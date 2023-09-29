// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { Safe } from "safe-contracts/Safe.sol";
// import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
// import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

contract SafeDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new Safe();

        vm.stopBroadcast();
    }
}
