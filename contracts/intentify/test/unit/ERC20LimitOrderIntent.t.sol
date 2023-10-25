// // SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.8.19 <0.9.0;

// import { ERC20Mintable } from "../mocks/ERC20Mintable.sol";
// import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
// import { SwapRouter } from "../../src/periphery/SwapRouter.sol";
// import { ERC20LimitOrderIntent } from "../../src/intents/ERC20LimitOrderIntent.sol";
// import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

// contract ERC20LimitOrderIntentHarness is ERC20LimitOrderIntent {
//     constructor(address _intentifySafeModule) ERC20LimitOrderIntent(_intentifySafeModule) { }

//     function exposed_unlock(
//         Intent calldata intent,
//         Hook calldata hook,
//         uint256 initialTokenInBalance
//     )
//         external
//         returns (bool)
//     {
//         return _unlock(intent, hook, initialTokenInBalance);
//     }

//     function exposed_hook(Hook calldata hook) external returns (bool success) {
//         return _hook(hook);
//     }
// }

// contract ERC20LimitOrderIntentTest is SafeTestingUtils {
//     ERC20LimitOrderIntent internal _erc20LimitOrderIntent;
//     ERC20Mintable internal _tokenA;
//     ERC20Mintable internal _tokenB;

//     SwapRouter internal _swapRouter;

//     uint256 startingBalance = 1000;
//     uint256 endingBalance = 2000;

//     function setUp() public virtual {
//         initializeBase();
//         initializeSafeBase();

// _erc20LimitOrderIntent = new ERC20LimitOrderIntentHarness(address(_intentifySafeModule));
// _tokenA = new ERC20Mintable();
// _tokenB = new ERC20Mintable();

//         _swapRouter = new SwapRouter();
//     }

//     function setupBalance(address account, address token, uint256 amount) internal {
//         ERC20Mintable(token).mint(account, amount);
//     }

//     /* ===================================================================================== */
//     /* Success                                                                               */
//     /* ===================================================================================== */

// function test_ERC20LimitOrderIntent_Success() external {
//     address executor = address(0x1234);

//         setupBalance(address(_safeCreated), address(_tokenA), startingBalance);

//         Intent[] memory intents = new Intent[](1);

// intents[0] = Intent({
//     root: address(_safeCreated),
//     value: 0,
//     target: address(_erc20LimitOrderIntent),
//     data: _erc20LimitOrderIntent.encodeIntent(address(_tokenA), address(_tokenB), startingBalance, endingBalance)
// });

//         IntentBatch memory intentBatch =
//             IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

//         bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

//         Hook[] memory hooks = new Hook[](1);

// bytes memory hookData = abi.encodeWithSignature(
//     "swap(address,address,uint256)", address(_safeCreated), address(_tokenB), endingBalance
// );
// bytes memory hookInstructions = _erc20LimitOrderIntent.encodeHookInstructions(executor);

// hooks[0] = Hook({ target: address(_swapRouter), data: hookData, instructions: hookInstructions });

//         IntentBatchExecution memory batchExecution =
//             IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

//         _intentifySafeModule.execute(batchExecution);

//         uint256 balanceTokenA = _tokenA.balanceOf(address(_safeCreated));
//         uint256 balanceTokenB = _tokenB.balanceOf(address(_safeCreated));
//         assertEq(balanceTokenA, 0);
//         assertEq(balanceTokenB, endingBalance);
//     }

// function test_encode_Success() external {
//     bytes memory encodeData =
//         _erc20LimitOrderIntent.encodeIntent(address(_tokenA), address(_tokenB), startingBalance, endingBalance);
//     assertEq(encodeData, abi.encode(address(_tokenA), address(_tokenB), startingBalance, endingBalance));
// }

//     /* ===================================================================================== */
//     /* Failing                                                                               */
//     /* ===================================================================================== */

// function test_RevertWhen_ERC20LimitOrderIntent_InsufficientTokenBalancePostHook() external {
//     address executor = address(0x1234);

//         setupBalance(address(_safeCreated), address(_tokenA), startingBalance);

//         Intent[] memory intents = new Intent[](1);

// intents[0] = Intent({
//     root: address(_safeCreated),
//     value: 0,
//     target: address(_erc20LimitOrderIntent),
//     data: _erc20LimitOrderIntent.encodeIntent(address(_tokenA), address(_tokenB), startingBalance, endingBalance)
// });

//         IntentBatch memory intentBatch =
//             IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

//         bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

//         Hook[] memory hooks = new Hook[](1);

// bytes memory hookData = abi.encodeWithSignature(
//     "swap(address,address,uint256)",
//     address(_safeCreated),
//     address(_tokenB),
//     endingBalance / 2 // Send half of the tokens expected, so the intent should revert
// );
// bytes memory hookInstructions = _erc20LimitOrderIntent.encodeHookInstructions(executor);

// hooks[0] = Hook({ target: address(_swapRouter), data: hookData, instructions: hookInstructions });

//         IntentBatchExecution memory batchExecution =
//             IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

//         vm.expectRevert(
//             abi.encodeWithSignature("InsufficientInputAmount(uint256,uint256)", endingBalance / 2, endingBalance)
//         );
//         _intentifySafeModule.execute(batchExecution);
//     }
// }
