// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20Mintable } from "~/test/mocks/ERC20Mintable.sol";
import { Intent, Signature, Hook } from "~/src/TypesAndDecoders.sol";
import { SwapRouter } from "~/src/periphery/SwapRouter.sol";
import { LimitOrderIntent, IntentWithHookAbstract } from "~/src/intents/LimitOrderIntent.sol";
import { LimitOrderIntentHarness } from "~/test/mocks/harness/intents/LimitOrderIntentHarness.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract LimitOrderIntentUnitConcreteTest is BaseTest {
    LimitOrderIntentHarness internal _limitOrderIntentHarness;
    ERC20Mintable internal _tokenA;
    ERC20Mintable internal _tokenB;
    SwapRouter internal _swapRouter;

    uint256 internal _startingBalance = 1000;
    uint256 internal _endingBalance = 2000;

    address internal immutable _safeCreatedMock = address(0x1111);
    address internal immutable _intentifySafeModuleMock = address(0x2222);
    address internal immutable _executor = address(0x1234);

    function setUp() public virtual {
        initializeBase();

        _limitOrderIntentHarness = new LimitOrderIntentHarness(address(_intentifySafeModuleMock));
        _tokenA = new ERC20Mintable();
        _tokenB = new ERC20Mintable();

        _swapRouter = new SwapRouter();
    }

    function setupBalance(address account, address token, uint256 amount) internal {
        ERC20Mintable(token).mint(account, amount);
    }

    function setupHook() internal view returns (Hook memory hook) {
        bytes memory hookTxData = abi.encodeWithSignature(
            "swap(address,address,uint256)", address(_safeCreatedMock), address(_tokenB), _endingBalance
        );
        bytes memory hookData = _limitOrderIntentHarness.encodeHook(_executor, hookTxData);
        hook = Hook({ target: address(_swapRouter), data: hookData });
    }

    function setupIntent() internal view returns (Intent memory intent) {
        intent = Intent({
            root: address(_safeCreatedMock),
            value: 0,
            target: address(_limitOrderIntentHarness),
            data: _limitOrderIntentHarness.encodeIntent(
                address(_tokenA), address(_tokenB), _startingBalance, _endingBalance
                )
        });
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_encodeHook_Success() external {
        bytes memory hookTxData =
            abi.encodeWithSignature("swap(address,address,uint256)", address(_safeCreatedMock), address(_tokenB), 1000);
        bytes memory encodedHookData = _limitOrderIntentHarness.encodeHook(_executor, hookTxData);

        assertEq(abi.encode(_executor, hookTxData), encodedHookData);
    }

    function test_encodeIntent_Success() external {
        bytes memory encodedIntentData =
            _limitOrderIntentHarness.encodeIntent(address(_tokenA), address(_tokenB), 1000, 1000);

        assertEq(abi.encode(address(_tokenA), address(_tokenB), 1000, 1000), encodedIntentData);
    }

    function test_execute_Success() external {
        // Prepare initial balances
        setupBalance(address(_safeCreatedMock), address(_tokenA), _startingBalance);

        // Prepare intent
        Intent memory intent = setupIntent();

        // Prepare hook
        Hook memory hook = setupHook();

        // Execute from the root address
        vm.prank(_safeCreatedMock);

        // Execute the intent
        _limitOrderIntentHarness.execute(intent, hook);

        /// @dev Mocks the `executeFromRoot` function from `execute` since we are not instantiating a safe.
        (address tokenOut,, uint256 amountOutMax,) = _limitOrderIntentHarness.exposed_decodeIntent(intent);
        (address executor,) = _limitOrderIntentHarness.exposed_decodeHook(hook);
        bytes memory txData = abi.encodeWithSignature("transfer(address,uint256)", executor, amountOutMax);
        vm.prank(_safeCreatedMock);
        (bool success, bytes memory returnData) = tokenOut.call(txData);
        if (!success) {
            _revertMessageReason(returnData);
        }

        // Ensure the tokenB balance was sent to the root address
        uint256 balanceTokenA = _tokenA.balanceOf(address(_safeCreatedMock));
        uint256 balanceTokenB = _tokenB.balanceOf(address(_safeCreatedMock));
        assertEq(balanceTokenA, 0);
        assertEq(balanceTokenB, _endingBalance);
    }

    function test_exposed_decodeHook_Success() external {
        bytes memory _hookTxData = abi.encodeWithSignature(
            "swap(address,address,uint256)", address(_safeCreatedMock), address(_tokenB), _endingBalance
        );
        Hook memory hook = setupHook();

        (address executor, bytes memory hookTxData) = _limitOrderIntentHarness.exposed_decodeHook(hook);

        assertEq(executor, _executor);
        assertEq(hookTxData, _hookTxData);
    }

    function test_exposed_decodeIntent_Success() external {
        Intent memory intent = setupIntent();

        (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin) =
            _limitOrderIntentHarness.exposed_decodeIntent(intent);

        assertEq(tokenOut, address(_tokenA));
        assertEq(tokenIn, address(_tokenB));
        assertEq(amountOutMax, _startingBalance);
        assertEq(amountInMin, _endingBalance);
    }

    function test_exposed_hook_Swap_Success() external {
        // Prepare hook
        Hook memory hook = setupHook();

        uint256 initialTokenBBalance = _tokenB.balanceOf(address(_safeCreatedMock));
        // Execute the hook
        _limitOrderIntentHarness.exposed_hook(hook);

        uint256 finalTokenBBalance = _tokenB.balanceOf(address(_safeCreatedMock));

        assertEq(finalTokenBBalance, initialTokenBBalance + _endingBalance);
    }

    function test_exposed_unlock_Success() external {
        // Prepare intent
        Intent memory intent = setupIntent();

        // Prepare hook
        Hook memory hook = setupHook();

        // Mocks the `balanceOf` function to simulate a transfer for the safe.
        vm.mockCall(
            address(_tokenB),
            abi.encodeWithSelector(_tokenB.balanceOf.selector, _safeCreatedMock),
            abi.encode(_endingBalance)
        );

        // Execute exposed_unlock
        // It doesn't test the transaction to the hook executor using `executeFromRoot` since this unit test is not
        // initializing a safe.
        _limitOrderIntentHarness.exposed_unlock(intent, hook, 0);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_exposed_unlock_ReverWhen_InsufficientInputAmount_ZeroBalance() external {
        // Prepare intent
        Intent memory intent = setupIntent();

        // Prepare hook
        Hook memory hook = setupHook();

        // Execute exposed_unlock. Expects it to revert with InsufficientInputAmount since the amountIn token was not
        // sent to the safe.
        vm.expectRevert(abi.encodeWithSelector(LimitOrderIntent.InsufficientInputAmount.selector, 0, _endingBalance));
        _limitOrderIntentHarness.exposed_unlock(intent, hook, 0);
    }

    function test_exposed_unlock_ReverWhen_InsufficientInputAmount_HalfBalance() external {
        uint256 halfBalance = _endingBalance / 2;

        // Prepare intent
        Intent memory intent = setupIntent();

        // Prepare hook
        Hook memory hook = setupHook();

        // Mocks the `balanceOf` function to simulate a transfer for the safe.
        vm.mockCall(
            address(_tokenB),
            abi.encodeWithSelector(_tokenB.balanceOf.selector, _safeCreatedMock),
            abi.encode(halfBalance)
        );

        // Execute exposed_unlock. Expects it to revert with InsufficientInputAmount since the amountIn token was not
        // sent to the safe entirely, just half of it.
        vm.expectRevert(
            abi.encodeWithSelector(LimitOrderIntent.InsufficientInputAmount.selector, halfBalance, _endingBalance)
        );
        _limitOrderIntentHarness.exposed_unlock(intent, hook, 0);
    }

    function test_execute_RevertWhen_InvalidRoot() external {
        Hook memory hook = setupHook();
        Intent memory intent = Intent({
            // The root is not the same as the safe created address, so it should revert with `InvalidRoot`.
            root: address(0),
            value: 0,
            target: address(_limitOrderIntentHarness),
            data: bytes("")
        });

        vm.expectRevert(IntentWithHookAbstract.InvalidRoot.selector);
        _limitOrderIntentHarness.execute(intent, hook);
    }

    function test_execute_RevertWhen_InvalidTarget() external {
        Hook memory hook = setupHook();
        Intent memory intent = Intent({
            // The root is not the same as the safe created address, so it should revert with `InvalidRoot`.
            root: address(_safeCreatedMock),
            value: 0,
            target: address(0),
            data: bytes("")
        });

        // Execute from the root address
        vm.prank(_safeCreatedMock);
        vm.expectRevert(IntentWithHookAbstract.InvalidTarget.selector);
        _limitOrderIntentHarness.execute(intent, hook);
    }
}
