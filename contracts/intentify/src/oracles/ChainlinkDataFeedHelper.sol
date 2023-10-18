// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { AggregatorV3Interface } from "@chainlink/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainlinkDataFeedHelper {
    function _calculateBaseAsset(int256 price, uint256 baseDecimal, uint256 amount) internal pure returns (uint256) {
        return amount * uint256(price) / 10 ** baseDecimal;
    }

    function _calculateQuoteAsset(int256 price, uint256 baseDecimal, uint256 amount) internal pure returns (uint256) {
        return (amount / uint256(price)) * (10 ** baseDecimal);
    }

    function _calcuateTokenInAmountEstimated(
        uint8 tokenOutDecimals,
        uint8 tokenInDecimals,
        uint256 tokenAmountExpected,
        uint8 feedDecimals,
        int256 derivedPrice,
        bool isBuy
    )
        internal
        pure
        returns (uint256 tokenAmountEstimated)
    {
        if (isBuy) {
            tokenAmountEstimated = (tokenAmountExpected * uint256(derivedPrice) * 10 ** uint256(tokenOutDecimals))
                / (10 ** uint256(tokenInDecimals + feedDecimals));
        } else {
            tokenAmountEstimated = (tokenAmountExpected * uint256(derivedPrice) * 10 ** uint256(tokenInDecimals))
                / (10 ** uint256(tokenOutDecimals + feedDecimals));
        }
    }

    function _getDerivedPrice(
        address _base,
        address _quote,
        uint8 _decimals,
        uint256 thresholdSeconds
    )
        internal
        view
        returns (int256)
    {
        require(_decimals > uint8(0) && _decimals <= uint8(18), "Invalid _decimals");
        int256 decimals = int256(10 ** uint256(_decimals));
        (, int256 basePrice,, uint256 baseUpdatedAt,) = AggregatorV3Interface(_base).latestRoundData();
        require(block.timestamp - baseUpdatedAt <= thresholdSeconds, "ChainlinkDataFeedHelper:stale-price");

        uint8 baseDecimals = AggregatorV3Interface(_base).decimals();

        (, int256 quotePrice,, uint256 quoteUpdatedAt,) = AggregatorV3Interface(_quote).latestRoundData();
        require(block.timestamp - quoteUpdatedAt <= thresholdSeconds, "ChainlinkDataFeedHelper:stale-price");
        uint8 quoteDecimals = AggregatorV3Interface(_quote).decimals();

        return _calculateDerivedPrice(basePrice, baseDecimals, quotePrice, quoteDecimals, _decimals, decimals);
    }

    function _calculateDerivedPrice(
        int256 basePrice,
        uint8 baseDecimals,
        int256 quotePrice,
        uint8 quoteDecimals,
        uint8 decimals,
        int256 scaledDecimals
    )
        internal
        view
        returns (int256)
    {
        basePrice = _scalePrice(basePrice, baseDecimals, decimals);
        quotePrice = _scalePrice(quotePrice, quoteDecimals, decimals);
        return (basePrice * scaledDecimals) / quotePrice;
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
