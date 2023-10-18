// // SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.8.19 <0.9.0;

// import { console2 } from "forge-std/StdCheats.sol";
// import { ChainlinkDataFeedHelper } from "../../src/oracles/ChainlinkDataFeedHelper.sol";
// import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

// contract MockChainlinkDataFeedHelper is ChainlinkDataFeedHelper {
//     function calculateDerivedPrice(
//         int256 basePrice,
//         uint8 baseDecimals,
//         int256 quotePrice,
//         uint8 quoteDecimals,
//         uint8 decimals,
//         int256 scaledDecimals
//     )
//         external
//         returns (int256)
//     {
//         return _calculateDerivedPrice(basePrice, baseDecimals, quotePrice, quoteDecimals, decimals, scaledDecimals);
//     }

//     function calculateBaseAsset(int256 price, uint256 baseDecimal, uint256 amount) external pure returns (uint256) {
//         return _calculateBaseAsset(price, baseDecimal, amount);
//     }

//     function calculateQuoteAsset(int256 price, uint256 baseDecimal, uint256 amount) external pure returns (uint256) {
//         return _calculateQuoteAsset(price, baseDecimal, amount);
//     }

//     function calculateTokenInAmountEstimated(
//         uint8 tokenOutDecimals,
//         uint8 tokenInDecimals,
//         uint256 tokenAmountExpected,
//         uint8 feedDecimals,
//         int256 derivedPrice,
//         bool isBuy
//     )
//         external
//         pure
//         returns (uint256 tokenAmountEstimated)
//     {
//         return _calculateTokenInAmountEstimated(
//             tokenOutDecimals, tokenInDecimals, tokenAmountExpected, feedDecimals, derivedPrice, isBuy
//         );
//     }
// }

// contract ChainlinkDataFeedHelperTest is SafeTestingUtils {
//     MockChainlinkDataFeedHelper public chainlinkOracleHelper;

//     function setUp() public virtual {
//         initializeBase();
//         chainlinkOracleHelper = new MockChainlinkDataFeedHelper();
//     }

//     /* ===================================================================================== */
//     /* Success Tests                                                                         */
//     /* ===================================================================================== */
//     function test_ChainLink_calculateDerivedPrice_USDC_ETH_Success() external {
//         // Block 18376878
//         int256 ETH_USD = 158_121_558_372;
//         uint8 ETH_USD_DECIMALS = 8;
//         int256 USDC_USD = 99_997_053;
//         uint8 USDC_USD_DECIMALS = 8;

//         uint8 decimals = 18;
//         int256 scaledDecimals = int256(10 ** uint256(decimals));

//         int256 price = chainlinkOracleHelper.calculateDerivedPrice(
//             ETH_USD, ETH_USD_DECIMALS, USDC_USD, USDC_USD_DECIMALS, decimals, scaledDecimals
//         );
//         assertEq(price, 1_581_262_183_516_548_232_676);

//         console2.log("PRICING", price);
//     }

//     function test_ChainLink_calculateDerivedPrice_ETH_USDC_Success() external {
//         // Block 18376878
//         int256 USDC_USD = 99_997_053;
//         uint8 USDC_USD_DECIMALS = 8;

//         int256 ETH_USD = 158_121_558_372;
//         uint8 ETH_USD_DECIMALS = 8;

//         uint8 decimals = 18;
//         int256 scaledDecimals = int256(10 ** uint256(decimals));

//         int256 price = chainlinkOracleHelper.calculateDerivedPrice(
//             USDC_USD, USDC_USD_DECIMALS, ETH_USD, ETH_USD_DECIMALS, decimals, scaledDecimals
//         );
//         assertEq(price, 632_406_194_509_827);

//         console2.log("PRICING", price);
//     }

//     function test_ChainLink_USDC_ETH_ConvertToETH_Amount_Success() external {
//         uint8 TOKEN_OUT_DECIMALS = 6;
//         uint8 TOKEN_IN_DECIMALS = 18;
//         int256 PRICE = 632_406_194_509_827;
//         uint8 PRICE_DECIMALS = 18;
//         uint256 usdcAmount = 1600e6;
//         uint256 swap = chainlinkOracleHelper.calculateTokenInAmountEstimated(
//             TOKEN_OUT_DECIMALS, TOKEN_IN_DECIMALS, usdcAmount, PRICE_DECIMALS, PRICE, false
//         );
//         assertEq(swap, 1_581_262_183);
//     }

