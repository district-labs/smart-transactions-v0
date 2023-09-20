// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";
import { Enum } from "safe-contracts/common/Enum.sol";

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
        _safeProxyFactory = new SafeProxyFactory();
        console2.log("Signer: ", signer);
        _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */

    function test_RevertWhen_intentSafeModule_IntentBundleCancelled_Success() external {
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({ root: address(0), value: 0, target: address(0), data: bytes("") });
        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: address(0), data: bytes("") });

        // Cancel the Intent Bundle
        {
            bytes memory txdata = abi.encodeWithSignature(
                "cancelIntentBatch((address,bytes,(address,address,uint256,bytes)[]))", intentBatch
            );
            uint256 nonce = _safeCreated.nonce();
            bytes32 executedata = _safeCreated.getTransactionHash(
                address(_intentifySafeModule), 0, txdata, Enum.Operation.Call, 0, 0, 0, address(0), address(0), nonce
            );
            (uint8 vv, bytes32 rr, bytes32 ss) = vm.sign(SIGNER, executedata);
            bytes memory signature = _combineRSV(rr, ss, vv);

            // Initialize the Safe Intentiy Module
            _safeCreated.execTransaction(
                address(_intentifySafeModule),
                0,
                txdata,
                Enum.Operation.Call, // operation
                0,
                0,
                0,
                address(0),
                payable(address(0)),
                signature
            );
        }

        // Try to execute the Intent Bundle
        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        vm.expectRevert("Intent:cancelled");
        bool _executed = _intentifySafeModule.execute(batchExecution);
    }

    function test_RevertWhen_intentSafeModule_IntentSendETH_Success() external {
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({ root: address(_safeCreated), value: 1e18, target: address(0), data: bytes("") });
        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: address(0), data: bytes("") });

        vm.deal(address(_safeCreated), 1e18);
        assertEq(address(_safeCreated).balance, 1e18);
        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        bool _executed = _intentifySafeModule.execute(batchExecution);
        assertEq(address(_safeCreated).balance, 0);
    }

    function test_RevertWhen_intentSafeModule_IsReentered() external {
        // TODO: implement when data structures are finalized
    }
}
