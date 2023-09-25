// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import {IntentifySafeModule} from "./IntentifySafeModule.sol";
import {IntentBatchExecution} from "../TypesAndDecoders.sol";

contract IntentifySafeModuleBundler {
    function executeBundle(IntentifySafeModule module, IntentBatchExecution[] memory executionBundles) external {
        for (uint256 i = 0; i < executionBundles.length; i++) {
            IntentBatchExecution memory executionBundle = executionBundles[i];
            module.execute(executionBundle);
        }
    }
}
