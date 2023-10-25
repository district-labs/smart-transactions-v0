// // SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.8.19 <0.9.0;

// import { Safe } from "safe-contracts/Safe.sol";
// import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
// import { ERC20Mintable } from "../src/periphery/ERC20Mintable.sol";
// import { console2 } from "forge-std/console2.sol";
// import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

// import { WalletFactoryTestnet } from "../src/WalletFactoryTestnet.sol";
// import { BaseTest } from "./utils/Base.t.sol";

// contract WalletFactoryTestnetTest is BaseTest {
//     ERC20Mintable internal _testUSDC;
//     ERC20Mintable internal _testWETH;
//     Safe internal _safe;
//     SafeProxy internal _safeProxy;
//     WalletFactoryTestnet.TestTokens[] internal _testTokens;
//     WalletFactoryTestnet internal _walletFactoryTestnet;

//     function setUp() public virtual {
//         initializeBase();

//         _testUSDC = new ERC20Mintable("USDC", "USDC", 6);
//         _testWETH = new ERC20Mintable("WETH", "WETH", 18);

//         _safe = new Safe();
//         _safeProxy = new SafeProxy(address(_safe));

//         address[] memory addressList = new address[](2);
//         addressList[0] = address(_testUSDC);
//         addressList[1] = address(_testWETH);
//         uint256[] memory amountList = new uint256[](2);
//         amountList[0] = 150_000e6;
//         amountList[1] = 100e18;

//         _walletFactoryTestnet = new WalletFactoryTestnet(
//             addressList,
//             amountList
//         );
//     }

//     function test_WalletFactory_getDeterministicWalletAddress_Success() external {
//         address EXPECTED_ADDRESS = 0x018A4A67Bc86771Ff1b17f76F06D37638A90aAfF;
//         address proxy = _walletFactoryTestnet.getDeterministicWalletAddress(address(_safe), wallet1, 0);
//         assertEq(address(proxy), address(EXPECTED_ADDRESS));
//     }

//     function test_WalletFactory_createDeterministicWallet_Success() external {
//         address proxyCounterfactual = _walletFactoryTestnet.getDeterministicWalletAddress(address(_safe), wallet1,
// 0);
//         SafeProxy proxyMaterialized = _walletFactoryTestnet.createDeterministicWallet(address(_safe), wallet1, 0);
//         uint256 proxyTestUSDCBalance = _testUSDC.balanceOf(address(proxyMaterialized));
//         uint256 proxyTestWETHBalance = _testWETH.balanceOf(address(proxyMaterialized));

//         assertEq(proxyTestUSDCBalance, 150_000e6);
//         assertEq(proxyTestWETHBalance, 100e18);
//         assertEq(address(proxyMaterialized), address(proxyCounterfactual));
//     }

//     function test_WalletFactory_isWalletMaterialized_Success() external {
//         address proxyCounterfactual = _walletFactoryTestnet.getDeterministicWalletAddress(address(_safe), wallet1,
// 0);
//         bool isCounterfactual = _walletFactoryTestnet.isWalletMaterialized(address(_safe), wallet1, 0);
//         assertEq(isCounterfactual, false);
//         SafeProxy proxyMaterialized = _walletFactoryTestnet.createDeterministicWallet(address(_safe), wallet1, 0);
//         bool isMaterialized = _walletFactoryTestnet.isWalletMaterialized(address(_safe), wallet1, 0);
//         assertEq(isMaterialized, true);
//     }
// }
