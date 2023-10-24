// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { BaseTest } from "~/test/Base.t.sol";
import { ChainlinkDataFeedIntentHarness } from "~/test/mocks/harness/intents/ChainlinkDataFeedIntentHarness.sol";

contract ChainlinkDataFeedIntentUnitConcreteTest is BaseTest {
    ChainlinkDataFeedIntentHarness internal _chainlinkDataFeedIntentHarness;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        initializeBase();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_encodeIntent_Success() external { }
}
