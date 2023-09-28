// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { WalletFactoryTestnet } from "../../src/WalletFactoryTestnet.sol";

contract WalletFactoryDeploy is Script {
    function run() external {
        address[] memory addressList = new address[](2);
        addressList[0] = address(0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB);
        addressList[1] = address(0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739);
        uint8[] memory decimalsList = new uint8[](2);
        decimalsList[0] = 6;
        decimalsList[1] = 18;
        uint256[] memory amountList = new uint256[](2);
        amountList[0] = 150_000e6;
        amountList[1] = 100e18;

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WalletFactoryTestnet walletFactory = new WalletFactoryTestnet(addressList,
            decimalsList,
            amountList);

        vm.stopBroadcast();
    }
}
