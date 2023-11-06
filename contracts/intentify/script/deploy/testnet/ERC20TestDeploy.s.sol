// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20Mintable } from "../../../src/periphery/ERC20Mintable.sol";

contract ERC20TestDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new ERC20Mintable("Test Wrapped ETH","WETH",18);
        new ERC20Mintable("Test USDC","USDC", 6);
        new ERC20Mintable("District Labs","DIS", 18);
        new ERC20Mintable("Web3 Rizz","RIZZ", 18);

        vm.stopBroadcast();
    }
}
