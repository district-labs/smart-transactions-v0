// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent } from "~/src/TypesAndDecoders.sol";
import { TimestampIntent } from "~/src/intents/TimestampIntent.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract TimestampIntent_Unit_Fuzz_Test is BaseTest {
    TimestampIntent internal _timestampIntent;

    address internal immutable _safeCreatedMock = address(0x1111);

    function setUp() public virtual {
        initializeBase();

        _timestampIntent = new TimestampIntent();
    }

    function setupIntent(uint128 minTimestamp, uint128 maxTimestamp) internal view returns (Intent memory intent) {
        intent = Intent({
            root: address(_safeCreatedMock),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(minTimestamp, maxTimestamp)
        });
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_execute_TimestampAfter_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);

        Intent memory intent = setupIntent(uint128(block.timestamp - pastSeconds), type(uint128).max);

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        _timestampIntent.execute(intent);
    }

    function test_execute_TimestampBefore_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds + block.timestamp < type(uint128).max);

        Intent memory intent = setupIntent(type(uint128).min, uint128(block.timestamp + pastSeconds));

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        _timestampIntent.execute(intent);
    }

    function test_execute_TimestampInRange_Success(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);
        vm.assume(pastSeconds + block.timestamp < type(uint128).max);

        Intent memory intent =
            setupIntent(uint128(block.timestamp - pastSeconds), uint128(block.timestamp + pastSeconds));

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        _timestampIntent.execute(intent);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_execute_RevertWhen_Early(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds + block.timestamp < type(uint128).max);

        uint128 minTimestamp = uint128(block.timestamp + pastSeconds);

        Intent memory intent = setupIntent(minTimestamp, type(uint128).max);

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(abi.encodeWithSelector(TimestampIntent.Early.selector, block.timestamp, minTimestamp));
        _timestampIntent.execute(intent);
    }

    function test_execute_RevertWhen_Expired(uint128 pastSeconds) external {
        vm.assume(pastSeconds > 0);
        vm.assume(pastSeconds < block.timestamp);

        uint128 maxTimestamp = uint128(block.timestamp - pastSeconds);

        Intent memory intent = setupIntent(type(uint128).min, maxTimestamp);

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(abi.encodeWithSelector(TimestampIntent.Expired.selector, block.timestamp, maxTimestamp));
        _timestampIntent.execute(intent);
    }
}
