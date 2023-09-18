// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

import {
    DimensionalNonce,
    IntentExecution,
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract IntentifySafeModuleTest is SafeTestingUtils {
    Safe internal _safeCreated;
    IntentifySafeModule internal _intentifySafeModule;

    function setUp() public virtual {
        initializeBase();

        _intentifySafeModule = new IntentifySafeModule();
        _safe = new Safe();
        _safeProxy = new SafeProxy(address(_safe));
        _safeProxyFactory = new SafeProxyFactory();

        // Setup Safe
        // Safe _safeCreated = _setupSafe(wallet1);

        // Enable Intentify Module
        Safe _safeCreated = _setupSafe(wallet1);
        _enableIntentifyModule(WALLET_1, _safeCreated, address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */

    function test_RevertWhen_intentSafeModule_IsReentered(uint128 pastSeconds) external {
        
    }
}
