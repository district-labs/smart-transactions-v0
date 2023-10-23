// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { UniswapV3TwapOracle } from "../../../src/periphery/Axiom/UniswapV3TwapOracle.sol";

contract LimitOrderIntentDeploy is Script {
    function run(address axiomV1QueryAddress) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UniswapV3TwapOracle uniswapV3TwapOracle = new UniswapV3TwapOracle(axiomV1QueryAddress);

        vm.stopBroadcast();
    }
}
