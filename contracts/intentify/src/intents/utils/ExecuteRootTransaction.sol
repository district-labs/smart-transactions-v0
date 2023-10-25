// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { RevertMessageReasonHelper } from "../../helpers/RevertMessageReasonHelper.sol";

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
            abi.encodeWithSignature("executeTransactionFromIntentModule(address,uint256,bytes)", target, value, data)
        );
        if (!success) {
            _revertMessageReason(errorMessage);
        }
        return success;
    }
}
