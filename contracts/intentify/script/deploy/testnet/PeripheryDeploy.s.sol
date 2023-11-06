// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { UniswapV3TwapOracle } from "../../../src/periphery/Axiom/UniswapV3TwapOracle.sol";
import { ERC20Mintable } from "../../../src/periphery/ERC20Mintable.sol";
import { ChainlinkOracleTestnet } from "../../../src/periphery/ChainlinkOracleTestnet.sol";
import { WalletFactoryTestnet } from "../../../src/WalletFactoryTestnet.sol";

contract PeripheryDeploy is Script {
    function run(address axiomV1QueryAddress) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // Zero-Knowlege Data Hub
        new UniswapV3TwapOracle(axiomV1QueryAddress);

        // ERC20 Tokens
        ERC20Mintable weth = new ERC20Mintable("Test Wrapped ETH","WETH",18);
        ERC20Mintable usdc = new ERC20Mintable("Test USDC","USDC", 6);
        ERC20Mintable dis = new ERC20Mintable("District Labs","DIS", 18);
        ERC20Mintable rizz = new ERC20Mintable("Web3 Rizz","RIZZ", 18);

        // Chainlink Oracles
        int256 wethPrice = 2000e8;
        int256 usdcPrice = 1e8;
        int256 disPrice = 5e8;
        int256 rizzPrice = 10e8;
        new ChainlinkOracleTestnet(wethPrice);
        new ChainlinkOracleTestnet(usdcPrice);
        new ChainlinkOracleTestnet(disPrice);
        new ChainlinkOracleTestnet(rizzPrice);

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
        vm.stopBroadcast();

        uint256 walletFactoryDeployerPrivateKey = vm.envUint("WALLET_FACTORY_PRIVATE_KEY");
        vm.startBroadcast(walletFactoryDeployerPrivateKey);

        // Wallet Factory
        new WalletFactoryTestnet(
            addressList,
            amountList);

        vm.stopBroadcast();
    }
}
