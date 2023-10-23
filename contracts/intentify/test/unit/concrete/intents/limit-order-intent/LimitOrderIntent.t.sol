// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20Mintable } from "~/test/mocks/ERC20Mintable.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "~/src/TypesAndDecoders.sol";
import { SwapRouter } from "~/src/periphery/SwapRouter.sol";
import { LimitOrderIntentHarness } from "./LimitOrderIntentHarness.sol";
import { SafeTestingUtils } from "~/test/SafeTestingUtils.sol";

contract LimitOrderIntent_Unit_Concrete_Test is SafeTestingUtils {
    LimitOrderIntentHarness internal _limitOrderIntentHarness;
    ERC20Mintable internal _tokenA;
    ERC20Mintable internal _tokenB;
    SwapRouter internal _swapRouter;

    address internal immutable _safeCreatedMock = address(0x1111);
    address internal immutable _executor = address(0x1234);

    function setUp() public virtual {
        initializeBase();

        _limitOrderIntentHarness = new LimitOrderIntentHarness(address(_intentifySafeModule));
        _tokenA = new ERC20Mintable();
        _tokenB = new ERC20Mintable();

        _swapRouter = new SwapRouter();
    }

    function setupBalance(address account, address token, uint256 amount) internal {
        ERC20Mintable(token).mint(account, amount);
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
          uint256 startingBalance = 1000;
    uint256 endingBalance = 2000;

        // Prepare initial balances
        setupBalance(address(_safeCreatedMock), address(_tokenA), startingBalance);

        // Prepare intent
        Intent memory intent = Intent({
            root: address(_safeCreatedMock),
            value: 0,
            target: address(_limitOrderIntentHarness),
            data: _limitOrderIntentHarness.encodeIntent(address(_tokenA), address(_tokenB), startingBalance, endingBalance)
        });

        // Prepare hook
        bytes memory hookTxData = abi.encodeWithSignature(
            "swap(address,address,uint256)", address(_safeCreatedMock), address(_tokenB), endingBalance
        );
        bytes memory hookData = _limitOrderIntentHarness.encodeHook(_executor, hookTxData);
        Hook memory hook = Hook({ target: address(_swapRouter), data: hookData });

        // Execute from the root address
        vm.prank(_safeCreatedMock);

        // Execute the intent
        _limitOrderIntentHarness.execute(intent, hook);

        // Ensure the tokenB balance was sent to the root address
        /// @dev The out token balance is not being checked since it's a unit test and the safe is not actually executing the transaction.
        uint256 balanceTokenB = _tokenB.balanceOf(address(_safeCreatedMock));
        assertEq(balanceTokenB, endingBalance);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */
}
