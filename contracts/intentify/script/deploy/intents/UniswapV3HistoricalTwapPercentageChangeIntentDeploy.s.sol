// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { UniswapV3HistoricalTwapPercentageChangeIntent } from
    "../../../src/intents/UniswapV3HistoricalTwapPercentageChangeIntent.sol";

contract TwapIntentDeploy is Script {
    function run(address intentifySafeModule) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UniswapV3HistoricalTwapPercentageChangeIntent uniswapV3HistoricalTwapPercentageChangeIntent =
            new UniswapV3HistoricalTwapPercentageChangeIntent(intentifySafeModule);

        vm.stopBroadcast();
    }
}
