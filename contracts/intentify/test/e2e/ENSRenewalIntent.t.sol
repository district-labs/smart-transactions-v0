// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { IETHRegistrarController, IPriceOracle } from "ens/ethregistrar/IETHRegistrarController.sol";
import { IBaseRegistrar } from "ens/ethregistrar/IBaseRegistrar.sol";
import { Intent, IntentBatch, IntentBatchExecution, Signature, Hook } from "../../src/TypesAndDecoders.sol";
import { ENSRenewalIntent } from "../../src/intents/ENSRenewalIntent.sol";
import { SafeTestingUtils } from "../utils/SafeTestingUtils.sol";

contract EnsRenewalIntentTest is SafeTestingUtils {
    ENSRenewalIntent internal _ensRenewalIntent;
    address constant ENS_REGISTRAR_CONTROLLER_ADDRESS = 0x253553366Da8546fC250F225fe3d25d0C782303b;
    IBaseRegistrar constant EnsBaseRegistrar = IBaseRegistrar(0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85);
    bytes32 private constant ETH_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

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

        _ensRenewalIntent = new ENSRenewalIntent(address(_intentifySafeModule), ENS_REGISTRAR_CONTROLLER_ADDRESS);
    }

    /* ===================================================================================== */
    /* Success Tests                                                                         */
    /* ===================================================================================== */
    function test_ENSRenewalIntent_Success() external {
        string memory name = "test";
        uint256 renewalDuration = 31_536_000; // 1 year
        uint256 initialNameExpiration = EnsBaseRegistrar.nameExpires(uint256(keccak256(bytes(name))));

        IPriceOracle.Price memory rentPrice =
            IETHRegistrarController(ENS_REGISTRAR_CONTROLLER_ADDRESS).rentPrice(name, renewalDuration);

        vm.deal(address(_safeCreated), 2 * rentPrice.base);

        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_safeCreated),
            value: 0,
            target: address(_ensRenewalIntent),
            data: _ensRenewalIntent.encodeIntent(name, renewalDuration)
        });
        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_safeCreated), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentifySafeModule.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = EMPTY_HOOK;

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        _intentifySafeModule.execute(batchExecution);

        uint256 finalNameExpiration = EnsBaseRegistrar.nameExpires(uint256(keccak256(bytes(name))));

        assertEq(finalNameExpiration, initialNameExpiration + renewalDuration);
    }

    /* ===================================================================================== */
    /* Failure Tests                                                                         */
    /* ===================================================================================== */
}
