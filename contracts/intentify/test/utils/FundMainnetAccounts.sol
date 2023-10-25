// // SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.8.19 <0.9.0;

// import { console2 } from "forge-std/StdCheats.sol";
// import { PRBTest } from "@prb/test/PRBTest.sol";
// import { StdCheats } from "forge-std/StdCheats.sol";

// interface IERC20 {
//     function balanceOf(address account) external view returns (uint256);
//     function transfer(address recipient, uint256 amount) external returns (bool);
// }

// contract FundMainnetAccounts is PRBTest, StdCheats {
//     address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
//     address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
//     address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
//     address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

//     function fundETH(address account, uint256 amount) public virtual {
//         vm.deal(account, amount);
//     }

//     function fundUSDC(address account, uint256 amount) public virtual {
//         vm.prank(vm.envAddress("WHALE_USDC"));
//         console2.log("Funding %s with %s USDC", account, amount);
//         IERC20(USDC).transfer(account, amount);
//     }

//     function fundDAI(address account, uint256 amount) public virtual {
//         vm.prank(vm.envAddress("WHALE_ACCOUNT"));
//         console2.log("Funding %s with %s DAI", account, amount);
//         IERC20(DAI).transfer(account, amount);
//     }

//     function fundWETH(address account, uint256 amount) public virtual {
//         vm.prank(vm.envAddress("WHALE_ACCOUNT"));
//         console2.log("Funding %s with %s WETH", account, amount);
//         IERC20(WETH).transfer(account, amount);
//     }
// }
