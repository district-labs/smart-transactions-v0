// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { WalletFactoryTestnet } from "../../src/WalletFactoryTestnet.sol";

contract WalletFactoryTestnetDeploy is Script {
    function run() external {
        address[] memory addressList = new address[](2);
        addressList[0] = address(0x7F06149c1A1e9125d1d284EBb39E7B0d149962F0);
        addressList[1] = address(0x719669ed43B1Cb2F96b068236D9d7B1545f098f2);
        uint256[] memory amountList = new uint256[](2);
        amountList[0] = 150_000e6;
        amountList[1] = 100e18;

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WalletFactoryTestnet walletFactory = new WalletFactoryTestnet(
            addressList,
            amountList);

        vm.stopBroadcast();
    }
}
