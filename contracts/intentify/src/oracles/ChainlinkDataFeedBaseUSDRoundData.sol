// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { FeedRegistryInterface } from "@chainlink/v0.8/interfaces/FeedRegistryInterface.sol";
import { Denominations } from "@chainlink/v0.8/Denominations.sol";

contract ChainlinkDataFeedBaseUSDRoundData {
    FeedRegistryInterface internal registry;

    constructor(address _registry) {
        registry = FeedRegistryInterface(_registry);
    }

    function getLatestRoundData(address base)
        public
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return registry.latestRoundData(base, Denominations.USD);
    }
}
