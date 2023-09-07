// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import { DimensionalNonce, Intent, IntentBatch, IntentBatchExecution, Signature, Hook, TypesAndDecoders } from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";
import { TimestampBeforeHook } from "../src/hooks/TimestampBeforeHook.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract IntentifyTest is PRBTest, StdCheats {
    Intentify internal _intentify;
    TimestampBeforeHook internal _timestampBeforeHook;

    uint256 SIGNER = 0xA11CE;
    address internal signer;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _intentify = new Intentify(signer, "Intentify", "V0");
        _timestampBeforeHook = new TimestampBeforeHook();
    }

    function generateCalldata(Intent calldata intent) external pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature("execute(Intent)", intent);
        return data;
    }


    function test_TimestampBeforeHook_Success() external {        
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_intentify),
            target: address(_timestampBeforeHook),
            data:  abi.encodePacked((uint128(block.timestamp - 100)))
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

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: new Hook[](0)
        });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_TimestampBeforeHook_IsExpired() external {        
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_intentify),
            target: address(_timestampBeforeHook),
            data: abi.encodePacked((uint128(block.timestamp + 100)))
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

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: new Hook[](0)
        });

        vm.expectRevert(bytes("TimestampBeforeHook:expired"));
        _intentify.execute(batchExecution);
    }
}
