// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { Enum } from "safe-contracts/common/Enum.sol";

interface SafeMinimal {
    function isOwner(address owner) external view returns (bool);

    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    )
        external
        returns (bool success);

    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    )
        external
        returns (bool success, bytes memory returnData);
}
