// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

// BEGIN EIP712 AUTOGENERATED SETUP
struct EIP712Domain {
    string name;
    string version;
    uint256 chainId;
    address verifyingContract;
}

bytes32 constant EIP712DOMAIN_TYPEHASH =
    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

struct DimensionalNonce {
    uint128 queue;
    uint128 accumulator;
}

bytes32 constant DIMENSIONALNONCE_TYPEHASH = keccak256("DimensionalNonce(uint128 queue,uint128 accumulator)");

struct Signature {
    bytes32 r;
    bytes32 s;
    uint8 v;
}

bytes32 constant SIGNATURE_TYPEHASH = keccak256("Signature(bytes32 r,bytes32 s,uint8 v)");

struct Intent {
    address root;
    address target;
    bytes data;
}

bytes32 constant INTENT_TYPEHASH = keccak256("Intent(address root,address target,bytes data)");

struct IntentBatch {
    address root;
    bytes nonce;
    Intent[] intents;
}

bytes32 constant INTENTBATCH_TYPEHASH =
    keccak256("IntentBatch(address root,bytes nonce,Intent[] intents)Intent(address root,address target,bytes data)");

struct Hook {
    address target;
    bytes data;
}

bytes32 constant HOOK_TYPEHASH = keccak256("Hook(address target,bytes data)");

struct IntentBatchExecution {
    IntentBatch batch;
    Signature signature;
    Hook[] hooks;
}

bytes32 constant INTENTBATCHEXECUTION_TYPEHASH = keccak256(
    "IntentBatchExecution(IntentBatch batch,Signature signature,Hook[] hooks)Hook(address target,bytes data)Intent(address root,address target,bytes data)IntentBatch(address root,bytes nonce,Intent[] intents)Signature(bytes32 r,bytes32 s,uint8 v)"
);

// END EIP712 AUTOGENERATED SETUP

contract TypesAndDecoders {
    // BEGIN EIP712 AUTOGENERATED BODY

    function GET_EIP712DOMAIN_PACKETHASH(EIP712Domain memory _input) public pure returns (bytes32) {
        bytes memory encoded =
            abi.encode(EIP712DOMAIN_TYPEHASH, _input.name, _input.version, _input.chainId, _input.verifyingContract);

        return keccak256(encoded);
    }

    function GET_DIMENSIONALNONCE_PACKETHASH(DimensionalNonce memory _input) public pure returns (bytes32) {
        bytes memory encoded = abi.encode(DIMENSIONALNONCE_TYPEHASH, _input.queue, _input.accumulator);

        return keccak256(encoded);
    }

    function GET_SIGNATURE_PACKETHASH(Signature memory _input) public pure returns (bytes32) {
        bytes memory encoded = abi.encode(SIGNATURE_TYPEHASH, _input.r, _input.s, _input.v);

        return keccak256(encoded);
    }

    function GET_INTENT_PACKETHASH(Intent memory _input) public pure returns (bytes32) {
        bytes memory encoded = abi.encode(INTENT_TYPEHASH, _input.root, _input.target, _input.data);

        return keccak256(encoded);
    }

    function GET_INTENTBATCH_PACKETHASH(IntentBatch memory _input) public pure returns (bytes32) {
        bytes memory encoded =
            abi.encode(INTENTBATCH_TYPEHASH, _input.root, _input.nonce, GET_INTENT_ARRAY_PACKETHASH(_input.intents));

        return keccak256(encoded);
    }

    function GET_INTENT_ARRAY_PACKETHASH(Intent[] memory _input) public pure returns (bytes32) {
        bytes memory encoded;
        for (uint256 i = 0; i < _input.length; i++) {
            encoded = bytes.concat(encoded, GET_INTENT_PACKETHASH(_input[i]));
        }

        bytes32 hash = keccak256(encoded);
        return hash;
    }

    function GET_HOOK_PACKETHASH(Hook memory _input) public pure returns (bytes32) {
        bytes memory encoded = abi.encode(HOOK_TYPEHASH, _input.target, _input.data);

        return keccak256(encoded);
    }

    function GET_INTENTBATCHEXECUTION_PACKETHASH(IntentBatchExecution memory _input) public pure returns (bytes32) {
        bytes memory encoded = abi.encode(
            INTENTBATCHEXECUTION_TYPEHASH,
            GET_INTENTBATCH_PACKETHASH(_input.batch),
            GET_SIGNATURE_PACKETHASH(_input.signature),
            GET_HOOK_ARRAY_PACKETHASH(_input.hooks)
        );

        return keccak256(encoded);
    }

    function GET_HOOK_ARRAY_PACKETHASH(Hook[] memory _input) public pure returns (bytes32) {
        bytes memory encoded;
        for (uint256 i = 0; i < _input.length; i++) {
            encoded = bytes.concat(encoded, GET_HOOK_PACKETHASH(_input[i]));
        }

        bytes32 hash = keccak256(encoded);
        return hash;
    }
    // END EIP712 AUTOGENERATED BODY
}
