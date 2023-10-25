// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { ERC20Mintable } from "./ERC20Mintable.sol";

contract SwapRouter {
    function swap(address account, address tokenIn, uint256 amountInMin) external {
        ERC20Mintable tokenB = ERC20Mintable(tokenIn);

        tokenB.mint(address(this), amountInMin);
        tokenB.transfer(account, amountInMin);
    }
}
