// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";
import { MarketOrderIntent } from "../../src/intents/MarketOrderIntent.sol";

import { BaseTest } from "../utils/Base.t.sol";

contract TwapIntentTest is BaseTest {
    Intentify internal _intentify;
    MarketOrderIntent internal _marketOrderIntent;

    uint256 mainnetFork;
    uint256 MAINNET_FORK_BLOCK = 18_341_359;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _marketOrderIntent = new MarketOrderIntent();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    /**
     * @dev Tests the successful execution of a market order buy intent.
     *
     * This test simulates creating an intent to purchase WETH with USDC at the market rate during intent execution.
     * - In order to execute a buy order, te last parameter of the `encode` function, the `isBuy` parameter, must be set
     * to `true`.
     */
    function test_MarketOrderIntent_Buy_Success() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSD = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

        // USDC/USD Price Feed on Ethereum Mainnet
        address priceFeedUSDCUSD = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;

        address WETHAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        address USDCAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_marketOrderIntent),
            data: _marketOrderIntent.encode(
                USDCAddress,
                WETHAddress,
                priceFeedUSDCUSD,
                priceFeedETHUSD,
                0.8 ether,
                0,
                36_000, // 10 hours of tolerance for stale data,
                true // isBuy
            )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    /**
     * @dev Tests the successful execution of a market order sell intent.
     *
     * This test simulates creating an intent to sell WETH for USDC at the market rate during intent execution.
     * - In order to execute a sell order, te last parameter of the `encode` function, the `isBuy` parameter, must be
     * set to `false`.
     */
    function test_MarketOrderIntent_Sell_Success() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSD = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

        // USDC/USD Price Feed on Ethereum Mainnet
        address priceFeedUSDCUSD = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;

        address WETHAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        address USDCAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_marketOrderIntent),
            data: _marketOrderIntent.encode(
                USDCAddress,
                WETHAddress,
                priceFeedUSDCUSD,
                priceFeedETHUSD,
                0.8 ether,
                0,
                36_000, // 10 hours of tolerance for stale data,
                false // isBuy
            )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */
}
