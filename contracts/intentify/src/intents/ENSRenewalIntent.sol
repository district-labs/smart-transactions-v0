// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/Console2.sol";
import { IETHRegistrarController, IPriceOracle } from "ens/ethregistrar/IETHRegistrarController.sol";
import { ERC20 } from "solady/tokens/ERC20.sol";
import { Intent, Hook } from "../TypesAndDecoders.sol";
import { IntentAbstract } from "../abstracts/IntentAbstract.sol";
import { ExecuteRootTransaction } from "./utils/ExecuteRootTransaction.sol";

/// @title ERC20 Tip Intent
/// @notice An intent that allows the intent root to tip the hook executor with ERC20 tokens.
contract ENSRenewalIntent is IntentAbstract, ExecuteRootTransaction {
    address public immutable ethRegistrarControllerAddress;

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Initialize the smart contract
    /// @param _intentifySafeModule The address of the Intentify Safe Module
    constructor(
        address _intentifySafeModule,
        address _ethRegistrarControllerAddress
    )
        ExecuteRootTransaction(_intentifySafeModule)
    {
        ethRegistrarControllerAddress = _ethRegistrarControllerAddress;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to encode intent parameters into a byte array.
    /// @param name The name of the ENS domain to be renewed.
    /// @param duration The duration of the renewal in seconds.
    /// @return data The encoded parameters.
    function encodeIntent(string calldata name, uint256 duration) external pure returns (bytes memory) {
        return abi.encode(name, duration);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                   WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @inheritdoc IntentAbstract
    function execute(Intent calldata intent)
        external
        override
        validIntentRoot(intent)
        validIntentTarget(intent)
        returns (bool)
    {
        (string memory name, uint256 duration) = _decodeIntent(intent);

        IPriceOracle.Price memory rentPrice =
            IETHRegistrarController(ethRegistrarControllerAddress).rentPrice(name, duration);

        uint256 rentPricePaid = rentPrice.base + (rentPrice.base / 10);
        //  Renew the ENS domain
        bytes memory data = abi.encodeWithSelector(IETHRegistrarController.renew.selector, name, duration);
        return executeFromRoot(ethRegistrarControllerAddress, rentPricePaid, data);
    }

    /*//////////////////////////////////////////////////////////////////////////
                              INTERNAL READ FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Helper function to decode intent parameters from a byte array.
    /// @param intent The intent to decode.
    /// @return name The name of the ENS domain to be renewed.
    /// @return duration The duration of the renewal in seconds.
    function _decodeIntent(Intent calldata intent) internal pure returns (string memory name, uint256 duration) {
        return abi.decode(intent.data, (string, uint256));
    }
}
