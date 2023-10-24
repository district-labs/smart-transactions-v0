// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent } from "~/src/TypesAndDecoders.sol";
import { TimestampIntent, IntentAbstract } from "~/src/intents/TimestampIntent.sol";
import { TimestampIntentHarness } from "~/test/mocks/harness/intents/TimestampIntentHarness.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract TimestampIntentUnitConcreteTest is BaseTest {
    TimestampIntentHarness internal _timestampIntentHarness;

    address internal immutable _safeCreatedMock = address(0x1111);

    function setUp() public virtual {
        initializeBase();

        _timestampIntentHarness = new TimestampIntentHarness();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_encodeIntent_Success() external {
        uint128 minTimestamp = uint128(block.timestamp - 1);
        uint128 maxTimestamp = uint128(block.timestamp + 1);
        bytes memory data = _timestampIntentHarness.encodeIntent(minTimestamp, maxTimestamp);
        assertEq(data, abi.encode(minTimestamp, maxTimestamp));
    }

    function test_exposed_decodeIntent_Success() external {
        uint128 minTimestamp = uint128(block.timestamp - 1);
        uint128 maxTimestamp = uint128(block.timestamp + 1);
        Intent memory intent = Intent({
            root: address(0x1111),
            value: 0,
            target: address(_timestampIntentHarness),
            data: _timestampIntentHarness.encodeIntent(minTimestamp, maxTimestamp)
        });

        (uint128 decodedMinTimestamp, uint128 decodedMaxTimestamp) =
            _timestampIntentHarness.exposed_decodeIntent(intent);
        assertEq(decodedMinTimestamp, minTimestamp);
        assertEq(decodedMaxTimestamp, maxTimestamp);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_execute_RevertWhen_InvalidRoot() external {
        Intent memory intent = Intent({
            // The root is not the same as the safe created address, so it should revert with `InvalidRoot`.
            root: address(0),
            value: 0,
            target: address(_timestampIntentHarness),
            data: bytes("")
        });

        vm.expectRevert(IntentAbstract.InvalidRoot.selector);
        _timestampIntentHarness.execute(intent);
    }

    function test_execute_RevertWhen_InvalidTarget() external {
        Intent memory intent = Intent({
            root: address(_safeCreatedMock),
            value: 0,
            // The target is not the same as the timestamp intent address, so it should revert with `InvalidTarget`.
            target: address(0),
            data: bytes("")
        });

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(IntentAbstract.InvalidTarget.selector);
        _timestampIntentHarness.execute(intent);
    }
}
