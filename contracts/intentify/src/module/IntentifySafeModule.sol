// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";
import { MultiSend } from "safe-contracts/libraries/MultiSend.sol";
import { Enum } from "safe-contracts/common/Enum.sol";

import { IHook } from "../interfaces/IHook.sol";
import {
    DimensionalNonce,
    Signature,
    Hook,
    Intent,
    IntentBatch,
    INTENT_TYPEHASH,
    IntentBatchExecution,
    EIP712DOMAIN_TYPEHASH,
    IntentExecution,
    TypesAndDecoders
} from "../TypesAndDecoders.sol";
import "./SignatureDecoder.sol";

interface SafeMinimal {
    function isOwner(address owner) external view returns (bool);

    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    )
        external
        returns (bool success);

    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    )
        external
        returns (bool success, bytes memory returnData);
}

contract IntentifySafeModule is TypesAndDecoders, SignatureDecoder {
    string public constant NAME = "Intentify Module";
    string public constant VERSION = "0.0.0";

    /// @notice The hash of the domain separator used in the EIP712 domain hash.
    bytes32 public immutable DOMAIN_SEPARATOR;

    /// @notice Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(uint256 => uint256)) internal multiNonce;

    constructor() {
        DOMAIN_SEPARATOR = _getEIP712DomainHash(NAME, VERSION, block.chainid, address(this));
    }

    /* ===================================================================================== */
    /* External Functions                                                                    */
    /* ===================================================================================== */

    function execute(
        address root, // WARNING: This needs to be re-implemented in the IntentBatch struct. It's UNSAFE to pass in the
            // root address as a parameter.
        IntentBatchExecution memory execution
    )
        public
        returns (bool executed)
    {
        _enforceReplayProtection(root, execution.batch.nonce);
        require(execution.batch.intents.length == execution.hooks.length, "Intent:invalid-intent-length");

        bytes32 digest = getIntentBatchTypedDataHash(execution.batch);
        address signer = _recover(digest, execution.signature.v, execution.signature.r, execution.signature.s);
        require(SafeMinimal(root).isOwner(signer), "Intent:invalid-signer");

        for (uint256 index = 0; index < execution.batch.intents.length; index++) {
            // If the accompanying hook is not set, execute the intent directly
            // This generally assumes the intent is a contract read i.e. a state constraint like timestamps, twaps or
            // other oracles.
            if (execution.hooks[index].target == address(0)) {
                _execute(execution.batch.intents[index]);

                // If the accompanying hook is set, execute the intent with the hook
                // This generally assumes the intent is access control based and the hook is a contract write i.e. a
                // state change.
            } else {
                _executeWithHook(execution.batch.intents[index], execution.hooks[index]);
            }
        }

        return true;
    }

    function getIntentBatchTypedDataHash(IntentBatch memory intent) public view returns (bytes32) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, GET_INTENTBATCH_PACKETHASH(intent)));
        return digest;
    }

    function getIntentExecutionTypedDataHash(IntentExecution memory intentExecution) public view returns (bytes32) {
        bytes32 digest =
            keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, GET_INTENTEXECUTION_PACKETHASH(intentExecution)));
        return digest;
    }

    /* ===================================================================================== */
    /* Internal Functions                                                                    */
    /* ===================================================================================== */

    function _enforceReplayProtection(address account, DimensionalNonce memory protection) internal {
        uint256 queue = protection.queue;
        uint256 accumulator = protection.accumulator;
        require(accumulator == (multiNonce[account][queue] + 1), "Intentify:nonce-out-of-order");
        multiNonce[account][queue] = accumulator;
    }

    function _generateIntentCalldata(Intent memory intent) internal pure returns (bytes memory) {
        return abi.encodeWithSignature("execute(((address,address,bytes),(bytes32,bytes32,uint8)))", intent);
    }

    function _generateIntentWithHookCalldata(
        Intent memory intent,
        Hook memory hook
    )
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature(
            "execute(((address,address,bytes),(bytes32,bytes32,uint8)),(address,bytes))", intent, hook
        );
    }

    function _execute(Intent memory intent) internal returns (bool success) {
        bytes memory errorMessage;
        bytes memory data = _generateIntentCalldata(intent);
        SafeMinimal _safe = SafeMinimal(address(intent.exec.root));
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            intent.exec.target, // to
            0, // value
            data, //calldata
            Enum.Operation.Call // operation
        );
        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("Intent::execution-failed");
            }
        }
    }

    function _executeWithHook(Intent memory intent, Hook memory hook) internal returns (bool success) {
        bytes memory errorMessage;
        bytes memory data = _generateIntentWithHookCalldata(intent, hook);
        SafeMinimal _safe = SafeMinimal(address(intent.exec.root));
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            intent.exec.target, // to
            0, // value
            data, //calldata
            Enum.Operation.Call // operation
        );
        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("Intent::execution-failed");
            }
        }
    }

    function _extractRevertReason(bytes memory revertData) internal pure returns (string memory reason) {
        uint256 length = revertData.length;
        if (length < 68) return "";
        uint256 t;
        assembly {
            revertData := add(revertData, 4)
            t := mload(revertData) // Save the content of the length slot
            mstore(revertData, sub(length, 4)) // Set proper length
        }
        reason = abi.decode(revertData, (string));
        assembly {
            mstore(revertData, t) // Restore the content of the length slot
        }
    }

    /* ===================================================================================== */
    /* Helper Functions                                                                      */
    /* ===================================================================================== */
    function _getEIP712DomainHash(
        string memory contractName,
        string memory version,
        uint256 chainId,
        address verifyingContract
    )
        internal
        pure
        returns (bytes32)
    {
        bytes memory encoded = abi.encode(
            EIP712DOMAIN_TYPEHASH, keccak256(bytes(contractName)), keccak256(bytes(version)), chainId, verifyingContract
        );
        return keccak256(encoded);
    }

    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32) {
        return _toTypedDataHash(DOMAIN_SEPARATOR, structHash);
    }

    function _toTypedDataHash(bytes32 domainSeparator, bytes32 structHash) internal pure returns (bytes32 data) {
        /// @solidity memory-safe-assembly
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, "\x19\x01")
            mstore(add(ptr, 0x02), domainSeparator)
            mstore(add(ptr, 0x22), structHash)
            data := keccak256(ptr, 0x42)
        }
    }

    function _recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
        return ecrecover(hash, v, r, s);
    }
}
