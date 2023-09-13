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
        address EXPECTED_ADDRESS = 0xE0872CCdce4e1f3102C2c80a8F79FCfa9a6389B7;
        address proxy = _walletFactory.getDeterministicWalletAddress(address(_safe), 0);
        assertEq(address(proxy), address(EXPECTED_ADDRESS));
    }
    
    function test_WalletFactory_createDeterministicWallet_Success() external {
        address proxyCounterfactual = _walletFactory.getDeterministicWalletAddress(address(_safe), 0);
        address[] memory owners = new address[](1);
        bytes memory data = new bytes(0);
        owners[0] = wallet1;
        bytes memory initializer = abi.encodeWithSelector(
            _safe.setup.selector, 
            owners, 
            1, // threshold 
            address(0), // to
            data, 
            address(0), // fallbackHandler
            address(0), // paymentToken
            0, // payment
            payable(address(0)) // paymentReceiver
        );

        SafeProxy proxyMaterialized = _walletFactory.createDeterministicWallet(address(_safe), initializer, 0);
        assertEq(address(proxyMaterialized), address(proxyCounterfactual));
    }
    
}