// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent } from "~/src/TypesAndDecoders.sol";
import { BaseTest } from "~/test/Base.t.sol";
import { ChainlinkDataFeedIntent, AggregatorV3Interface } from "~/src/intents/ChainlinkDataFeedIntent.sol";
import { ChainlinkDataFeedIntentHarness } from "~/test/mocks/harness/intents/ChainlinkDataFeedIntentHarness.sol";

contract ChainlinkDataFeedIntentUnitFuzzTest is BaseTest {
    ChainlinkDataFeedIntentHarness internal _chainlinkDataFeedIntentHarness;

    address internal immutable _safeCreatedMock = address(0x1111);
    address internal immutable _priceFeedMock = address(0x2222);

    int256 internal immutable _minValue = 1000e8;
    int256 internal immutable _maxValue = 2000e8;
    uint256 internal immutable _thresholdSeconds = 5 minutes;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        initializeBase();

        _chainlinkDataFeedIntentHarness = new ChainlinkDataFeedIntentHarness();
    }

    function _setupIntent() internal view returns (Intent memory intent) {
        return Intent({
            root: _safeCreatedMock,
            value: 0,
            target: address(_chainlinkDataFeedIntentHarness),
            data: _chainlinkDataFeedIntentHarness.encodeIntent(_priceFeedMock, _minValue, _maxValue, _thresholdSeconds)
        });
    }

    function _mockPriceFeedCall(
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
        internal
    {
        vm.mockCall(
            _priceFeedMock,
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(roundId, answer, startedAt, updatedAt, answeredInRound)
        );
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_execute_Success(int256 dataFeedAnswer) external {
        // Ensure the data feed answer is within the bounds of the intent.
        dataFeedAnswer = bound(dataFeedAnswer, _minValue, _maxValue);

        Intent memory intent = _setupIntent();

        _mockPriceFeedCall(
            1, // roundId
            dataFeedAnswer, // answer
            block.timestamp - 1000, // startedAt
            block.timestamp - (_thresholdSeconds / 2), // updatedAt
            1 // answeredInRound);
        );

        // Execute from the intent root
        vm.prank(_safeCreatedMock);

        _chainlinkDataFeedIntentHarness.execute(intent);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_execute_RevertWhen_StaleData(uint256 timestamp) external {
        vm.assume(timestamp > _thresholdSeconds + 1);
        vm.warp(timestamp);

        Intent memory intent = _setupIntent();

        _mockPriceFeedCall(
            1, // roundId
            1680e8, // answer
            0, // startedAt
            block.timestamp - (_thresholdSeconds + 1), // updatedAt
            1 // answeredInRound);
        );

        // Execute from the intent root
        vm.prank(_safeCreatedMock);

        vm.expectRevert(ChainlinkDataFeedIntent.StaleData.selector);
        _chainlinkDataFeedIntentHarness.execute(intent);
    }

    function test_execute_RevertWhen_LowValue(int256 dataFeedAnswer) external {
        dataFeedAnswer = bound(dataFeedAnswer, 0, _minValue - 1);

        Intent memory intent = _setupIntent();

        _mockPriceFeedCall(
            1, // roundId
            dataFeedAnswer, // answer
            block.timestamp - 1000, // startedAt
            block.timestamp - (_thresholdSeconds / 2), // updatedAt
            1 // answeredInRound);
        );

        // Execute from the intent root
        vm.prank(_safeCreatedMock);

        vm.expectRevert(ChainlinkDataFeedIntent.LowValue.selector);
        _chainlinkDataFeedIntentHarness.execute(intent);
    }

    function test_execute_RevertWhen_HighValue(int256 dataFeedAnswer) external {
        dataFeedAnswer = bound(dataFeedAnswer, _maxValue + 1, type(int256).max);

        Intent memory intent = _setupIntent();

        _mockPriceFeedCall(
            1, // roundId
            dataFeedAnswer, // answer
            block.timestamp - 1000, // startedAt
            block.timestamp - (_thresholdSeconds / 2), // updatedAt
            1 // answeredInRound);
        );

        // Execute from the intent root
        vm.prank(_safeCreatedMock);

        vm.expectRevert(ChainlinkDataFeedIntent.HighValue.selector);
        _chainlinkDataFeedIntentHarness.execute(intent);
    }
}
