// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { MultiCallWithFlashLoan, IERC20 } from "../../src/periphery/MultiCallWithFlashLoan.sol";

import { BaseTest } from "../utils/Base.t.sol";

contract BalancerV2FlashLoanTest is BaseTest {
    MultiCallWithFlashLoan internal _multicallWithFlashloan;

    // Balancer
    address public constant BALANCER_VAULT = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;

    // Tokens
    address public constant WBTC = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // Intentify
    address public constant SEARCHER = address(0x1234);

    uint256 mainnetFork;
    uint256 MAINNET_FORK_BLOCK = 18_124_343;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    function setUp() public virtual {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();

        _multicallWithFlashloan = new MultiCallWithFlashLoan(SEARCHER, BALANCER_VAULT);
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_BalancerV2FlashLoan_Success() external {
        vm.deal(address(_multicallWithFlashloan), 10e18);

        IERC20[] memory tokens = new IERC20[](3);
        tokens[0] = IERC20(WBTC);
        tokens[1] = IERC20(USDC);
        tokens[2] = IERC20(WETH);

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1e8;
        amounts[1] = 1e6;
        amounts[2] = 1e18;

        MultiCallWithFlashLoan.Call[] memory calls = new MultiCallWithFlashLoan.Call[](1);
        calls[0] = MultiCallWithFlashLoan.Call(address(0), 2e18, bytes("0x"));

        bytes memory multiCallData = abi.encode(calls);

        vm.prank(SEARCHER);
        _multicallWithFlashloan.flashLoan(tokens, amounts, multiCallData);
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */
}
