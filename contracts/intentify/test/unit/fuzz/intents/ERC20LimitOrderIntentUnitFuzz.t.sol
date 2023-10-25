// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20Mintable } from "~/test/mocks/ERC20Mintable.sol";
import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { SwapRouter } from "~/src/periphery/SwapRouter.sol";
import { ERC20LimitOrderIntent } from "~/src/intents/ERC20LimitOrderIntent.sol";
import { ERC20LimitOrderIntentHarness } from "~/test/mocks/harness/intents/ERC20LimitOrderIntentHarness.sol";
import { BaseTest } from "~/test/Base.t.sol";

contract ERC20LimitOrderIntentUnitFuzzTest is BaseTest {
    ERC20LimitOrderIntentHarness internal _erc20limitOrderIntentHarness;
    ERC20Mintable internal _tokenA;
    ERC20Mintable internal _tokenB;
    SwapRouter internal _swapRouter;

    address internal immutable _safeCreatedMock = address(0x1111);
    address internal immutable _intentifySafeModuleMock = address(0x2222);
    address internal immutable _executor = address(0x3333);

    function setUp() public virtual {
        initializeBase();

        _erc20limitOrderIntentHarness = new ERC20LimitOrderIntentHarness(address(_intentifySafeModuleMock));
        _tokenA = new ERC20Mintable();
        _tokenB = new ERC20Mintable();
        _swapRouter = new SwapRouter();
    }

    function setupBalance(address account, address token, uint256 amount) internal {
        ERC20Mintable(token).mint(account, amount);
    }

    function setupHook(uint256 _endingBalance) internal view returns (Hook memory hook) {
        bytes memory hookData = abi.encodeWithSignature(
            "swap(address,address,uint256)", address(_safeCreatedMock), address(_tokenB), _endingBalance
        );
        bytes memory hookInstructions = _erc20limitOrderIntentHarness.encodeHookInstructions(_executor);

        hook = Hook({ target: address(_swapRouter), data: hookData, instructions: hookInstructions });
    }

    function setupIntent(
        uint256 _startingBalance,
        uint256 _endingBalance
    )
        internal
        view
        returns (Intent memory intent)
    {
        intent = Intent({
            root: address(_safeCreatedMock),
            value: 0,
            target: address(_erc20limitOrderIntentHarness),
            data: _erc20limitOrderIntentHarness.encodeIntent(
                address(_tokenA), address(_tokenB), _startingBalance, _endingBalance
                )
        });
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_execute_Success(uint256 startingBalance, uint256 endingBalance) external {
        vm.assume(startingBalance > 0);
        vm.assume(endingBalance > 0);

        // Prepare initial balances
        setupBalance(address(_safeCreatedMock), address(_tokenA), startingBalance);

        // Prepare intent
        Intent memory intent = setupIntent(startingBalance, endingBalance);

        // Prepare hook
        Hook memory hook = setupHook(endingBalance);

        // Execute from the root address
        vm.prank(_safeCreatedMock);

        // Execute the intent
        _erc20limitOrderIntentHarness.execute(intent, hook);

        // Mocks the `balanceOf` function to simulate a transfer for the safe.
        vm.mockCall(
            address(_tokenB),
            abi.encodeWithSelector(_tokenB.balanceOf.selector, _safeCreatedMock),
            abi.encode(endingBalance)
        );

        // Ensure the tokenB balance was sent to the root address
        uint256 balanceTokenA = _tokenA.balanceOf(address(_safeCreatedMock));
        uint256 balanceTokenB = _tokenB.balanceOf(address(_safeCreatedMock));
        assertEq(balanceTokenA, 0);
        assertEq(balanceTokenB, endingBalance);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_exposed_unlock_ReverWhen_InsufficientInputAmount_ZeroBalance(
        uint256 startingBalance,
        uint256 endingBalance
    )
        external
    {
        vm.assume(startingBalance > 0);
        vm.assume(endingBalance > 0);

        // Prepare intent
        Intent memory intent = setupIntent(startingBalance, endingBalance);

        // Prepare hook
        Hook memory hook = setupHook(endingBalance);

        // Execute exposed_unlock. Expects it to revert with InsufficientInputAmount since the amountIn token was not
        // sent to the safe.
        vm.expectRevert(
            abi.encodeWithSelector(ERC20LimitOrderIntent.InsufficientInputAmount.selector, 0, endingBalance)
        );
        _erc20limitOrderIntentHarness.exposed_unlock(intent, hook, 0);
    }

    function test_exposed_unlock_ReverWhen_InsufficientInputAmount_InsufficientEndingBalance(
        uint256 startingBalance,
        uint256 endingBalance,
        uint256 insufficientEndingBalance
    )
        external
    {
        vm.assume(startingBalance > 0);
        vm.assume(endingBalance > 0);
        vm.assume(endingBalance > insufficientEndingBalance);

        // Prepare intent
        Intent memory intent = setupIntent(startingBalance, endingBalance);

        // Prepare hook
        Hook memory hook = setupHook(endingBalance);

        // Mocks the `balanceOf` function to simulate a transfer for the safe.
        vm.mockCall(
            address(_tokenB),
            abi.encodeWithSelector(_tokenB.balanceOf.selector, _safeCreatedMock),
            abi.encode(insufficientEndingBalance)
        );

        // Execute exposed_unlock. Expects it to revert with InsufficientInputAmount since the amountIn token was not
        // sent to the safe entirely, just half of it.
        vm.expectRevert(
            abi.encodeWithSelector(
                ERC20LimitOrderIntent.InsufficientInputAmount.selector, insufficientEndingBalance, endingBalance
            )
        );
        _erc20limitOrderIntentHarness.exposed_unlock(intent, hook, 0);
    }
}
