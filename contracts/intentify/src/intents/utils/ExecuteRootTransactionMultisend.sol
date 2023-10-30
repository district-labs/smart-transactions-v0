// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { Enum } from "safe-contracts/common/Enum.sol";
import { IntentifySafeModule } from "../../module/IntentifySafeModule.sol";
import { ExecuteRootTransaction } from "./ExecuteRootTransaction.sol";

/// @title Execute Root Transaction Multisend
/// @notice Execute a multisend transaction from the root of the calling safe using the Intentify Safe Module.
contract ExecuteRootTransactionMultisend is ExecuteRootTransaction {
    /*//////////////////////////////////////////////////////////////////////////
                                TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Transaction structure to be used in safe multisend encode helper.
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        Enum.Operation operation;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                INTERNAL STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice The address of the multisend contract
    address internal _multisend;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev No transactions provided for multisend.
    error NoTransactionsProvided();

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(address _intentifySafeModule, address __multisend) ExecuteRootTransaction(_intentifySafeModule) {
        _multisend = __multisend;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Execute a multisend transaction from the root of the Intentify Safe Module
    /// @param txs The transactions to execute
    /// @return success The success of the transaction
    function executeFromRootMultisend(Transaction[] memory txs) public returns (bool) {
        (address to, uint256 value, bytes memory data, Enum.Operation operation) = _encodeMultiSend(txs);

        (bool success, bytes memory errorMessage) = intentifySafeModule.call(
            abi.encodeWithSelector(
                IntentifySafeModule.executeTransactionFromIntentModule.selector, to, value, data, operation
            )
        );
        if (!success) {
            _revertMessageReason(errorMessage);
        }
        return success;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Encode a multisend transaction
    /// @dev Helper function to encode meta transactions for multisend.
    /// @param txs The transactions to encode
    /// @return to The address of the multisend contract
    /// @return value The amount of ETH to send with the transaction
    /// @return data The data to send with the transaction
    /// @return operation The operation to use with the transaction
    function _encodeMultiSend(Transaction[] memory txs)
        internal
        view
        returns (address to, uint256 value, bytes memory data, Enum.Operation operation)
    {
        if (txs.length == 0) {
            revert NoTransactionsProvided();
        }

        if (txs.length > 1) {
            to = _multisend;
            value = 0;
            data = hex"";
            for (uint256 i; i < txs.length; i++) {
                data = abi.encodePacked(
                    data,
                    abi.encodePacked(
                        uint8(txs[i].operation),
                        /// operation as an uint8.
                        txs[i].to,
                        /// to as an address.
                        txs[i].value,
                        /// value as an uint256.
                        uint256(txs[i].data.length),
                        /// data length as an uint256.
                        txs[i].data
                    )
                );
                /// data as bytes.
            }
            data = abi.encodeWithSignature("multiSend(bytes)", data);
            operation = Enum.Operation.DelegateCall;
        } else {
            to = txs[0].to;
            value = txs[0].value;
            data = txs[0].data;
            operation = txs[0].operation;
        }
    }
}
