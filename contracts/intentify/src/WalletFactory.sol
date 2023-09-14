// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

contract WalletFactory is SafeProxyFactory {
    function getDeterministicWalletAddress(address _singleton, bytes memory initializer, uint256 saltNonce) external view returns (address proxy) {
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        bytes memory deploymentData = abi.encodePacked(type(SafeProxy).creationCode, uint256(uint160(_singleton)));
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(deploymentData))
        );
        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint(hash)));
    }
}