// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { Intent, Hook } from "../TypesAndDecoders.sol";
import {IIntentWithHook} from "../interfaces/IIntentWithHook.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

contract TipEthIntent is IIntentWithHook, ExecuteRootTransaction {
    constructor(address _intentifySafeModule) ExecuteRootTransaction(_intentifySafeModule) { }

    function encode(uint256 amount) public pure returns (bytes memory) {
        return abi.encode(amount);
    }

    function encodeHook(address target) public pure returns (bytes memory) {
        return abi.encode(target);
    }

    /// @inheritdoc IIntentWithHook
    function execute(Intent calldata intent, Hook calldata hook) external returns (bool) {
        require(intent.root == msg.sender, "TipEthIntent:invalid-root");
        require(intent.target == address(this), "TipEthIntent:invalid-target");
        (uint256 amount) = abi.decode(intent.data, (uint256));
        return executeFromRoot(hook.target, amount, new bytes(0));
    }
}
