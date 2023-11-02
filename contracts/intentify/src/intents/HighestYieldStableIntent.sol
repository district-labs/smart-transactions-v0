// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { IComet } from "../../src/periphery/interfaces/IComet.sol";
import { IPot } from "../../src/periphery/interfaces/IPot.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { SavingsDai } from "makerdao-sdai/SavingsDai.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Enum } from "safe-contracts/common/Enum.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { ExecuteRootTransactionMultisend } from "./utils/ExecuteRootTransactionMultisend.sol";

/// @title Highest Yield Stable Intent
contract HighestYieldStableIntent is IntentWithHookAbstract, ExecuteRootTransactionMultisend {
    enum ProtocolType {
        AAVE,
        DSR,
        COMPOUND
    }

    struct Protocol {
        ProtocolType protocolType;
        address protocolAddress;
        address wrappedToken;
        address token;
    }

    uint32 public constant SECONDS_PER_YEAR = 31_536_000;

    // Supported stablecoins
    address[] internal _stablecoins;

    mapping(uint8 => Protocol[]) internal _protocols;

    Protocol[] internal _daiProtocols;
    Protocol[] internal _usdcProtocols;
    Protocol[] internal _usdtProtocols;

    error InsufficientSupply(uint256 amountSupplied, uint256 expectedAmountSuppliedScaledTo18);

    error UnsupportedProtocolType();

    error OptimalPositionAlreadyAllocated();

    /// @notice Initialize the smart contract
    constructor(
        address _intentifySafeModule,
        address _aavePool,
        address _sparkPool,
        address _dsrPot,
        address[] memory __stablecoins,
        address[][] memory _wrappedTokens
    )
        ExecuteRootTransactionMultisend(_intentifySafeModule, 0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526)
    {
        // Stablecoins
        // DAI, USDC, USDT
        _stablecoins = __stablecoins;

        // Protocols
        _daiProtocols.push(Protocol(ProtocolType.AAVE, _aavePool, _wrappedTokens[0][0], __stablecoins[0]));
        _daiProtocols.push(Protocol(ProtocolType.AAVE, _sparkPool, _wrappedTokens[0][1], __stablecoins[0]));
        _daiProtocols.push(Protocol(ProtocolType.DSR, _dsrPot, _wrappedTokens[0][2], __stablecoins[0]));

        _usdcProtocols.push(Protocol(ProtocolType.AAVE, _aavePool, _wrappedTokens[1][0], __stablecoins[1]));
        _usdcProtocols.push(Protocol(ProtocolType.AAVE, _sparkPool, _wrappedTokens[1][1], __stablecoins[1]));
        // Compound does not have a protocol core contract, just the wrapped token
        _usdcProtocols.push(Protocol(ProtocolType.COMPOUND, address(0), _wrappedTokens[1][2], __stablecoins[1]));

        _usdtProtocols.push(Protocol(ProtocolType.AAVE, _aavePool, _wrappedTokens[2][0], __stablecoins[2]));
        _usdtProtocols.push(Protocol(ProtocolType.AAVE, _sparkPool, _wrappedTokens[2][1], __stablecoins[2]));

        _protocols[0] = _daiProtocols;
        _protocols[1] = _usdcProtocols;
        _protocols[2] = _usdtProtocols;
    }

    function encodeIntent(uint256 expectedAmountSuppliedScaledTo18) external pure returns (bytes memory) {
        return abi.encode(expectedAmountSuppliedScaledTo18);
    }

    function encodeHookInstructions(address executor) external pure returns (bytes memory) {
        return abi.encode(executor);
    }

    /// @inheritdoc IntentWithHookAbstract
    function execute(
        Intent calldata intent,
        Hook calldata hook
    )
        external
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        // Retrieves the optimal yield protocol and token
        Protocol memory optimalProtocol = _retrieveOptimalYieldProtocol();

        // Check if the required amount allocated to the optimal protocol is fulfilled
        uint256 initialAllocatedAmount = _checkOptimalProtocolAllocation(optimalProtocol, intent);

        // Withdraw from the non optimal pool
        // Also calculates the expected amount supplied
        _withdrawFromNonOptimalPools(optimalProtocol, intent, initialAllocatedAmount);

        _hook(hook);
        // The hook is expected to transfer the tokens to the intent root.
        // NOTICE: We can likely optimize by using the `transient storage` when available.

        _unlock(optimalProtocol, intent, hook, initialAllocatedAmount);

        return true;
    }

    function _decodeHookInstructions(Hook calldata hook) internal pure returns (address executor) {
        return abi.decode(hook.instructions, (address));
    }

    function _decodeIntent(Intent calldata intent) internal pure returns (uint256 expectedAmountSuppliedScaledTo18) {
        return abi.decode(intent.data, (uint256));
    }

    /// @notice Execute the hook
    /// @param hook The hook to be executed.
    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call{ value: 0 }(hook.data);

        if (!success) {
            if (errorMessage.length > 0) {
                _revertMessageReason(errorMessage);
            } else {
                revert HookExecutionFailed();
            }
        }
    }

    function _checkOptimalProtocolAllocation(
        Protocol memory optimalProtocol,
        Intent calldata intent
    )
        internal
        view
        returns (uint256 initialAllocatedAmount)
    {
        // Scale the expected amount supplied to the optimal protocol decimals
        uint256 expectedAmountAllocated =
            _scaleDecimalsFrom18(_decodeIntent(intent), _getWrappedTokenDecimals(optimalProtocol));

        // Retrieves the initial allocated amount to the optimal protocol
        initialAllocatedAmount = _getAllocatedTokenBalance(optimalProtocol, intent.root);

        // If the optimal protocol is already allocated the minimum amount, revert
        if (initialAllocatedAmount >= expectedAmountAllocated) {
            revert OptimalPositionAlreadyAllocated();
        }
    }

    /// @notice Unlock the tokenOut to the hook executor if the amountIn is greater than the amountInMin.
    /// @param intent Contains data related to intent.
    /// @param hook Contains data related to hook.
    function _unlock(
        Protocol memory protocol,
        Intent calldata intent,
        Hook calldata hook,
        uint256 initialAllocatedAmount
    )
        internal
        returns (bool)
    {
        uint8 tokensToUnlock = 0;
        ExecuteRootTransactionMultisend.Transaction[] memory txs =
            new ExecuteRootTransactionMultisend.Transaction[](_stablecoins.length);

        uint256 expectedAmountSuppliedScaledTo18 = _decodeIntent(intent);
        uint256 expectedAmountSupplied =
            _scaleDecimalsFrom18(expectedAmountSuppliedScaledTo18, ERC20(protocol.token).decimals());

        uint256 amountSupplied = _getAllocatedTokenBalance(protocol, intent.root);

        if (amountSupplied < expectedAmountSupplied) {
            revert InsufficientSupply(amountSupplied, expectedAmountSupplied);
        }

        address executor = _decodeHookInstructions(hook);

        uint256 amountToUnlockScaledTo18 =
            _scaleDecimalsTo18(amountSupplied - initialAllocatedAmount, _getWrappedTokenDecimals(protocol));

        // Sends the stablecoins to the hook executor
        for (uint8 i = 0; i < _stablecoins.length; i++) {
            if (amountToUnlockScaledTo18 == 0) {
                break;
            }

            uint256 tokenBalance = ERC20(_stablecoins[i]).balanceOf(intent.root);
            if (tokenBalance > 0) {
                uint256 amountTosend;
                uint256 amountToUnlock =
                    _scaleDecimalsFrom18(amountToUnlockScaledTo18, ERC20(_stablecoins[i]).decimals());

                if (amountToUnlock > tokenBalance) {
                    amountTosend = tokenBalance;
                } else {
                    amountTosend = amountToUnlock;
                }

                bytes memory txData = abi.encodeWithSelector(ERC20.transfer.selector, executor, tokenBalance);

                txs[tokensToUnlock] = ExecuteRootTransactionMultisend.Transaction({
                    to: _stablecoins[i],
                    value: 0,
                    data: txData,
                    operation: Enum.Operation.Call
                });
                tokensToUnlock++;
                amountToUnlockScaledTo18 -= amountTosend;
            }
        }

        // Send the tokens to the hook executor.
        if (tokensToUnlock > 0) {
            ExecuteRootTransactionMultisend.Transaction[] memory txsToUnlock =
                new ExecuteRootTransactionMultisend.Transaction[](tokensToUnlock);
            for (uint8 i = 0; i < tokensToUnlock; i++) {
                txsToUnlock[i] = txs[i];
            }
            executeFromRootMultisend(txsToUnlock);
        }

        return true;
    }

    function _withdrawFromProtocol(
        Protocol memory protocol,
        Intent calldata intent,
        uint256 wrappedTokenBalance
    )
        internal
    {
        // Withdraw from the protocol
        if (protocol.protocolType == ProtocolType.AAVE) {
            _withdrawAavePoolSingle(protocol, intent, wrappedTokenBalance);
        } else if (protocol.protocolType == ProtocolType.DSR) {
            _withdrawDsrSingle(protocol, intent);
        } else if (protocol.protocolType == ProtocolType.COMPOUND) {
            _withdrawCompoundSingle(protocol, wrappedTokenBalance);
        } else {
            revert UnsupportedProtocolType();
        }
    }

    /// @notice Withdraws a single stablecoin from the lending pool;
    function _withdrawAavePoolSingle(
        Protocol memory protocol,
        Intent calldata intent,
        uint256 aTokenBalance
    )
        internal
    {
        bytes memory data = abi.encodeWithSelector(IPool.withdraw.selector, protocol.token, aTokenBalance, intent.root);
        executeFromRoot(protocol.protocolAddress, 0, data);
    }

    /// @notice Withdraws a single stablecoin from the lending pool;
    function _withdrawCompoundSingle(Protocol memory protocol, uint256 compoundTokenBalance) internal {
        bytes memory data = abi.encodeWithSelector(IComet.withdraw.selector, protocol.token, compoundTokenBalance);
        executeFromRoot(protocol.wrappedToken, 0, data);
    }

    /// @notice Withdraws sDAI from DSR
    function _withdrawDsrSingle(Protocol memory protocol, Intent calldata intent) internal {
        // Get the sDai balance in DAI value from the DSR
        uint256 sDaiSharesBalance = SavingsDai(protocol.wrappedToken).maxRedeem(intent.root);

        bytes memory data =
            abi.encodeWithSelector(SavingsDai.redeem.selector, sDaiSharesBalance, intent.root, intent.root);
        executeFromRoot(protocol.wrappedToken, 0, data);
    }

    function _withdrawFromNonOptimalPools(
        Protocol memory optimalProtocol,
        Intent calldata intent,
        uint256 initialAllocatedAmount
    )
        internal
    {
        uint256 expectedAmountSuppliedScaledTo18 = _decodeIntent(intent);
        uint256 initialAllocatedAmountScaledTo18 =
            _scaleDecimalsTo18(initialAllocatedAmount, _getWrappedTokenDecimals(optimalProtocol));
        uint256 withdrawnAmountScaledTo18;

        for (uint8 i = 0; i < _stablecoins.length; i++) {
            for (uint8 j = 0; j < _protocols[i].length; j++) {
                Protocol memory protocol = _protocols[i][j];
                // Retrieves the amount allocated to the protocol
                uint256 allocatedTokenBalance = _getAllocatedTokenBalance(protocol, intent.root);
                uint256 allocatedTokenBalanceScaledTo18 =
                    _scaleDecimalsTo18(allocatedTokenBalance, _getWrappedTokenDecimals(protocol));

                uint256 amountToWithdraw;

                // Check if the current stablecoin and lending pool is not the optimal one
                if (
                    protocol.token != optimalProtocol.token
                        || protocol.protocolAddress != optimalProtocol.protocolAddress
                ) {
                    // If the amount already allocated to the optimal protocol plus the withdrawn from non-optimal pool
                    // is greater than the expected amount supplied, break
                    if (
                        withdrawnAmountScaledTo18 + initialAllocatedAmountScaledTo18 >= expectedAmountSuppliedScaledTo18
                    ) {
                        break;
                    }

                    // Check if user has funds in the pool via the aToken balanceOf function
                    // If the user has funds in the pool, withdraw them
                    if (allocatedTokenBalance > 0) {
                        if (
                            expectedAmountSuppliedScaledTo18 - withdrawnAmountScaledTo18
                                - initialAllocatedAmountScaledTo18 > allocatedTokenBalanceScaledTo18
                        ) {
                            amountToWithdraw = _scaleDecimalsFrom18(
                                allocatedTokenBalanceScaledTo18, _getWrappedTokenDecimals(protocol)
                            );
                        } else {
                            amountToWithdraw = _scaleDecimalsFrom18(
                                expectedAmountSuppliedScaledTo18 - withdrawnAmountScaledTo18
                                    - initialAllocatedAmountScaledTo18,
                                _getWrappedTokenDecimals(protocol)
                            );
                        }

                        console2.log("expectedAmountSuppliedScaledTo18", expectedAmountSuppliedScaledTo18);
                        console2.log("withdrawnAmountScaledTo18", withdrawnAmountScaledTo18);
                        console2.log("initialAllocatedAmountScaledTo18", initialAllocatedAmountScaledTo18);
                        console2.log(
                            "expectedAmountSuppliedScaledTo18 - withdrawnAmountScaledTo18 - initialAllocatedAmountScaledTo18",
                            expectedAmountSuppliedScaledTo18 - withdrawnAmountScaledTo18
                                - initialAllocatedAmountScaledTo18
                        );
                        console2.log("allocatedTokenBalanceScaledTo18", allocatedTokenBalanceScaledTo18);

                        // Withdraw from the pool
                        // uses type(uint256).max amount to withdraw all the funds
                        _withdrawFromProtocol(protocol, intent, allocatedTokenBalance);

                        withdrawnAmountScaledTo18 += allocatedTokenBalanceScaledTo18;
                    }
                }
            }
        }
    }

    // @notice Returns the balance of the underlying token allocated in the protocol
    function _getAllocatedTokenBalance(Protocol memory protocol, address account) internal view returns (uint256) {
        if (protocol.protocolType == ProtocolType.AAVE) {
            // The aToken balanceOf function returns the underlying token balance at a 1:1 ratio
            return ERC20(protocol.wrappedToken).balanceOf(account);
        } else if (protocol.protocolType == ProtocolType.DSR) {
            // Converts the sDAI balance from shares to asset, which is the DAI token balance
            return
                SavingsDai(protocol.wrappedToken).convertToAssets(SavingsDai(protocol.wrappedToken).balanceOf(account));
        } else if (protocol.protocolType == ProtocolType.COMPOUND) {
            // The compound balanceOf function returns the underlying token balance at a 1:1 ratio
            return IComet(protocol.wrappedToken).balanceOf(account);
        } else {
            revert UnsupportedProtocolType();
        }
    }

    function _getWrappedTokenDecimals(Protocol memory protocol) internal view returns (uint8) {
        if (protocol.protocolType == ProtocolType.AAVE) {
            return ERC20(protocol.wrappedToken).decimals();
        } else if (protocol.protocolType == ProtocolType.DSR) {
            return SavingsDai(protocol.wrappedToken).decimals();
        } else if (protocol.protocolType == ProtocolType.COMPOUND) {
            return IComet(protocol.wrappedToken).decimals();
        } else {
            revert UnsupportedProtocolType();
        }
    }

    function _scaleDecimalsTo18(uint256 amount, uint8 decimals) internal pure returns (uint256) {
        return _scaleDecimals(amount, decimals, 18);
    }

    function _scaleDecimalsFrom18(uint256 amount, uint8 decimals) internal pure returns (uint256) {
        return _scaleDecimals(amount, 18, decimals);
    }

    function _scaleDecimals(uint256 amount, uint8 amountDecimals, uint8 baseDecimals) internal pure returns (uint256) {
        if (amountDecimals == baseDecimals) {
            return amount;
        }

        if (amountDecimals > baseDecimals) {
            return amount / (10 ** (amountDecimals - baseDecimals));
        }

        return amount * (10 ** (baseDecimals - amountDecimals));
    }

    /// @notice Retrieves the highest yield protocol and token.
    function _retrieveOptimalYieldProtocol() internal view returns (Protocol memory optimalProtocol) {
        uint256 highestSupplyRatePerSecond;
        uint256 returnRatePerSecond;

        for (uint8 i = 0; i < _stablecoins.length; i++) {
            for (uint8 j = 0; j < _protocols[i].length; j++) {
                returnRatePerSecond = _getReturnRatePerSecond(_protocols[i][j]);

                if (returnRatePerSecond > highestSupplyRatePerSecond) {
                    highestSupplyRatePerSecond = returnRatePerSecond;
                    optimalProtocol = _protocols[i][j];
                }
            }
        }
    }

    /// @dev Returns the return rate per second for the given stablecoin and protocol with 27 decimal precision.
    function _getReturnRatePerSecond(Protocol memory protocol) internal view returns (uint256) {
        if (protocol.protocolType == ProtocolType.AAVE) {
            return _getReturnRatePerSecondAave(protocol);
        } else if (protocol.protocolType == ProtocolType.DSR) {
            return _getReturnRatePerSecondDsr(protocol);
        } else if (protocol.protocolType == ProtocolType.COMPOUND) {
            return _getReturnRatePerSecondCompound(protocol);
        } else {
            revert UnsupportedProtocolType();
        }
    }

    function _getReturnRatePerSecondAave(Protocol memory protocol) internal view returns (uint256) {
        // Gets the current pool liquidity rate annualized in 10^27 precision
        uint128 currentLiquidityRateAnnualized =
            IPool(protocol.protocolAddress).getReserveData(protocol.token).currentLiquidityRate;

        // Returns the current liquidity rate per seconds in 10^27 precision.
        return currentLiquidityRateAnnualized / SECONDS_PER_YEAR;
    }

    function _getReturnRatePerSecondCompound(Protocol memory protocol) internal view returns (uint256) {
        // Retrieves the utilization rate.
        uint256 utilization = IComet(protocol.wrappedToken).getUtilization();

        // Retrieves the supply rate per second scaled to 10^18 precision.
        uint256 supplyRate = IComet(protocol.wrappedToken).getSupplyRate(utilization);

        // Returns the supply rate per second in 10^27 precision.
        return supplyRate * 10 ** (27 - 18);
    }

    function _getReturnRatePerSecondDsr(Protocol memory protocol) internal view returns (uint256) {
        // Returns the DSR in 10^27 precision minus 1
        return IPot(protocol.protocolAddress).dsr() - 10 ** 27;
    }
}
