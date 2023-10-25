// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { Intent, Hook } from "~/src/TypesAndDecoders.sol";
import { AaveLeverageLongIntent } from "~/src/intents/AaveLeverageLongIntent.sol";

contract AaveLeverageLongIntentHarness is AaveLeverageLongIntent {
    constructor(
        address _intentifySafeModule,
        address __chainlinkDataFeedBaseUSDRoundData,
        address __pool
    )
        AaveLeverageLongIntent(_intentifySafeModule, __chainlinkDataFeedBaseUSDRoundData, __pool)
    { }

    function exposed_checkFinalBalance(address account, address token, uint256 balanceStart) external view {
        return _checkFinalBalance(account, token, balanceStart);
    }

    function exposed_checkHealthFactor(address account, uint256 minHealthFactor) external view {
        return _checkHealthFactor(account, minHealthFactor);
    }

    function exposed_checkIntentAndHookData(
        address supplyAsset,
        address borrowAsset,
        uint32 fee,
        Hook calldata hook
    )
        external
        view
        returns (uint256 amountRepay)
    {
        return _checkIntentAndHookData(supplyAsset, borrowAsset, fee, hook);
    }

    function exposed_decodeHookInstructions(Hook calldata hook)
        external
        pure
        returns (uint256 supplyAmount, uint256 borrowAmount)
    {
        return _decodeHookInstructions(hook);
    }

    function exposed_decodeIntent(Intent calldata intent)
        external
        pure
        returns (
            address supplyAsset,
            address borrowAsset,
            uint256 interestRateMode,
            uint256 minHealthFactor,
            uint32 fee
        )
    {
        return _decodeIntent(intent);
    }

    function exposed_borrow(
        address borrowAsset,
        uint256 borrowAmount,
        uint256 interestRateMode,
        address root
    )
        external
    {
        return _borrow(borrowAsset, borrowAmount, interestRateMode, root);
    }

    function exposed_getDerivedPrice(address supplyAsset, address borrowAsset) external view returns (int256) {
        return _getDerivedPrice(supplyAsset, borrowAsset);
    }

    function exposed_hook(Hook calldata hook) external returns (bool success) {
        return _hook(hook);
    }

    function exposed_leverage(Intent calldata intent, Hook calldata hook) external {
        return _leverage(intent, hook);
    }

    function exposed_supply(address supplyAsset, uint256 supplyAmount, address root) external {
        return _supply(supplyAsset, supplyAmount, root);
    }

    function exposed_transferFromRoot(address token, address to, uint256 amount) external {
        return _transferFromRoot(token, to, amount);
    }
}
