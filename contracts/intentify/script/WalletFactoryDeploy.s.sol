// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { WalletFactory } from "../src/WalletFactory.sol";

contract WalletFactoryDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        WalletFactory walletFactory = new WalletFactory();

        vm.stopBroadcast();
    }
}

// forge script script/WalletFactoryDeploy.s.sol:WalletFactoryDeploy --fork-url http://localhost:8545 --broadcast
// forge script script/WalletFactoryDeploy.s.sol:WalletFactoryDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify
// -vvvv
