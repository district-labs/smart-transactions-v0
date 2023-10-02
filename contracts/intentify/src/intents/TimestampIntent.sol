// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IHook } from "../interfaces/IHook.sol";
import { Intent } from "../TypesAndDecoders.sol";
import { BytesLib } from "../libraries/BytesLib.sol";

contract TimestampIntent is IHook {
    function execute(Intent calldata intent) external view returns (bool) {
        require(intent.root == msg.sender, "TimestampIntent:invalid-root");
        require(intent.target == address(this), "TimestampIntent:invalid-target");
        (uint128 minTimestamp, uint128 maxTimestamp) = abi.decode(intent.data, (uint128, uint128));

        if (block.timestamp > maxTimestamp) {
            revert("TimestampIntent:expired");
        } else if (block.timestamp < minTimestamp) {
            revert("TimestampIntent:expired");
        }

        return true;
    }

    function encode(uint128 minTimestamp, uint128 maxTimestamp) external pure returns (bytes memory data) {
        data = abi.encode(minTimestamp, maxTimestamp);
    }
}
