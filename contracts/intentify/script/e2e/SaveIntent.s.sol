// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

// Forge Contracts
import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {StdCheats} from "forge-std/StdCheats.sol";

import {Surl} from "surl/Surl.sol";

// Intentify Contracts
import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";

// Protocol Contracts
import {TimestampBeforeIntent} from "../../src/intents/TimestampBeforeIntent.sol";
import {IntentifySafeModule} from "../../src/module/IntentifySafeModule.sol";
import {WalletFactory} from "../../src/WalletFactory.sol";

contract SaveIntent is Script, StdCheats {
    using Surl for *;

    TimestampBeforeIntent _timestampBeforeIntent = new TimestampBeforeIntent();
    Hook EMPTY_HOOK = Hook({target: address(0), data: bytes("")});

    // Deterministicaly deploted in TestnetDeploy.s.sol
    IntentifySafeModule internal _intentifySafeModule = IntentifySafeModule(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    address internal _safe = 0x8EB74E3d253d479A4b3A354f71FB7dDC664c8929;

    // Anvil Account 1
    address DEPLOYER_PUBLIC = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 DEPLOYER_PRIVATE = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    struct DBIntentArg {
        string name;
        string argType;
        string value;
    }

    struct DBIntent {
        string intentId;
        address root;
        address target;
        uint256 value;
        bytes data;
        DBIntentArg[] intentArgs;
    }

    struct DBIntentBatch {
        string nonce;
        address root;
        string chainId;
        string intentBatchHash;
        bytes signature;
        DBIntent[] intents;
    }

    function run() external {
        vm.startBroadcast(DEPLOYER_PRIVATE);

        uint248 nonce = _intentifySafeModule.getStandardNonce(address(_safe));
        bytes memory nonceStandard = abi.encodePacked(uint8(0), nonce);

        // Tests if the current timestamp is in the range of the rangeSeconds
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safe),
            value: 0,
            target: address(_timestampBeforeIntent),
            data: _timestampBeforeIntent.encode(uint128(block.timestamp - 100))
        });

        IntentBatch memory intentBatch = IntentBatch({root: address(_safe), nonce: nonceStandard, intents: intents});

        bytes32 intentBatchHash = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(DEPLOYER_PRIVATE, intentBatchHash);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({batch: intentBatch, signature: Signature({r: r, s: s, v: v}), hooks: hooks});

        // Perform a post request with headers and JSON body
        save(nonceStandard, intentBatchHash, intentBatch, batchExecution);
        vm.stopBroadcast();
    }

    function save(
        bytes memory nonce,
        bytes32 intentBatchHash,
        IntentBatch memory intentBatch,
        IntentBatchExecution memory batchExecution
    ) internal {
        string[] memory headers = new string[](1);
        headers[0] = "Content-Type: application/json";
        string memory URL = "http://localhost:3000/api/intent-batch/create";

        DBIntentArg[] memory dbIntentArgs = new DBIntentArg[](1);
        dbIntentArgs[0] =
            DBIntentArg({name: "timestamp", argType: "uint128", value: uintToString(block.timestamp - 100)});

        DBIntent memory dbIntent = DBIntent({
            intentId: bytesToString(abi.encodePacked("TimestampBefore", "0")),
            root: batchExecution.batch.intents[0].root,
            target: batchExecution.batch.intents[0].target,
            value: batchExecution.batch.intents[0].value,
            data: batchExecution.batch.intents[0].data,
            intentArgs: dbIntentArgs
        });

        DBIntent[] memory dbIntents = new DBIntent[](1);
        dbIntents[0] = dbIntent;

        DBIntentBatch memory dbIntentBatch = DBIntentBatch({
            chainId: uintToString(block.chainid),
            nonce: bytesToString(nonce),
            root: intentBatch.root,
            intentBatchHash: bytesToString(abi.encodePacked(intentBatchHash)),
            signature: _combineRSV(batchExecution.signature.r, batchExecution.signature.s, batchExecution.signature.v),
            intents: dbIntents
        });
        console2.log(createDBIntentBatchString(dbIntentBatch));
        (, bytes memory response) =
            URL.post(string.concat("{\"intentBatch\":", createDBIntentBatchString(dbIntentBatch), "}"));
    }

    function createDBIntentBatchString(DBIntentBatch memory intentBatch) internal pure returns (string memory) {
        string memory intentBatchString = "{";
        intentBatchString = string.concat(intentBatchString, "\"chainId\": \"", intentBatch.chainId, "\",");
        intentBatchString =
            string.concat(intentBatchString, "\"intentBatchHash\": \"", intentBatch.intentBatchHash, "\",");
        intentBatchString =
            string.concat(intentBatchString, "\"signature\": \"", bytesToString(intentBatch.signature), "\",");
        intentBatchString = string.concat(intentBatchString, "\"root\": \"", addressToString(intentBatch.root), "\",");
        intentBatchString = string.concat(intentBatchString, "\"nonce\": \"", intentBatch.nonce, "\",");
        intentBatchString = string.concat(intentBatchString, "\"intents\": [");
        for (uint256 i = 0; i < intentBatch.intents.length; i++) {
            intentBatchString = string.concat(intentBatchString, createDBIntentString(intentBatch.intents[i]));
            if (i < intentBatch.intents.length - 1) {
                intentBatchString = string.concat(intentBatchString, ",");
            }
        }
        intentBatchString = string.concat(intentBatchString, "]}");

        return intentBatchString;
    }

    function createDBIntentString(DBIntent memory intent) internal pure returns (string memory) {
        string memory intentString = "{";
        intentString = string.concat(intentString, "\"intentId\": \"", intent.intentId, "\",");
        intentString = string.concat(intentString, "\"root\": \"", addressToString(intent.root), "\",");
        intentString = string.concat(intentString, "\"target\": \"", addressToString(intent.target), "\",");
        intentString = string.concat(intentString, "\"value\": \"", uintToString(intent.value), "\",");
        intentString = string.concat(intentString, "\"data\": \"", bytesToString(intent.data), "\",");
        intentString = string.concat(intentString, "\"intentArgs\": [");
        for (uint256 i = 0; i < intent.intentArgs.length; i++) {
            intentString = string.concat(intentString, createDBIntentArgString(intent.intentArgs[i]));
            if (i < intent.intentArgs.length - 1) {
                intentString = string.concat(intentString, ",");
            }
        }
        intentString = string.concat(intentString, "]");
        // Continue to concatenate other fields of Intent struct similarly
        intentString = string.concat(intentString, "}");
        return intentString;
    }

    function createDBIntentArgString(DBIntentArg memory intentArg) internal pure returns (string memory) {
        string memory intentArgString = "{";
        intentArgString = string.concat(intentArgString, "\"name\": \"", intentArg.name, "\",");
        intentArgString = string.concat(intentArgString, "\"type\": \"", intentArg.argType, "\",");
        intentArgString = string.concat(intentArgString, "\"value\": \"", intentArg.value, "\"");
        intentArgString = string.concat(intentArgString, "}");
        return intentArgString;
    }

    function addressToString(address _addr) public pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function bytesToString(bytes memory buffer) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(buffer.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < buffer.length; i++) {
            converted[i * 2] = _base[uint8(buffer[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(buffer[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }

    function uintToString(uint256 value) public pure returns (string memory) {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }

        return string(buffer);
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
