// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { EngineHub } from "../../src/periphery/EngineHub.sol";
import { ERC20Mintable } from "../../src/periphery/ERC20Mintable.sol";
import { BaseTest } from "../utils/Base.t.sol";

contract EngineHubTest is BaseTest {
    EngineHub internal _engineHub;
    ERC20Mintable internal _token;

    function setUp() public virtual {
        initializeBase();
        _token = new ERC20Mintable("Token", "TOKEN", 18);
        _engineHub = new EngineHub(address(this));
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_multiCall_SingleParam_Success() external {
        uint256 amount = 100;

        EngineHub.Call[] memory calls = new EngineHub.Call[](1);
        calls[0] =
            EngineHub.Call(address(_token), abi.encodeWithSignature("mint(address,uint256)", address(this), amount));

        _engineHub.multiCall(calls);
        assertEq(_token.balanceOf(address(this)), amount);
    }

    function test_multiCall_MultipleParams_Success() external {
        uint256 amount1 = 100;
        uint256 amount2 = 200;

        EngineHub.Call[] memory calls = new EngineHub.Call[](2);
        calls[0] =
            EngineHub.Call(address(_token), abi.encodeWithSignature("mint(address,uint256)", address(this), amount1));
        calls[1] =
            EngineHub.Call(address(_token), abi.encodeWithSignature("mint(address,uint256)", address(this), amount2));

        _engineHub.multiCall(calls);
        assertEq(_token.balanceOf(address(this)), amount1 + amount2);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_FailingCall() external {
        uint256 amount = 100;

        EngineHub.Call[] memory calls = new EngineHub.Call[](2);
        calls[0] =
            EngineHub.Call(address(_token), abi.encodeWithSignature("mint(address,uint256)", address(this), amount));
        calls[1] = EngineHub.Call(
            address(_token),
            abi.encodeWithSignature("transfer(address,address,uint256)", address(this), address(_engineHub), amount)
        );

        vm.expectRevert("EngineHub:call-failed");
        _engineHub.multiCall(calls);
    }

    function test_RevertWhen_notOwner() external {
        uint256 amount = 100;

        EngineHub.Call[] memory calls = new EngineHub.Call[](1);
        calls[0] =
            EngineHub.Call(address(_token), abi.encodeWithSignature("mint(address,uint256)", address(this), amount));

        vm.startPrank(signer);
        vm.expectRevert(Ownable.Unauthorized.selector);
        _engineHub.multiCall(calls);
        vm.stopPrank();
    }
}
