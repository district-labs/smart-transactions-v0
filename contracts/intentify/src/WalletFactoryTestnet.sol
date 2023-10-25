// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";

import { ERC20Mintable } from "./periphery/ERC20Mintable.sol";
import { WalletFactory } from "./WalletFactory.sol";

contract WalletFactoryTestnet is WalletFactory {
    /*//////////////////////////////////////////////////////////////////////////
                                TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////////////////*/

    struct TestTokens {
        address tokenAddress;
        uint256 amount;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice The list of test tokens to be minted upon wallet creation.
    TestTokens[] public testTokens;

    /*//////////////////////////////////////////////////////////////////////////
                                CUSTOM ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Indicates that the test tokens are invalid.
    error InvalidTestTokens();

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param tokenAddressList The list of token addresses to be minted.
    /// @param amountList The list of token amounts to be minted.
    constructor(address[] memory tokenAddressList, uint256[] memory amountList) {
        if (tokenAddressList.length != amountList.length) {
            revert InvalidTestTokens();
        }

        for (uint256 i = 0; i < tokenAddressList.length; i++) {
            testTokens.push(TestTokens(tokenAddressList[i], amountList[i]));
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc WalletFactory
    function createDeterministicWallet(
        address _singleton,
        address owner,
        uint256 saltNonce
    )
        public
        override
        returns (SafeProxy proxy)
    {
        bytes memory initializer = _encodeInitializer(owner);
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        proxy = deployProxy(_singleton, initializer, salt);

        // Mint test tokens upon wallet creation
        for (uint256 i = 0; i < testTokens.length; i++) {
            ERC20Mintable(testTokens[i].tokenAddress).mint(address(proxy), testTokens[i].amount);
        }

        emit ProxyCreation(proxy, _singleton);
    }
}
