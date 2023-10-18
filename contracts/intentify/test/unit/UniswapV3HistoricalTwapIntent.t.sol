// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import {
    Intent,
    IntentBatch,
    IntentBatchExecution,
    Signature,
    Hook,
    TypesAndDecoders
} from "../../src/TypesAndDecoders.sol";
import { Intentify } from "../../src/Intentify.sol";
import { UniswapV3HistoricalTwapIntent } from "../../src/intents/UniswapV3HistoricalTwapIntent.sol";
import { UniswapV3TwapOracle } from "../../src/periphery/Axiom/UniswapV3TwapOracle.sol";
import { AxiomResponseStruct } from "../../src/periphery/Axiom/AxiomStructs.sol";
import { IAxiomV1Query } from "axiom-v1/contracts/interfaces/IAxiomV1Query.sol";
import { BaseTest } from "../utils/Base.t.sol";

contract UniswapV3HistoricalTwapIntentHarness is UniswapV3HistoricalTwapIntent {
    constructor(address uniswapV3TwapOracle) UniswapV3HistoricalTwapIntent(uniswapV3TwapOracle) { }

    function exposed_checkBlockWindow(UniswapV3HistoricalTwapIntent.BlockData memory blockData) external view {
        _checkBlockWindow(blockData);
    }

    function exposed_checkBlocksRange(BlockData memory numerator, BlockData memory denominator) external view {
        _checkBlocksRange(numerator, denominator);
    }

    function exposed_checkPercentageDifference(bytes memory intentData, bytes memory hookData) external view {
        _checkPercentageDifference(intentData, hookData);
    }
}

