// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/StdCheats.sol";
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
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";

contract SimulateFlashloan is FundMainnetAccounts {
    function simulateFlashloan(address account, uint256 amount) external {
        fundUSDC(account, amount);
    }
}

contract AaveLeverageLongIntentTest is SafeTestingUtils {
    address public constant ETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    address public constant AAVE_POOL = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;

    Safe internal _safeCreated;
    IntentifySafeModule internal _intentifySafeModule;
    AaveLeverageLongIntent internal _aaveLeverageLongIntent;
    SimulateFlashloan internal _simulateFlashloan;

    uint256 mainnetFork;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    uint256 MAINNET_FORK_BLOCK = 18_124_343;

    function setUp() public virtual {
        // Mainnet Fork
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        _simulateFlashloan = new SimulateFlashloan();
        _intentifySafeModule = new IntentifySafeModule();
        _aaveLeverageLongIntent = new AaveLeverageLongIntent(address(_intentifySafeModule), AAVE_POOL);
        _safe = new Safe();
        _safeProxyFactory = new SafeProxyFactory();
        _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));

        vm.prank(vm.envOr("WHALE_USDC", 0x28C6c06298d514Db089934071355E5743bf21d60));
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_AaveLeverageLongIntent_Success() external {
        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(USDC, ETH, 2, 1.2e18, 0.2e18)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx =
            abi.encodeWithSelector(SimulateFlashloan.simulateFlashloan.selector, address(_safeCreated), 100_000e6);
        bytes memory leverageHookData = _aaveLeverageLongIntent.encodeHook(100_000e6, 41e18, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        vm.deal(address(_safeCreated), 1e18);
        _intentifySafeModule.execute(batchExecution);

        assert(address(0xdEAD).balance == 1e18);
    }
}
