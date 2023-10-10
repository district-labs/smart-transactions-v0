// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { IAxiomV1Query } from "axiom-v1/contracts/interfaces/IAxiomV1Query.sol";
import { Oracle } from "@uniswap/v3-core/contracts/libraries/Oracle.sol";

import { UniswapV3TwapOracle, AxiomResponseStruct } from "../../../src/periphery/Axiom/UniswapV3TwapOracle.sol";
import { BaseTest } from "../../utils/Base.t.sol";

contract UniswapV3TwapOracleHarness is UniswapV3TwapOracle {
    constructor(address _axiomV1QueryAddress) UniswapV3TwapOracle(_axiomV1QueryAddress) { }

    function exposed_validateData(AxiomResponseStruct calldata axiomResponse) public view {
        _validateData(axiomResponse);
    }

    function exposed_unpackObservation(uint256 observation) public pure returns (Oracle.Observation memory) {
        return _unpackObservation(observation);
    }

    function exposed_getObservations(
        address poolAddress,
        uint256 startBlockNumber,
        uint256 endBlockNumber
    )
        public
        view
        returns (Oracle.Observation memory, Oracle.Observation memory)
    {
        return _getObservations(poolAddress, startBlockNumber, endBlockNumber);
    }

    function exposed_calculateTwaTickLiquidity(
        Oracle.Observation memory startObservation,
        Oracle.Observation memory endObservation
    )
        public
        pure
        returns (int24 twaTick, uint160 twaLiquidity)
    {
        return _calculateTwaTickLiquidity(startObservation, endObservation);
    }
}

