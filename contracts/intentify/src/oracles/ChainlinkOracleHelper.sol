// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { AggregatorV3Interface } from "chainlink/interfaces/AggregatorV3Interface.sol";

contract ChainlinkOracleHelper { 
    function _calculateDenominatorAsset(address priceFeed, uint256 baseDecimal, uint256 amount) internal returns (uint256) {
        AggregatorV3Interface feed = AggregatorV3Interface(priceFeed);
        (, int256 price,,,) = feed.latestRoundData();
        return amount * uint256(price) / 10 ** baseDecimal;
    }
    
    function _calculateNumeratorAsset(address priceFeed, uint256 baseDecimal, uint256 amount) internal returns (uint256) {
        AggregatorV3Interface feed = AggregatorV3Interface(priceFeed);
        (, int256 price,,,) = feed.latestRoundData();
        return (amount / uint256(price)) * (10 ** baseDecimal);
    }
}
