// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { Enum } from "safe-contracts/common/Enum.sol";

import {
    Signature,
    Hook,
    Intent,
    IntentBatch,
    INTENT_TYPEHASH,
    IntentBatchExecution,
    EIP712DOMAIN_TYPEHASH,
    TypesAndDecoders
} from "../TypesAndDecoders.sol";
import { SafeMinimal } from "../interfaces/SafeMinimal.sol";
import { NonceManagerMultiTenant } from "../nonce/NonceManagerMultiTenant.sol";

contract IntentifySafeModule is TypesAndDecoders, NonceManagerMultiTenant {
    // EIP712 Domain Separator
    string public constant NAME = "Intentify Safe Module";
    string public constant VERSION = "0";

    /// @notice The hash of the domain separator used in the EIP712 domain hash.
    bytes32 public immutable DOMAIN_SEPARATOR;

    address private _root;

    /// @notice Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(bytes32 => bool)) internal cancelledIntentBundles;

    constructor() {
        DOMAIN_SEPARATOR = _getEIP712DomainHash(NAME, VERSION, block.chainid, address(this));
    }

    event IntentBatchExecuted(address executor, address indexed root, bytes32 indexed intentBatchId);

    event IntentBatchCancelled(address root, bytes32 indexed intentBatchId);

    /* ===================================================================================== */
    /* Modifiers                                                                              */
    /* ===================================================================================== */

    modifier nonReentrant(address root) {
        _nonReentrantBefore(root);
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore(address root) private {
        require(_root == address(0), "ReentrancyGuard: reentrant call");
        _root = root;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _root = address(0);
    }

    /* ===================================================================================== */
    /* External Functions                                                                    */
    /* ===================================================================================== */

    function getIntentBatchTypedDataHash(IntentBatch memory intent) public view returns (bytes32) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, GET_INTENTBATCH_PACKETHASH(intent)));
        return digest;
    }

    function cancelIntentBatch(IntentBatch memory intentBatch) external nonReentrant(intentBatch.root) {
        bytes32 digest = getIntentBatchTypedDataHash(intentBatch);
        require(!cancelledIntentBundles[msg.sender][digest], "Intent:already-cancelled");
        cancelledIntentBundles[msg.sender][digest] = true;
        emit IntentBatchCancelled(intentBatch.root, digest);
    }

    function execute(IntentBatchExecution memory execution) external nonReentrant(execution.batch.root) {
        _nonceEnforcer(execution.batch.root, execution.batch.nonce);

        // The length of the intents and hooks must be the same.
        // This is because the hooks are meant to be executed in tandem with the intents.
        // If no hook has empty address, then the intent is executed without a hook.
        require(execution.batch.intents.length == execution.hooks.length, "Intent:invalid-hooks-length");

        bytes32 digest = getIntentBatchTypedDataHash(execution.batch);
        require(!cancelledIntentBundles[execution.batch.root][digest], "Intent:cancelled");

        // The signer must be the owner of the Safe
        // We only require a single owner to sign the Intent Bundle.
        // That's because in the alpha version we're expecting Safes to be 1-of-1 multisigs.
        // In the future, we'll add support for multi-owner Safes. And more complex access controls.
        address signer = _recover(digest, execution.signature.v, execution.signature.r, execution.signature.s);
        require(SafeMinimal(execution.batch.root).isOwner(signer), "Intent:invalid-signer");

        for (uint256 index = 0; index < execution.batch.intents.length; index++) {
            // If the intent target is the Safe itself, execute the intent directly
            // as if it were a standard Safe transaction.
            // The "true" target is encoded in the intent data field.
            if (execution.batch.intents[index].target == address(execution.batch.root)) {
                _execute(execution.batch.intents[index]);
            }
            // If the accompanying hook is not set, execute the intent directly
            // This generally assumes the intent is a contract read i.e. a state constraint like timestamps, twaps or
            // other oracles.
            if (execution.hooks[index].target == address(0)) {
                _executeIntent(execution.batch.intents[index]);
                // If the accompanying hook is set, execute the intent with the hook
                // This generally assumes the intent is access control based and the hook is a contract write i.e. a
                // state change.
            } else {
                _executeIntentWithHook(execution.batch.intents[index], execution.hooks[index]);
            }
        }

        emit IntentBatchExecuted(msg.sender, execution.batch.root, digest);
    }

    function executeTransactionFromIntentModule(
        address target,
        uint256 value,
        bytes calldata data
    )
        external
        returns (bool success)
    {
        bytes memory errorMessage;
        SafeMinimal _safe = SafeMinimal(_root);
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            target, // to
            value, // value
            data, // calldata
            Enum.Operation.Call // operation
        );
        _handleTransactionCallback(success, errorMessage);
    }

    /* ===================================================================================== */
    /* Internal Functions                                                                    */
    /* ===================================================================================== */

    function _execute(Intent memory intent) internal returns (bool success) {
        bytes memory errorMessage;
        SafeMinimal _safe = SafeMinimal(address(intent.root));
        (address target, bytes memory data) = abi.decode(intent.data, (address, bytes));
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            target, // to
            intent.value, // value
            data, //calldata
            Enum.Operation.Call // operation
        );
        _handleTransactionCallback(success, errorMessage);
    }

    function _executeIntent(Intent memory intent) internal returns (bool success) {
        bytes memory errorMessage;
        bytes memory data = _generateIntentCalldata(intent);
        SafeMinimal _safe = SafeMinimal(address(intent.root));
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            intent.target, // to
            intent.value, // value
            data, //calldata
            Enum.Operation.Call // operation
        );
        _handleTransactionCallback(success, errorMessage);
    }

    function _executeIntentWithHook(Intent memory intent, Hook memory hook) internal returns (bool success) {
        bytes memory errorMessage;
        bytes memory data = _generateIntentWithHookCalldata(intent, hook);
        SafeMinimal _safe = SafeMinimal(address(intent.root));
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            intent.target, // to
            intent.value, // value
            data, //calldata
            Enum.Operation.Call // operation
        );
        _handleTransactionCallback(success, errorMessage);
    }

    function _handleTransactionCallback(bool success, bytes memory returnData) internal pure {
        if (!success) {
            if (returnData.length > 0) {
                string memory reason = _extractRevertReason(returnData);
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
    function _generateIntentCalldata(Intent memory intent) internal pure returns (bytes memory) {
        return abi.encodeWithSignature("execute((address,address,uint256,bytes))", intent);
    }

    function _generateIntentWithHookCalldata(
        Intent memory intent,
        Hook memory hook
    )
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature("execute((address,address,uint256,bytes),(address,bytes))", intent, hook);
    }

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

    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32 data) {
        bytes32 domainSeparator = DOMAIN_SEPARATOR;

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
