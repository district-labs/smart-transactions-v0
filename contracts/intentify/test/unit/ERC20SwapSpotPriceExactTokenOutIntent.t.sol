// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { ERC20SwapSpotPriceExactTokenOutIntent } from "../../src/intents/ERC20SwapSpotPriceExactTokenOutIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract ERC20SwapSpotPriceExactTokenOutIntentTest is SafeTestingUtils {
    ERC20SwapSpotPriceExactTokenOutIntent internal _erc20SwapSpotPriceExactTokenOutIntent;

    address internal _whaleUSDC;
    address internal _whaleWETH;
    address internal _executor;

    uint256 mainnetFork;
    uint256 MAINNET_FORK_BLOCK = 18_341_359;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

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
        _erc20SwapSpotPriceExactTokenOutIntent =
            new ERC20SwapSpotPriceExactTokenOutIntent(address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    /// @dev Tests the successful execution of a market order sell intent.
    /// @notice This test simulates creating an intent to sell WETH for USDC at the market rate during intent execution.
    function test_ERC20SwapSpotPriceExactTokenOutIntentTest_Success() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSD = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

        // USDC/USD Price Feed on Ethereum Mainnet
        address priceFeedUSDCUSD = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;

        address WETHAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        address USDCAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

        // Safe starts with 1 ETH
        vm.prank(_whaleWETH);
        ERC20(WETHAddress).transfer(address(_safeCreated), 1 ether);

        Intent[] memory intents = new Intent[](1);

        // It intents to sell 0.8 ETH for USDC at the market rate at the time of execution
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_erc20SwapSpotPriceExactTokenOutIntent),
            data: _erc20SwapSpotPriceExactTokenOutIntent.encodeIntent(
                WETHAddress,
                USDCAddress,
                priceFeedETHUSD,
                priceFeedUSDCUSD,
                0.8 ether,
                36_000 // 10 hours of tolerance for stale data,
            )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        // Approve 1300 USDC to the Market Order Intent, this is a helper to execute the hook trading
        vm.prank(_whaleUSDC);
        ERC20(USDCAddress).approve(address(_erc20SwapSpotPriceExactTokenOutIntent), 1300e6);

        uint256 initialSafeUSDCBalance = ERC20(USDCAddress).balanceOf(address(_safeCreated));
        uint256 initialSearcherWETHBalance = ERC20(WETHAddress).balanceOf(_executor);

        bytes memory hookData =
            abi.encodeWithSignature("transferFrom(address,address,uint256)", _whaleUSDC, address(_safeCreated), 1300e6);
        bytes memory hookInstructions = _erc20SwapSpotPriceExactTokenOutIntent.encodeHookInstructions(_executor);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: USDCAddress, data: hookData, instructions: hookInstructions });
        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);

        // Asserts the safe received 1236.38 USDC in exchange for the 0.8 ETH at
        // the current market rate (purchase amount)
        assert(ERC20(USDCAddress).balanceOf(address(_safeCreated)) - initialSafeUSDCBalance >= 1_236_380_549);

        // Asserts the searcher received 0.8 ETH (sell amount)
        assertEq(ERC20(WETHAddress).balanceOf(_executor) - initialSearcherWETHBalance, 0.8 ether);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */
}
