// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/StdCheats.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";
import { Enum } from "safe-contracts/common/Enum.sol";

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { AaveLeverageLongIntent } from "../../src/intents/AaveLeverageLongIntent.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";
import { FundMainnetAccounts } from "../utils/FundMainnetAccounts.sol";
import { Counter } from "../mocks/Counter.sol";

contract SimulateFlashLoan is FundMainnetAccounts {
    function simulateFlashLoanUSDC(address account, uint256 amount) external {
        fundUSDC(account, amount);
    }

    function simulateFlashLoanDAI(address account, uint256 amount) external {
        fundDAI(account, amount);
    }
}

contract AaveLeverageLongIntentTest is SafeTestingUtils {
    address public constant ETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC_ETH_PRICE_FEED = 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4;
    address public constant DAI_ETH_PRICE_FEED = 0x773616E4d11A78F511299002da57A0a94577F1f4;
    address public constant AAVE_POOL = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address public constant SWAP_ROUTER = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;

    Safe internal _safeCreated;
    IntentifySafeModule internal _intentifySafeModule;
    AaveLeverageLongIntent internal _aaveLeverageLongIntent;
    SimulateFlashLoan internal _simulateFlashloan;
    IPool internal _pool = IPool(AAVE_POOL);

    uint256 mainnetFork;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    uint256 MAINNET_FORK_BLOCK = 18_124_343;

    function setUp() public virtual {
        // Mainnet Fork
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        _simulateFlashloan = new SimulateFlashLoan();
        _intentifySafeModule = new IntentifySafeModule();
        _aaveLeverageLongIntent = new AaveLeverageLongIntent(address(_intentifySafeModule), AAVE_POOL, SWAP_ROUTER);
        _safe = new Safe();
        _safeProxyFactory = new SafeProxyFactory();
        _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));

        vm.prank(vm.envOr("WHALE_USDC", 0x28C6c06298d514Db089934071355E5743bf21d60));
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_AaveLeverageLongIntent_USDC_ETH_Success() external {
        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(USDC_ETH_PRICE_FEED, USDC, ETH, 2, 1.2e18, 0.2e18)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx =
            abi.encodeWithSelector(SimulateFlashLoan.simulateFlashLoanUSDC.selector, address(_safeCreated), 100_000e6);
        bytes memory leverageHookData = _aaveLeverageLongIntent.encodeHook(100_000e6, 10e18, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        vm.deal(address(_safeCreated), 1e18);
        _intentifySafeModule.execute(batchExecution);

        (,,,,, uint256 healthFactor) = _pool.getUserAccountData(address(_safeCreated));
        console2.log("Health Factor: %s", healthFactor);
        // assert(healthFactor < 1.5e18);
        assert(healthFactor > 1.1e18);
    }

    function test_AaveLeverageLongIntent_DAI_ETH_Success() external {
        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(DAI_ETH_PRICE_FEED, DAI, ETH, 2, 1.2e18, 0.2e18)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx =
            abi.encodeWithSelector(SimulateFlashLoan.simulateFlashLoanDAI.selector, address(_safeCreated), 100_000e18);
        bytes memory leverageHookData = _aaveLeverageLongIntent.encodeHook(100_000e18, 10e18, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        vm.deal(address(_safeCreated), 1e18);
        _intentifySafeModule.execute(batchExecution);

        (,,,,, uint256 healthFactor) = _pool.getUserAccountData(address(_safeCreated));
        console2.log("Health Factor: %s", healthFactor);
        // assert(healthFactor < 1.5e18);
        assert(healthFactor > 1.1e18);
    }
}
