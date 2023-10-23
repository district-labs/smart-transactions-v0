// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { Enum } from "safe-contracts/common/Enum.sol";

/// @title SafeMinimal
/// @notice Minimal interface for the Safe contract.
interface SafeMinimal {
    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Returns the current threshold of the Safe.
    /// @param owner Address of the owner.
    /// @return boool True if the address is an owner of the Safe.
    function isOwner(address owner) external view returns (bool);

    /// @notice Executes a Safe transaction from the safe module.
    /// @param to Address of the destination account.
    /// @param value Ether value of the transaction.
    /// @param data Data payload of the transaction.
    /// @param operation EnumOperation of the transaction.
    /// @return success if the transaction was executed successfully.
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    )
        external
        returns (bool success);

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Executes a Safe transaction from the safe module and returns the call data.
    /// @param to Address of the destination account.
    /// @param value Ether value of the transaction.
    /// @param data Data payload of the transaction.
    /// @param operation EnumOperation of the transaction.
    /// @return success if the transaction was executed successfully.
    /// @return returnData of the transaction.
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    )
        external
        returns (bool success, bytes memory returnData);
}
