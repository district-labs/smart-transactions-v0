// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { IComet } from "../../src/periphery/interfaces/IComet.sol";
import { HighestYieldStableIntent, IPool, SavingsDai } from "../../src/intents/HighestYieldStableIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";
import { Counter } from "../mocks/Counter.sol";

contract HighestYieldStableIntentTest is SafeTestingUtils {
    HighestYieldStableIntent internal _highestYieldStableIntent;

    uint256 internal _mainnetFork;
    string internal MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    uint256 internal MAINNET_FORK_BLOCK = 18_463_003;

    address executor = address(0x1111);

    // Stablecoins
    address DAI_MAINNET = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address USDC_MAINNET = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address USDT_MAINNET = 0xdAC17F958D2ee523a2206206994597C13D831ec7;

    // Wrapped tokens
    address ADAI_AAVE_MAINNET = 0x018008bfb33d285247A21d44E50697654f754e63;
    address ADAI_SPARK_MAINNET = 0x4DEDf26112B3Ec8eC46e7E31EA5e123490B05B8B;
    address AUSDC_AAVE_MAINNET = 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c;
    address AUSDC_SPARK_MAINNET = 0x377C3bd93f2a2984E1E7bE6A5C22c525eD4A4815;
    address AUSDT_AAVE_MAINNET = 0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a;
    address AUSDT_SPARK_MAINNET = 0xe7dF13b8e3d6740fe17CBE928C7334243d86c92f;
    address SDAI_MAINNET = 0x83F20F44975D03b1b09e64809B757c47f942BEeA;
    address COMPOUND_USDC_MAINNET = 0xc3d688B66703497DAA19211EEdff47f25384cdc3;

    // Protocols
    address AAVE_POOL_MAINNET = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address SPARK_POOL_MAINNET = 0xC13e21B648A5Ee794902342038FF3aDAB66BE987;
    address DSR_POT_MAINNET = 0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7;

    address WHALE_ACCOUNT = 0x28C6c06298d514Db089934071355E5743bf21d60;

    function setUp() public virtual {
        // Mainnet Fork
        _mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(_mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        initializeSafeBase();

        address[] memory daiWrappedTokens = new address[](3);
        daiWrappedTokens[0] = ADAI_AAVE_MAINNET;
        daiWrappedTokens[1] = ADAI_SPARK_MAINNET;
        daiWrappedTokens[2] = SDAI_MAINNET;

        address[] memory usdcWrappedTokens = new address[](3);
        usdcWrappedTokens[0] = AUSDC_AAVE_MAINNET;
        usdcWrappedTokens[1] = AUSDC_SPARK_MAINNET;
        usdcWrappedTokens[2] = COMPOUND_USDC_MAINNET;

        address[] memory usdtWrappedTokens = new address[](3);
        usdtWrappedTokens[0] = AUSDT_AAVE_MAINNET;
        usdtWrappedTokens[1] = AUSDT_SPARK_MAINNET;

        address[][] memory wrappedTokens = new address[][](3);
        wrappedTokens[0] = daiWrappedTokens;
        wrappedTokens[1] = usdcWrappedTokens;
        wrappedTokens[2] = usdtWrappedTokens;

        address[] memory stablecoins = new address[](3);
        stablecoins[0] = DAI_MAINNET;
        stablecoins[1] = USDC_MAINNET;
        stablecoins[2] = USDT_MAINNET;

        _highestYieldStableIntent = new HighestYieldStableIntent(
          address(_intentifySafeModule),
           AAVE_POOL_MAINNET,
          SPARK_POOL_MAINNET,
            DSR_POT_MAINNET,
          stablecoins,
         wrappedTokens
          );
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_HighestYieldStableIntent_Success() external {
        // Fund Safe
        vm.startPrank(WHALE_ACCOUNT);
        ERC20(DAI_MAINNET).transfer(address(_safeCreated), 1000e18);
        ERC20(USDC_MAINNET).transfer(address(_safeCreated), 1000e6);
        vm.stopPrank();

        vm.startPrank(address(_safeCreated));
        // Supply $400 USDC to aave pool
        uint256 amountToSupplyUSDC = 400e6;
        ERC20(USDC_MAINNET).approve(AAVE_POOL_MAINNET, amountToSupplyUSDC);
        IPool(AAVE_POOL_MAINNET).supply(USDC_MAINNET, amountToSupplyUSDC, address(_safeCreated), 0);

        // Supply $300 DAI to aave pool
        uint256 amountToSupplyDAI = 300e18;
        ERC20(DAI_MAINNET).approve(AAVE_POOL_MAINNET, amountToSupplyDAI);
        IPool(AAVE_POOL_MAINNET).supply(DAI_MAINNET, amountToSupplyDAI, address(_safeCreated), 0);

        // Supply $500 DAI to sDAI DSR
        uint256 amountToSupplySDAI = 500e18;
        ERC20(DAI_MAINNET).approve(SDAI_MAINNET, amountToSupplySDAI);
        SavingsDai(SDAI_MAINNET).deposit(amountToSupplySDAI, address(_safeCreated));

        // Supply $150 USDC to compound
        uint256 amountToSupplyUSDCCompound = 150e6;
        ERC20(USDC_MAINNET).approve(COMPOUND_USDC_MAINNET, amountToSupplyUSDCCompound);
        IComet(COMPOUND_USDC_MAINNET).supplyTo(address(_safeCreated), USDC_MAINNET, amountToSupplyUSDCCompound);
        vm.stopPrank();

        // USDC remaining in safe balance: $450
        // DAI remaining in safe balance: $200

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_highestYieldStableIntent),
            data: _highestYieldStableIntent.encodeIntent(3000e18)
        });

        Hook[] memory hooks = new Hook[](1);

        uint256 hookAmountUSDT = 3000e6;
        // Mints aUSDC to the whale account
        vm.startPrank(WHALE_ACCOUNT);
        console2.log("WHALE_ACCOUNT USDT balance: %s", ERC20(USDT_MAINNET).balanceOf(WHALE_ACCOUNT));
        // Encode approve data since USDT doesn't follow the ERC20 standard
        bytes memory usdtApproveData =
            abi.encodeWithSignature("approve(address,uint256)", AAVE_POOL_MAINNET, hookAmountUSDT);
        USDT_MAINNET.call(usdtApproveData);
        IPool(AAVE_POOL_MAINNET).supply(USDT_MAINNET, hookAmountUSDT, WHALE_ACCOUNT, 0);
        ERC20(AUSDT_AAVE_MAINNET).approve(address(_highestYieldStableIntent), hookAmountUSDT);
        vm.stopPrank();

        uint256 initialAUSDTAmount = 155e6;
        // Whale sends 150 AUSDT initially
        vm.startPrank(WHALE_ACCOUNT);
        bytes memory usdtApproveDataInitial =
            abi.encodeWithSignature("approve(address,uint256)", AAVE_POOL_MAINNET, initialAUSDTAmount);
        USDT_MAINNET.call(usdtApproveDataInitial);
        IPool(AAVE_POOL_MAINNET).supply(USDT_MAINNET, initialAUSDTAmount, address(_safeCreated), 0);
        vm.stopPrank();

        bytes memory hookData =
            abi.encodeWithSelector(ERC20.transferFrom.selector, WHALE_ACCOUNT, address(_safeCreated), hookAmountUSDT);
        bytes memory hookInstructions = _highestYieldStableIntent.encodeHookInstructions(executor);
        hooks[0] = Hook({ target: AUSDT_AAVE_MAINNET, data: hookData, instructions: hookInstructions });

        IntentBatchExecution memory batchExecution = _generateIntentBatchExecution(intents, hooks);

        console2.log("_safeCreated DAI balance initial: %s", ERC20(DAI_MAINNET).balanceOf(address(_safeCreated)));
        console2.log("_safeCreated USDC balance initial: %s", ERC20(USDC_MAINNET).balanceOf(address(_safeCreated)));
        console2.log(
            "_safeCreated ADAI_AAVE balance initial: %s", ERC20(ADAI_AAVE_MAINNET).balanceOf(address(_safeCreated))
        );
        console2.log(
            "_safeCreated AUSDC_AAVE balance initial: %s", ERC20(AUSDC_AAVE_MAINNET).balanceOf(address(_safeCreated))
        );
        console2.log(
            "_safeCreated AUSDT_AAVE balance initial: %s", ERC20(AUSDT_AAVE_MAINNET).balanceOf(address(_safeCreated))
        );
        console2.log(
            "_safeCreated SDAI_DSR balance initial: %s",
            SavingsDai(SDAI_MAINNET).convertToAssets(ERC20(SDAI_MAINNET).balanceOf(address(_safeCreated)))
        );
        console2.log(
            "_safeCreated COMPOUND_USDC balance initial: %s",
            ERC20(COMPOUND_USDC_MAINNET).balanceOf(address(_safeCreated))
        );

        _intentifySafeModule.execute(batchExecution);
        console2.log("_safeCreated DAI balance final: %s", ERC20(DAI_MAINNET).balanceOf(address(_safeCreated)));
        console2.log("_safeCreated USDC balance final: %s", ERC20(USDC_MAINNET).balanceOf(address(_safeCreated)));
        console2.log(
            "_safeCreated ADAI_AAVE balance final: %s", ERC20(ADAI_AAVE_MAINNET).balanceOf(address(_safeCreated))
        );
        console2.log(
            "_safeCreated AUSDC_AAVE balance final: %s", ERC20(AUSDC_AAVE_MAINNET).balanceOf(address(_safeCreated))
        );
        console2.log(
            "_safeCreated AUSDT_AAVE balance final: %s", ERC20(AUSDT_AAVE_MAINNET).balanceOf(address(_safeCreated))
        );
        console2.log(
            "_safeCreated SDAI_DSR balance final: %s",
            SavingsDai(SDAI_MAINNET).convertToAssets(ERC20(SDAI_MAINNET).balanceOf(address(_safeCreated)))
        );
        console2.log(
            "_safeCreated COMPOUND_USDC balance final: %s",
            ERC20(COMPOUND_USDC_MAINNET).balanceOf(address(_safeCreated))
        );
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */
}
