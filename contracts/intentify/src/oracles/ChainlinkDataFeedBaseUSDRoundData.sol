// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { FeedRegistryInterface } from "@chainlink/v0.8/interfaces/FeedRegistryInterface.sol";
import { Denominations } from "@chainlink/v0.8/Denominations.sol";

contract ChainlinkDataFeedBaseUSDRoundData {
    address internal immutable _weth;
    FeedRegistryInterface internal _registry;

    constructor(address __registry, address __weth) {
        _weth = __weth;
        _registry = FeedRegistryInterface(__registry);
    }

    function getLatestRoundData(address base)
        public
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        base = base == _weth ? 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE : base;
        return _registry.latestRoundData(base, Denominations.USD);
    }
}
