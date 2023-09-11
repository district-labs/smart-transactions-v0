// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";
import { ERC20 } from "solady/tokens/ERC20.sol";
import { IHook } from "../interfaces/IHook.sol"; 
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract TokenRouterReleaseIntent {
    event Release(address indexed account, address indexed token, uint256 amount);
    mapping (address => mapping (address => uint256)) public till;

    function execute(Intent calldata intent) external returns (bool) {
        require(msg.sender == intent.exec.root, "TokenRouter:invalid-target");
        (address token, uint256 amount) = abi.decode(intent.exec.data, (address, uint256));
        till[intent.exec.root][token] += amount;
        emit Release(intent.exec.root, token, amount);
        return true;
    }

    function claim(address from, address to, address token, uint256 amount) external returns (bool) {
        require(till[from][token] <= amount, "TokenRouter:insufficient-balance");
        till[from][token] -= amount;
        ERC20(token).transferFrom(from, to, amount);
        return true;
    }

}
