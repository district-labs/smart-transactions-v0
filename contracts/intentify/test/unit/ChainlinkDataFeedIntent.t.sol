// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import "uniswap-v3-core/libraries/FullMath.sol";
import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";
import { ChainlinkDataFeedIntent } from "../../src/intents/ChainlinkDataFeedIntent.sol";

import { BaseTest } from "../utils/Base.t.sol";

contract TwapIntentTest is BaseTest {
    Intentify internal _intentify;
    ChainlinkDataFeedIntent internal _chainlinkDataFeedIntent;

    uint256 mainnetFork;
    uint256 MAINNET_FORK_BLOCK = 18_249_259;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _chainlinkDataFeedIntent = new ChainlinkDataFeedIntent();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_DataFeedIntent_PriceFeed_Success() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSDC = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        // Checks if the price of ETH/USD is between 1680 and 1685
        int256 minValue = int256(1680e8);
        int256 maxValue = int256(1685e8);
        // Requires the price to be updated within the last 5 minutes
        uint256 thresholdSeconds = 5 minutes;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds)
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

    function test_DataFeedIntent_ProofOfReserveFeed_Success() external {
        // WBTC Proof of Reserve on Ethereum Mainnet
        address proofOfReserveWBTC = 0xa81FE04086865e63E12dD3776978E49DEEa2ea4e;
        // Checks if the WBTC Proof of Reserve is between 162k and 165k
        int256 minValue = int256(162_000e8);
        int256 maxValue = int256(165_000e8);
        // Requires the price to be updated within the last 12 hours
        uint256 thresholdSeconds = 12 hours;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(proofOfReserveWBTC, minValue, maxValue, thresholdSeconds)
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

    function test_DataFeedIntent_NFTFloorPrice_Success() external {
        // CryptoPunks Floor Price on Ethereum Mainnet
        address nftFloorPriceCryptoPunks = 0x01B6710B01cF3dd8Ae64243097d91aFb03728Fdd;
        // Checks if the floor price of CryptoPunks is between 44 and 46 ETH
        int256 minValue = int256(44e18);
        int256 maxValue = int256(46e18);
        // Requires the price to be updated within the last 24 hours
        uint256 thresholdSeconds = 24 hours;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(nftFloorPriceCryptoPunks, minValue, maxValue, thresholdSeconds)
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

    function test_DataFeedIntent_encode_Success() external {
        address priceFeedETHUSDC = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        int256 minValue = int256(1680e8);
        int256 maxValue = int256(1685e8);
        uint256 thresholdSeconds = 5 minutes;

        bytes memory data =
            _chainlinkDataFeedIntent.encodeIntent(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds);
        assertEq(data, abi.encode(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds));
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_DataFeedIntent_ValueTooLow() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSDC = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        // Checks if the price of ETH/USD is between 1680 and 1685
        int256 minValue = int256(1685e8);
        int256 maxValue = int256(1690e8);
        // Requires the price to be updated within the last 5 minutes
        uint256 thresholdSeconds = 5 minutes;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert();
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_DataFeedIntent_ValueTooHigh() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSDC = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        // Checks if the price of ETH/USD is between 1680 and 1685
        int256 minValue = int256(1670e8);
        int256 maxValue = int256(1675e8);
        // Requires the price to be updated within the last 5 minutes
        uint256 thresholdSeconds = 5 minutes;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert();
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_DataFeedIntent_StaleData() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSDC = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        // Checks if the price of ETH/USD is between 1680 and 1685
        int256 minValue = int256(1680e8);
        int256 maxValue = int256(1685e8);
        // Requires the price to be updated within the last 5 minutes
        uint256 thresholdSeconds = 60;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert();
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_DataFeedIntent_InvalidRoot() external {
        // ETH/USD Price Feed on Ethereum Mainnet
        address priceFeedETHUSDC = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        // Checks if the price of ETH/USD is between 1680 and 1685
        int256 minValue = int256(1680e8);
        int256 maxValue = int256(1685e8);
        // Requires the price to be updated within the last 5 minutes
        uint256 thresholdSeconds = 5 minutes;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(0),
            value: 0,
            target: address(_chainlinkDataFeedIntent),
            data: _chainlinkDataFeedIntent.encodeIntent(priceFeedETHUSDC, minValue, maxValue, thresholdSeconds)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert();
        _intentify.execute(batchExecution);
    }
}
