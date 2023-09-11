// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import{ ERC20Mintable } from "./ERC20Mintable.sol";

import { TokenRouterReleaseIntent } from '../intents/TokenRouterReleaseIntent.sol'; 

contract SwapRouter {
    function swap(address account, address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin, address tokenRouter) external returns (bool) {
        ERC20Mintable tokenA = ERC20Mintable(tokenOut);
        ERC20Mintable tokenB = ERC20Mintable(tokenIn);

        TokenRouterReleaseIntent(tokenRouter).claim(account, address(0x00), tokenOut, amountOutMax);

        tokenB.mint(address(this), amountInMin);
        tokenB.transfer(account, amountInMin);
    }
}