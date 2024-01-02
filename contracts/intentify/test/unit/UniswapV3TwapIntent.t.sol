// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { UniswapV3TwapIntent, IntentAbstract } from "../../src/intents/UniswapV3TwapIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract UniswapV3TwapIntentHarness is UniswapV3TwapIntent {
    function exposed_getTwapX96(address uniswapV3Pool, uint32 twapInterval) public view returns (uint256 priceX96) {
        return _getTwapX96(uniswapV3Pool, twapInterval);
    }
}

contract UniswapV3TwapIntentTest is SafeTestingUtils {
    UniswapV3TwapIntentHarness internal _uniswapV3TwapIntent;

    uint256 mainnetFork;
    uint256 MAINNET_FORK_BLOCK = 18_124_343;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    // DAI/ETH on Uniswap V3 Ethereum Mainnet
    address immutable UNISWAP_V3_POOL = 0x60594a405d53811d3BC4766596EFD80fd545A270;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        initializeSafeBase();

        _uniswapV3TwapIntent = new UniswapV3TwapIntentHarness();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_TwapIntent_Success() external {
        uint256 minPriceX96 = 49_573_475_736_131_303_867_109_800;
        uint256 maxPriceX96 = 49_573_475_736_131_303_867_109_810;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_uniswapV3TwapIntent),
            data: _uniswapV3TwapIntent.encodeIntent(UNISWAP_V3_POOL, uint32(100), minPriceX96, maxPriceX96)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: address(0xdEAD), data: new bytes(0x00), instructions: bytes("") });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);
    }

    function test_getTwapX96_ZeroInterval_Success() external {
        uint256 priceX96 = _uniswapV3TwapIntent.exposed_getTwapX96(UNISWAP_V3_POOL, 0);
        assertEq(priceX96, 49_571_501_129_800_262_641_687_087);
    }

    function test_getTwapX96_Interval_Success() external {
        uint256 priceX96 = _uniswapV3TwapIntent.exposed_getTwapX96(UNISWAP_V3_POOL, 100);
        assertEq(priceX96, 49_573_475_736_131_303_867_109_805);
    }

    function test_encode_Success() external {
        uint32 twapIntervalSeconds = 100;
        uint256 minPriceX96 = 49_573_475_736_131_303_867_109_800;
        uint256 maxPriceX96 = 49_573_475_736_131_303_867_109_810;

        bytes memory data =
            _uniswapV3TwapIntent.encodeIntent(UNISWAP_V3_POOL, twapIntervalSeconds, minPriceX96, maxPriceX96);
        assertEq(data, abi.encode(UNISWAP_V3_POOL, twapIntervalSeconds, minPriceX96, maxPriceX96));
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_TwapIntent_PriceTooLow() external {
        uint256 minPriceX96 = 49_573_475_736_131_303_867_109_806;
        uint256 maxPriceX96 = 49_573_475_736_131_303_867_109_810;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_uniswapV3TwapIntent),
            data: _uniswapV3TwapIntent.encodeIntent(UNISWAP_V3_POOL, uint32(100), minPriceX96, maxPriceX96)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(UniswapV3TwapIntent.LowPrice.selector);
        _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_TwapIntent_PriceTooHigh() external {
        uint256 minPriceX96 = 49_573_475_736_131_303_867_109_800;
        uint256 maxPriceX96 = 49_573_475_736_131_303_867_109_804;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_uniswapV3TwapIntent),
            data: _uniswapV3TwapIntent.encodeIntent(UNISWAP_V3_POOL, uint32(100), minPriceX96, maxPriceX96)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(UniswapV3TwapIntent.HighPrice.selector);
        _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_TwapIntent_InvalidRoot() external {
        uint256 minPriceX96 = 49_573_475_736_131_303_867_109_800;
        uint256 maxPriceX96 = 49_573_475_736_131_303_867_109_810;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(0),
            value: 0,
            target: address(_uniswapV3TwapIntent),
            data: _uniswapV3TwapIntent.encodeIntent(UNISWAP_V3_POOL, uint32(100), minPriceX96, maxPriceX96)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert();
        _intentifySafeModule.execute(batchExecution);
    }
}
