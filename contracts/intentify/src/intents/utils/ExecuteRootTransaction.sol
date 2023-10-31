// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { Enum } from "safe-contracts/common/Enum.sol";
import { IntentifySafeModule } from "../../module/IntentifySafeModule.sol";
import { RevertMessageReasonHelper } from "../../helpers/RevertMessageReasonHelper.sol";

/// @title Execute Root Transaction
/// @notice Execute a transaction from the root of the calling safe using the Intentify Safe Module
contract ExecuteRootTransaction is RevertMessageReasonHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/
    /// @notice The address of the Intentify Safe Module
    address public intentifySafeModule;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Generic execution failed error.
    error ExecuteRootTransactionFailed();

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(address _intentifySafeModule) {
        intentifySafeModule = _intentifySafeModule;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Execute a transaction from the root of the Intentify Safe Module
    /// @param target The target address to execute the transaction on
    /// @param value The amount of ETH to send with the transaction
    /// @param data The data to send with the transaction
    /// @return success The success of the transaction
    function executeFromRoot(address target, uint256 value, bytes memory data) public returns (bool) {
        (bool success, bytes memory errorMessage) = intentifySafeModule.call(
            abi.encodeWithSelector(
                IntentifySafeModule.executeTransactionFromIntentModule.selector,
                target,
                value,
                data,
                Enum.Operation.Call
            )
        );
        if (!success) {
            _revertMessageReason(errorMessage);
        }
        return success;
    }
}
