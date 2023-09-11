// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest, Vm } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";
import { Safe } from "safe-contracts/Safe.sol";
import { SafeProxy } from "safe-contracts/proxies/SafeProxy.sol";
import { Enum } from "safe-contracts/common/Enum.sol";
import { SafeProxyFactory } from "safe-contracts/proxies/SafeProxyFactory.sol";


import { ERC20Mintable } from "./mocks/ERC20Mintable.sol";

import { IntentifySafeModule } from "../src/module/IntentifySafeModule.sol";
import { DimensionalNonce, IntentExecution, Intent, IntentBatch, IntentBatchExecution, Signature, Hook, TypesAndDecoders } from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";

contract IntentifySafeModuleTest is PRBTest, StdCheats {
    // Safe Contracts
    Safe internal _safe;
    SafeProxy internal _safeProxy;
    Safe internal _safeDeploy;
    SafeProxyFactory internal _safeProxyFactory;

    // Intentify Module
    IntentifySafeModule internal _intentifySafeModule;

    // Testing Variables
    address internal signer;
    uint256 SIGNER = 0xA11CE;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _safe = new Safe();
        _safeProxy = new SafeProxy(address(_safe));
        _safeDeploy = Safe(payable(address(_safeProxy)));
        _safeProxyFactory = new SafeProxyFactory();
        _intentifySafeModule = new IntentifySafeModule();
    }

    function test_SetupSafe_Success() external {
        // Setup the safe
        /**
            function setup(
                address[] calldata _owners,
                uint256 _threshold,
                address to,
                bytes calldata data,
                address fallbackHandler,
                address paymentToken,
                uint256 payment,
                address payable paymentReceiver
            )
         */
        address[] memory owners = new address[](1);
        owners[0] = signer;
        bytes memory data = new bytes(0);
        
        vm.recordLogs();
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
        SafeProxy _safeProxyCreated = _safeProxyFactory.createProxyWithNonce(address(_safe), initializer, uint256(0));
        Safe _safeCreated = Safe(payable(address(_safeProxyCreated)));
        _enableIntentifyModule(_safeCreated, address(_intentifySafeModule));
    }

    function _enableIntentifyModule(Safe _safe, address module) internal {
        // Craft Transaction
        bytes memory txdata = _generateIntentifyModuleEnableData(address(module));

        bytes32 executedata = _safe.getTransactionHash(
            address(_safe),
            0,
            txdata,
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0x00),
            address(0x00),
            0
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, executedata);
        bytes memory signatures = combineRSV(r,s,v);
        
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

    function _generateIntentifyModuleEnableData(address module) internal pure returns (bytes memory) {
        return abi.encodeWithSignature("enableModule(address)", module);
    }

    function combineRSV(bytes32 r, bytes32 s, uint8 v) public pure returns (bytes memory) {
        // Initialize a bytes array with a length of 65
        bytes memory signature = new bytes(65);
        
        // Use inline assembly to store the variables
        assembly {
            // First 32 bytes store the length of the signature
            mstore(add(signature, 32), r)
            mstore(add(signature, 64), s)
            mstore8(add(signature, 96), v)
        }
        
        return signature;
    }

    bytes32 private constant SAFE_MSG_TYPEHASH = 0x60b3cbf8b4a223d68d641b3b6ddf9a298e7f33710cf3d3a9d1146b5a6150fbca;
    function _getMessageHash(Safe _safe, bytes memory message) internal view returns (bytes32) {
        bytes32 safeMessageHash = keccak256(abi.encode(SAFE_MSG_TYPEHASH, keccak256(message)));
        return keccak256(abi.encodePacked(bytes1(0x19), bytes1(0x01), _safe.domainSeparator(), safeMessageHash));
    }

    // // computes the hash of the fully encoded EIP-712 message for the domain, which can be used to recover the signer
    // function _getTypedDataHash(bytes32 DOMAIN_SEPARATOR, Permit memory _permit)
    //     internal
    //     view
    //     returns (bytes32)
    // {
    //     return
    //         keccak256(
    //             abi.encodePacked(
    //                 "\x19\x01",
    //                 DOMAIN_SEPARATOR,
    //                 getStructHash(_permit)
    //             )
    //         );
    // }

    // function _getStructHash(Permit memory _permit)
    //     internal
    //     pure
    //     returns (bytes32)
    // {
    //     return
    //         keccak256(
    //             abi.encode(
    //                 PERMIT_TYPEHASH,
    //                 _permit.owner,
    //                 _permit.spender,
    //                 _permit.value,
    //                 _permit.nonce,
    //                 _permit.deadline
    //             )
    //         );
    // }

}
