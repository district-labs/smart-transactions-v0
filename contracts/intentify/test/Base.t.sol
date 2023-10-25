// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Test } from "forge-std/Test.sol";
import { RevertMessageReasonHelper } from "~/src/helpers/RevertMessageReasonHelper.sol";

contract BaseTest is Test, RevertMessageReasonHelper {
    uint256 SIGNER = 0xA11CE;
    uint256 WALLET1 = 0xA11CE;
    uint256 WALLET2 = 0xA11CE;
    uint256 WALLET3 = 0xA11CE;

    address internal signer;
    address internal wallet1;
    address internal wallet2;
    address internal wallet3;

    function initializeBase() public virtual {
        signer = vm.addr(SIGNER);
        wallet1 = vm.addr(WALLET1);
        wallet2 = vm.addr(WALLET2);
        wallet3 = vm.addr(WALLET3);
    }
}
