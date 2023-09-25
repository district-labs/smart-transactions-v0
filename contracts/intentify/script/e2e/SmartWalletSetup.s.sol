// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

// Forge Contracts
import "forge-std/Script.sol";

// Safe Contracts
import {Safe} from "safe-contracts/Safe.sol";
import {SafeProxy} from "safe-contracts/proxies/SafeProxy.sol";
import {SafeProxyFactory} from "safe-contracts/proxies/SafeProxyFactory.sol";
import {Enum} from "safe-contracts/common/Enum.sol";

// Protocol Contracts
import {IntentifySafeModule} from "../../src/module/IntentifySafeModule.sol";
import {WalletFactory} from "../../src/WalletFactory.sol";

contract SmartWalletSetup is Script {
    Safe internal _safe;
    SafeProxyFactory internal _safeProxyFactory;

    // Deterministicaly deploted in TestnetDeploy.s.sol
    IntentifySafeModule internal _intentifySafeModule = IntentifySafeModule(0x5FbDB2315678afecb367f032d93F642f64180aa3);

    // Anvil Account 1
    address DEPLOYER_PUBLIC = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 DEPLOYER_PRIVATE = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function run() external {
        vm.startBroadcast(DEPLOYER_PRIVATE);
        _safe = new Safe();
        _safeProxyFactory = new SafeProxyFactory();

        address[] memory owners = new address[](1);
        bytes memory data = new bytes(0);
        owners[0] = DEPLOYER_PUBLIC;
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

        SafeProxy _safeProxy = _safeProxyFactory.createProxyWithNonce(address(_safe), initializer, uint256(0));
        Safe _safe = Safe(payable(address(_safeProxy)));
        _enableIntentifyModule(DEPLOYER_PRIVATE, _safe, address(_intentifySafeModule));
        vm.stopBroadcast();
    }

    function _setupSafe(address owner) internal returns (Safe safe) {
        address[] memory owners = new address[](1);
        bytes memory data = new bytes(0);
        owners[0] = owner;
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
        SafeProxy _safeProxy = _safeProxyFactory.createProxyWithNonce(address(_safe), initializer, uint256(0));
        safe = Safe(payable(address(_safeProxy)));
    }

    function _enableIntentifyModule(uint256 signer, Safe _safe, address module) internal {
        // Craft Transaction
        bytes memory txdata = abi.encodeWithSignature("enableModule(address)", module);
        bytes32 executedata =
            _safe.getTransactionHash(address(_safe), 0, txdata, Enum.Operation.Call, 0, 0, 0, address(0), address(0), 0);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signer, executedata);
        bytes memory signatures = _combineRSV(r, s, v);
        // Initialize the Safe Intentiy Module
        _safe.execTransaction(
            address(_safe),
            0,
            txdata,
            Enum.Operation.Call, // operation
            0,
            0,
            0,
            address(0),
            payable(address(0)),
            signatures
        );
    }

    function _bitShiftedSig(bytes memory signMessageData) internal pure returns (bytes memory) {
        require(signMessageData.length >= 2, "Input bytes should have at least 2 characters");

        // Check and replace the last byte
        if (signMessageData[signMessageData.length - 1] == bytes1(0x1b)) {
            signMessageData[signMessageData.length - 1] = bytes1(0x1f);
        } else if (signMessageData[signMessageData.length - 1] == bytes1(0x1c)) {
            signMessageData[signMessageData.length - 1] = bytes1(0x20);
        }

        // Check and replace the second last byte
        if (signMessageData[signMessageData.length - 2] == bytes1(0x1b)) {
            signMessageData[signMessageData.length - 2] = bytes1(0x1f);
        } else if (signMessageData[signMessageData.length - 2] == bytes1(0x1c)) {
            signMessageData[signMessageData.length - 2] = bytes1(0x20);
        }

        return signMessageData;
    }

    function _combineRSV(bytes32 r, bytes32 s, uint8 v) internal pure returns (bytes memory) {
        bytes memory signature = new bytes(65);
        assembly {
            mstore(add(signature, 32), r)
            mstore(add(signature, 64), s)
            mstore8(add(signature, 96), v)
        }

        return signature;
    }
}