//     // FAILING
//     function test_ChainLink_USDC_ETH_ConvertToUSDC_Amount_Success() external {
//         uint8 TOKEN_OUT_DECIMALS = 6;
//         uint8 TOKEN_IN_DECIMALS = 18;
//         int256 PRICE = 632_406_194_509_827;
//         uint8 PRICE_DECIMALS = 18;
//         uint256 usdcAmount = 1600e6;
//         uint256 swap = chainlinkOracleHelper.calculateTokenInAmountEstimated(
//             TOKEN_OUT_DECIMALS, TOKEN_IN_DECIMALS, usdcAmount, PRICE_DECIMALS, PRICE, true
//         );
//         assertEq(swap, 1_011_849_911_215_723_200);
//     }

//     function test_ChainLink_ETH_USDC_ConvertToUSDC_Amount_Success() external {
//         uint8 TOKEN_OUT_DECIMALS = 18;
//         uint8 TOKEN_IN_DECIMALS = 6;
//         int256 PRICE = 1_581_262_183_516_548_232_676;
//         uint8 PRICE_DECIMALS = 18;
//         uint256 AMOUNT = 1e18;
//         uint256 swap = chainlinkOracleHelper.calculateTokenInAmountEstimated(
//             TOKEN_OUT_DECIMALS, TOKEN_IN_DECIMALS, AMOUNT, PRICE_DECIMALS, PRICE, false
//         );
//         assertEq(swap, 6_324_061_945_098_270_000);
//     }

//     function test_ChainLink_ETH_USDC_ConvertToETH_Amount_Success() external {
//         uint8 TOKEN_OUT_DECIMALS = 18;
//         uint8 TOKEN_IN_DECIMALS = 6;
//         int256 PRICE = 1_581_262_183_516_548_232_676;
//         uint8 PRICE_DECIMALS = 18;
//         uint256 AMOUNT = 1e18;
//         uint256 swap = chainlinkOracleHelper.calculateTokenInAmountEstimated(
//             TOKEN_OUT_DECIMALS, TOKEN_IN_DECIMALS, AMOUNT, PRICE_DECIMALS, PRICE, false
//         );
//         assertEq(swap, 6_324_061_945_098_270_000);
//     }

//     // function test_ChainLink_USDC_ETH_ConvertToETH_Amount_Success() external {
//     //     int256 price = 632_406_194_509_827;
//     //     uint256 usdcAmount = 10_000e6;
//     //     uint256 swap = chainlinkOracleHelper.calculateBaseAsset(price, 6, usdcAmount);
//     //     assertEq(swap, 6_324_061_945_098_270_000);
//     // }

//     // function test_ChainLink_USDC_ETH_ConvertToUSDC_Amount_Success() external {
//     //     int256 price = 632_406_194_509_827; // USDC_ETH_PRICE at block 18_124_343
//     //     uint256 ethAmount = 1e18;
//     //     uint256 swap = chainlinkOracleHelper.calculateQuoteAsset(price, 6, ethAmount);
//     //     assertEq(swap, 1_581_000_000);
//     // }

//     // function test_ChainLink_ETH_USDC_ConvertToUSDC_Amount_Success() external {
//     //     int256 price = 1581262183516548232676;
//     //     uint256 ethAmount = 100e6;
//     //     uint256 swap = chainlinkOracleHelper.calculateQuoteAsset(price, 0, ethAmount);
//     //     assertEq(swap, 6_324_061_945_098_270_000);
//     // }

//     // function test_ChainLink_ETH_USDC_ConvertToETH_Amount_Success() external {
//     //     int256 price = 1581262183516548232676; // USDC_ETH_PRICE at block 18_124_343
//     //     uint256 usdcAmount = 10_000e6;
//     //     uint256 swap = chainlinkOracleHelper.calculateBaseAsset(price, 21, usdcAmount);
//     //     assertEq(swap, 1581262183516548232676);
//     // }
// }
