// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import {Hook} from "../Hook.sol";
import {BytesLib} from "../libraries/BytesLib.sol";

contract LimitOrderHook is Hook {
    /**
     * @notice Allows the delegator to specify the latest timestamp the delegation will be valid.
     * @param terms - The latest timestamp this delegation is valid.
     * @param delegationHash - The hash of the delegation being operated on.
     **/
    function execute(
        bytes calldata terms,
        bytes calldata release
    ) public view override returns (bool) {
        (address tokenOut, address tokenIn, uint256 amountOut, uint256 amountIn) = abi.decode(terms, (address, address, uint256, uint256));
    }

    function lock(
        bytes calldata terms
    ) public override virtual returns (bool) {
        
    }
    
    function unlock(
        bytes calldata terms
    ) public override virtual returns (bool) {

    }
    
    function release(
        bytes calldata terms
    ) public override virtual returns (bool) {

    }
}
