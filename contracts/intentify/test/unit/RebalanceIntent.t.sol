// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { RebalanceIntent } from "../../src/intents/RebalanceIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract RebalanceIntentTest is SafeTestingUtils {
    RebalanceIntent internal _rebalanceIntent;
    address internal _whaleUSDC;
    address internal _whaleWETH;
    address internal _executor;

    uint256 internal mainnetFork;
    uint256 internal MAINNET_FORK_BLOCK = 18_341_359;
    string internal MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        initializeSafeBase();

        _executor = address(0x1234);
        _whaleUSDC = 0x51eDF02152EBfb338e03E30d65C15fBf06cc9ECC;
        _whaleWETH = 0xF04a5cC80B1E94C69B48f5ee68a08CD2F09A7c3E;
        _rebalanceIntent = new RebalanceIntent(address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    /// @notice Tests the successful execution of a rebalance intent with 50% USDC and 50% WETH.
    function test_RebalanceIntent_Success() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSD = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

        // USDC/USD Price Feed on Ethereum Mainnet
        address priceFeedUSDCUSD = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;

        address WETHAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        address USDCAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

        // Safe starts with 1000 USDC
        vm.prank(_whaleUSDC);
        ERC20(USDCAddress).transfer(address(_safeCreated), 1000e6);

        Intent[] memory intents = new Intent[](1);

        RebalanceIntent.RebalanceToken[] memory rebalanceTokens = new RebalanceIntent.RebalanceToken[](2);

        rebalanceTokens[0] =
            RebalanceIntent.RebalanceToken({ token: USDCAddress, tokenPriceFeed: priceFeedUSDCUSD, weight: 50_000 });

        rebalanceTokens[1] =
            RebalanceIntent.RebalanceToken({ token: WETHAddress, tokenPriceFeed: priceFeedETHUSD, weight: 50_000 });

        // It intents to rebalance the safe to 50% USDC and 50% WETH.
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_rebalanceIntent),
            data: _rebalanceIntent.encodeIntent(rebalanceTokens)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        // Approve 0.33 ETH to the Market Order Intent, this is a helper to execute the hook trading
        vm.prank(_whaleWETH);
        ERC20(WETHAddress).approve(address(_rebalanceIntent), 323_524_986_025_341_197);

        bytes memory hookTxData = abi.encodeWithSignature(
            "transferFrom(address,address,uint256)", _whaleWETH, address(_safeCreated), 323_524_986_025_341_197
        );

        Hook[] memory hooks = new Hook[](1);
        bytes memory hookData = _rebalanceIntent.encodeHook(_executor, hookTxData);

        hooks[0] = Hook({ target: WETHAddress, data: hookData });
        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);

        // Check the balances of the safe after the rebalance.
        uint256 safeUSDCBalance = ERC20(USDCAddress).balanceOf(address(_safeCreated));
        uint256 safeWETHBalance = ERC20(WETHAddress).balanceOf(address(_safeCreated));

        assertEq(safeUSDCBalance, 500e6);
        assertEq(safeWETHBalance, 323_524_986_025_341_197);
    }
}
