// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

abstract contract Hook {
    function execute(
        bytes calldata terms,
        bytes calldata release
    ) public virtual returns (bool);


    function lock(
        bytes calldata terms
    ) public virtual returns (bool);
    
    function unlock(
        bytes calldata terms
    ) public virtual returns (bool);
    
    function release(
        bytes calldata terms
    ) public virtual returns (bool);
}
