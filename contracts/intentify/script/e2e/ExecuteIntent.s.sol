// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

// Forge Contracts
import { Script } from "forge-std/Script.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

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
import { TimestampIntent } from "../../src/intents/TimestampIntent.sol";
import { IntentifySafeModule } from "../../src/module/IntentifySafeModule.sol";
import { WalletFactory } from "../../src/WalletFactory.sol";

contract ExecuteIntent is Script, StdCheats {
    TimestampIntent _timestampIntent = new TimestampIntent();
    Hook EMPTY_HOOK = Hook({ target: address(0), data: bytes("") });

    // Deterministicaly deploted in TestnetDeploy.s.sol
    IntentifySafeModule internal _intentifySafeModule = IntentifySafeModule(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    address internal _safe = 0x930d7714a8D543b10F1BeFE2B80cE11c9B168160;

    // Anvil Account 1
    address DEPLOYER_PUBLIC = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 DEPLOYER_PRIVATE = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function run() external {
        vm.startBroadcast(DEPLOYER_PRIVATE);

        uint248 nonce = _intentifySafeModule.getStandardNonce(address(_safe));
        bytes memory nonceStandard = abi.encodePacked(uint8(0), nonce);

        // Tests if the current timestamp is in the range of the rangeSeconds
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safe),
            value: 0,
            target: address(_timestampIntent),
            data: _timestampIntent.encodeIntent(type(uint128).min, uint128(block.timestamp + 100))
        });

        IntentBatch memory intentBatch = IntentBatch({ root: address(_safe), nonce: nonceStandard, intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(DEPLOYER_PRIVATE, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);

        vm.stopBroadcast();
    }
}
