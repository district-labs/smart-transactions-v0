// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IHook } from "../interfaces/IHook.sol"; 
import { Intent } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract TimestampBeforeHook is IHook {

    function execute(
        Intent calldata intent
    ) external view returns (bool) {
        require(intent.root == msg.sender, "TimestampBeforeHook:invalid-root");
        require(intent.target == address(this), "TimestampBeforeHook:invalid-target");

        uint128 timestamp = BytesLib.toUint128(intent.data, 0);
        if (timestamp < block.timestamp) {
            return true;
        } else {
            revert("TimestampBeforeHook:expired");
        }
    }
}
