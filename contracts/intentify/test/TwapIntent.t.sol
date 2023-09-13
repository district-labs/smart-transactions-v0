// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { PRBTest } from "@prb/test/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import { DimensionalNonce, IntentExecution, Intent, IntentBatch, IntentBatchExecution, Signature, Hook, TypesAndDecoders } from "../src/TypesAndDecoders.sol";
import { Intentify } from "../src/Intentify.sol";
import { TwapIntent } from "../src/intents/TwapIntent.sol";

contract TwapIntentHarness is TwapIntent {
    function exposed_getTwapX96(address uniswapV3Pool, uint32 twapInterval) public view returns (uint256 priceX96) {
        return _getTwapX96(uniswapV3Pool, twapInterval);
    }
}

contract TwapIntentTest is PRBTest, StdCheats {
    Intentify internal _intentify;
    TwapIntentHarness internal _twapIntent;

    uint256 mainnetFork;
    uint256 MAINNET_FORK_BLOCK = 18_124_343;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    // DAI/ETH on Uniswap V3 Ethereum Mainnet
    address immutable UNISWAP_V3_POOL = 0x60594a405d53811d3BC4766596EFD80fd545A270;

    uint256 SIGNER = 0xA11CE;
    address internal signer;
    
    Signature EMPTY_SIGNATURE = Signature({
        r: bytes32(0x00),
        s: bytes32(0x00),
        v: uint8(0x00)
    });
    Hook EMPTY_HOOK = Hook({
        target: address(0x00),
        data: bytes("")
    });

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        // Instantiate the contract-under-test.
        signer = vm.addr(SIGNER);
        _intentify = new Intentify(signer, "Intentify", "V0");
        _twapIntent = new TwapIntentHarness();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_TwapIntent_Success() external {
        uint256 minPriceX96 = 49573475736131303867109800;
        uint256 maxPriceX96 = 49573475736131303867109810;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_twapIntent),
                data:  abi.encode(
                    UNISWAP_V3_POOL,
                    uint32(100),
                    minPriceX96,
                    maxPriceX96
                )
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

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    function test_getTwapX96_ZeroInterval_Success() external {
        uint256 priceX96 = _twapIntent.exposed_getTwapX96(UNISWAP_V3_POOL, 0);
        assertEq(priceX96, 49571501129800262641687087);
    }

    function test_getTwapX96_Interval_Success() external {
        uint256 priceX96 = _twapIntent.exposed_getTwapX96(UNISWAP_V3_POOL, 100);
        assertEq(priceX96, 49573475736131303867109805);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_TwapIntent_PriceTooLow() external {
        uint256 minPriceX96 = 49573475736131303867109806;
        uint256 maxPriceX96 = 49573475736131303867109810;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_twapIntent),
                data:  abi.encode(
                    UNISWAP_V3_POOL,
                    uint32(100),
                    minPriceX96,
                    maxPriceX96
                )
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

        vm.expectRevert(bytes("TwapIntent:low-price"));
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_TwapIntent_PriceTooHigh() external {
        uint256 minPriceX96 = 49573475736131303867109800;
        uint256 maxPriceX96 = 49573475736131303867109804;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(_intentify),
                target: address(_twapIntent),
                data:  abi.encode(
                    UNISWAP_V3_POOL,
                    uint32(100),
                    minPriceX96,
                    maxPriceX96
                )
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

        vm.expectRevert(bytes("TwapIntent:high-price"));
        _intentify.execute(batchExecution);
    }

    function test_RevertWhen_TwapIntent_InvalidRoot() external {
        uint256 minPriceX96 = 49573475736131303867109800;
        uint256 maxPriceX96 = 49573475736131303867109810;

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            exec: IntentExecution({
                root: address(0),
                target: address(_twapIntent),
                data:  abi.encode(
                    UNISWAP_V3_POOL,
                    uint32(100),
                    minPriceX96,
                    maxPriceX96
                )
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

        vm.expectRevert(bytes("TwapIntent:invalid-root"));
        _intentify.execute(batchExecution);
    }
}