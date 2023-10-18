// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { AggregatorV3Interface } from "@chainlink/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainlinkDataFeedHelper {
    function _getDerivedPrice(
        address _base,
        address _quote,
        uint8 _decimals,
        uint256 thresholdSeconds
    )
        public
        view
        returns (int256)
    {
        require(_decimals > uint8(0) && _decimals <= uint8(18), "Invalid _decimals");
        int256 decimals = int256(10 ** uint256(_decimals));
        (, int256 basePrice,, uint256 baseUpdatedAt,) = AggregatorV3Interface(_base).latestRoundData();
        require(block.timestamp - baseUpdatedAt <= thresholdSeconds, "ChainlinkDataFeedHelper:stale-price");

        uint8 baseDecimals = AggregatorV3Interface(_base).decimals();
        basePrice = _scalePrice(basePrice, baseDecimals, _decimals);

        (, int256 quotePrice,, uint256 quoteUpdatedAt,) = AggregatorV3Interface(_quote).latestRoundData();
        require(block.timestamp - quoteUpdatedAt <= thresholdSeconds, "ChainlinkDataFeedHelper:stale-price");
        uint8 quoteDecimals = AggregatorV3Interface(_quote).decimals();
        quotePrice = _scalePrice(quotePrice, quoteDecimals, _decimals);

        return (basePrice * decimals) / quotePrice;
    }

    function _scalePrice(int256 _price, uint8 _priceDecimals, uint8 _decimals) internal pure returns (int256) {
        if (_priceDecimals < _decimals) {
            return _price * int256(10 ** uint256(_decimals - _priceDecimals));
        } else if (_priceDecimals > _decimals) {
            return _price / int256(10 ** uint256(_priceDecimals - _decimals));
        }
        return _price;
    }
}
