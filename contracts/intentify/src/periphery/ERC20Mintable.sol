// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { ERC20 } from "solady/tokens/ERC20.sol";

contract ERC20Mintable is ERC20 {
    string internal _name;
    string internal _symbol;
    uint8 internal _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address account, uint256 amount) external returns (bool) {
        _mint(account, amount);
        return true;
    }
}
