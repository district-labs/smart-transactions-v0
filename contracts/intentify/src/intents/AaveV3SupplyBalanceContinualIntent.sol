// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { ChainlinkDataFeedHelper } from "../helpers/ChainlinkDataFeedHelper.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title AaveV3SupplyBalanceContinualIntent
/// @notice Intent to continually supply a token to Aave V3 when the balance of the token in the root smart wallet is
/// above a certain threshold.
contract AaveV3SupplyBalanceContinualIntent is IntentAbstract, ExecuteRootTransaction {
    address private immutable _aaveV3Pool;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev The amount of tokens transferred to the intent root is less than the minimum amount expected.
    error InsufficientBalance();

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(address _intentifySafeModule, address aaveV3Pool) ExecuteRootTransaction(_intentifySafeModule) {
        _aaveV3Pool = aaveV3Pool;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode hook instruction parameters into a byte array.
    /// @param executor The address of the hook executor.
    /// @return data The encoded data.
    function encodeHookInstructions(address executor) external pure returns (bytes memory data) {
        data = abi.encode(executor);
    }

    /// @notice Helper function to encode provided parameters into a byte array.
    /// @param tokenOut The token to be supplied.
    /// @param minBalance The minimum balance to be maintained in the root smart wallet.
    /// @param balanceDelta The difference from the minimum balance before a deposit is triggered.
    function encodeIntent(
        address tokenOut,
        uint256 minBalance,
        uint256 balanceDelta
    )
        external
        pure
        returns (bytes memory data)
    {
        data = abi.encode(tokenOut, minBalance, balanceDelta);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IntentAbstract
    function execute(Intent calldata intent)
        external
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (address tokenOut, uint256 minBalance, uint256 balanceDelta) = _decodeIntent(intent);

        uint256 tokenOutBalance = ERC20(tokenOut).balanceOf(intent.root);

        // Check if the current token out balance is above the minimum balance + the balance delta
        if (tokenOutBalance < (minBalance + balanceDelta)) {
            revert InsufficientBalance();
        }

        uint256 supplyAmount = tokenOutBalance - minBalance;

        bytes memory txData = abi.encodeWithSelector(IPool.supply.selector, tokenOut, supplyAmount, intent.root, 0);
        executeFromRoot(_aaveV3Pool, 0, txData);

        return true;
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to be decoded.
    /// @return tokenOut The token to be sold.
    /// @return minBalance The minimum balance to be maintained in the root smart wallet.
    /// @return balanceDelta The difference from the minimum balance before a deposit is triggered.
    function _decodeIntent(Intent calldata intent)
        internal
        pure
        returns (address tokenOut, uint256 minBalance, uint256 balanceDelta)
    {
        return abi.decode(intent.data, (address, uint256, uint256));
    }
}
