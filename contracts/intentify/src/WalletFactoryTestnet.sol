// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { ERC20Mintable } from "./periphery/ERC20Mintable.sol";
import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

contract WalletFactoryTestnet is SafeProxyFactory {
    struct TestTokens {
        address tokenAddress;
        uint256 amount;
    }

    TestTokens[] public testTokens;

    constructor(address[] memory tokenAddressList, uint256[] memory amountList) {
        require(tokenAddressList.length == amountList.length, "WalletFactoryTestnet:InvalidTestTokens");

        for (uint256 i = 0; i < tokenAddressList.length; i++) {
            testTokens.push(TestTokens(tokenAddressList[i], amountList[i]));
        }
    }

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

    function createDeterministicWallet(
        address _singleton,
        address owner,
        uint256 saltNonce
    )
        public
        returns (SafeProxy proxy)
    {
        bytes memory initializer = _encodeInitializer(owner);
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        proxy = deployProxy(_singleton, initializer, salt);

        for (uint256 i = 0; i < testTokens.length; i++) {
            ERC20Mintable(testTokens[i].tokenAddress).mint(address(proxy), testTokens[i].amount);
        }

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
