// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ChainlinkOracleHelper } from "../../src/oracles/ChainlinkOracleHelper.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract MockChainlinkOracleHelper is ChainlinkOracleHelper {
    function calculateBaseAsset(int256 price, uint256 baseDecimal, uint256 amount) external returns (uint256) {
        return _calculateBaseAsset(price, baseDecimal, amount);
    }

    function calculateQuoteAsset(int256 price, uint256 baseDecimal, uint256 amount) external returns (uint256) {
        return _calculateQuoteAsset(price, baseDecimal, amount);
    }
}

contract ChainlinkOracleHelperTest is SafeTestingUtils {
    MockChainlinkOracleHelper public chainlinkOracleHelper;

    function setUp() public virtual {
        initializeBase();
        chainlinkOracleHelper = new MockChainlinkOracleHelper();
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_ChainLink_USDC_ETH_ConvertToETH_Amount_Success() external {
        int256 price = 623_344_226_452_823; // USDC_ETH_PRICE at block 18_124_343
        uint256 usdcAmount = 10_000e6;
        uint256 swap = chainlinkOracleHelper.calculateBaseAsset(price, 6, usdcAmount);
        assertEq(swap, 6_233_442_264_528_230_000);
    }

    function test_ChainLink_USDC_ETH_ConvertToUSDC_Amount_Success() external {
        int256 price = 623_344_226_452_823; // USDC_ETH_PRICE at block 18_124_343
        uint256 ethAmount = 1e18;
        uint256 swap = chainlinkOracleHelper.calculateQuoteAsset(price, 6, ethAmount);
        assertEq(swap, 1_604_000_000);
    }

    function test_ChainLink_DAI_ETH_ConvertToETH_Success() external {
        int256 price = 628_635_666_114_621; // DAI_ETH_PRICE at block 18_124_343
        uint256 amount = 10_000e18;
        uint256 swap = chainlinkOracleHelper.calculateBaseAsset(price, 18, amount);
        assertEq(swap, 6_286_356_661_146_210_000);
    }

    function test_ChainLink_DAI_ETH_ConvertToDAI_Success() external {
        int256 price = 628_635_666_114_621; // DAI_ETH_PRICE at block 18_124_343
        uint256 ethAmount = 1e18;
        uint256 swap = chainlinkOracleHelper.calculateQuoteAsset(price, 18, ethAmount);
        assertEq(swap, 1_590_000_000_000_000_000_000);
    }
}
