// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import { ERC20Mintable } from "./mocks/ERC20Mintable.sol";

import { DimensionalNonce, IntentExecution, Intent, IntentBatch, IntentBatchExecution, Signature, Hook, TypesAndDecoders } from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";
import { SwapRouter } from "../src/periphery/SwapRouter.sol";
import { TokenRouterReleaseIntent } from "../src/intents/TokenRouterReleaseIntent.sol";
import { TokenRouterReleaseIntent } from "../src/intents/TokenRouterReleaseIntent.sol";

contract TokenRouterReleaseIntentTest is PRBTest, StdCheats {
    Intentify internal _intentify;
    TokenRouterReleaseIntent internal _tokenRouterRelease;
    ERC20Mintable internal _tokenA;

    address internal signer;
    uint256 SIGNER = 0xA11CE;
    uint256 startingBalance = 1000;

    Signature internal EMPTY_SIGNATURE = Signature({
                r: bytes32(0x00),
                s: bytes32(0x00),
                v: uint8(0x00)
            });
    Hook EMPTY_HOOK = Hook({
        target: address(0x00),
        data: bytes("")
    });

    event Release(address indexed account, address indexed token, uint256 amount);

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _intentify = new Intentify(signer, "Intentify", "V0");
        _tokenRouterRelease = new TokenRouterReleaseIntent();
        _tokenA = new ERC20Mintable();

    }

    function setupBalanceAndApprovals(address account, address token, uint256 amount, address approvalTarget) internal {
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
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_tokenRouterRelease),
                data:  abi.encode(_tokenA, startingBalance)
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

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

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_InvalidRoot() external {
        setupBalanceAndApprovals(address(_intentify), address(_tokenA), startingBalance, address(_tokenRouterRelease));

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(0),
                target: address(_tokenRouterRelease),
                data:  abi.encode(_tokenA, startingBalance)
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        vm.expectRevert(bytes("TokenRouterReleaseIntent:invalid-root"));
        _intentify.execute(batchExecution);
    }

      function test_RevertWhen_InsufficientBalance() external {
        setupBalanceAndApprovals(address(_intentify), address(_tokenA), startingBalance, address(_tokenRouterRelease));

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_tokenRouterRelease),
                data:  abi.encode(_tokenA, startingBalance)
            }),
            signature: EMPTY_SIGNATURE
        });

        IntentBatch memory intentBatch = IntentBatch({
            nonce: DimensionalNonce({
                queue: 0,
                accumulator: 1
            }),
            intents: intents
        });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        vm.expectEmit(true, true, false, true);
        emit Release(address(_intentify), address(_tokenA), startingBalance);
        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);

        vm.expectRevert(bytes("TokenRouter:insufficient-balance"));
       _tokenRouterRelease.claim(address(_intentify), signer, address(_tokenA), 2 * startingBalance);

    }
}
