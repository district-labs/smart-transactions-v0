// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import { DimensionalNonce, IntentExecution, Intent, IntentBatch, IntentBatchExecution, Signature, Hook, TypesAndDecoders } from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";
import { TimestampBeforeIntent } from "../src/intents/TimestampBeforeIntent.sol";

contract TimestampBeforeIntentTest is PRBTest, StdCheats {
    Intentify internal _intentify;
    TimestampBeforeIntent internal _TimestampBeforeIntent;

    uint256 SIGNER = 0xA11CE;
    address internal signer;

    Signature internal EMPTY_SIGNATURE = Signature({
                r: bytes32(0x00),
                s: bytes32(0x00),
                v: uint8(0x00)
            });
    Hook EMPTY_HOOK = Hook({
        target: address(0x00),
        data: bytes("")
    });

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _intentify = new Intentify(signer, "Intentify", "V0");
        _TimestampBeforeIntent = new TimestampBeforeIntent();
    }

    function generateCalldata(Intent calldata intent) external pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature("execute(Intent)", intent);
        return data;
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_TimestampBeforeIntent_Success(uint128 pastSeconds) external {        
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);

        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_TimestampBeforeIntent),
                data:  abi.encodePacked((uint128(block.timestamp - pastSeconds)))
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_TimestampBeforeIntent_IsExpired(uint128 pastSeconds) external {        
        vm.assume(pastSeconds > 0);
        vm.assume(block.timestamp + pastSeconds < type(uint128).max);

        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_TimestampBeforeIntent),
                data:  abi.encodePacked((uint128(block.timestamp + pastSeconds)))
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        vm.expectRevert(bytes("TimestampBeforeIntent:expired"));
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_TimestampBeforeIntent_IsCurrentTimestamp() external {        
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_TimestampBeforeIntent),
                data:  abi.encodePacked((uint128(block.timestamp)))
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        vm.expectRevert(bytes("TimestampBeforeIntent:expired"));
        _intentify.execute(batchExecution);
    } 

    function test_RevertWhen_InvalidRoot() external {        
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            exec: IntentExecution({
                root: address(0),
                target: address(_TimestampBeforeIntent),
                data:  abi.encodePacked((uint128(block.timestamp - 100)))
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        vm.expectRevert(bytes("TimestampBeforeIntent:invalid-root"));
        _intentify.execute(batchExecution);
    }
}
