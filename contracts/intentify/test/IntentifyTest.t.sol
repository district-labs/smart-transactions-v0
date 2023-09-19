// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract IntentifyTest is PRBTest, StdCheats {
    Intentify internal _intentify;

    uint256 SIGNER = 0xA11CE;
    address internal signer;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _intentify = new Intentify(signer, "Intentify", "V0");
    }

    function test_IntentTypehash() external {
        bytes32 intent_typehash = _intentify.INTENT_TYPEHASH();
        assertEq(intent_typehash, 0x1c1c350c1957c79b9473515603344f03c9ca5681d0ec8463fa339cde96988bd7);
    }

    function test_DomainSeperator() external {
        bytes32 domain_seperator = _intentify.DOMAIN_SEPARATOR();
        assertEq(domain_seperator, 0x737b39765287d277b6f6fbd86b509967a9453f079390acb60bdc1b82049c1633);
    }

    function test_Execute() external {
        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({ root: address(this), target: address(0x00), data: bytes("") });

        IntentBatch memory intentBatch =
            IntentBatch({ nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);

        hooks[0] = Hook({ target: address(0x00), data: bytes("") });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    /* ===================================================================================== */
    /* Fork Tests                                                                            */
    /* ===================================================================================== */
}
