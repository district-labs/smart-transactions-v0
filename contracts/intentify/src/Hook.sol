// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

abstract contract Hook {
    function enforceCaveat(
        bytes calldata terms,
        bytes32 delegationHash
    ) public virtual returns (bool);
}
