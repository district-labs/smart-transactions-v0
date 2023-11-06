// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

contract ChainlinkOracleTestnet {
    int256 internal _answer;

    constructor(int256 answer) {
        _answer = answer;
    }

    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return (0, _answer, 0, block.timestamp, 0);
    }

    function setAnswer(int256 answer) external {
        _answer = answer;
    }
}
