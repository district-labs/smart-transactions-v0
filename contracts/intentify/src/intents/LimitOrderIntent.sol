// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { console2 } from "forge-std/console2.sol";

import { ERC20 } from "solady/tokens/ERC20.sol";
import { IHook } from "../interfaces/IHook.sol"; 
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract LimitOrderIntent {

    mapping(address => mapping(address => uint256)) public till;

    function execute(
        Intent calldata intent,
        Hook calldata hook
    ) external returns (bool) {
        require(intent.exec.root == msg.sender, "LimitOrderIntent:invalid-root");
        require(intent.exec.target == address(this), "LimitOrderIntent:invalid-target");

        (address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin) = abi.decode(intent.exec.data, (address, address, uint256, uint256));

        uint256 tokenABalance = ERC20(tokenOut).balanceOf(intent.exec.root);
        uint256 tokenBBalance = ERC20(tokenIn).balanceOf(intent.exec.root);
        console2.log("pre:tokenABalance", tokenABalance);

        till[intent.exec.root][tokenOut] = tokenABalance - amountOutMax;
        till[intent.exec.root][tokenIn] += tokenBBalance + amountInMin;

        _hook(hook);
        // The hook is expected to transfer the tokens to the intent root.
        // NOTICE: We can likely optimize by using the `transient storage` when available.

        _unlock(intent.exec.root, tokenOut, tokenIn);

        return true;
        
    }

    function _unlock(address account, address tokenOut, address tokenIn) internal view returns (bool) {
        uint256 tokenABalance = ERC20(tokenOut).balanceOf(account);
        uint256 tokenBBalance = ERC20(tokenIn).balanceOf(account);
        require(till[account][tokenOut] <= tokenABalance, "LimitOrderIntent:unlock:tokenOut:insufficient-balance");
        require(till[account][tokenIn] <= tokenBBalance, "LimitOrderIntent:unlock:tokenIn:insufficient-balance");
        return true;
    }

    function _hook(Hook calldata hook) internal returns (bool success) {
        bytes memory errorMessage;
        (success, errorMessage) = address(hook.target).call{value: 0}(hook.data);

        if (!success) {
            if (errorMessage.length > 0) {
                string memory reason = _extractRevertReason(errorMessage);
                revert(reason);
            } else {
                revert("LimitOrderIntentHook::execution-failed");
            }
        }
    }

    function _extractRevertReason(bytes memory revertData)
        internal
        pure
        returns (string memory reason)
    {
        uint256 length = revertData.length;
        if (length < 68) return "";
        uint256 t;
        assembly {
            revertData := add(revertData, 4)
            t := mload(revertData) // Save the content of the length slot
            mstore(revertData, sub(length, 4)) // Set proper length
        }
        reason = abi.decode(revertData, (string));
        assembly {
            mstore(revertData, t) // Restore the content of the length slot
        }
    }


}