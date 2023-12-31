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
import { TimestampIntent, IntentAbstract } from "../../src/intents/TimestampIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract TimestampIntentTest is SafeTestingUtils {
    TimestampIntent internal _timestampIntent;

    function setUp() public virtual {
        initializeBase();
        initializeSafeBase();

        _timestampIntent = new TimestampIntent();
    }

    function generateCalldata(Intent calldata intent) external pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature("execute(Intent)", intent);
        return data;
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_timestampAfterIntent_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(uint128(block.timestamp - pastSeconds), type(uint128).max)
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

    function test_timestampBeforeIntent_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds + block.timestamp < type(uint128).max);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(type(uint128).min, uint128(block.timestamp + pastSeconds))
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

    function test_timestampInRangeIntent_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);
        vm.assume(pastSeconds + block.timestamp < type(uint128).max);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(
                uint128(block.timestamp - pastSeconds), uint128(block.timestamp + pastSeconds)
                )
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
        uint128 minTimestamp = uint128(block.timestamp - 1);
        uint128 maxTimestamp = uint128(block.timestamp + 1);
        bytes memory data = _timestampIntent.encodeIntent(minTimestamp, maxTimestamp);
        assertEq(data, abi.encode(minTimestamp, maxTimestamp));
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_timestampAfterIntent_IsEarly(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds + block.timestamp < type(uint128).max);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(uint128(block.timestamp + pastSeconds), type(uint128).max)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(TimestampIntent.Early.selector);
        _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_timestampBeforeIntent_IsExpired(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(type(uint128).min, uint128(block.timestamp - pastSeconds))
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(TimestampIntent.Expired.selector);
        _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_InvalidRoot() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(0),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(type(uint128).min, type(uint128).max)
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
