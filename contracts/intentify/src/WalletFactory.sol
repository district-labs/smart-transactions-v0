// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import {Safe} from "safe-contracts/Safe.sol";
import {SafeProxy} from "safe-contracts/proxies/SafeProxy.sol";
import {SafeProxyFactory} from "safe-contracts/proxies/SafeProxyFactory.sol";

contract WalletFactory is SafeProxyFactory {
    function getDeterministicWalletAddress(address _singleton, address owner, uint256 saltNonce)
        public
        view
        returns (address proxy)
    {
        address[] memory owners = new address[](1);
        owners[0] = owner;
        bytes memory initializer = abi.encodeWithSelector(
            Safe.setup.selector,
            owners,
            1, // threshold
            address(0), // to
            new bytes(0), // data
            address(0), // fallbackHandler
            address(0), // paymentToken
            0, // payment
            payable(address(0)) // paymentReceiver
        );
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        bytes memory deploymentData = abi.encodePacked(type(SafeProxy).creationCode, uint256(uint160(_singleton)));
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(deploymentData)));
        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }

    function createDeterministicWallet(address _singleton, address owner, uint256 saltNonce)
        public
        returns (SafeProxy proxy)
    {
        bytes memory initializer = _encodeInitializer(owner);
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        proxy = deployProxy(_singleton, initializer, salt);

        // TODO: For testnets connect to a mock token faucet and automatically fund the wallet with some tokens
        emit ProxyCreation(proxy, _singleton);
    }

    function isWalletMaterialized(address _singleton, address owner, uint256 saltNonce) external view returns (bool) {
        address proxyCounterfactual = getDeterministicWalletAddress(_singleton, owner, saltNonce);
        return isContract(proxyCounterfactual);
    }

    function _encodeInitializer(address owner) internal returns (bytes memory initializer) {
        address[] memory owners = new address[](1);
        owners[0] = owner;
        initializer = abi.encodeWithSelector(
            Safe.setup.selector,
            owners,
            1, // threshold
            address(0), // to
            new bytes(0), // data
            address(0), // fallbackHandler
            address(0), // paymentToken
            0, // payment
            payable(address(0)) // paymentReceiver
        );
    }
}
