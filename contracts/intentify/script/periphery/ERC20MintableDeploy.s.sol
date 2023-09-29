// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { ERC20Mintable } from "../../src/periphery/ERC20Mintable.sol";

contract ERC20MintableDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new ERC20Mintable("Test Wrapped ETH","testWETH", 18);
        new ERC20Mintable("Test USD Coin","testUSDC", 6);

        vm.stopBroadcast();
    }
}
