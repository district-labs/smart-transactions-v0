// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    INTENT_TYPEHASH,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";

import { BaseTest } from "../utils/Base.t.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract IntentifyTest is BaseTest {
    Intentify internal _intentify;

    function setUp() public virtual {
        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "0");
    }

    function test_DomainSeperator() external {
        bytes32 domain_seperator = _intentify.DOMAIN_SEPARATOR();
        assertEq(domain_seperator, 0x809b25f02493594dd8d2db02357af214c2038f891013d2006211fc9e290daf39);
    }

    function test_Execute() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({ root: address(this), target: address(0x00), data: bytes("") });

        IntentBatch memory intentBatch = IntentBatch({ nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);

        hooks[0] = Hook({ target: address(0x00), data: bytes("Hello World") });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }
}
