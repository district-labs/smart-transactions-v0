// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.19 <0.9.0;

struct AssetInfo {
    uint8 offset;
    address asset;
    address priceFeed;
    uint64 scale;
    uint64 borrowCollateralFactor;
    uint64 liquidateCollateralFactor;
    uint64 liquidationFactor;
    uint128 supplyCap;
}

/**
 * @title Compound's Comet Ext Interface
 * @notice An efficient monolithic money market protocol
 * @author Compound
 */
abstract contract CometExtInterface {
    error BadAmount();
    error BadNonce();
    error BadSignatory();
    error InvalidValueS();
    error InvalidValueV();
    error SignatureExpired();

    function allow(address manager, bool isAllowed) external virtual;

    function collateralBalanceOf(address account, address asset) external view virtual returns (uint128);
    function baseTrackingAccrued(address account) external view virtual returns (uint64);

    function baseAccrualScale() external view virtual returns (uint64);
    function baseIndexScale() external view virtual returns (uint64);
    function factorScale() external view virtual returns (uint64);
    function priceScale() external view virtual returns (uint64);

    function maxAssets() external view virtual returns (uint8);

    function version() external view virtual returns (string memory);

    /**
     * ===== ERC20 interfaces =====
     * Does not include the following functions/events, which are defined in `CometMainInterface` instead:
     * - function decimals() virtual external view returns (uint8)
     * - function totalSupply() virtual external view returns (uint256)
     * - function transfer(address dst, uint amount) virtual external returns (bool)
     * - function transferFrom(address src, address dst, uint amount) virtual external returns (bool)
     * - function balanceOf(address owner) virtual external view returns (uint256)
     * - event Transfer(address indexed from, address indexed to, uint256 amount)
     */
    function name() external view virtual returns (string memory);
    function symbol() external view virtual returns (string memory);

    /**
     * @notice Approve `spender` to transfer up to `amount` from `src`
     * @dev This will overwrite the approval amount for `spender`
     *  and is subject to issues noted [here](https://eips.ethereum.org/EIPS/eip-20#approve)
     * @param spender The address of the account which may transfer tokens
     * @param amount The number of tokens that are approved (-1 means infinite)
     * @return Whether or not the approval succeeded
     */
    function approve(address spender, uint256 amount) external virtual returns (bool);

    /**
     * @notice Get the current allowance from `owner` for `spender`
     * @param owner The address of the account which owns the tokens to be spent
     * @param spender The address of the account which may transfer tokens
     * @return The number of tokens allowed to be spent (-1 means infinite)
     */
    function allowance(address owner, address spender) external view virtual returns (uint256);

    event Approval(address indexed owner, address indexed spender, uint256 amount);
}

