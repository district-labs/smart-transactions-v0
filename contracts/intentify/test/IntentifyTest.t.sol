// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import {
    DimensionalNonce,
    IntentExecution,
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

        intents[0] = Intent({
            exec: IntentExecution({ root: address(this), target: address(0x00), data: bytes("Hello World") }),
            signature: Signature({ r: bytes32(0x00), s: bytes32(0x00), v: uint8(0x00) })
        });

        IntentBatch memory intentBatch =
            IntentBatch({ nonce: DimensionalNonce({ queue: 0, accumulator: 1 }), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);

        hooks[0] = Hook({ target: address(0x00), data: bytes("Hello World") });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    // function test_Example() external {
    //     console2.log("Hello World");
    // }

    /* ===================================================================================== */
    /* Fork Tests                                                                            */
    /* ===================================================================================== */

    /// @dev Fork test that runs against an Ethereum Mainnet fork. For this to work, you need to set `API_KEY_ALCHEMY`
    /// in your environment You can get an API key for free at https://alchemy.com.
    function testFork_Example() external {
        // Silently pass this test if there is no API key.
        string memory alchemyApiKey = vm.envOr("API_KEY_ALCHEMY", string(""));
        if (bytes(alchemyApiKey).length == 0) {
            return;
        }

        // Otherwise, run the test against the mainnet fork.
        vm.createSelectFork({ urlOrAlias: "mainnet", blockNumber: 16_428_000 });
        address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        address holder = 0x7713974908Be4BEd47172370115e8b1219F4A5f0;
        uint256 actualBalance = IERC20(usdc).balanceOf(holder);
        uint256 expectedBalance = 196_307_713.810457e6;
        console2.log(actualBalance);
        assertEq(actualBalance, expectedBalance);
    }
}
