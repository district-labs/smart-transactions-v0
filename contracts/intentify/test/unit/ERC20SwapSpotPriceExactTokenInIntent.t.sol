// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { ERC20SwapSpotPriceExactTokenInIntent } from "../../src/intents/ERC20SwapSpotPriceExactTokenInIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract ERC20SwapSpotPriceExactTokenInIntentTest is SafeTestingUtils {
    ERC20SwapSpotPriceExactTokenInIntent internal _erc20SwapSpotPriceExactTokenInIntent;

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
        _erc20SwapSpotPriceExactTokenInIntent = new ERC20SwapSpotPriceExactTokenInIntent(address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    /// @dev Tests the successful execution of a market order buy intent.
    /// @notice This test simulates creating an intent to purchase WETH with USDC at the market rate during intent
    /// execution.
    function test_ERC20SwapSpotPriceExactTokenInIntent_Success() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSD = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

        // USDC/USD Price Feed on Ethereum Mainnet
        address priceFeedUSDCUSD = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;

        address WETHAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        address USDCAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

        // Safe starts with 1500 USDC
        vm.prank(_whaleUSDC);
        ERC20(USDCAddress).transfer(address(_safeCreated), 1500e6);

        Intent[] memory intents = new Intent[](1);

        // It intents to buy 0.8 ETH with USDC at the market rate at the time of execution
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_erc20SwapSpotPriceExactTokenInIntent),
            data: _erc20SwapSpotPriceExactTokenInIntent.encodeIntent(
                USDCAddress,
                WETHAddress,
                priceFeedUSDCUSD,
                priceFeedETHUSD,
                0.8 ether,
                36_000 // 10 hours of tolerance for stale data,
            )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        // Approve 0.8 ETH to the Market Order Intent, this is a helper to execute the hook trading
        vm.prank(_whaleWETH);
        ERC20(WETHAddress).approve(address(_erc20SwapSpotPriceExactTokenInIntent), 0.8 ether);

        uint256 initialSafeWETHBalance = ERC20(WETHAddress).balanceOf(address(_safeCreated));
        uint256 initialSearcherUSDCBalance = ERC20(USDCAddress).balanceOf(_executor);

        bytes memory hookData = abi.encodeWithSignature(
            "transferFrom(address,address,uint256)", _whaleWETH, address(_safeCreated), 0.8 ether
        );
        bytes memory hookInstructions = _erc20SwapSpotPriceExactTokenInIntent.encodeHookInstructions(_executor);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: WETHAddress, data: hookData, instructions: hookInstructions });
        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);

        // Asserts the safe received 0.8 ETH (purchase amount)
        assertEq(ERC20(WETHAddress).balanceOf(address(_safeCreated)) - initialSafeWETHBalance, 0.8 ether);

        // Asserts the searcher received 1236.38 USDC in exchange for the 0.8 ETH
        // at the current market rate (sell amount)
        assertEq(ERC20(USDCAddress).balanceOf(_executor) - initialSearcherUSDCBalance, 1_236_380_549);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */
}
