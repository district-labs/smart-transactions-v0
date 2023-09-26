// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { WalletFactory } from "../../src/WalletFactory.sol";

contract WalletFactoryDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WalletFactory walletFactory = new WalletFactory();

        vm.stopBroadcast();
    }
}
