// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/StdCheats.sol";
import { IPool } from "@aave/v3-core/interfaces/IPool.sol";
import { Enum } from "safe-contracts/common/Enum.sol";

import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { AaveLeverageLongIntent } from "../../src/intents/AaveLeverageLongIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";
import { FundMainnetAccounts } from "../utils/FundMainnetAccounts.sol";
import { Counter } from "../mocks/Counter.sol";

contract SimulateFlashLoan is FundMainnetAccounts {
    function simulateFlashLoanETH(address account, uint256 amount) external {
        fundWETH(account, amount);
    }

    function simulateFlashLoanUSDC(address account, uint256 amount) external {
        fundUSDC(account, amount);
    }

    function simulateFlashLoanDAI(address account, uint256 amount) external {
        fundDAI(account, amount);
    }
}

contract AaveLeverageLongIntentTest is SafeTestingUtils {
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC_ETH_PRICE_FEED = 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4;
    address public constant DAI_ETH_PRICE_FEED = 0x773616E4d11A78F511299002da57A0a94577F1f4;
    address public constant AAVE_POOL = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address public constant SWAP_ROUTER = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;

    AaveLeverageLongIntent internal _aaveLeverageLongIntent;
    SimulateFlashLoan internal _simulateFlashloan;
    IPool internal _pool = IPool(AAVE_POOL);

    uint256 mainnetFork;
    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    uint256 MAINNET_FORK_BLOCK = 18_124_343;

    function setUp() public virtual {
        // Mainnet Fork
        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        vm.selectFork(mainnetFork);
        vm.rollFork(MAINNET_FORK_BLOCK);

        initializeBase();
        initializeSafeBase();

        _simulateFlashloan = new SimulateFlashLoan();
        _aaveLeverageLongIntent = new AaveLeverageLongIntent(address(_intentifySafeModule), AAVE_POOL);

        vm.prank(vm.envOr("WHALE_USDC", 0x28C6c06298d514Db089934071355E5743bf21d60));
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */

    /**
     * @notice This test is to simulate a flashloan of 1 ETH and then use that ETH to borrow USDC
     */
    function test_AaveLeverageLongIntent_USDC_ETH_Success() external {
        uint256 INITIAL_DEPOSIT = 1e18;
        _simulateFlashloan.fundWETH(address(_safeCreated), INITIAL_DEPOSIT);
        _initialAaveSupplyTransaction(WETH, INITIAL_DEPOSIT, AAVE_POOL);

        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(0, USDC_ETH_PRICE_FEED, WETH, USDC, 2, 1.2e18, 3000)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx = abi.encodeWithSelector(
            SimulateFlashLoan.simulateFlashLoanETH.selector, address(_aaveLeverageLongIntent), 1e18
        );
        bytes memory leverageHookData = _aaveLeverageLongIntent.encodeHook(1e18, 1_652_000_000, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        _intentifySafeModule.execute(batchExecution);

        (,,,,, uint256 healthFactor) = _pool.getUserAccountData(address(_safeCreated));
        assert(healthFactor == 1_606_015_562_015_790_245);
    }

    /**
     * @notice This test is to simulate a flashloan of 1000 USDC and then use that USDC to borrow ETH
     */
    function test_AaveLeverageLongIntent_ETH_USDC_Success() external {
        uint256 INITIAL_DEPOSIT = 1000e6;
        _simulateFlashloan.fundUSDC(address(_safeCreated), INITIAL_DEPOSIT);
        _initialAaveSupplyTransaction(USDC, INITIAL_DEPOSIT, AAVE_POOL);

        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(1, USDC_ETH_PRICE_FEED, USDC, WETH, 2, 1.2e18, 3000)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx = abi.encodeWithSelector(
            SimulateFlashLoan.simulateFlashLoanUSDC.selector, address(_aaveLeverageLongIntent), 1_604_000_000
        );
        bytes memory leverageHookData =
            _aaveLeverageLongIntent.encodeHook(1_604_000_000, 1_029_839_463_407_237_934, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        _intentifySafeModule.execute(batchExecution);

        (,,,,, uint256 healthFactor) = _pool.getUserAccountData(address(_safeCreated));
        assert(healthFactor == 1_265_638_661_563_111_203);
    }

    /**
     * @notice This test is to simulate a flashloan of 1 ETH and then use that ETH to borrow DAI
     */
    function test_AaveLeverageLongIntent_DAI_ETH_Success() external {
        uint256 INITIAL_DEPOSIT = 1e18;
        _simulateFlashloan.fundWETH(address(_safeCreated), INITIAL_DEPOSIT);
        _initialAaveSupplyTransaction(WETH, INITIAL_DEPOSIT, AAVE_POOL);

        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(0, DAI_ETH_PRICE_FEED, WETH, DAI, 2, 1.2e18, 3000)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx = abi.encodeWithSelector(
            SimulateFlashLoan.simulateFlashLoanETH.selector, address(_aaveLeverageLongIntent), 1e18
        );
        bytes memory leverageHookData =
            _aaveLeverageLongIntent.encodeHook(1e18, 1_638_000_000_000_000_000_000, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        _intentifySafeModule.execute(batchExecution);

        (,,,,, uint256 healthFactor) = _pool.getUserAccountData(address(_safeCreated));
        assert(healthFactor == 1_620_105_567_656_887_789);
    }

    function test_AaveLeverageLongIntent_ETH_DAI_Success() external {
        uint256 INITIAL_DEPOSIT = 1000e18;
        _simulateFlashloan.fundDAI(address(_safeCreated), INITIAL_DEPOSIT);
        _initialAaveSupplyTransaction(DAI, INITIAL_DEPOSIT, AAVE_POOL);

        // Create Hook
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_aaveLeverageLongIntent),
            data: _aaveLeverageLongIntent.encode(1, DAI_ETH_PRICE_FEED, DAI, WETH, 2, 1.2e18, 3000)
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch));
        Hook[] memory hooks = new Hook[](1);

        bytes memory flashloanTx = abi.encodeWithSelector(
            SimulateFlashLoan.simulateFlashLoanDAI.selector,
            address(_aaveLeverageLongIntent),
            1_590_000_000_000_000_000_000
        );
        bytes memory leverageHookData =
            _aaveLeverageLongIntent.encodeHook(1_590_000_000_000_000_000_000, 1_029_516_630_395_914_811, flashloanTx);

        hooks[0] = Hook({ target: address(_simulateFlashloan), data: leverageHookData });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });
        _intentifySafeModule.execute(batchExecution);

        (,,,,, uint256 healthFactor) = _pool.getUserAccountData(address(_safeCreated));
        console2.log("Health Factor: %s", healthFactor);
        assert(healthFactor == 1_258_946_459_298_217_358);
    }

    /* ===================================================================================== */
    /* Helpers                                                                               */
    /* ===================================================================================== */

    function _initialAaveSupplyTransaction(address asset, uint256 amount, address pool) internal {
        {
            bytes memory txdata = abi.encodeWithSignature("approve(address,uint256)", pool, amount);
            uint256 nonce = _safeCreated.nonce();
            bytes32 executedata = _safeCreated.getTransactionHash(
                address(asset), 0, txdata, Enum.Operation.Call, 0, 0, 0, address(0), address(0), nonce
            );
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, executedata);
            bytes memory signature = _combineRSV(r, s, v);

            _safeCreated.execTransaction(
                address(asset),
                0,
                txdata,
                Enum.Operation.Call, // operation
                0,
                0,
                0,
                address(0),
                payable(address(0)),
                signature
            );
        }

        {
            bytes memory txdata = abi.encodeWithSignature(
                "deposit(address,uint256,address,uint16)", asset, amount, address(_safeCreated), 0
            );
            uint256 nonce = _safeCreated.nonce();
            bytes32 executedata = _safeCreated.getTransactionHash(
                address(pool), 0, txdata, Enum.Operation.Call, 0, 0, 0, address(0), address(0), nonce
            );
            (uint8 vv, bytes32 rr, bytes32 ss) = vm.sign(SIGNER, executedata);
            bytes memory signature = _combineRSV(rr, ss, vv);

            _safeCreated.execTransaction(
                address(pool),
                0,
                txdata,
                Enum.Operation.Call, // operation
                0,
                0,
                0,
                address(0),
                payable(address(0)),
                signature
            );
        }
    }
}
