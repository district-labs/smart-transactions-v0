// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import {IHook} from "../interfaces/IHook.sol";
import {Intent} from "../TypesAndDecoders.sol";
import {BytesLib} from "../libraries/BytesLib.sol";

contract TimestampAfterIntent is IHook {
    function execute(Intent calldata intent) external view returns (bool) {
        require(intent.root == msg.sender, "TimestampAfterIntent:invalid-root");
        require(intent.target == address(this), "TimestampAfterIntent:invalid-target");

        uint128 timestamp = BytesLib.toUint128(intent.data, 0);
        if (timestamp > block.timestamp) {
            return true;
        } else {
            revert("TimestampAfterIntent:expired");
        }
    }

    function encode(uint128 timestamp) external pure returns (bytes memory data) {
        data = abi.encodePacked(timestamp);
    }
}
