// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

/// @title Wallet Factory
/// @notice Factory to create deterministic safe wallets
contract WalletFactory is SafeProxyFactory {
    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Retrieves the deterministic wallet address for a given owner, singleton, and salt nonce.
    /// @param _singleton The address of the singleton contract.
    /// @param owner The owner of the wallet.
    /// @param saltNonce The nonce to be used in the deterministic wallet address.
    /// @return proxy The deterministic wallet address.
    function getDeterministicWalletAddress(
        address _singleton,
        address owner,
        uint256 saltNonce
    )
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

    /// @notice Checks if a safe wallet has been materialized.
    /// @param _singleton The address of the singleton contract.
    /// @param owner The owner of the wallet.
    /// @param saltNonce The nonce to be used in the deterministic wallet address.
    /// @return isMaterialized True if the wallet has been materialized.
    function isWalletMaterialized(address _singleton, address owner, uint256 saltNonce) external view returns (bool) {
        address proxyCounterfactual = getDeterministicWalletAddress(_singleton, owner, saltNonce);
        return isContract(proxyCounterfactual);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Creates a deterministic safe wallet.
    /// @param _singleton The address of the singleton contract.
    /// @param owner The owner of the wallet.
    /// @param saltNonce The nonce to be used in the deterministic wallet address.
    /// @return proxy The deterministic wallet address.
    function createDeterministicWallet(
        address _singleton,
        address owner,
        uint256 saltNonce
    )
        public
        virtual
        returns (SafeProxy proxy)
    {
        bytes memory initializer = _encodeInitializer(owner);
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        proxy = deployProxy(_singleton, initializer, salt);

        emit ProxyCreation(proxy, _singleton);
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Encodes the initializer for a safe wallet.
    /// @param owner The owner of the wallet.
    /// @return initializer The encoded initializer.
    function _encodeInitializer(address owner) internal pure returns (bytes memory initializer) {
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
