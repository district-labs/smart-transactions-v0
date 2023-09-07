// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

interface IHookWithLocks {
    function execute(
        bytes calldata terms,
        bytes calldata release
    ) external returns (bool);


    function lock(
        bytes calldata terms
    ) external returns (bool);
    
    function unlock(
        bytes calldata terms
    ) external returns (bool);
    
    function delegate(
        bytes calldata terms
    ) external returns (bool);
}
