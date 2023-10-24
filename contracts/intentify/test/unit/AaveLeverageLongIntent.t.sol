// // SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.8.19 <0.9.0;

// import { console2 } from "forge-std/StdCheats.sol";
// import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
// import { Safe } from "safe-contracts/Safe.sol";
// import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
// import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";
// import { Enum } from "safe-contracts/common/Enum.sol";

// import {
//     Intent,
//     IntentBatch,
//     IntentBatchExecution,
//     Signature,
//     Hook,
//     TypesAndDecoders
// } from "../../src/TypesAndDecoders.sol";
// import { AaveLeverageLongIntent } from "../../src/intents/AaveLeverageLongIntent.sol";
// import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
// import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";
// import { FundMainnetAccounts } from "../utils/FundMainnetAccounts.sol";
// import { Counter } from "../mocks/Counter.sol";

// contract MockAaveLeverageLongIntent is AaveLeverageLongIntent {
//     function calculatePayout(
//         uint8 swapType,
//         int256 price,
//         uint256 supplyAssetDecimals,
//         uint256 borrowAssetDecimals,
//         uint256 supplyAmount,
//         uint256 borrowAmount,
//         uint32 fee
//     )
//         external
//         view
//         returns (uint256 amountRepay)
//     {
//         return _calculatePayout(swapType, price, supplyAssetDecimals, borrowAssetDecimals, supplyAmount,
// borrowAmount);
//     }
// }

// contract AaveLeverageLongIntentTest is SafeTestingUtils {
//     IntentifySafeModule internal _intentifySafeModule;
//     MockAaveLeverageLongIntent internal _aaveLeverageLongIntent;

//     function setUp() public virtual {
//         initializeBase();
//         _aaveLeverageLongIntent = new MockAaveLeverageLongIntent(address(_intentifySafeModule), AAVE_POOL);
//     }

//     /* ===================================================================================== */
//     /* Success Tests                                                                         */
//     /* ===================================================================================== */

//     /**
//      * @notice This test is to simulate a flashloan of 1 ETH and then use that ETH to borrow USDC
//      */
//     function test_AaveLeverageLongIntent_calculatePayout_Success() external {
//         uint256 SWAP_TYPE = 1;
//         uint256 PRICE = 1e18;
//         uint256 TOKEN_A_DECIMALS = 18;
//         uint256 TOKEN_B_DECIMALS = 18;
//         uint256 TOKEN_A_AMOUNT = 1e18;
//         uint256 TOKEN_B_AMOUNT = 1e18;
//         uint256 FEE = 0;

//         uint256 amount =
//             calculatePayout(SWAP_TYPE, PRICE, TOKEN_A_DECIMALS, TOKEN_B_DECIMALS, TOKEN_A_AMOUNT, TOKEN_B_AMOUNT,
// FEE);
//     }
// }
