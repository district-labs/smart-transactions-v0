// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { ERC20Mintable } from "../mocks/ERC20Mintable.sol";

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";
import { SwapRouter } from "../../src/periphery/SwapRouter.sol";
import { TokenRouterReleaseIntent } from "../../src/intents/TokenRouterReleaseIntent.sol";
import { TokenRouterReleaseIntent } from "../../src/intents/TokenRouterReleaseIntent.sol";

import { BaseTest } from "../utils/Base.t.sol";

contract TokenRouterReleaseIntentTest is BaseTest {
    Intentify internal _intentify;
    TokenRouterReleaseIntent internal _tokenRouterRelease;
    ERC20Mintable internal _tokenA;

    uint256 startingBalance = 1000;

    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    event Release(address indexed account, address indexed token, uint256 amount);

    function setUp() public virtual {
        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _tokenRouterRelease = new TokenRouterReleaseIntent();
        _tokenA = new ERC20Mintable();
    }

    function setupBalanceAndApprovals(
        address account,
        address token,
        uint256 amount,
        address approvalTarget
    )
        internal
    {
        ERC20Mintable(token).mint(account, amount);
        vm.prank(account);
        ERC20Mintable(token).approve(approvalTarget, amount);
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_TokenRouterReleaseIntent_Success() external {
        setupBalanceAndApprovals(address(_intentify), address(_tokenA), startingBalance, address(_tokenRouterRelease));

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            target: address(_tokenRouterRelease),
            data: _tokenRouterRelease.encode(address(_tokenA), startingBalance)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectEmit(true, true, false, true);
        emit Release(address(_intentify), address(_tokenA), startingBalance);
        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);

        uint256 preBalanceTokenA = _tokenA.balanceOf(signer);
        assertEq(preBalanceTokenA, 0);

        bool _claimed = _tokenRouterRelease.claim(address(_intentify), signer, address(_tokenA), startingBalance);
        assertEq(true, _claimed);

        uint256 postBalanceTokenA = _tokenA.balanceOf(signer);
        assertEq(postBalanceTokenA, startingBalance);
    }

    function test_encode_Success() external {
        bytes memory data = _tokenRouterRelease.encode(address(_tokenA), startingBalance);
        assertEq(data, abi.encode(address(_tokenA), startingBalance));
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_InvalidRoot() external {
        setupBalanceAndApprovals(address(_intentify), address(_tokenA), startingBalance, address(_tokenRouterRelease));

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(0),
            target: address(_tokenRouterRelease),
            data: _tokenRouterRelease.encode(address(_tokenA), startingBalance)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectRevert(bytes("TokenRouterReleaseIntent:invalid-root"));
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_InsufficientBalance() external {
        setupBalanceAndApprovals(address(_intentify), address(_tokenA), startingBalance, address(_tokenRouterRelease));

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            target: address(_tokenRouterRelease),
            data: _tokenRouterRelease.encode(address(_tokenA), startingBalance)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        vm.expectEmit(true, true, false, true);
        emit Release(address(_intentify), address(_tokenA), startingBalance);
        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);

        vm.expectRevert(bytes("TokenRouter:insufficient-balance"));
        _tokenRouterRelease.claim(address(_intentify), signer, address(_tokenA), 2 * startingBalance);
    }
}
