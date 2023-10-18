// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { ERC20 } from "solady/tokens/ERC20.sol";
import { IIntent } from "../interfaces/IIntent.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract TokenRouterReleaseIntent is IIntent {
    event Release(address indexed account, address indexed token, uint256 amount);

    mapping(address => mapping(address => uint256)) public till;

    /// @inheritdoc IIntent
    function execute(Intent calldata intent) external returns (bool) {
        require(intent.root == msg.sender, "TokenRouterReleaseIntent:invalid-root");
        require(intent.target == address(this), "TokenRouterReleaseIntent:invalid-target");

        (address token, uint256 amount) = abi.decode(intent.data, (address, uint256));
        till[intent.root][token] += amount;
        emit Release(intent.root, token, amount);
        return true;
    }

    function claim(address from, address to, address token, uint256 amount) external returns (bool) {
        require(till[from][token] >= amount, "TokenRouter:insufficient-balance");
        till[from][token] -= amount;
        ERC20(token).transferFrom(from, to, amount);
        return true;
    }

    function encode(address token, uint256 amount) external pure returns (bytes memory data) {
        data = abi.encode(token, amount);
    }
}
