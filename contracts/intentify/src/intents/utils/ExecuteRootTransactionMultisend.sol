// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { Enum } from "safe-contracts/common/Enum.sol";
import { IntentifySafeModule } from "../../module/IntentifySafeModule.sol";
import { ExecuteRootTransaction } from "./ExecuteRootTransaction.sol";

struct Transaction {
    address to;
    uint256 value;
    bytes data;
    Enum.Operation operation;
}

contract ExecuteRootTransactionMultisend is ExecuteRootTransaction {
    address internal _multisend;

    error NoTransactionsProvided();

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(address _intentifySafeModule, address __multisend) ExecuteRootTransaction(_intentifySafeModule) {
        _multisend = __multisend;
    }

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
