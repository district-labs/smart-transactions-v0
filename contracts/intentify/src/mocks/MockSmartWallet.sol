// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { Intentify } from "../Intentify.sol";

contract MockSmartWallet is Intentify {

    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    /* ===================================================================================== */
    /* External Functions                                                                    */
    /* ===================================================================================== */

    function setOwner(address _owner) external {
        owner = _owner;
    }

    /* ===================================================================================== */
    /* Internal Functions                                                                    */
    /* ===================================================================================== */
    
}
