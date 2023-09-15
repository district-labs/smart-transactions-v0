// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { StdCheats } from "forge-std/StdCheats.sol";
import { PRBTest } from "@prb/test/PRBTest.sol";

import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";

import { WalletFactory } from "../src/WalletFactory.sol";
import { BaseTest } from "./utils/Base.t.sol";


contract WalletFactoryTest is BaseTest {
    Safe internal _safe;
    SafeProxy internal _safeProxy;
    WalletFactory internal _walletFactory;

    function setUp() public virtual {
        initializeBase();
        _safe = new Safe();
        _safeProxy = new SafeProxy(address(_safe));
        _walletFactory = new WalletFactory();
    }

    function test_WalletFactory_getDeterministicWalletAddress_Success() external {
        address EXPECTED_ADDRESS = 0x6A5A6B9c48cCC0157BCDbE4F13Ce073F2D609cbC;
        address proxy = _walletFactory.getDeterministicWalletAddress(address(_safe),wallet1, 0);
        assertEq(address(proxy), address(EXPECTED_ADDRESS));
    }
    
    function test_WalletFactory_createDeterministicWallet_Success() external {
        address proxyCounterfactual = _walletFactory.getDeterministicWalletAddress(address(_safe), wallet1, 0);
        SafeProxy proxyMaterialized = _walletFactory.createDeterministicWallet(address(_safe), wallet1, 0);
        assertEq(address(proxyMaterialized), address(proxyCounterfactual));
    }
    
    function test_WalletFactory_isWalletMaterialized_Success() external {
        address proxyCounterfactual = _walletFactory.getDeterministicWalletAddress(address(_safe), wallet1, 0);
        bool isCounterfactual = _walletFactory.isWalletMaterialized(address(_safe), wallet1, 0);
        assertEq(isCounterfactual, false);
        SafeProxy proxyMaterialized = _walletFactory.createDeterministicWallet(address(_safe), wallet1, 0);
        bool isMaterialized = _walletFactory.isWalletMaterialized(address(_safe), wallet1, 0);
        assertEq(isMaterialized, true);
    }
    
}