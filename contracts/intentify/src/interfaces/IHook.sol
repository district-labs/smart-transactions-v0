// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { Intent } from "../TypesAndDecoders.sol";

interface IHook {
    function execute(
        Intent calldata intent
    ) external returns (bool);
}
