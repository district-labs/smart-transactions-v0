// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Hook, Intent, IntentBatchExecution, Signature } from "~/src/TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "~/src/intents/EthTipIntent.sol";
import { EthTipIntentHarness } from "~/test/mocks/harness/intents/EthTipIntentHarness.sol";
import { SafeTestingUtils } from "~/test/utils/SafeTestingUtils.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract EthTipIntentIntegrationFuzzTest is SafeTestingUtils {
    EthTipIntentHarness internal _ethTipIntentHarness;

    function setUp() public virtual {
        initializeBase();
        initializeSafeBase();

        _ethTipIntentHarness = new EthTipIntentHarness(address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_execute_Success(uint256 amount) external {

        amount = bound(amount, 0, 1_000_000_000e18);

        address executor = address(0x1111);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_ethTipIntentHarness),
            data: _ethTipIntentHarness.encodeIntent(amount)
        });

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: executor, data: bytes(""), instructions: bytes("") });

        IntentBatchExecution memory batchExecution = _generateIntentBatchExecution(intents, hooks);

        // Add necessary funds to the safe crated
        vm.deal(address(_safeCreated), amount + 1e18);

        _intentifySafeModule.execute(batchExecution);

        assertEq(address(executor).balance, amount);
    }
}
