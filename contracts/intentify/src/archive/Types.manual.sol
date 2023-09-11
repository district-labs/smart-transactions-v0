// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

struct DimensionalNonce {
    uint128 queue;
    uint128 accumulator;
}

struct Signature {
    bytes32 r;
    bytes32 s;
    uint8 v;
}

struct Intent {
    address root;
    address target;
    bytes data;
    Signature signature;
}

struct IntentBatch {
    DimensionalNonce nonce;
    Intent[] intents;
}

struct Hook {
    address target;
    bytes data;
}

struct IntentBatchExecution {
    IntentBatch batch;
    Signature signature;
    Hook[] hooks;
}

struct EIP712Domain {
    string name;
    string version;
    uint256 chainId;
    address verifyingContract;
}