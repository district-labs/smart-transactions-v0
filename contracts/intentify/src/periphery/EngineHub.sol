// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { ERC20Mintable } from "./ERC20Mintable.sol";

import { TokenRouterReleaseIntent } from "../intents/TokenRouterReleaseIntent.sol";

contract EngineHub {
    address public immutable owner;

    event MultiCallAction(address indexed target, bytes data, bytes result);

    modifier onlyOwner() {
        require(msg.sender == owner, "EngineHub:not-owner");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function multiCall(
        address[] calldata targets,
        bytes[] calldata data
    )
        external
        onlyOwner
        returns (bytes[] memory results)
    {
        require(targets.length == data.length, "EngineHub:invalid-length");

        results = new bytes[](targets.length);
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, bytes memory result) = targets[i].call(data[i]);
            require(success, "EngineHub:call-failed");
            results[i] = result;

            emit MultiCallAction(targets[i], data[i], result);
        }
    }
}
