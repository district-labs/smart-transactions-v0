// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

/// @title Revert Message Reason Helper
/// @notice A helper contract to propagate revert messages from the target contract.
contract RevertMessageReasonHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Generic execution failed error.
    error ExecutionFailed();

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Reverts with the reason from the target contract.
    /// @param revertData The revert data from the target contract.
    function _revertMessageReason(bytes memory revertData) internal pure {
        if (revertData.length == 0) revert ExecutionFailed();
        assembly {
            // We use Yul's revert() to bubble up errors from the target contract.
            revert(add(32, revertData), mload(revertData))
        }
    }
}
