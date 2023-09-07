// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";
import { IHook } from "./interfaces/IHook.sol";

import { 
    DimensionalNonce, 
    Signature, 
    Intent, 
    IntentBatch, 
    IntentBatchExecution, 
    EIP712DOMAIN_TYPEHASH,
    TypesAndDecoders
} from "./TypesAndDecoders.sol";

contract Intentify is TypesAndDecoders {

    address public immutable owner;

    /// @notice The hash of the domain separator used in the EIP712 domain hash.
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public immutable INTENT_TYPEHASH = keccak256("IntentBatch(address target)");
    
    /// @notice Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(uint256 => uint256)) internal multiNonce;


    /**
     * @notice Delegatable Constructor
     * @param contractName string - The name of the contract
     * @param version string - The version of the contract
     */
    constructor(address _owner, string memory contractName, string memory version) {
        owner = _owner;
        DOMAIN_SEPARATOR = _getEIP712DomainHash(
            contractName,
            version,
            block.chainid,
            address(this)
        );
    }

    /* ===================================================================================== */
    /* External Functions                                                                    */
    /* ===================================================================================== */

    function execute(
        IntentBatchExecution memory execution
    ) public returns (bool executed) {
        bytes32 digest = getIntentBatchTypedDataHash(execution.batch);
        address signer = _recover(digest, execution.signature.v, execution.signature.r ,execution.signature.s);
        require(signer == owner, "Intent:invalid-signature");

        for (uint256 index = 0; index < execution.batch.intents.length; index++) {
            _execute(execution.batch.intents[index], 1e8);
        }
        
        return true;
    }
    
    
    function testing(
        IntentBatch calldata intentBatch, 
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public returns (address signer) {
        bytes32 digest = getIntentBatchTypedDataHash(intentBatch);
        signer = _recover(digest, v, r ,s);
    }

    function getIntentBatchTypedDataHash(IntentBatch memory intent)
        public
        view
        returns (bytes32)
    {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                GET_INTENTBATCH_PACKETHASH(intent)
            )
        );
        return digest;
    }


    /* ===================================================================================== */
    /* Internal Functions                                                                    */
    /* ===================================================================================== */

    function _enforceReplayProtection(
        address intendedSender,
        DimensionalNonce memory protection
    ) internal {
        uint256 queue = protection.queue;
        uint256 nonce = protection.accumulator;
        require(
            nonce == (multiNonce[intendedSender][queue] + 1),
            "Intent:nonce2-out-of-order"
        );
        multiNonce[intendedSender][queue] = nonce;
    }

    function _generateHookCalldata(Intent memory intent) internal pure returns (bytes memory) {
        return abi.encodeWithSignature("execute((address,address,bytes))", intent);
    }

    function _execute(
        Intent memory intent,
        uint256 gasLimit
    ) internal returns (bool success) {
        bytes memory errorMessage;
        bytes memory data = _generateHookCalldata(intent);
        (success, errorMessage) = address(intent.target).call{value: 0}(data);
        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("Intent::execution-failed");
            }
        }
    }


    function _extractRevertReason(bytes memory revertData)
        internal
        pure
        returns (string memory reason)
    {
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
    function getIntentHash(Intent memory _intent)
        public
        view
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    _getStructHash(_intent)
                )
            );
    }

    function _getStructHash(Intent memory _intent)
        internal
        view
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    INTENT_TYPEHASH,
                    _intent.target
                )
            );
    }

    function _getEIP712DomainHash(
        string memory contractName,
        string memory version,
        uint256 chainId,
        address verifyingContract
    ) internal pure returns (bytes32) {
        bytes memory encoded = abi.encode(
            EIP712DOMAIN_TYPEHASH,
            keccak256(bytes(contractName)),
            keccak256(bytes(version)),
            chainId,
            verifyingContract
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

    function _recover(bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s
    ) internal pure returns (address) {
        return ecrecover(hash, v, r, s);
    }
    
}
