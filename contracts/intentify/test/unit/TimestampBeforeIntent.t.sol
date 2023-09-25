// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import {PRBTest} from "@prb/test/PRBTest.sol";
import {console2} from "forge-std/console2.sol";
import {StdCheats} from "forge-std/StdCheats.sol";

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import {Intentify} from "../../src/Intentify.sol";
import {TimestampBeforeIntent} from "../../src/intents/TimestampBeforeIntent.sol";

import {BaseTest} from "../utils/Base.t.sol";

contract TimestampBeforeIntentTest is BaseTest {
    Intentify internal _intentify;
    TimestampBeforeIntent internal _timestampBeforeIntent;

    Signature internal EMPTY_SIGNATURE = Signature({r: bytes32(0x00), s: bytes32(0x00), v: uint8(0x00)});
    Hook EMPTY_HOOK = Hook({target: address(0x00), data: bytes("")});

    function setUp() public virtual {
        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "0");
        _timestampBeforeIntent = new TimestampBeforeIntent();
    }

    function generateCalldata(Intent calldata intent) external pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature("execute(Intent)", intent);
        return data;
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_timestampBeforeIntent_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_timestampBeforeIntent),
            data: _timestampBeforeIntent.encode(uint128(block.timestamp - pastSeconds))
        });

        IntentBatch memory intentBatch =
            IntentBatch({root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents});

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({batch: intentBatch, signature: Signature({r: r, s: s, v: v}), hooks: hooks});

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    function test_encode_Success() external {
        uint128 timestamp = uint128(block.timestamp);
        bytes memory data = _timestampBeforeIntent.encode(timestamp);
        assertEq(data, abi.encodePacked(uint128(block.timestamp)));
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_timestampBeforeIntent_IsExpired(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(block.timestamp + pastSeconds < type(uint128).max);

        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_timestampBeforeIntent),
            data: _timestampBeforeIntent.encode(uint128(block.timestamp + pastSeconds))
        });

        IntentBatch memory intentBatch =
            IntentBatch({root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents});

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({batch: intentBatch, signature: Signature({r: r, s: s, v: v}), hooks: hooks});

        vm.expectRevert(bytes("TimestampBeforeIntent:expired"));
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_timestampBeforeIntent_IsCurrentTimestamp() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_timestampBeforeIntent),
            data: _timestampBeforeIntent.encode(uint128(block.timestamp))
        });

        IntentBatch memory intentBatch =
            IntentBatch({root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents});

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({batch: intentBatch, signature: Signature({r: r, s: s, v: v}), hooks: hooks});

        vm.expectRevert(bytes("TimestampBeforeIntent:expired"));
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_InvalidRoot() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(0),
            value: 0,
            target: address(_timestampBeforeIntent),
            data: _timestampBeforeIntent.encode(uint128(block.timestamp - 100))
        });

        IntentBatch memory intentBatch =
            IntentBatch({root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents});

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({batch: intentBatch, signature: Signature({r: r, s: s, v: v}), hooks: hooks});

        vm.expectRevert(bytes("TimestampBeforeIntent:invalid-root"));
        _intentify.execute(batchExecution);
    }
}
