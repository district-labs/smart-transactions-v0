// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { IntentWithHookAbstract } from "~/src/intents/EthTipIntent.sol";
import { EthTipIntentHarness } from "~/test/mocks/harness/intents/EthTipIntentHarness.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract EthTipIntentUnitConcreteTest is BaseTest {
    EthTipIntentHarness internal _ethTipIntentHarness;

    address internal immutable _safeCreatedMock = address(0x1111);
    address internal immutable _intentifySafeModuleMock = address(0x2222);
    address internal immutable _executor = address(0x3333);

    function setUp() public virtual {
        initializeBase();

        _ethTipIntentHarness = new EthTipIntentHarness(address(_intentifySafeModuleMock));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_encodeIntent_Success() external {
        uint256 amount = 1000;
        bytes memory expected = abi.encode(amount);

        bytes memory actual = _ethTipIntentHarness.encodeIntent(amount);

        assertEq(actual, expected);
    }

    function test_exposed_decodeIntent_Success() external {
        uint256 amount = 1000;

        Intent memory intent = Intent({
            root: _safeCreatedMock,
            value: 0,
            target: address(_ethTipIntentHarness),
            data: _ethTipIntentHarness.encodeIntent(amount)
        });

        uint256 decodedAmount = _ethTipIntentHarness.exposed_decodeIntent(intent);

        assertEq(decodedAmount, amount);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_execute_RevertWhen_InvalidRoot() external {
        Hook memory hook = Hook({ target: _executor, data: bytes(""), instructions: bytes("") });

        Intent memory intent = Intent({
            // The root is not the same as the safe created address, so it should revert with `InvalidRoot`.
            root: address(0),
            value: 0,
            target: address(_ethTipIntentHarness),
            data: bytes("")
        });

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(IntentWithHookAbstract.InvalidRoot.selector);
        _ethTipIntentHarness.execute(intent, hook);
    }

    function test_execute_RevertWhen_InvalidTarget() external {
        Hook memory hook = Hook({ target: _executor, data: bytes(""), instructions: bytes("") });

        Intent memory intent = Intent({
            root: _safeCreatedMock,
            value: 0,
            // The target is not the same as the safe created address, so it should revert with `InvalidTarget`.
            target: address(0),
            data: bytes("")
        });

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(IntentWithHookAbstract.InvalidTarget.selector);
        _ethTipIntentHarness.execute(intent, hook);
    }
}
