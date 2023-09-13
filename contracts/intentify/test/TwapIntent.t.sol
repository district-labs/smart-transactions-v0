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


    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);
        _twapIntent = new TwapIntentHarness();
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

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


}