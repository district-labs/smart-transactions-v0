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
import { MeanAverageIntent } from "../../src/intents/MeanAverageIntent.sol";

import { BaseTest } from "../utils/Base.t.sol";

contract MeanAverageIntentHarness is MeanAverageIntent {
    constructor(address uniswapV3TwapOracle) MeanAverageIntent(uniswapV3TwapOracle) { }

    function exposed_checkBlockWindow(
        MeanAverageIntent.BlockData memory blockData,
        string memory errorMessageStart,
        string memory errorMessageEnd
    )
        external
        view
    {
        _checkBlockWindow(blockData, errorMessageStart, errorMessageEnd);
    }

    function exposed_checkBlocksRange(BlockData memory numerator, BlockData memory denominator) external view {
        _checkBlocksRange(numerator, denominator);
    }

    function exposed_checkPercentageDifference(bytes memory intentData, bytes memory hookData) external view {
        _checkPercentageDifference(intentData, hookData);
    }
}

contract MeanAverageIntentTest is BaseTest {
    Intentify internal _intentify;
    MeanAverageIntentHarness internal _meanAverageIntent;

    uint256 goerliFork;
    uint256 GOERLI_FORK_BLOCK = 9_848_670;
    string GOERLI_RPC_URL = vm.envString("GOERLI_RPC_URL");

    address UNISWAP_V3_TWAP_ORACLE = 0xA754f61Ba3A8da22BD186a542a151Fcd637Cd85c;
    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        goerliFork = vm.createFork(GOERLI_RPC_URL);
        vm.selectFork(goerliFork);
        vm.rollFork(GOERLI_FORK_BLOCK);

        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _meanAverageIntent = new MeanAverageIntentHarness(UNISWAP_V3_TWAP_ORACLE);
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_MeanAverageIntent_Success() external {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_meanAverageIntent),
            data: _meanAverageIntent.encode(
                uniswapV3Pool, block.number, 89_220, 40, block.number, 49_950, 40, 105_000, 110_000
                )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] =
            Hook({ target: address(_meanAverageIntent), data: abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630) });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    function test_MeanAverageIntent_CurrentBlockAsReference_Success() external {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_meanAverageIntent),
            data: _meanAverageIntent.encode(
                // Set the reference block to 0, so the current block at the
                // intent execution time will be used as the reference block.
                uniswapV3Pool,
                0,
                89_220,
                40,
                0,
                49_950,
                40,
                105_000,
                110_000
                )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] =
            Hook({ target: address(_meanAverageIntent), data: abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630) });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    function test_CheckBlockWindow_Success() external view {
        MeanAverageIntent.BlockData memory blockData = MeanAverageIntent.BlockData({
            referenceBlock: block.number,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_424,
            endBlock: 9_848_630
        });

        _meanAverageIntent.exposed_checkBlockWindow(
            blockData, "MeanAverageIntent:out-of-tolerance-start-block", "MeanAverageIntent:out-of-tolerance-end-block"
        );
    }

    function test_CheckBlocksRange_Success() external view {
        MeanAverageIntent.BlockData memory numerator = MeanAverageIntent.BlockData({
            referenceBlock: block.number,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_424,
            endBlock: 9_848_630
        });

        MeanAverageIntent.BlockData memory denominator = MeanAverageIntent.BlockData({
            referenceBlock: block.number,
            blockWindow: 49_950,
            blockWindowTolerance: 40,
            startBlock: 9_798_709,
            endBlock: 9_848_630
        });

        _meanAverageIntent.exposed_checkBlocksRange(numerator, denominator);
    }

    function test_CheckPercentageDifference_Success() external view {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        bytes memory intentData = _meanAverageIntent.encode(
            uniswapV3Pool, block.number, 89_220, 40, block.number, 49_950, 40, 105_000, 110_000
        );
        bytes memory hookData = abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630);

        _meanAverageIntent.exposed_checkPercentageDifference(intentData, hookData);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    // @TODO: Add failling tests for the whole intent

    function test_CheckBlockWindow_RevertWhen_OutOfTolerance() external {
        MeanAverageIntent.BlockData memory blockData = MeanAverageIntent.BlockData({
            referenceBlock: block.number,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_500,
            endBlock: 9_848_630
        });

        vm.expectRevert("MeanAverageIntent:out-of-tolerance-start-block");
        _meanAverageIntent.exposed_checkBlockWindow(
            blockData, "MeanAverageIntent:out-of-tolerance-start-block", "MeanAverageIntent:out-of-tolerance-end-block"
        );

        blockData.startBlock = 9_759_424;
        blockData.endBlock = 9_848_500;

        vm.expectRevert("MeanAverageIntent:out-of-tolerance-end-block");
        _meanAverageIntent.exposed_checkBlockWindow(
            blockData, "MeanAverageIntent:out-of-tolerance-start-block", "MeanAverageIntent:out-of-tolerance-end-block"
        );
    }

    function test_CheckBlocksRange_RevertWhen_InvalidWindow() external {
        MeanAverageIntent.BlockData memory numerator = MeanAverageIntent.BlockData({
            referenceBlock: block.number,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_400,
            endBlock: 9_848_630
        });

        MeanAverageIntent.BlockData memory denominator = MeanAverageIntent.BlockData({
            referenceBlock: block.number,
            blockWindow: 49_950,
            blockWindowTolerance: 40,
            startBlock: 9_798_709,
            endBlock: 9_848_630
        });

        vm.expectRevert("MeanAverageIntent:invalid-numerator-block-window-start");
        _meanAverageIntent.exposed_checkBlocksRange(numerator, denominator);

        numerator.startBlock = 9_759_424;
        numerator.endBlock = 9_848_500;

        vm.expectRevert("MeanAverageIntent:invalid-numerator-block-window-end");
        _meanAverageIntent.exposed_checkBlocksRange(numerator, denominator);

        numerator.endBlock = 9_848_630;
        denominator.startBlock = 9_798_609;

        vm.expectRevert("MeanAverageIntent:invalid-denominator-block-window-start");
        _meanAverageIntent.exposed_checkBlocksRange(numerator, denominator);

        denominator.startBlock = 9_798_709;
        denominator.endBlock = 9_848_500;

        vm.expectRevert("MeanAverageIntent:invalid-denominator-block-window-end");
        _meanAverageIntent.exposed_checkBlocksRange(numerator, denominator);
    }

    function test_CheckPercentageDifference_RevertWhen_OutOfRange() external {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        bytes memory intentDataHigh = _meanAverageIntent.encode(
            uniswapV3Pool, block.number, 89_220, 40, block.number, 49_950, 40, 105_000, 108_000
        );
        bytes memory intentDataLow = _meanAverageIntent.encode(
            uniswapV3Pool, block.number, 89_220, 40, block.number, 49_950, 40, 110_000, 115_000
        );
        bytes memory hookData = abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630);

        vm.expectRevert("MeanAverageIntent:high-difference");
        _meanAverageIntent.exposed_checkPercentageDifference(intentDataHigh, hookData);

        vm.expectRevert("MeanAverageIntent:low-difference");
        _meanAverageIntent.exposed_checkPercentageDifference(intentDataLow, hookData);
    }
}
