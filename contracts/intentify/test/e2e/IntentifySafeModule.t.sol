// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

import {
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

        Safe _safeCreated = _setupSafe(wallet1);
        _enableIntentifyModule(WALLET1, _safeCreated, address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */

    function test_RevertWhen_intentSafeModule_IsReentered() external {
        // TODO: implement when data structures are finalized
    }
}
