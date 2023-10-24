// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { EthTipIntent } from "../../src/intents/EthTipIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";
import { Counter } from "../mocks/Counter.sol";

contract EthTipIntentTest is SafeTestingUtils {
    EthTipIntent internal _ethTipIntent;

    function setUp() public virtual {
        initializeBase();
        initializeSafeBase();

        _ethTipIntent = new EthTipIntent(address(_intentifySafeModule));
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_EthTipIntent_Success() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_ethTipIntent),
            data: _ethTipIntent.encodeIntent(1e18)
        });
        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: address(0xdEAD), data: new bytes(0x00), instructions: bytes("") });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        vm.deal(address(_safeCreated), 1e18);
        _intentifySafeModule.execute(batchExecution);

        assert(address(0xdEAD).balance == 1e18);
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */
}
