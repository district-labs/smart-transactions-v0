// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import {
    Hook,
    Intent,
    IntentBatch,
    IntentBatchExecution,
    EIP712DOMAIN_TYPEHASH,
    TypesAndDecoders
} from "../TypesAndDecoders.sol";
import { console2 } from "forge-std/console2.sol";
import { SafeMinimal, Enum } from "../interfaces/SafeMinimal.sol";
import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { IntentWithHookAbstract } from "../abstracts/IntentWithHookAbstract.sol";
import { NonceManagerMultiTenant } from "../nonce/NonceManagerMultiTenant.sol";
import { RevertMessageReasonHelper } from "../helpers/RevertMessageReasonHelper.sol";

/// @title Intentify Safe Module
/// @notice Safe Module that allows the execution of multiple intents in a single transaction.
contract IntentifySafeModule is TypesAndDecoders, NonceManagerMultiTenant, RevertMessageReasonHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                  CONSTANTS
    //////////////////////////////////////////////////////////////////////////*/

    string public constant NAME = "Intentify Safe Module";
    string public constant VERSION = "0";

    /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    // EIP712 Domain Separator
    /// @notice The hash of the domain separator used in the EIP712 domain hash.
    bytes32 public immutable DOMAIN_SEPARATOR;

    /*//////////////////////////////////////////////////////////////////////////
                                PRIVATE STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice The root address of the Intent Batch
    address private _root;

    /*//////////////////////////////////////////////////////////////////////////
                                INTERNAL STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(bytes32 => bool)) internal cancelledIntentBundles;

    /*//////////////////////////////////////////////////////////////////////////
                                    EVENTS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Emitted when an intent batch is executed
    /// @param executor The address of the executor
    /// @param root The address of the intent batch root
    /// @param intentBatchId The id of the intent batch
    event IntentBatchExecuted(address executor, address indexed root, bytes32 indexed intentBatchId);

    /// @notice Emitted when an intent batch is cancelled
    /// @param root The address of the intent batch root
    /// @param intentBatchId The id of the intent batch
    event IntentBatchCancelled(address root, bytes32 indexed intentBatchId);

    /*//////////////////////////////////////////////////////////////////////////
                                    ERRORS          
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Intent batch is already cancelled
    error IntentAlreadyCancelled();

    /// @dev Intent execution failed with an unknown reason
    error IntentExecutionFailed();

    /// @dev Intent length and hook length are not the same
    error InvalidHookLength();

    /// @dev Only the intent batch root can cancel the intent batch
    error OnlyIntentBatchRootCanCancel();

    /// @dev Reentrancy guard error where the root address is not set to the zero address.
    error ReentrantCall();

    /*//////////////////////////////////////////////////////////////////////////
                                    MODIFIER 
    //////////////////////////////////////////////////////////////////////////*/
    modifier nonReentrant(address root) {
        _nonReentrantBefore(root);
        _;
        _nonReentrantAfter();
    }

    /*//////////////////////////////////////////////////////////////////////////
                                  CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @dev The domain separator is computed from the contract's name, version and chain id.
    constructor() {
        DOMAIN_SEPARATOR = _getEIP712DomainHash(NAME, VERSION, block.chainid, address(this));
    }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode the intent batch into a typed data hash.
    /// @param intent The intent batch to be encoded.
    /// @return digest The typed data hash.
    function getIntentBatchTypedDataHash(IntentBatch memory intent) public view returns (bytes32) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, GET_INTENTBATCH_PACKETHASH(intent)));
        return digest;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Cancel an intent batch
    /// @param intentBatch The intent batch to be cancelled.
    function cancelIntentBatch(IntentBatch memory intentBatch) external nonReentrant(intentBatch.root) {
        // The signer must be the intent batch root
        if (msg.sender != intentBatch.root) revert OnlyIntentBatchRootCanCancel();

        bytes32 digest = getIntentBatchTypedDataHash(intentBatch);
        if (cancelledIntentBundles[msg.sender][digest]) revert IntentAlreadyCancelled();
        cancelledIntentBundles[msg.sender][digest] = true;
        emit IntentBatchCancelled(intentBatch.root, digest);
    }

    /// @notice Execute an intent batch
    /// @param execution The intent batch execution to be executed.
    function execute(IntentBatchExecution memory execution) external nonReentrant(execution.batch.root) {
        _nonceEnforcer(execution.batch.root, execution.batch.nonce);

        // The length of the intents and hooks must be the same.
        // This is because the hooks are meant to be executed in tandem with the intents.
        // If no hook has empty address, then the intent is executed without a hook.
        if (execution.batch.intents.length != execution.hooks.length) revert InvalidHookLength();

        bytes32 digest = getIntentBatchTypedDataHash(execution.batch);
        if (cancelledIntentBundles[execution.batch.root][digest]) revert IntentAlreadyCancelled();

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

    /// @notice Execute an intent batch from the Intent Module
    /// @param target The address of the target contract.
    /// @param value The amount of ETH to be sent.
    /// @param data The calldata to be executed.
    /// @return success Whether the transaction was successful or not.
    function executeTransactionFromIntentModule(
        address target,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
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
            operation // operation
        );
        _handleTransactionCallback(success, errorMessage);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to revert the transaction with the revert message returned by the target contract.
    /// @param success Whether the transaction was successful or not.
    /// @param returnData The return data of the transaction.
    function _handleTransactionCallback(bool success, bytes memory returnData) internal pure {
        if (!success) {
            if (returnData.length > 0) {
                _revertMessageReason(returnData);
            } else {
                revert IntentExecutionFailed();
            }
        }
    }

    /// @notice Helper function to generate the calldata for the intent.
    /// @param intent The intent to be encoded.
    /// @return data The calldata to be executed.
    function _generateIntentCalldata(Intent memory intent) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(IntentAbstract.execute.selector, intent);
    }

    /// @notice Helper function to generate the calldata for the intent with the hook.
    /// @param intent The intent to be encoded.
    /// @param hook The hook to be encoded.
    /// @return data The calldata to be executed.
    function _generateIntentWithHookCalldata(
        Intent memory intent,
        Hook memory hook
    )
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSelector(IntentWithHookAbstract.execute.selector, intent, hook);
    }

    /// @notice Helper function to generate the EIP712 domain hash for the intentify safe module.
    /// @param contractName The name of the contract.
    /// @param version The version of the contract.
    /// @param chainId The chain id of the contract.
    /// @param verifyingContract The address of the verifying contract.
    /// @return The EIP712 domain hash.
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
        bytes memory encoded = abi.encode(EIP712DOMAIN_TYPEHASH, contractName, version, chainId, verifyingContract);
        return keccak256(encoded);
    }

    /// @notice Helper function to recover the signer address.
    /// @param hash The hash to be signed.
    /// @param v The v value of the signature.
    /// @param r The r value of the signature.
    /// @param s The s value of the signature.
    /// @return The signer address.
    function _recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
        return ecrecover(hash, v, r, s);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                INTERNAL WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice execute the intent directly as a standard Safe transaction with the target and calldata encoded in the
    /// intent data.
    /// @param intent The intent to be executed.
    /// @return success Whether the transaction was successful or not.
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

    /// @notice execute the intent directly as a standard Safe transaction with the target as the intent target.
    /// @param intent The intent to be executed.
    /// @return success Whether the transaction was successful or not.
    function _executeIntent(Intent memory intent) internal returns (bool success) {
        bytes memory errorMessage;
        SafeMinimal _safe = SafeMinimal(address(intent.root));
        bytes memory data = _generateIntentCalldata(intent);
        (success, errorMessage) = _safe.execTransactionFromModuleReturnData(
            intent.target, // to
            intent.value, // value
            data, //calldata
            Enum.Operation.Call // operation
        );
        _handleTransactionCallback(success, errorMessage);
    }

    /// @notice execute the intent with the hook with the target as the intent target.
    /// @param intent The intent to be executed.
    /// @param hook The hook to be executed.
    /// @return success Whether the transaction was successful or not.
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

    /// @notice Reentrancy guard before helper function.
    /// @param root The address of the intent batch root.
    function _nonReentrantBefore(address root) private {
        if (_root != address(0)) revert ReentrantCall();
        _root = root;
    }

    /// @notice Reentrancy guard after helper function.
    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _root = address(0);
    }
}
