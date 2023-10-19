// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

contract RevertMessageReasonHelper {
    error ExecutionFailed();

    function _revertMessageReason(bytes memory revertData) internal pure {
        if (revertData.length == 0) revert ExecutionFailed();
        assembly {
            // We use Yul's revert() to bubble up errors from the target contract.
            revert(add(32, revertData), mload(revertData))
        }
    }
}
