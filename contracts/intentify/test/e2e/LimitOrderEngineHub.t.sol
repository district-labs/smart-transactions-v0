// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { IERC20 } from "../../lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import { ERC20Mintable } from "../mocks/ERC20Mintable.sol";
import { Intentify } from "../../src/Intentify.sol";
import { EngineHub } from "../../src/periphery/EngineHub.sol";
import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { TokenRouterReleaseIntent } from "../../src/intents/TokenRouterReleaseIntent.sol";
import { LimitOrderIntent } from "../../src/intents/LimitOrderIntent.sol";
import { BaseTest } from "../utils/Base.t.sol";

contract LimitOrderIntentHarness is LimitOrderIntent {
    function exposed_unlock(address account, address tokenOut, address tokenIn) external view returns (bool) {
        return _unlock(account, tokenOut, tokenIn);
    }

    function exposed_hook(Hook calldata hook) external returns (bool success) {
        return _hook(hook);
    }

    function exposed_extractRevertReason(bytes memory revertData) external pure returns (string memory reason) {
        return _extractRevertReason(revertData);
    }
}

contract LimitOrderEngineHubTest is BaseTest {
    Intentify internal _intentify;
    TokenRouterReleaseIntent internal _tokenRouterReleaseIntent;
    LimitOrderIntentHarness internal _limitOrderIntent;
    EngineHub internal _engineHub;

    Signature internal EMPTY_SIGNATURE = Signature({ r: bytes32(0x00), s: bytes32(0x00), v: uint8(0x00) });
    Hook EMPTY_HOOK = Hook({ target: address(0x00), data: bytes("") });

    uint256 _goerliFork;
    uint256 immutable _goerliForkBlock = 9_763_755;
    string _goerliRpcUrl = vm.envString("GOERLI_RPC_URL");

    ERC20Mintable immutable _testUSDC = ERC20Mintable(0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB);
    ERC20Mintable immutable _testWETH = ERC20Mintable(0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739);
    uint24 public immutable poolFee = 3000;
    ISwapRouter immutable _swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        _goerliFork = vm.createFork(_goerliRpcUrl);
        vm.selectFork(_goerliFork);
        vm.rollFork(_goerliForkBlock);

        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _limitOrderIntent = new LimitOrderIntentHarness();
        _tokenRouterReleaseIntent = new TokenRouterReleaseIntent();
        _engineHub = new EngineHub(address(0x2e234DAe75C793f67A35089C9d99245E1C58470b));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_LimitOrderWithEngineHub_Success() external {
        // Place a limit order of 150 USDC for 0.11 WETH
        uint256 amountInMaximum = 0.11e18;
        uint256 amountOut = 150e6;
        address tokenIn = address(_testWETH);
        address tokenOut = address(_testUSDC);

        _testWETH.mint(address(_intentify), amountInMaximum);
        vm.prank(address(_intentify));
        _testWETH.approve(address(_tokenRouterReleaseIntent), amountInMaximum);

        Intent[] memory intents = new Intent[](2);

        // ------------------------------------------------------
        // Token Release Intent
        // ------------------------------------------------------
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_tokenRouterReleaseIntent),
            data: _tokenRouterReleaseIntent.encode(address(_testWETH), amountInMaximum)
        });

        // ------------------------------------------------------
        // Limit Order Intent
        // ------------------------------------------------------

        intents[1] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_limitOrderIntent),
            data: _limitOrderIntent.encode(address(_testWETH), address(_testUSDC), amountInMaximum, amountOut)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](2);
        hooks[0] = EMPTY_HOOK;

        // ------------------------------------------------------
        // Engine Hub Call
        // ------------------------------------------------------

        address[] memory engineHubTargets = new address[](3);
        bytes[] memory engineHubdata = new bytes[](3);

        // Claim the WETH from the TokenRouterReleaseIntent
        // The WETH is now transferred to the EngineHub
        engineHubTargets[0] = address(_tokenRouterReleaseIntent);
        engineHubdata[0] = abi.encodeWithSignature(
            "claim(address,address,address,uint256)",
            address(_intentify),
            address(_engineHub),
            address(_testWETH),
            amountInMaximum
        );

        // Approve the WETH from the EngineHub to the SwapRouter
        engineHubTargets[1] = address(_testWETH);
        engineHubdata[1] = abi.encodeWithSignature("approve(address,uint256)", address(_swapRouter), amountInMaximum);

        // Swap the WETH for USDC and transfer the USDC to the Intentify contract
        // The remaining WETH is kept in the EngineHub as a payment for the operation
        engineHubTargets[2] = address(_swapRouter);
        engineHubdata[2] = abi.encodeWithSignature(
            "exactOutputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: address(_intentify),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            })
        );

        // Encode the EngineHub multiCall in a single hook call
        hooks[1] = Hook({
            target: address(_engineHub),
            data: abi.encodeWithSignature("multiCall(address[],bytes[])", engineHubTargets, engineHubdata)
        });

        // ------------------------------------------------------
        // Intent Batch Execution
        // ------------------------------------------------------

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        console2.log("address(this) 2", address(this));

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);

        bool _unlocked = _limitOrderIntent.exposed_unlock(address(_intentify), address(_testWETH), address(_testUSDC));
        assertEq(true, _unlocked);
    }
}
