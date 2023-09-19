// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

/**
 * The NonceManager contract is used to handle replay protection for multiple queues.
 * It packs 3 different types of nonces into a single bytes32 value.
 * The first byte is used to identify the nonce type.
 * The remaining bytes are used to store the nonce value.
 *
 * Below are the 3 different types of nonces in struct form:
 *
 * struct StandardNonce {
 *     uint8 nonceType;
 *     uint248 accumulator;
 * }
 *
 * struct DimensionalNonce {
 *     uint8 nonceType;
 *     uint128 queue;
 *     uint120 accumulator;
 * }
 *
 * struct TimeNonce {
 *     uint8 nonceType;
 *     uint32 id;
 *     uint128 delta; // time in seconds
 *     uint96 count; // number of transactions
 * }
 *
 * The NonceManager contract doesn't use the structs directly.
 * They are only used to explain the nonce types.
 */

enum NonceType {
    Standard,
    Dimensional,
    Time
}

struct TimeTracker {
    uint128 delta; // time in epoch
    uint96 count; // number of transactions
}

contract NonceManager {
    /// @notice Standard Multi nonce to handle replay protection for multiple queues
    mapping(address => uint248) internal standardNonce;

    /// @notice Dimensional Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(uint120 => uint128)) internal dimensionalNonce;

    /// @notice Time Multi nonce to handle replay protection for multiple queues
    mapping(address => mapping(uint32 => TimeTracker)) internal timeTracking;
    mapping(address => mapping(uint32 => bytes32)) internal timeNonce;

    function getStandardNonce(address account) public view returns (uint248) {
        return standardNonce[account];
    }

    function getDimensionalNonce(address account, uint120 queue) public view returns (uint128) {
        return dimensionalNonce[account][queue];
    }

    function getTimeNonce(address account, uint32 id) public view returns (TimeTracker memory) {
        return timeTracking[account][id];
    }

    /* ===================================================================================== */
    /* Encoding                                                                              */
    /* ===================================================================================== */
    function encodeStandardNonce(uint248 accumulator) public pure returns (bytes memory encodedNonce) {
        return abi.encodePacked(uint8(NonceType.Standard), accumulator);
    }

    function encodeDimensionalNonce(
        uint120 queue,
        uint128 accumulator
    )
        public
        pure
        returns (bytes memory encodedNonce)
    {
        return abi.encodePacked(uint8(NonceType.Dimensional), queue, accumulator);
    }

    function encodeTimeNonce(uint32 id, uint128 delta, uint88 count) public pure returns (bytes memory encodedNonce) {
        return abi.encodePacked(uint8(NonceType.Time), id, delta, count);
    }

    /* ===================================================================================== */
    /* Nonce Enforcers                                                                       */
    /* ===================================================================================== */

    function _nonceEnforcer(address account, bytes memory encodedNonce) internal {
        uint8 nonceType = uint8(encodedNonce[0]);
        if (nonceType == uint8(NonceType.Standard)) {
            _enforceStandardNonce(account, encodedNonce);
        } else if (nonceType == uint8(NonceType.Dimensional)) {
            _enforceDimensionalNonce(account, encodedNonce);
        } else if (nonceType == uint8(NonceType.Time)) {
            _enforceTimeNonce(account, encodedNonce);
        } else {
            revert("NonceManager:invalid-nonce-type");
        }
    }

    function _enforceStandardNonce(address account, bytes memory encodedNonce) internal {
        (, uint248 accumulator) = _decodeStandardNonce(encodedNonce);
        require(accumulator == standardNonce[account]++, "NonceManager:nonce-out-of-order");
    }

    function _enforceDimensionalNonce(address account, bytes memory encodedNonce) internal {
        (, uint120 queue, uint128 accumulator) = _decodeDimensionalNonce(encodedNonce);
        require(accumulator == (dimensionalNonce[account][queue]++), "NonceManager:nonce-out-of-order");
    }

    function _enforceTimeNonce(address account, bytes memory encodedNonce) internal {
        (, uint32 id, uint128 delta, uint88 count) = _decodeTimeNonce(encodedNonce);
        require(delta != 0, "NonceManager:must-use-delta");
        require(count != 0, "NonceManager:must-use-count");

        bytes32 timeNonceIdStorage = timeNonce[account][id];
        if (timeNonceIdStorage == 0) {
            timeNonce[account][id] = keccak256(abi.encodePacked(id, delta, count));
        } else {
            require(timeNonceIdStorage == keccak256(abi.encodePacked(id, delta, count)), "NonceManager:id-used");
        }
        TimeTracker memory timeTracker = timeTracking[account][id];
        require(timeTracker.delta + delta <= block.timestamp, "NonceManager:delta-not-reached");
        require(timeTracker.count + 1 <= count, "NonceManager:count-reached");
        timeTracking[account][id] = TimeTracker(uint128(block.timestamp), timeTracker.count + 1);
    }

    /* ===================================================================================== */
    /* Decoding                                                                              */
    /* ===================================================================================== */

    function _decodeStandardNonce(bytes memory encodedNonce)
        public
        pure
        returns (uint8 nonceType, uint248 accumulator)
    {
        require(encodedNonce.length == 32, "Invalid encodedNonce length");

        assembly {
            // Load the first byte to get the nonce type
            nonceType := shr(248, mload(add(encodedNonce, 0x20)))

            // Load the next 31 bytes to get the accumulator
            accumulator := shr(8, mload(add(encodedNonce, 0x21)))
        }

        // Validate the nonce type
        require(NonceType(nonceType) == NonceType.Standard, "Invalid nonce type");
    }

    function _decodeDimensionalNonce(bytes memory encodedNonce)
        public
        pure
        returns (uint8 nonceType, uint120 queue, uint128 accumulator)
    {
        require(encodedNonce.length == 32, "Invalid encodedNonce length");

        assembly {
            // Load the first byte to get the nonce type
            nonceType := shr(248, mload(add(encodedNonce, 0x20)))

            // Load the next 15 bytes to get the queue
            queue := shr(136, mload(add(encodedNonce, 0x21)))

            // Load the next 16 bytes to get the accumulator
            accumulator := shr(128, mload(add(encodedNonce, 0x30)))
        }

        // Validate the nonce type
        require(NonceType(nonceType) == NonceType.Dimensional, "Invalid nonce type");
    }

    function _decodeTimeNonce(bytes memory encodedNonce)
        public
        pure
        returns (uint8 nonceType, uint32 id, uint128 delta, uint88 count)
    {
        require(encodedNonce.length == 32, "Invalid encodedNonce length");

        assembly {
            // Load the first byte to get the nonce type
            nonceType := shr(248, mload(add(encodedNonce, 0x20)))

            // Load the next 4 bytes to get the id
            id := shr(224, mload(add(encodedNonce, 0x21)))

            // Load the next 16 bytes to get the delta
            delta := shr(128, mload(add(encodedNonce, 0x25)))

            // Load the next 11 bytes to get the count
            count := shr(168, mload(add(encodedNonce, 0x35)))
        }

        // Validate the nonce type
        require(NonceType(nonceType) == NonceType.Time, "Invalid nonce type");
    }
}
