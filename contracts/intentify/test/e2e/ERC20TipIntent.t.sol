// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20Mintable } from "../../src/periphery/ERC20Mintable.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { ERC20TipIntent } from "../../src/intents/ERC20TipIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";
import { Counter } from "../mocks/Counter.sol";

contract EthTipIntentTest is SafeTestingUtils {
    ERC20TipIntent internal _erc20TipIntent;
    ERC20Mintable internal _erc20Token;


    function setUp() public virtual {
        initializeBase();
        initializeSafeBase();

        _erc20TipIntent = new ERC20TipIntent(address(_intentifySafeModule));
        _erc20Token = new ERC20Mintable("Test", "TEST", 18);
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_EthTipIntent_Success() external {
        uint256 tipAmount = 1000e18;
        address hookTarget = address(0xdEAD);

        // Ensure the safe has enough tokens to tip.
        _erc20Token.mint(address(_safeCreated), tipAmount);

        Intent[] memory intents = new Intent[](1);

        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_erc20TipIntent),
            data: _erc20TipIntent.encodeIntent(address(_erc20Token), tipAmount)
        });
        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({ target: hookTarget, data: new bytes(0x00) });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        vm.deal(address(_safeCreated), tipAmount);

        uint256 initialTokenBalance = _erc20Token.balanceOf(hookTarget);

        _intentifySafeModule.execute(batchExecution);

        assertEq(_erc20Token.balanceOf(hookTarget), initialTokenBalance + tipAmount);
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */
}
