// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { BlockNumberIntent, IntentAbstract } from "../../src/intents/BlockNumberIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract BlockNumberIntentTest is SafeTestingUtils {
    BlockNumberIntent internal _blockNumberIntent;

    function setUp() public virtual {
        initializeBase();
        initializeSafeBase();

        _blockNumberIntent = new BlockNumberIntent();
    }

    function generateCalldata(Intent calldata intent) external pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature("execute(Intent)", intent);
        return data;
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_blockNumberAfterIntent_Success(uint128 pastBlocks, uint128 blockNumber) external {
        vm.assume(pastBlocks > 0);
        vm.assume(blockNumber > 0);
        vm.assume(pastBlocks < blockNumber);

        // Set the block.number to `blockNumber`
        vm.roll(blockNumber);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_blockNumberIntent),
            data: _blockNumberIntent.encodeIntent(uint128(block.number - pastBlocks), type(uint128).max)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);
    }

    function test_blockNumberBeforeIntent_Success(uint128 pastBlocks, uint128 blockNumber) external {
        vm.assume(pastBlocks > 0);
        vm.assume(blockNumber > 0);
        vm.assume(pastBlocks < type(uint128).max / 2);
        vm.assume(blockNumber < type(uint128).max / 2);

        // Set the block.number to `blockNumber`
        vm.roll(blockNumber);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_blockNumberIntent),
            data: _blockNumberIntent.encodeIntent(type(uint128).min, uint128(block.number + pastBlocks))
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);
    }

    function test_blockNumberInRangeIntent_Success(uint128 pastBlocks, uint128 blockNumber) external {
        vm.assume(pastBlocks > 0);
        vm.assume(blockNumber > 0);
        vm.assume(pastBlocks < blockNumber);
        vm.assume(pastBlocks < type(uint128).max / 2);
        vm.assume(blockNumber < type(uint128).max / 2);

        // Set the block.number to `blockNumber`
        vm.roll(blockNumber);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_blockNumberIntent),
            data: _blockNumberIntent.encodeIntent(uint128(block.number - pastBlocks), uint128(block.number + pastBlocks))
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);
    }

    function test_encode_Success() external {
        uint128 minBlockNumber = uint128(block.number - 1);
        uint128 maxBlockNumber = uint128(block.number + 1);
        bytes memory data = _blockNumberIntent.encodeIntent(minBlockNumber, maxBlockNumber);
        assertEq(data, abi.encode(minBlockNumber, maxBlockNumber));
    }

    // /* ===================================================================================== */
    // /* Failing                                                                               */
    // /* ===================================================================================== */

    function test_RevertWhen_blockNumberAfterIntent_IsEarly(uint128 pastBlocks, uint128 blockNumber) external {
        vm.assume(pastBlocks > 0);
        vm.assume(blockNumber > 0);
        vm.assume(pastBlocks < type(uint128).max / 2);
        vm.assume(blockNumber < type(uint128).max / 2);

        // Set the block.number to `blockNumber`
        vm.roll(blockNumber);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_blockNumberIntent),
            data: _blockNumberIntent.encodeIntent(uint128(block.number + pastBlocks), type(uint128).max)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(BlockNumberIntent.Early.selector);
        _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_blockNumberBeforeIntent_IsExpired(uint128 pastBlocks, uint128 blockNumber) external {
        vm.assume(pastBlocks > 0);
        vm.assume(blockNumber > 0);
        vm.assume(pastBlocks < blockNumber);

        // Set the block.number to `blockNumber`
        vm.roll(blockNumber);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_blockNumberIntent),
            data: _blockNumberIntent.encodeIntent(type(uint128).min, uint128(block.number - pastBlocks))
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(BlockNumberIntent.Expired.selector);
        _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_InvalidRoot() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(0),
            value: 0,
            target: address(_blockNumberIntent),
            data: _blockNumberIntent.encodeIntent(type(uint128).min, type(uint128).max)
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
