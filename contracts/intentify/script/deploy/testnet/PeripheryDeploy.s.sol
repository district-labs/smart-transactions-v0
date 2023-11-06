// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20Mintable } from "../../../src/periphery/ERC20Mintable.sol";
import { WalletFactoryTestnet } from "../../../src/WalletFactoryTestnet.sol";

contract PeripheryDeploy is Script {
    function run() external {
        ERC20Mintable weth = new ERC20Mintable("Test Wrapped ETH","WETH",18);
        ERC20Mintable usdc = new ERC20Mintable("Test USDC","USDC", 6);
        ERC20Mintable dis = new ERC20Mintable("District Labs","DIS", 18);
        ERC20Mintable rizz = new ERC20Mintable("Web3 Rizz","RIZZ", 18);

        address[] memory addressList = new address[](4);
        addressList[0] = address(weth);
        addressList[1] = address(usdc);
        addressList[2] = address(dis);
        addressList[3] = address(rizz);
        uint256[] memory amountList = new uint256[](4);
        amountList[0] = 10e18;
        amountList[1] = 10_000e6;
        amountList[2] = 5e18;
        amountList[3] = 1e18;

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WalletFactoryTestnet walletFactory = new WalletFactoryTestnet(
            addressList,
            amountList);

        vm.stopBroadcast();
    }
}