abstract contract IComet is CometExtInterface {
    error Absurd();
    error AlreadyInitialized();
    error BadAsset();
    error BadDecimals();
    error BadDiscount();
    error BadMinimum();
    error BadPrice();
    error BorrowTooSmall();
    error BorrowCFTooLarge();
    error InsufficientReserves();
    error LiquidateCFTooLarge();
    error NoSelfTransfer();
    error NotCollateralized();
    error NotForSale();
    error NotLiquidatable();
    error Paused();
    error SupplyCapExceeded();
    error TimestampTooLarge();
    error TooManyAssets();
    error TooMuchSlippage();
    error TransferInFailed();
    error TransferOutFailed();
    error Unauthorized();

    event Supply(address indexed from, address indexed dst, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Withdraw(address indexed src, address indexed to, uint256 amount);

    event SupplyCollateral(address indexed from, address indexed dst, address indexed asset, uint256 amount);
    event TransferCollateral(address indexed from, address indexed to, address indexed asset, uint256 amount);
    event WithdrawCollateral(address indexed src, address indexed to, address indexed asset, uint256 amount);

    /// @notice Event emitted when a borrow position is absorbed by the protocol
    event AbsorbDebt(address indexed absorber, address indexed borrower, uint256 basePaidOut, uint256 usdValue);

    /// @notice Event emitted when a user's collateral is absorbed by the protocol
    event AbsorbCollateral(
        address indexed absorber,
        address indexed borrower,
        address indexed asset,
        uint256 collateralAbsorbed,
        uint256 usdValue
    );

    /// @notice Event emitted when a collateral asset is purchased from the protocol
    event BuyCollateral(address indexed buyer, address indexed asset, uint256 baseAmount, uint256 collateralAmount);

    /// @notice Event emitted when an action is paused/unpaused
    event PauseAction(bool supplyPaused, bool transferPaused, bool withdrawPaused, bool absorbPaused, bool buyPaused);

    /// @notice Event emitted when reserves are withdrawn by the governor
    event WithdrawReserves(address indexed to, uint256 amount);

    function supply(address asset, uint256 amount) external virtual;
    function supplyTo(address dst, address asset, uint256 amount) external virtual;
    function supplyFrom(address from, address dst, address asset, uint256 amount) external virtual;

    function transfer(address dst, uint256 amount) external virtual returns (bool);
    function transferFrom(address src, address dst, uint256 amount) external virtual returns (bool);

    function transferAsset(address dst, address asset, uint256 amount) external virtual;
    function transferAssetFrom(address src, address dst, address asset, uint256 amount) external virtual;

    function withdraw(address asset, uint256 amount) external virtual;
    function withdrawTo(address to, address asset, uint256 amount) external virtual;
    function withdrawFrom(address src, address to, address asset, uint256 amount) external virtual;

    function approveThis(address manager, address asset, uint256 amount) external virtual;
    function withdrawReserves(address to, uint256 amount) external virtual;

    function absorb(address absorber, address[] calldata accounts) external virtual;
    function buyCollateral(address asset, uint256 minAmount, uint256 baseAmount, address recipient) external virtual;
    function quoteCollateral(address asset, uint256 baseAmount) public view virtual returns (uint256);

    function getAssetInfo(uint8 i) public view virtual returns (AssetInfo memory);
    function getAssetInfoByAddress(address asset) public view virtual returns (AssetInfo memory);
    function getCollateralReserves(address asset) public view virtual returns (uint256);
    function getReserves() public view virtual returns (int256);
    function getPrice(address priceFeed) public view virtual returns (uint256);

    function isBorrowCollateralized(address account) public view virtual returns (bool);
    function isLiquidatable(address account) public view virtual returns (bool);

    function totalSupply() external view virtual returns (uint256);
    function totalBorrow() external view virtual returns (uint256);
    function balanceOf(address owner) public view virtual returns (uint256);
    function borrowBalanceOf(address account) public view virtual returns (uint256);

    function pause(
        bool supplyPaused,
        bool transferPaused,
        bool withdrawPaused,
        bool absorbPaused,
        bool buyPaused
    )
        external
        virtual;
    function isSupplyPaused() public view virtual returns (bool);
    function isTransferPaused() public view virtual returns (bool);
    function isWithdrawPaused() public view virtual returns (bool);
    function isAbsorbPaused() public view virtual returns (bool);
    function isBuyPaused() public view virtual returns (bool);

    function accrueAccount(address account) external virtual;
    function getSupplyRate(uint256 utilization) public view virtual returns (uint64);
    function getBorrowRate(uint256 utilization) public view virtual returns (uint64);
    function getUtilization() public view virtual returns (uint256);

    function governor() external view virtual returns (address);
    function pauseGuardian() external view virtual returns (address);
    function baseToken() external view virtual returns (address);
    function baseTokenPriceFeed() external view virtual returns (address);
    function extensionDelegate() external view virtual returns (address);

    /// @dev uint64
    function supplyKink() external view virtual returns (uint256);
    /// @dev uint64
    function supplyPerSecondInterestRateSlopeLow() external view virtual returns (uint256);
    /// @dev uint64
    function supplyPerSecondInterestRateSlopeHigh() external view virtual returns (uint256);
    /// @dev uint64
    function supplyPerSecondInterestRateBase() external view virtual returns (uint256);
    /// @dev uint64
    function borrowKink() external view virtual returns (uint256);
    /// @dev uint64
    function borrowPerSecondInterestRateSlopeLow() external view virtual returns (uint256);
    /// @dev uint64
    function borrowPerSecondInterestRateSlopeHigh() external view virtual returns (uint256);
    /// @dev uint64
    function borrowPerSecondInterestRateBase() external view virtual returns (uint256);
    /// @dev uint64
    function storeFrontPriceFactor() external view virtual returns (uint256);

    /// @dev uint64
    function baseScale() external view virtual returns (uint256);
    /// @dev uint64
    function trackingIndexScale() external view virtual returns (uint256);

    /// @dev uint64
    function baseTrackingSupplySpeed() external view virtual returns (uint256);
    /// @dev uint64
    function baseTrackingBorrowSpeed() external view virtual returns (uint256);
    /// @dev uint104
    function baseMinForRewards() external view virtual returns (uint256);
    /// @dev uint104
    function baseBorrowMin() external view virtual returns (uint256);
    /// @dev uint104
    function targetReserves() external view virtual returns (uint256);

    function numAssets() external view virtual returns (uint8);
    function decimals() external view virtual returns (uint8);

    function initializeStorage() external virtual;
}
