// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";
import { Enum } from "safe-contracts/common/Enum.sol";
import { BaseTest } from "./Base.t.sol";
import { IntentifySafeModule } from "../src/module/IntentifySafeModule.sol";
import { Hook, Signature } from "../src/TypesAndDecoders.sol";

contract SafeTestingUtils is BaseTest {
    Safe internal _safe;
    SafeProxyFactory internal _safeProxyFactory;
    Safe internal _safeCreated;
    IntentifySafeModule internal _intentifySafeModule;

    bytes32 private constant SAFE_MSG_TYPEHASH = 0x60b3cbf8b4a223d68d641b3b6ddf9a298e7f33710cf3d3a9d1146b5a6150fbca;
    Hook internal EMPTY_HOOK = Hook({ target: address(0x00), data: bytes(""), instructions: bytes("") });
    Signature internal EMPTY_SIGNATURE = Signature({ r: bytes32(0x00), s: bytes32(0x00), v: uint8(0x00) });

    function initializeSafeBase() public {
        _intentifySafeModule = new IntentifySafeModule();
        _safe = new Safe();
        _safeProxyFactory = new SafeProxyFactory();
        _safeCreated = _setupSafe(signer);
        _enableIntentifyModule(SIGNER, _safeCreated, address(_intentifySafeModule));
    }

    function _combineRSV(bytes32 r, bytes32 s, uint8 v) internal pure returns (bytes memory) {
        bytes memory signature = new bytes(65);
        assembly {
            mstore(add(signature, 32), r)
            mstore(add(signature, 64), s)
            mstore8(add(signature, 96), v)
        }

        return signature;
    }

    function _generateIntentifyModuleEnableData(address module) internal pure returns (bytes memory) {
        return abi.encodeWithSignature("enableModule(address)", module);
    }

    function _getMessageHash(Safe _safe, bytes memory message) internal view returns (bytes32) {
        bytes32 safeMessageHash = keccak256(abi.encode(SAFE_MSG_TYPEHASH, keccak256(message)));
        return keccak256(abi.encodePacked(bytes1(0x19), bytes1(0x01), _safe.domainSeparator(), safeMessageHash));
    }

    function _setupSafe(address owner) internal returns (Safe safe) {
        address[] memory owners = new address[](1);
        bytes memory data = new bytes(0);
        owners[0] = owner;
        bytes memory initializer = abi.encodeWithSelector(
            _safe.setup.selector,
            owners,
            1, // threshold
            address(0), // to
            data,
            address(0), // fallbackHandler
            address(0), // paymentToken
            0, // payment
            payable(address(0)) // paymentReceiver
        );
        SafeProxy _safeProxy = _safeProxyFactory.createProxyWithNonce(address(_safe), initializer, uint256(0));
        safe = Safe(payable(address(_safeProxy)));
    }

    function _enableIntentifyModule(uint256 signer, Safe _safe, address module) internal {
        // Craft Transaction
        bytes memory txdata = _generateIntentifyModuleEnableData(address(module));
        bytes32 executedata =
            _safe.getTransactionHash(address(_safe), 0, txdata, Enum.Operation.Call, 0, 0, 0, address(0), address(0), 0);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signer, executedata);
        bytes memory signatures = _combineRSV(r, s, v);
        // Initialize the Safe Intentiy Module
        _safe.execTransaction(
            address(_safe),
            0,
            txdata,
            Enum.Operation.Call, // operation
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );
    }

    function _bitShiftedSig(bytes memory signMessageData) internal pure returns (bytes memory) {
        require(signMessageData.length >= 2, "Input bytes should have at least 2 characters");

        // Check and replace the last byte
        if (signMessageData[signMessageData.length - 1] == bytes1(0x1b)) {
            signMessageData[signMessageData.length - 1] = bytes1(0x1f);
        } else if (signMessageData[signMessageData.length - 1] == bytes1(0x1c)) {
            signMessageData[signMessageData.length - 1] = bytes1(0x20);
        }

        // Check and replace the second last byte
        if (signMessageData[signMessageData.length - 2] == bytes1(0x1b)) {
            signMessageData[signMessageData.length - 2] = bytes1(0x1f);
        } else if (signMessageData[signMessageData.length - 2] == bytes1(0x1c)) {
            signMessageData[signMessageData.length - 2] = bytes1(0x20);
        }

        return signMessageData;
    }
}
