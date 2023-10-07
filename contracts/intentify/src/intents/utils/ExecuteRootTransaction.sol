// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

contract ExecuteRootTransaction {
    address public intentifySafeModule;

    constructor(address _intentifySafeModule) {
        intentifySafeModule = _intentifySafeModule;
    }

    function executeFromRoot(address target, uint256 value, bytes memory data) public returns (bool success) {
        (bool success, bytes memory data) = intentifySafeModule.call(
            abi.encodeWithSignature("executeTransactionFromIntentModule(address,uint256,bytes)", target, value, data)
        );
        require(success, "ExecuteRootTransaction:execute-failed");
    }
}
