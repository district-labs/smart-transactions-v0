// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import {ReplayProtection} from "./Types.sol";

contract IntentifyCore {
    /// @notice Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(uint256 => uint256)) internal multiNonce;

    /* ===================================================================================== */
    /* External Functions                                                                    */
    /* ===================================================================================== */


    /* ===================================================================================== */
    /* Internal Functions                                                                    */
    /* ===================================================================================== */

    function _enforceReplayProtection(
        address intendedSender,
        ReplayProtection memory protection
    ) internal {
        uint256 queue = protection.queue;
        uint256 nonce = protection.nonce;
        require(
            nonce == (multiNonce[intendedSender][queue] + 1),
            "Intent:nonce2-out-of-order"
        );
        multiNonce[intendedSender][queue] = nonce;
    }

    function _execute(
        address to,
        bytes memory data,
        uint256 gasLimit,
        address sender
    ) internal returns (bool success) {
        bytes memory full = abi.encodePacked(data, sender);
        bytes memory errorMessage;
        (success, errorMessage) = address(to).call{gas: gasLimit}(full);

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
    
}
