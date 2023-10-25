// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20Mintable, ERC20 } from "~/test/mocks/ERC20Mintable.sol";
import { Hook, Intent, IntentBatch, IntentBatchExecution, Signature } from "~/src/TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "~/src/intents/ERC20TipIntent.sol";
import { ERC20TipIntentHarness } from "~/test/mocks/harness/intents/ERC20TipIntentHarness.sol";
import { SafeTestingUtils } from "~/test/utils/SafeTestingUtils.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract ERC20TipIntentIntegrationFuzzTest is SafeTestingUtils {
    ERC20TipIntentHarness internal _erc20TipIntentHarness;
    ERC20Mintable internal _erc20TokenMock;

    function setUp() public virtual {
        initializeBase();
        initializeSafeBase();

        _erc20TipIntentHarness = new ERC20TipIntentHarness(address(_intentifySafeModule));
        _erc20TokenMock = new ERC20Mintable();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_execute_Success(uint256 amount, address executor) external {
        vm.assume(executor != address(0));
        vm.assume(amount > 0);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_erc20TipIntentHarness),
            data: _erc20TipIntentHarness.encodeIntent(address(_erc20TokenMock), amount)
        });

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: executor, data: bytes(""), instructions: bytes("") });

        IntentBatchExecution memory batchExecution = _generateIntentBatchExecution(intents, hooks);

        // Add necessary funds to the safe crated
        _erc20TokenMock.mint(address(_safeCreated), amount);

        _intentifySafeModule.execute(batchExecution);
        assertEq(_erc20TokenMock.balanceOf(executor), amount);
    }
}
