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

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _intentify = new Intentify(signer, "Intentify", "V0");
        _tokenRouterRelease = new TokenRouterReleaseIntent();
        _tokenA = new ERC20Mintable();

    }

    function balanceAndApprovals(address token, address account, uint256 amount, address approvalTarget) internal {
        ERC20Mintable(token).mint(address(this), amount*2);
        ERC20Mintable(token).approve(approvalTarget, amount*2);
    }

    function test_TokenRouterReleaseIntent_Success() external {      
        balanceAndApprovals(address(_tokenA), signer, startingBalance, address(_tokenRouterRelease));

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_tokenRouterRelease),
                data:  abi.encode(_tokenA, startingBalance)
            }),
            signature: Signature({
                r: bytes32(0x00),
                s: bytes32(0x00),
                v: uint8(0x00)
            })
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
        hooks[0] = Hook({
            target: address(0x00),
            data: bytes("Hello World")
        });

        IntentBatchExecution memory batchExecution = IntentBatchExecution({
            batch: intentBatch,
            signature: Signature({
                r: r,
                s: s,
                v: v
            }),
            hooks: hooks
        });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

}
