// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import {BaseTest} from "../utils/Base.t.sol";
import {NonceManager} from "../../src/nonce/NonceManager.sol";

contract NonceManagerMock is NonceManager {
    function nonceEnforcer(bytes calldata encodedNonce) external {
        _nonceEnforcer(encodedNonce);
    }

    function decodeStandardNonce(bytes calldata encodedNonce) public returns (uint8, uint248) {
        return _decodeStandardNonce(encodedNonce);
    }

    function decodeDimensionalNonce(bytes calldata encodedNonce) public returns (uint8, uint120, uint128) {
        return _decodeDimensionalNonce(encodedNonce);
    }

    function decodeTimeNonce(bytes calldata encodedNonce) public returns (uint8, uint32, uint128, uint96) {
        return _decodeTimeNonce(encodedNonce);
    }
}

contract NonceManagerTest is BaseTest {
    NonceManagerMock internal _nonceManager;

    function setUp() public virtual {
        _nonceManager = new NonceManagerMock();
    }

    // Standard Nonce

    function test_NonceManager_StandardNonce_Success() external {
        bytes memory encodedStandardNonce = _nonceManager.encodeStandardNonce(0);
        _nonceManager.nonceEnforcer(encodedStandardNonce);
    }

    function test_NonceManager_StandardNonce_WithoutEncoding_Success() external {
        _nonceManager.nonceEnforcer(abi.encodePacked(uint256(0)));
    }

    function test_NonceManager_StandardNonce_Failure() external {
        bytes memory encodedStandardNonce = _nonceManager.encodeStandardNonce(0);
        _nonceManager.nonceEnforcer(encodedStandardNonce);
        vm.expectRevert(bytes("NonceManager:nonce-out-of-order"));
        _nonceManager.nonceEnforcer(encodedStandardNonce);
    }

    // Dimensional Nonce

    function test_NonceManager_DimensionalNonce_Success() external {
        bytes memory encodedDimensionalNonce = _nonceManager.encodeDimensionalNonce(0, 0);
        _nonceManager.nonceEnforcer(encodedDimensionalNonce);
    }

    function test_NonceManager_DimensionalNonce_SameQueue_Success() external {
        bytes memory encodedDimensionalNonce = _nonceManager.encodeDimensionalNonce(0, 0);
        _nonceManager.nonceEnforcer(encodedDimensionalNonce);
        bytes memory encodedDimensionalNonceNext = _nonceManager.encodeDimensionalNonce(0, 1);
        _nonceManager.nonceEnforcer(encodedDimensionalNonceNext);
    }

    function test_NonceManager_DimensionalNonce_NewQueue_Success() external {
        bytes memory encodedDimensionalNonceQueueOne = _nonceManager.encodeDimensionalNonce(0, 0);
        _nonceManager.nonceEnforcer(encodedDimensionalNonceQueueOne);
        bytes memory encodedDimensionalNonceQueueTwo = _nonceManager.encodeDimensionalNonce(1, 0);
        _nonceManager.nonceEnforcer(encodedDimensionalNonceQueueTwo);
    }

    function test_NonceManager_DimensionalNonce_Failure() external {
        bytes memory encodedDimensionalNonce = _nonceManager.encodeDimensionalNonce(0, 0);
        _nonceManager.nonceEnforcer(encodedDimensionalNonce);
        vm.expectRevert(bytes("NonceManager:nonce-out-of-order"));
        _nonceManager.nonceEnforcer(encodedDimensionalNonce);
    }

    // Time Nonce
    function test_NonceManager_TimeNonce_Success() external {
        bytes memory encodedTimeNonce = _nonceManager.encodeTimeNonce(1, 100, 1);
        _nonceManager.nonceEnforcer(encodedTimeNonce);
    }

    function test_NonceManager_TimeNonce_InvalidId_Failure() external {
        bytes memory encodedTimeNonceOne = _nonceManager.encodeTimeNonce(42, 100, 1);
        _nonceManager.nonceEnforcer(encodedTimeNonceOne);
        bytes memory encodedTimeNonceTwo = _nonceManager.encodeTimeNonce(42, 200, 1);
        vm.expectRevert(bytes("NonceManager:id-used"));
        _nonceManager.nonceEnforcer(encodedTimeNonceTwo);
    }

    function test_NonceManager_TimeNonce_DeltaMet_Success() external {
        bytes memory encodedTimeNonce = _nonceManager.encodeTimeNonce(2, 100, 2);
        _nonceManager.nonceEnforcer(encodedTimeNonce);
        vm.warp(block.timestamp + 100);
        _nonceManager.nonceEnforcer(encodedTimeNonce);
    }

    function test_NonceManager_TimeNonce_DeltaMet_Failure() external {
        bytes memory encodedTimeNonce = _nonceManager.encodeTimeNonce(2, 100, 2);
        _nonceManager.nonceEnforcer(encodedTimeNonce);
        vm.warp(block.timestamp + 99);
        vm.expectRevert(bytes("NonceManager:delta-not-reached"));
        _nonceManager.nonceEnforcer(encodedTimeNonce);
    }

    function test_NonceManager_TimeNonce_CountReached_Failure() external {
        bytes memory encodedTimeNonce = _nonceManager.encodeTimeNonce(3, 1, 1);
        _nonceManager.nonceEnforcer(encodedTimeNonce);
        vm.warp(block.timestamp + 1);
        vm.expectRevert(bytes("NonceManager:count-reached"));
        _nonceManager.nonceEnforcer(encodedTimeNonce);
    }

    // Invalid Nonce Type
    function test_NonceManager_InvalidNonceType_Failure() external {
        bytes memory encodedInvalidNonce = abi.encodePacked(uint8(4), uint248(1));
        vm.expectRevert(bytes("NonceManager:invalid-nonce-type"));
        _nonceManager.nonceEnforcer(encodedInvalidNonce);
    }

    /* ===================================================================================== */
    /* Decoding                                                                              */
    /* ===================================================================================== */
    function test_NonceManager_DecodeStandardNonce_Success() external {
        bytes memory encodedNonce = _nonceManager.encodeStandardNonce(20);
        (uint8 nonceType, uint248 accumulator) = _nonceManager.decodeStandardNonce(encodedNonce);
        assertEq(nonceType, uint8(0));
        assertEq(accumulator, 20);
    }

    function test_NonceManager_DecodeDimensionalNonce_Success() external {
        bytes memory encodedInvalidNonce = _nonceManager.encodeDimensionalNonce(20, 30);
        (uint8 nonceType, uint120 queue, uint128 accumulator) =
            _nonceManager.decodeDimensionalNonce(encodedInvalidNonce);
        assertEq(nonceType, uint8(1));
        assertEq(queue, uint120(20));
        assertEq(accumulator, uint128(30));
    }

    function test_NonceManager_DecodeTimeNonce_Success() external {
        bytes memory encodedInvalidNonce = _nonceManager.encodeTimeNonce(20, 30, 5);
        (uint8 nonceType, uint32 id, uint128 delta, uint96 count) = _nonceManager.decodeTimeNonce(encodedInvalidNonce);
        assertEq(nonceType, uint8(2));
        assertEq(id, uint32(20));
        assertEq(delta, uint128(30));
        assertEq(count, uint96(5));
    }

    function _convertBytesToBytes32(bytes memory inBytes) internal pure returns (bytes32 out) {
        if (inBytes.length == 0) {
            return 0x0;
        }

        assembly {
            out := mload(add(inBytes, 32))
        }
    }
}
