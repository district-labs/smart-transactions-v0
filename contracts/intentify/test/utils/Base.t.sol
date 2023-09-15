// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { StdCheats } from "forge-std/StdCheats.sol";
import { PRBTest } from "@prb/test/PRBTest.sol";

contract BaseTest is PRBTest, StdCheats {
    uint256 SIGNER = 0xA11CE;
    uint256 WALLET_1 = 0xA11CE;
    uint256 WALLET_2 = 0xA11CE;
    uint256 WALLET_3 = 0xA11CE;

    address internal signer;
    address internal wallet1;
    address internal wallet2;
    address internal wallet3;

    function initializeBase() public virtual {
        signer = vm.addr(SIGNER);
        wallet1 = vm.addr(WALLET_1);
        wallet2 = vm.addr(WALLET_2);
        wallet3 = vm.addr(WALLET_3);
    }
}
