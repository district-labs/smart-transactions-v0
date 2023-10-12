// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/StdCheats.sol";
import { ChainlinkOracleHelper } from "../../src/oracles/ChainlinkOracleHelper.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract MockChainlinkOracleHelper is ChainlinkOracleHelper {
    function calculateDenominatorAsset(address priceFeed, uint256 baseDecimal, uint256 amount) external returns (uint256) {
        return _calculateDenominatorAsset(priceFeed, baseDecimal, amount);
    }
    
    function calculateNumeratorAsset(address priceFeed, uint256 baseDecimal, uint256 amount) external returns (uint256) {
        return _calculateNumeratorAsset(priceFeed, baseDecimal, amount);
    }

}

contract ChainlinkOracleHelperTest is SafeTestingUtils {
    address public constant ETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC_ETH_PRICE_FEED = 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4;
    address public constant DAI_ETH_PRICE_FEED = 0x773616E4d11A78F511299002da57A0a94577F1f4;

    MockChainlinkOracleHelper public chainlinkOracleHelper;

    uint256 mainnetFork;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    uint256 MAINNET_FORK_BLOCK = 18_124_343;

    function setUp() public virtual {
        // Mainnet Fork
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        chainlinkOracleHelper = new MockChainlinkOracleHelper();
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_ChainLink_USDC_ETH_ConvertToETH_Amount_Success() external { 
        uint256 usdcAmount = 10_000e6;
        uint256 swap = chainlinkOracleHelper.calculateDenominatorAsset(USDC_ETH_PRICE_FEED, 6, usdcAmount);
        assertEq(swap, 6233442264528230000);
    }
   
    function test_ChainLink_USDC_ETH_ConvertToUSDC_Amount_Success() external { 
        uint256 ethAmount = 1e18;
        uint256 swap = chainlinkOracleHelper.calculateNumeratorAsset(USDC_ETH_PRICE_FEED, 6, ethAmount);
        console2.log("swap: %s", swap);
        assertEq(swap, 1604000000);
    }

    function test_ChainLink_DAI_ETH_ConvertToETH_Success() external { 
        uint256 amount = 10_000e18;
        uint256 swap = chainlinkOracleHelper.calculateDenominatorAsset(DAI_ETH_PRICE_FEED, 18, amount);
        assertEq(swap, 6286356661146210000);
    }
    
    function test_ChainLink_DAI_ETH_ConvertToDAI_Success() external { 
        uint256 ethAmount = 1e18;
        uint256 swap = chainlinkOracleHelper.calculateNumeratorAsset(DAI_ETH_PRICE_FEED, 18, ethAmount);
        assertEq(swap, 1590000000000000000000);
    }
}
