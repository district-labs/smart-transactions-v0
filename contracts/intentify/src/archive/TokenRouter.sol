// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

// import{ ERC20 } from "solady/tokens/ERC20.sol";
// import { Intent } from './TypesAndDecoders.sol';

// import {
//     IntentBatch,
//     TypesAndDecoders
// } from "./TypesAndDecoders.sol";

// contract TokenRouter is TypesAndDecoders {
//     mapping (address => mapping (address => uint256)) public till;

//     function execute(Intent calldata intent) external (return bool) {
//         require(msg.sender == intent.exec.root, "TokenRouter:invalid-target");
//         (address token, uint256 amount) = abi.decode(intent.exec.data, (address, uint256));
//         till[intent.exec.root][token] += amount;
//     }

//     function claim(address from, address to, address token, uint256 amount) external {
//         require(till[from][token] >= amount, "TokenRouter:insufficient-balance");
//         till[from][token] -= amount;
//         ERC20(token).transferFrom(from, to, amount);
//     }
// }