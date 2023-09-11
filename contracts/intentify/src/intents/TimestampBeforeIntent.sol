// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IHook } from "../interfaces/IHook.sol"; 
import { Intent } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract TimestampBeforeIntent is IHook {

    function execute(
        Intent calldata intent
    ) external view returns (bool) {
        require(intent.exec.root == msg.sender, "TimestampBeforeIntent:invalid-root");
        require(intent.exec.target == address(this), "TimestampBeforeIntent:invalid-target");

        uint128 timestamp = BytesLib.toUint128(intent.exec.data, 0);
        if (timestamp < block.timestamp) {
            return true;
        } else {
            revert("TimestampBeforeIntent:expired");
        }
    }
}
