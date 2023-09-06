// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

struct DimensionalNonce {
    uint128 queue;
    uint128 accumulator;
}

struct Intent {
    bool hooking;    // prevent running hooks on this intent. critical for enforcing final intent outcomes.
    address target;
    bytes terms;
}

struct IntentBatch {
    address root; 
    DimensionalNonce nonce;
    Intent[] intents;
}

struct Hooks {
    bytes pre;
    bytes post;
}

struct IntentBatchExecution {
    IntentBatch batch;
    bool[] map;     // executes hooks for an intent. if TRUE the intent `hooking` must also be TRUE.
    Hooks[] hooks;
}