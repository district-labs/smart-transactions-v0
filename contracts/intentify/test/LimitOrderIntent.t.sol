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
import { LimitOrderIntent } from "../src/intents/LimitOrderIntent.sol";

contract LimitOrderIntentTest is PRBTest, StdCheats {
    Intentify internal _intentify;
    TokenRouterReleaseIntent internal _tokenRouterReleaseIntent;
    LimitOrderIntent internal _limitOrderIntent;
    ERC20Mintable internal _tokenA;
    ERC20Mintable internal _tokenB;

    SwapRouter internal _swapRouter;

    address internal signer;
    address internal executor;
    
    uint256 SIGNER = 0xA11CE;
    uint256 EXECUTOR = 0x0B0B1E;

    uint256 startingBalance = 1000;
    uint256 endingBalance = 2000;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        signer = vm.addr(SIGNER);
        executor = vm.addr(EXECUTOR);
        _intentify = new Intentify(signer, "Intentify", "V0");
        _tokenRouterReleaseIntent = new TokenRouterReleaseIntent();
        _limitOrderIntent = new LimitOrderIntent();
        
        _tokenA = new ERC20Mintable();
        _tokenB = new ERC20Mintable();
        
        _swapRouter = new SwapRouter();

    }

    function setupBalanceAndApprovals(address account, address token, uint256 amount, address approvalTarget) internal {
        ERC20Mintable(token).mint(account, amount);
        vm.prank(account);
        ERC20Mintable(token).approve(approvalTarget, amount);
    }

    function test_LimitOrderIntent_Success() external {      
        setupBalanceAndApprovals(address(_intentify), address(_tokenA), startingBalance, address(_tokenRouterReleaseIntent));

        Intent[] memory intents = new Intent[](2);

        // ------------------------------------------------------
        // Token Release Intent
        // ------------------------------------------------------
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_tokenRouterReleaseIntent),
                data:  abi.encode(_tokenA, startingBalance)
            }),
            signature: Signature({
                r: bytes32(0x00),
                s: bytes32(0x00),
                v: uint8(0x00)
            })
        });

        // ------------------------------------------------------
        // Limit Order Intent
        // ------------------------------------------------------

        IntentExecution memory _limitOrderIntentExecution = IntentExecution({
            root: address(_intentify),
            target: address(_limitOrderIntent),
            data: abi.encode(_tokenA, _tokenB, startingBalance, endingBalance)
        });

        bytes32 _limitOrderIntentDigest = _intentify.getIntentExecutionTypedDataHash(_limitOrderIntentExecution);
        (uint8 v_loi, bytes32 r_loi, bytes32 s_loi) = vm.sign(SIGNER, _limitOrderIntentDigest);

        intents[1] = Intent({
            exec: _limitOrderIntentExecution,
            signature: Signature({
                r: r_loi,
                s: s_loi,
                v: v_loi
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

        // ------------------------------------------------------
        // Hooks
        // ------------------------------------------------------

        Hook[] memory hooks = new Hook[](2);
        hooks[0] = Hook({
            target: address(0x00),
            data: bytes("Hello World")
        });
        hooks[1] = Hook({
            target: address(_swapRouter),
            // function swap(address account, address mevBot, address tokenOut, address tokenIn, uint256 amountOutMax, uint256 amountInMin) external returns (bool) {
            data: abi.encodeWithSignature("swap(address,address,address,uint256,uint256,address)", address(_intentify), address(_tokenA), address(_tokenB), startingBalance, endingBalance, _tokenRouterReleaseIntent)
        });

        // ------------------------------------------------------
        // Intent Batch Execution
        // ------------------------------------------------------

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

        uint256 balanceTokenA = _tokenA.balanceOf(address(_intentify));
        uint256 balanceTokenB = _tokenB.balanceOf(address(_intentify));
        assertEq(balanceTokenA, 0);
        assertEq(balanceTokenB, endingBalance);
    }

}
