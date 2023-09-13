// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest, Vm } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { Enum } from "safe-contracts/common/Enum.sol";
import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

import { SafeTestingUtils } from "./SafeTestingUtils.sol";
import { ERC20Mintable } from "./mocks/ERC20Mintable.sol";

import { IntentifySafeModule } from "../src/module/IntentifySafeModule.sol";
import {
    DimensionalNonce,
    IntentExecution,
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";
import { TimestampBeforeIntent } from "../src/intents/TimestampBeforeIntent.sol";

contract IntentifySafeModuleTest is SafeTestingUtils {
    // Intentify Module
    IntentifySafeModule internal _intentifySafeModule;
    TimestampBeforeIntent internal _timestampBeforeIntent;

    // Testing Variables
    uint256 SIGNER = 0xA11CE;
    address internal signer;
    bytes internal EMPTY_BYTES;

    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _safe = new Safe();
        _safeProxy = new SafeProxy(address(_safe));
        _safeProxyFactory = new SafeProxyFactory();
        _intentifySafeModule = new IntentifySafeModule();
        _timestampBeforeIntent = new TimestampBeforeIntent();
    }

    function test_SafeSetupWithIntentifyModule_Success() external {
        Safe _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));
    }

    function test_SafeExecuteIntent_Success() external {
        Safe _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));
        address[] memory owners = _safeCreated.getOwners();
        IntentBatchExecution memory batchExecution =
            _craftIntentBundleExecution(address(_safeCreated), _intentifySafeModule);
        _intentifySafeModule.execute(address(_safeCreated), batchExecution);
    }

    function _craftIntentBundleExecution(
        address _safe,
        IntentifySafeModule _intentify
    )
        internal
        returns (IntentBatchExecution memory batchExecution)
    {
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: _safe,
                target: address(_timestampBeforeIntent),
                data: _timestampBeforeIntent.encode(uint128(block.timestamp - 100))
            }),
            signature: Signature({ r: bytes32(0x00), s: bytes32(0x00), v: uint8(0x00) })
        });

        IntentBatch memory intentBatch =
            IntentBatch({ nonce: DimensionalNonce({ queue: 0, accumulator: 1 }), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: address(0x00), data: EMPTY_BYTES });

        batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
    }
}
