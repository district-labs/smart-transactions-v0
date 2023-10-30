// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <0.9.0;

interface IPot {
    // Auth functions
    function rely(address guy) external;
    function deny(address guy) external;

    // Administration functions
    function file(bytes32 what, uint256 data) external;
    function file(bytes32 what, address addr) external;
    function cage() external;

    // Savings Rate Accumulation functions
    function drip() external returns (uint256 tmp);

    // Savings Dai Management functions
    function join(uint256 wad) external;
    function exit(uint256 wad) external;

    // Public variables
    function wards(address) external view returns (uint256);
    function pie(address) external view returns (uint256);
    function Pie() external view returns (uint256);
    function dsr() external view returns (uint256);
    function chi() external view returns (uint256);
    function vat() external view returns (address);
    function vow() external view returns (address);
    function rho() external view returns (uint256);
    function live() external view returns (uint256);
}

interface VatLike {
    function move(address, address, uint256) external;
    function suck(address, address, uint256) external;
}