contract UniswapV3TwapOracleTest is BaseTest {
    event ObservationStored(address indexed pool, uint256 blockNumber);

    UniswapV3TwapOracleHarness internal _uniswapV3TwapOracle;
    address public constant UNI_V3_POOL_ADDRESS = 0x5c33044BdBbE55dAb3d526CE70F908aAF6990373;
    address public constant AXIOM_V1_QUERY_GOERLI_ADDR = 0x4Fb202140c5319106F15706b1A69E441c9536306;

    AxiomResponseStruct internal _axiomResponse;

    uint256 internal goerliFork;
    uint256 GOERLI_FORK_BLOCK = 9_843_492;
    string GOERLI_RPC_URL = vm.envString("GOERLI_RPC_URL");

    function setUp() public virtual {
        goerliFork = vm.createFork(GOERLI_RPC_URL);
        vm.selectFork(goerliFork);
        vm.rollFork(GOERLI_FORK_BLOCK);

        initializeBase();
        _uniswapV3TwapOracle = new UniswapV3TwapOracleHarness(AXIOM_V1_QUERY_GOERLI_ADDR);
    }

    function getAxiomRespose() public pure returns (AxiomResponseStruct memory axiomResponse) {
        IAxiomV1Query.BlockResponse[] memory blockResponses;
        IAxiomV1Query.AccountResponse[] memory accountResponses;
        IAxiomV1Query.StorageResponse[] memory storageResponses = new IAxiomV1Query.StorageResponse[](2);

        storageResponses[0] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_798_709,
            addr: UNI_V3_POOL_ADDRESS,
            slot: 8,
            value: 452_312_848_583_266_388_393_004_091_316_455_592_718_743_602_750_844_626_884_460_571_921_802_281_080,
            leafIdx: 0,
            proof: [
                bytes32(0x547e8631cbb7cd9dd3731e7920416634153c84e120564cb71f42c94db155bc81),
                bytes32(0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5),
                bytes32(0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        storageResponses[1] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_802_115,
            addr: UNI_V3_POOL_ADDRESS,
            slot: 8,
            value: 452_312_848_583_266_388_405_929_743_242_968_174_120_889_316_368_109_357_035_745_887_406_725_532_816,
            leafIdx: 1,
            proof: [
                bytes32(0xac84314bee2bd96d844987feb43224f4fcef4881b5f0747a1167ac14caa2867b),
                bytes32(0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5),
                bytes32(0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        axiomResponse = AxiomResponseStruct({
            keccakBlockResponse: bytes32(0x88ff4802a72f005ed9f524a0d09ed10e4d3fa9c75bef1e3cc61ffe1f76452938),
            keccakAccountResponse: bytes32(0xf08dc7b7d6c2fe7436d94938e3ebe3e834061b5e59b814e6ebacd0f7a7d6ea8f),
            keccakStorageResponse: bytes32(0x1d401261f04d5b526c5c75b21b1da3ee14c59d1b06d3e219f17814f192424866),
            blockResponses: blockResponses,
            accountResponses: accountResponses,
            storageResponses: storageResponses
        });
    }

    // Proof is valid but it's reading the wrong slot (4 instead of 8)
    function getAxiomResposeWrongSlot() public pure returns (AxiomResponseStruct memory axiomResponse) {
        IAxiomV1Query.BlockResponse[] memory blockResponses;
        IAxiomV1Query.AccountResponse[] memory accountResponses;
        IAxiomV1Query.StorageResponse[] memory storageResponses = new IAxiomV1Query.StorageResponse[](2);

        storageResponses[0] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_798_709,
            addr: UNI_V3_POOL_ADDRESS,
            slot: 4,
            value: 425_692_773_283_842,
            leafIdx: 0,
            proof: [
                bytes32(0x3308d945d431a153f9c85e1b92ea4cc6d9e19ca2e76d63ad6a56150135b6f356),
                bytes32(0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5),
                bytes32(0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        storageResponses[1] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_802_115,
            addr: UNI_V3_POOL_ADDRESS,
            slot: 4,
            value: 425_692_773_283_842,
            leafIdx: 1,
            proof: [
                bytes32(0xbd4b6361ed362c25e7dcade9a9a4cea3d93d71f86a18dbdb203119012c6bfa8f),
                bytes32(0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5),
                bytes32(0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        axiomResponse = AxiomResponseStruct({
            keccakBlockResponse: bytes32(0x88ff4802a72f005ed9f524a0d09ed10e4d3fa9c75bef1e3cc61ffe1f76452938),
            keccakAccountResponse: bytes32(0xf08dc7b7d6c2fe7436d94938e3ebe3e834061b5e59b814e6ebacd0f7a7d6ea8f),
            keccakStorageResponse: bytes32(0x13ef2d396b27c8c112627151278667d581e9b3525d63399fe6044bd16a60cb3e),
            blockResponses: blockResponses,
            accountResponses: accountResponses,
            storageResponses: storageResponses
        });
    }

    // Proof is valid but it has no storage responses
    function getAxiomResposeEmptyStorageResponses() public pure returns (AxiomResponseStruct memory axiomResponse) {
        IAxiomV1Query.BlockResponse[] memory blockResponses;
        IAxiomV1Query.AccountResponse[] memory accountResponses;
        IAxiomV1Query.StorageResponse[] memory storageResponses;

        axiomResponse = AxiomResponseStruct({
            keccakBlockResponse: bytes32(0x88ff4802a72f005ed9f524a0d09ed10e4d3fa9c75bef1e3cc61ffe1f76452938),
            keccakAccountResponse: bytes32(0xf08dc7b7d6c2fe7436d94938e3ebe3e834061b5e59b814e6ebacd0f7a7d6ea8f),
            keccakStorageResponse: bytes32(0x13ef2d396b27c8c112627151278667d581e9b3525d63399fe6044bd16a60cb3e),
            blockResponses: blockResponses,
            accountResponses: accountResponses,
            storageResponses: storageResponses
        });
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_StoreObservations_Success() external {
        AxiomResponseStruct memory axiomResponse = getAxiomRespose();

        vm.expectEmit(true, false, false, true);
        emit ObservationStored(UNI_V3_POOL_ADDRESS, 9_798_709);
        vm.expectEmit(true, false, false, true);
        emit ObservationStored(UNI_V3_POOL_ADDRESS, 9_802_115);

        _uniswapV3TwapOracle.storeObservations(axiomResponse);

        (uint32 blockTimestamp, int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128, bool initialized) =
            _uniswapV3TwapOracle.observations(keccak256(abi.encode(UNI_V3_POOL_ADDRESS, 9_798_709)));

        assertEq(blockTimestamp, 1_696_284_792);
        assertEq(tickCumulative, 178_572_296_592);
        assertEq(secondsPerLiquidityCumulativeX128, 63_589_287_046_984_900_412_872_929_525);
        assertEq(initialized, true);
    }

    function test_GetTwap_Success() external {
        AxiomResponseStruct memory axiomResponse = getAxiomRespose();

        _uniswapV3TwapOracle.storeObservations(axiomResponse);

        (
            int56 twaTick,
            uint160 twaLiquidity,
            Oracle.Observation memory startObservation,
            Oracle.Observation memory endObservation
        ) = _uniswapV3TwapOracle.getUniswapV3TWAP(UNI_V3_POOL_ADDRESS, 9_798_709, 9_802_115);

        assertEq(twaTick, 202_269);
        assertEq(twaLiquidity, 425_692_773_283_842);
        assertEq(startObservation.blockTimestamp, 1_696_284_792);
        assertEq(endObservation.blockTimestamp, 1_696_337_040);
    }

    function test_ValidateData_Success() external view {
        AxiomResponseStruct memory axiomResponse = getAxiomRespose();
        _uniswapV3TwapOracle.exposed_validateData(axiomResponse);
    }

    function test_UnpackObservation_Succss() external {
        Oracle.Observation memory observation = _uniswapV3TwapOracle.exposed_unpackObservation(
            452_312_848_583_266_388_393_004_091_316_455_592_718_743_602_750_844_626_884_460_571_921_802_281_080
        );

        assertEq(observation.blockTimestamp, 1_696_284_792);
        assertEq(observation.tickCumulative, 178_572_296_592);
        assertEq(observation.secondsPerLiquidityCumulativeX128, 63_589_287_046_984_900_412_872_929_525);
        assertEq(observation.initialized, true);
    }

    function test_GetObservations_Success() external {
        AxiomResponseStruct memory axiomResponse = getAxiomRespose();

        _uniswapV3TwapOracle.storeObservations(axiomResponse);

        (Oracle.Observation memory startObservation, Oracle.Observation memory endObservation) =
            _uniswapV3TwapOracle.exposed_getObservations(UNI_V3_POOL_ADDRESS, 9_798_709, 9_802_115);

        assertEq(startObservation.blockTimestamp, 1_696_284_792);
        assertEq(endObservation.blockTimestamp, 1_696_337_040);
    }

    function test_CalculateTwaTickLiquidity_Success() external {
        Oracle.Observation memory startObservation = Oracle.Observation({
            blockTimestamp: 1_696_284_792,
            tickCumulative: 178_572_296_592,
            secondsPerLiquidityCumulativeX128: 63_589_287_046_984_900_412_872_929_525,
            initialized: true
        });

        Oracle.Observation memory endObservation = Oracle.Observation({
            blockTimestamp: 1_696_337_040,
            tickCumulative: 189_140_460_096,
            secondsPerLiquidityCumulativeX128: 105_354_320_946_281_382_213_822_565_334,
            initialized: true
        });

        (int24 twaTick, uint160 twaLiquidity) =
            _uniswapV3TwapOracle.exposed_calculateTwaTickLiquidity(startObservation, endObservation);

        assertEq(twaTick, 202_269);
        assertEq(twaLiquidity, 425_692_773_283_842);
    }

    /* ===================================================================================== */
    /* Failure                                                                               */
    /* ===================================================================================== */

    function test_StoreObservations_RevertWhen_InvalidProof() external {
        AxiomResponseStruct memory axiomResponse = getAxiomRespose();
        axiomResponse.keccakStorageResponse =
            bytes32(0x1d401261f04d5b526c5c75b21b1da3ee14c59d1b06d3e219f17814f192424867);

        vm.expectRevert("Invalid Proof");
        _uniswapV3TwapOracle.storeObservations(axiomResponse);
    }

    function test_StoreObservations_RevertWhen_InvalidStorage() external {
        AxiomResponseStruct memory axiomResponse = getAxiomResposeWrongSlot();

        vm.expectRevert("Invalid Slot");
        _uniswapV3TwapOracle.storeObservations(axiomResponse);
    }

    function test_GetTwap_RevertWhen_ObservationNotStored() external {
        vm.expectRevert("Observation Not Stored");
        _uniswapV3TwapOracle.getUniswapV3TWAP(UNI_V3_POOL_ADDRESS, 9_798_710, 9_802_116);
    }

    function test_ValidateData_RevertWhen_InvalidProof() external {
        AxiomResponseStruct memory axiomResponse = getAxiomRespose();
        axiomResponse.keccakStorageResponse =
            bytes32(0x1d401261f04d5b526c5c75b21b1da3ee14c59d1b06d3e219f17814f192424867);

        vm.expectRevert("Invalid Proof");
        _uniswapV3TwapOracle.exposed_validateData(axiomResponse);
    }

    function test_ValidateData_RevertWhen_EmptyStorageResponses() external {
        AxiomResponseStruct memory axiomResponse = getAxiomResposeEmptyStorageResponses();

        vm.expectRevert("No Storage Responses");
        _uniswapV3TwapOracle.exposed_validateData(axiomResponse);
    }

    function test_GetObservations_RevertWhen_ObservationNotStored() external {
        vm.expectRevert("Observation Not Stored");
        _uniswapV3TwapOracle.exposed_getObservations(UNI_V3_POOL_ADDRESS, 9_798_710, 9_802_116);
    }

    function test_CalculateTwaTickLiquidity_RevertWhen_InvalidObservationOrder() external {
        Oracle.Observation memory startObservation = Oracle.Observation({
            blockTimestamp: 1_696_337_040,
            tickCumulative: 178_572_296_592,
            secondsPerLiquidityCumulativeX128: 63_589_287_046_984_900_412_872_929_525,
            initialized: true
        });

        Oracle.Observation memory endObservation = Oracle.Observation({
            blockTimestamp: 1_696_284_792,
            tickCumulative: 189_140_460_096,
            secondsPerLiquidityCumulativeX128: 105_354_320_946_281_382_213_822_565_334,
            initialized: true
        });

        vm.expectRevert("Invalid Observation Order");
        _uniswapV3TwapOracle.exposed_calculateTwaTickLiquidity(startObservation, endObservation);
    }
}
