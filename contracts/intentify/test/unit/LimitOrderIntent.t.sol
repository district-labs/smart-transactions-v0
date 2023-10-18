// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

import { ERC20Mintable } from "../mocks/ERC20Mintable.sol";
import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";
import { SwapRouter } from "../../src/periphery/SwapRouter.sol";
import { LimitOrderIntent } from "../../src/intents/LimitOrderIntent.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract LimitOrderIntentHarness is LimitOrderIntent {
    constructor(address _intentifySafeModule) LimitOrderIntent(_intentifySafeModule) { }

    function exposed_unlock(
        Hook calldata hook,
        Intent calldata intent,
        uint256 initialTokenInBalance
    )
        external
        returns (bool)
    {
        return _unlock(intent, hook, initialTokenInBalance);
    }

    function exposed_hook(Hook calldata hook) external returns (bool success) {
        return _hook(hook);
    }

    function exposed_extractRevertReason(bytes memory revertData) external pure returns (string memory reason) {
        return _extractRevertReason(revertData);
    }
}

contract LimitOrderIntentTest is SafeTestingUtils {
    Safe internal _safeCreated;
    IntentifySafeModule internal _intentifySafeModule;
    LimitOrderIntentHarness internal _limitOrderIntent;
    ERC20Mintable internal _tokenA;
    ERC20Mintable internal _tokenB;

    SwapRouter internal _swapRouter;

    uint256 startingBalance = 1000;
    uint256 endingBalance = 2000;

    Signature internal EMPTY_SIGNATURE = Signature({ r: bytes32(0x00), s: bytes32(0x00), v: uint8(0x00) });
    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    function setUp() public virtual {
        initializeBase();

        _intentifySafeModule = new IntentifySafeModule();
        _limitOrderIntent = new LimitOrderIntentHarness(address(_intentifySafeModule));
        _safe = new Safe();
        _safeProxyFactory = new SafeProxyFactory();
        _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));

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

    function test_LimitOrderIntent_Success() external {
        address executor = address(0x1234);

        setupBalance(address(_safeCreated), address(_tokenA), startingBalance);

        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_limitOrderIntent),
            data: _limitOrderIntent.encode(address(_tokenA), address(_tokenB), startingBalance, endingBalance)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);

        bytes memory hookData = abi.encode(
            executor,
            abi.encodeWithSignature(
                "swap(address,address,uint256)", address(_safeCreated), address(_tokenB), endingBalance
            )
        );
        hooks[0] = Hook({ target: address(_swapRouter), data: hookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);

        uint256 balanceTokenA = _tokenA.balanceOf(address(_safeCreated));
        uint256 balanceTokenB = _tokenB.balanceOf(address(_safeCreated));
        assertEq(balanceTokenA, 0);
        assertEq(balanceTokenB, endingBalance);
    }

    function test_encode_Success() external {
        bytes memory encodeData =
            _limitOrderIntent.encode(address(_tokenA), address(_tokenB), startingBalance, endingBalance);
        assertEq(encodeData, abi.encode(address(_tokenA), address(_tokenB), startingBalance, endingBalance));
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_LimitOrderIntent_InsufficientTokenBalancePostHook() external {
        address executor = address(0x1234);

        setupBalance(address(_safeCreated), address(_tokenA), startingBalance);

        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_limitOrderIntent),
            data: _limitOrderIntent.encode(address(_tokenA), address(_tokenB), startingBalance, endingBalance)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);

        bytes memory hookData = abi.encode(
            executor,
            abi.encodeWithSignature(
                "swap(address,address,uint256)",
                address(_safeCreated),
                address(_tokenB),
                endingBalance / 2 // Send half of the tokens expected, so the intent should revert
            )
        );
        hooks[0] = Hook({ target: address(_swapRouter), data: hookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert();
        _intentifySafeModule.execute(batchExecution);
    }
}
