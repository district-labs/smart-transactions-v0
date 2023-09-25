// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { EngineHub } from "../../src/periphery/EngineHub.sol";
import { ERC20Mintable } from "../../src/periphery/ERC20Mintable.sol";
import { console2 } from "forge-std/console2.sol";
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
        bytes[] memory data = new bytes[](1);
        address[] memory targets = new address[](1);
        targets[0] = address(_token);
        data[0] = abi.encodeWithSignature("mint(address,uint256)", address(this), amount);

        _engineHub.multiCall(targets, data);
        assertEq(_token.balanceOf(address(this)), amount);
    }

    function test_multiCall_MultipleParams_Success() external {
        uint256 amount1 = 100;
        uint256 amount2 = 200;
        bytes[] memory data = new bytes[](2);
        address[] memory targets = new address[](2);

        targets[0] = address(_token);
        data[0] = abi.encodeWithSignature("mint(address,uint256)", address(this), amount1);

        targets[1] = address(_token);
        data[1] = abi.encodeWithSignature("mint(address,uint256)", address(this), amount2);

        _engineHub.multiCall(targets, data);
        assertEq(_token.balanceOf(address(this)), amount1 + amount2);
    }

    /* ===================================================================================== */
    /* Failing                                                                               */
    /* ===================================================================================== */

    function test_RevertWhen_FailingCall() external {
        uint256 amount = 100;
        bytes[] memory data = new bytes[](2);
        address[] memory targets = new address[](2);

        targets[0] = address(_token);
        data[0] = abi.encodeWithSignature("mint(address,uint256)", address(this), amount);

        targets[1] = address(_token);
        data[1] =
            abi.encodeWithSignature("transfer(address,address,uint256)", address(this), address(_engineHub), amount);

        // Revert if the second call fails due to the lack of balance or allowance
        vm.expectRevert("EngineHub:call-failed");
        _engineHub.multiCall(targets, data);
    }

    function test_RevertWhen_notOwner() external {
        uint256 amount = 100;
        bytes[] memory data = new bytes[](1);
        address[] memory targets = new address[](1);
        targets[0] = address(_token);
        data[0] = abi.encodeWithSignature("mint(address,uint256)", address(this), amount);

        vm.startPrank(signer);
        vm.expectRevert("EngineHub:not-owner");
        _engineHub.multiCall(targets, data);
        vm.stopPrank();
    }
}
