// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";
import { MeanAverageIntent } from "../../src/intents/MeanAverageIntent.sol";

import { BaseTest } from "../utils/Base.t.sol";

contract MeanAverageIntentTest is BaseTest {
    Intentify internal _intentify;
    MeanAverageIntent internal _meanAverageIntent;

    uint256 goerliFork;
    uint256 GOERLI_FORK_BLOCK = 9_848_670;
    string GOERLI_RPC_URL = vm.envString("GOERLI_RPC_URL");

    address UNISWAP_V3_TWAP_ORACLE = 0xA754f61Ba3A8da22BD186a542a151Fcd637Cd85c;
    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        goerliFork = vm.createFork(GOERLI_RPC_URL);
        vm.selectFork(goerliFork);
        vm.rollFork(GOERLI_FORK_BLOCK);

        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _meanAverageIntent = new MeanAverageIntent(UNISWAP_V3_TWAP_ORACLE);
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_MeanAverageIntent_Success() external {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_meanAverageIntent),
            data: _meanAverageIntent.encode(
                uniswapV3Pool, block.number, 89_220, 40, block.number, 49_950, 40, 105_000, 110_000
                )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] =
            Hook({ target: address(_meanAverageIntent), data: abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630) });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */
}
