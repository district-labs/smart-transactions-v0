// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent } from "~/src/TypesAndDecoders.sol";
import { BaseTest } from "~/test/Base.t.sol";
import {
    AggregatorV3Interface, ChainlinkDataFeedIntent, IntentAbstract
} from "~/src/intents/ChainlinkDataFeedIntent.sol";
import { ChainlinkDataFeedIntentHarness } from "~/test/mocks/harness/intents/ChainlinkDataFeedIntentHarness.sol";

contract ChainlinkDataFeedIntentUnitConcreteTest is BaseTest {
    ChainlinkDataFeedIntentHarness internal _chainlinkDataFeedIntentHarness;

    address internal immutable _safeCreatedMock = address(0x1111);
    address internal immutable _priceFeedMock = address(0x2222);

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        initializeBase();

        _chainlinkDataFeedIntentHarness = new ChainlinkDataFeedIntentHarness();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_encodeIntent_Success() external {
        int256 minValue = 100;
        int256 maxValue = 200;
        uint256 thresholdSeconds = 300;

        bytes memory expectedData = abi.encode(_priceFeedMock, minValue, maxValue, thresholdSeconds);
        bytes memory actualData =
            _chainlinkDataFeedIntentHarness.encodeIntent(_priceFeedMock, minValue, maxValue, thresholdSeconds);

        assertEq(actualData, expectedData);
    }

    function test_exposed_decodeIntent_Success() external {
        int256 minValue = 100;
        int256 maxValue = 200;
        uint256 thresholdSeconds = 300;

        Intent memory intent = Intent({
            root: _safeCreatedMock,
            value: 0,
            target: address(_chainlinkDataFeedIntentHarness),
            data: _chainlinkDataFeedIntentHarness.encodeIntent(_priceFeedMock, minValue, maxValue, thresholdSeconds)
        });

        (address dataFeedDecoded, int256 minValueDecoded, int256 maxValueDecoded, uint256 thresholdSecondsDecoded) =
            _chainlinkDataFeedIntentHarness.exposed_decodeIntent(intent);

        assertEq(dataFeedDecoded, _priceFeedMock);
        assertEq(minValueDecoded, minValue);
        assertEq(maxValueDecoded, maxValue);
        assertEq(thresholdSecondsDecoded, thresholdSeconds);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_execute_RevertWhen_InvalidRoot() external {
        Intent memory intent = Intent({
            // The root is not the same as the safe created address, so it should revert with `InvalidRoot`.
            root: address(0),
            value: 0,
            target: address(_chainlinkDataFeedIntentHarness),
            data: bytes("")
        });

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(IntentAbstract.InvalidRoot.selector);
        _chainlinkDataFeedIntentHarness.execute(intent);
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
        _chainlinkDataFeedIntentHarness.execute(intent);
    }
}