contract UniswapV3HistoricalTwapIntentTest is BaseTest {
    Intentify internal _intentify;
    UniswapV3TwapOracle internal _uniswapV3TwapOracle;
    UniswapV3HistoricalTwapIntentHarness internal _uniswapV3HistoricalTwapIntentHarness;

    address public constant AXIOM_V1_QUERY_GOERLI_ADDR = 0x4Fb202140c5319106F15706b1A69E441c9536306;

    uint256 goerliFork;
    uint256 GOERLI_FORK_BLOCK = 9_886_260;
    string GOERLI_RPC_URL = vm.envString("GOERLI_RPC_URL");

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        goerliFork = vm.createFork(GOERLI_RPC_URL);
        vm.selectFork(goerliFork);
        vm.rollFork(GOERLI_FORK_BLOCK);

        initializeBase();
        _intentify = new Intentify(signer, "Intentify", "V0");
        _uniswapV3TwapOracle = new UniswapV3TwapOracle(AXIOM_V1_QUERY_GOERLI_ADDR);
        storeAxiomResposeToOracle();
        _uniswapV3HistoricalTwapIntentHarness = new UniswapV3HistoricalTwapIntentHarness(address(_uniswapV3TwapOracle));
    }

    function storeAxiomResposeToOracle() public returns (AxiomResponseStruct memory axiomResponse) {
        IAxiomV1Query.BlockResponse[] memory blockResponses;
        IAxiomV1Query.AccountResponse[] memory accountResponses;
        IAxiomV1Query.StorageResponse[] memory storageResponses = new IAxiomV1Query.StorageResponse[](5);

        storageResponses[0] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_759_424,
            addr: 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373,
            slot: 8,
            value: 452_312_848_583_266_388_378_915_906_719_041_379_119_147_357_761_481_643_994_996_978_731_940_190_260,
            leafIdx: 0,
            proof: [
                bytes32(0xac814f03757e06dff8346f74487b0c0d14d9a3b2818a0b1c19c15e2ebc4e8861),
                bytes32(0x0492f1d993523b8ed0f7e8b3254a5e0d72a6ff820ad0c7f84838ef9927b93354),
                bytes32(0x568e70fc4f50a803c41a81e5b7e533968fa14063228d45c68c21a666942ca783),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        storageResponses[1] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_798_609,
            addr: 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373,
            slot: 8,
            value: 452_312_848_583_266_388_392_425_197_856_264_974_121_265_785_995_014_838_802_374_969_261_343_586_132,
            leafIdx: 1,
            proof: [
                bytes32(0xb997dc9f66ba9666527c6afb7909f072961e5c5c327bee39fd96ece1caa38244),
                bytes32(0x0492f1d993523b8ed0f7e8b3254a5e0d72a6ff820ad0c7f84838ef9927b93354),
                bytes32(0x568e70fc4f50a803c41a81e5b7e533968fa14063228d45c68c21a666942ca783),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        storageResponses[2] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_798_709,
            addr: 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373,
            slot: 8,
            value: 452_312_848_583_266_388_393_004_091_316_455_592_718_743_602_750_844_626_884_460_571_921_802_281_080,
            leafIdx: 2,
            proof: [
                bytes32(0x397006d3432b23b360e0fc1146972ad357fc18ce218cb840cd48a43a4afca945),
                bytes32(0x969bab88d9c0a9606c3f8f1973b943fd70413c8e8f4679717016e42f1d999ea5),
                bytes32(0x568e70fc4f50a803c41a81e5b7e533968fa14063228d45c68c21a666942ca783),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        storageResponses[3] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_848_500,
            addr: 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373,
            slot: 8,
            value: 452_312_848_583_266_388_405_929_743_242_968_174_120_889_316_368_109_357_035_745_887_406_725_532_816,
            leafIdx: 3,
            proof: [
                bytes32(0xac84314bee2bd96d844987feb43224f4fcef4881b5f0747a1167ac14caa2867b),
                bytes32(0x969bab88d9c0a9606c3f8f1973b943fd70413c8e8f4679717016e42f1d999ea5),
                bytes32(0x568e70fc4f50a803c41a81e5b7e533968fa14063228d45c68c21a666942ca783),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        storageResponses[4] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_848_630,
            addr: 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373,
            slot: 8,
            value: 452_312_848_583_266_388_405_929_743_242_968_174_120_889_316_368_109_357_035_745_887_406_725_532_816,
            leafIdx: 4,
            proof: [
                bytes32(0x0000000000000000000000000000000000000000000000000000000000000000),
                bytes32(0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5),
                bytes32(0x14a4f5808d3e095581f90d96d5a173428dc31eca6868cea7c5459c55005ab145),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        axiomResponse = AxiomResponseStruct({
            keccakBlockResponse: bytes32(0x886dcdf9fabffe4c7fdeb11ef57ae8d2b0a145a3e49bb4129db7ffa1b47a87ed),
            keccakAccountResponse: bytes32(0x8c1f00bcc5ae3121b43a40f5ece2fe6598e80c6c65b3883c1dceba88e279d05f),
            keccakStorageResponse: bytes32(0x6e8ad7f1fc98a6d445fbe383ff7cc76fbff6365ff842336648f6ddee31eb3ca1),
            blockResponses: blockResponses,
            accountResponses: accountResponses,
            storageResponses: storageResponses
        });

        _uniswapV3TwapOracle.storeObservations(axiomResponse);
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_UniswapV3HistoricalTwapIntent_Success() external {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        Intent[] memory intents = new Intent[](1);
        intents[0] = Intent({
            root: address(_intentify),
            value: 0,
            target: address(_uniswapV3HistoricalTwapIntentHarness),
            data: _uniswapV3HistoricalTwapIntentHarness.encode(
                uniswapV3Pool, 37_590, 89_220, 40, 37_590, 49_950, 40, 105_000, 110_000
                )
        });

        IntentBatch memory intentBatch =
            IntentBatch({ root: address(_intentify), nonce: abi.encodePacked(uint256(0)), intents: intents });

        bytes32 digest = _intentify.getIntentBatchTypedDataHash(intentBatch);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER, digest);

        Hook[] memory hooks = new Hook[](1);
        hooks[0] = Hook({
            target: address(_uniswapV3HistoricalTwapIntentHarness),
            data: abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630)
        });

        IntentBatchExecution memory batchExecution =
            IntentBatchExecution({ batch: intentBatch, signature: Signature({ r: r, s: s, v: v }), hooks: hooks });

        bool _executed = _intentify.execute(batchExecution);
        assertEq(true, _executed);
    }

    function test_CheckBlockWindow_Success() external view {
        UniswapV3HistoricalTwapIntent.BlockData memory blockData = UniswapV3HistoricalTwapIntent.BlockData({
            referenceBlockOffset: 37_590,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_424,
            endBlock: 9_848_630
        });

        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlockWindow(blockData);
    }

    function test_CheckBlocksRange_Success() external view {
        UniswapV3HistoricalTwapIntent.BlockData memory numerator = UniswapV3HistoricalTwapIntent.BlockData({
            referenceBlockOffset: 37_590,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_424,
            endBlock: 9_848_630
        });

        UniswapV3HistoricalTwapIntent.BlockData memory denominator = UniswapV3HistoricalTwapIntent.BlockData({
            referenceBlockOffset: 37_590,
            blockWindow: 49_950,
            blockWindowTolerance: 40,
            startBlock: 9_798_709,
            endBlock: 9_848_630
        });

        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlocksRange(numerator, denominator);
    }

    function test_CheckPercentageDifference_Success() external view {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        bytes memory intentData = _uniswapV3HistoricalTwapIntentHarness.encode(
            uniswapV3Pool, 37_590, 89_220, 40, 37_590, 49_950, 40, 105_000, 110_000
        );
        bytes memory hookData = abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630);

        _uniswapV3HistoricalTwapIntentHarness.exposed_checkPercentageDifference(intentData, hookData);
    }

    // /* ===================================================================================== */
    // /* Failing                                                                               */
    // /* ===================================================================================== */

    function test_CheckBlockWindow_RevertWhen_OutOfTolerance() external {
        UniswapV3HistoricalTwapIntent.BlockData memory blockData = UniswapV3HistoricalTwapIntent.BlockData({
            referenceBlockOffset: 37_590,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_500,
            endBlock: 9_848_630
        });

        vm.expectRevert(
            abi.encodeWithSelector(UniswapV3HistoricalTwapIntent.InvalidStartBlockWindow.selector, blockData.startBlock)
        );
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlockWindow(blockData);

        blockData.startBlock = 9_759_424;
        blockData.endBlock = 9_848_500;

        vm.expectRevert(
            abi.encodeWithSelector(UniswapV3HistoricalTwapIntent.InvalidEndBlockWindow.selector, blockData.endBlock)
        );
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlockWindow(blockData);
    }

    function test_CheckBlocksRange_RevertWhen_InvalidWindow() external {
        UniswapV3HistoricalTwapIntent.BlockData memory numerator = UniswapV3HistoricalTwapIntent.BlockData({
            referenceBlockOffset: 37_590,
            blockWindow: 89_220,
            blockWindowTolerance: 40,
            startBlock: 9_759_400,
            endBlock: 9_848_630
        });

        UniswapV3HistoricalTwapIntent.BlockData memory denominator = UniswapV3HistoricalTwapIntent.BlockData({
            referenceBlockOffset: 37_590,
            blockWindow: 49_950,
            blockWindowTolerance: 40,
            startBlock: 9_798_709,
            endBlock: 9_848_630
        });

        vm.expectRevert(
            abi.encodeWithSelector(UniswapV3HistoricalTwapIntent.InvalidStartBlockWindow.selector, numerator.startBlock)
        );
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlocksRange(numerator, denominator);

        numerator.startBlock = 9_759_424;
        numerator.endBlock = 9_848_500;

        vm.expectRevert(
            abi.encodeWithSelector(UniswapV3HistoricalTwapIntent.InvalidEndBlockWindow.selector, numerator.endBlock)
        );
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlocksRange(numerator, denominator);

        numerator.endBlock = 9_848_630;
        denominator.startBlock = 9_798_609;

        vm.expectRevert(
            abi.encodeWithSelector(
                UniswapV3HistoricalTwapIntent.InvalidStartBlockWindow.selector, denominator.startBlock
            )
        );
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlocksRange(numerator, denominator);

        denominator.startBlock = 9_798_709;
        denominator.endBlock = 9_848_500;

        vm.expectRevert(
            abi.encodeWithSelector(UniswapV3HistoricalTwapIntent.InvalidEndBlockWindow.selector, denominator.endBlock)
        );
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkBlocksRange(numerator, denominator);
    }

    function test_CheckPercentageDifference_RevertWhen_OutOfRange() external {
        address uniswapV3Pool = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
        bytes memory intentDataHigh = _uniswapV3HistoricalTwapIntentHarness.encode(
            uniswapV3Pool, 37_590, 89_220, 40, 37_590, 49_950, 40, 105_000, 108_000
        );
        bytes memory intentDataLow = _uniswapV3HistoricalTwapIntentHarness.encode(
            uniswapV3Pool, 37_590, 89_220, 40, 37_590, 49_950, 40, 110_000, 115_000
        );
        bytes memory hookData = abi.encode(9_759_424, 9_848_630, 9_798_709, 9_848_630);

        vm.expectRevert(UniswapV3HistoricalTwapIntent.HighPercentageDifference.selector);
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkPercentageDifference(intentDataHigh, hookData);

        vm.expectRevert(UniswapV3HistoricalTwapIntent.LowPercentageDifference.selector);
        _uniswapV3HistoricalTwapIntentHarness.exposed_checkPercentageDifference(intentDataLow, hookData);
    }
}
