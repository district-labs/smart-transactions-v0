// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IHook } from "../interfaces/IHook.sol";
import { BytesLib } from "../libraries/BytesLib.sol";
import { ERC20 } from "solady/tokens/ERC20.sol";

contract LimitOrderHookArchive {
    struct Order {
        address tokenOut;
        address tokenIn;
        uint256 amountOut;
        uint256 amountIn;
    }

    mapping(address => Order) public orders;

    function execute(address account, bytes calldata terms, bytes calldata release) public returns (bool) {
        (address tokenOut, address tokenIn, uint256 amountOut, uint256 amountIn) =
            abi.decode(terms, (address, address, uint256, uint256));
        bytes memory lockdata = abi.encode(account, tokenOut, tokenIn, amountOut, amountIn);
        lock(lockdata);
    }

    function lock(bytes memory terms) internal returns (bool) {
        (address account, address tokenOut, address tokenIn, uint256 amountOut, uint256 amountIn) =
            abi.decode(terms, (address, address, address, uint256, uint256));

        orders[msg.sender] = Order(tokenOut, tokenIn, amountOut, amountIn);

        return true;
    }

    function unlock(bytes calldata terms) public returns (bool) {
        return true;
    }

    function delegate(bytes calldata terms) public returns (bool) {
        return true;
    }
}
