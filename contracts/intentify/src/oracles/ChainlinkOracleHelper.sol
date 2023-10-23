// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { AggregatorV3Interface } from "chainlink/interfaces/AggregatorV3Interface.sol";

contract ChainlinkOracleHelper {
    function _calculateBaseAsset(int256 price, uint256 baseDecimal, uint256 amount) internal pure returns (uint256) {
        return amount * uint256(price) / 10 ** baseDecimal;
    }

    function _calculateQuoteAsset(int256 price, uint256 baseDecimal, uint256 amount) internal pure returns (uint256) {
        return (amount / uint256(price)) * (10 ** baseDecimal);
    }
}
