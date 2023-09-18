// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20Mintable } from "../../src/periphery/ERC20Mintable.sol";

contract TwapIntentDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC20Mintable erc20Mintable = new ERC20Mintable("District Labs USDC","disUSDC",6);

        vm.stopBroadcast();
    }
}
