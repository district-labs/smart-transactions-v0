// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { ERC20Mintable } from "./ERC20Mintable.sol";
import { Ownable } from "solady/auth/Ownable.sol";

import { TokenRouterReleaseIntent } from "../intents/TokenRouterReleaseIntent.sol";

contract EngineHub is Ownable {
    struct Call {
        address target;
        bytes callData;
    }

    event MultiCallAction(address indexed target, bytes data, bytes result);

    constructor(address _owner) {
        _initializeOwner(_owner);
    }

    function multiCall(Call[] calldata calls) external onlyOwner returns (bytes[] memory results) {
        results = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory result) = calls[i].target.call(calls[i].callData);
            if (!success) {
                if (result.length > 0) {
                    string memory reason = _extractRevertReason(result);
                    revert(reason);
                } else {
                    revert("EngineHub:call-failed");
                }
            }
            results[i] = result;

            emit MultiCallAction(calls[i].target, calls[i].callData, result);
        }
    }

    function _extractRevertReason(bytes memory revertData) internal pure returns (string memory reason) {
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
