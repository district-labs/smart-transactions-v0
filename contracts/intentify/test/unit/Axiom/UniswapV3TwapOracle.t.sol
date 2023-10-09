// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { IAxiomV1Query } from "axiom-v1/contracts/interfaces/IAxiomV1Query.sol";
import { Oracle } from "@uniswap/v3-core/contracts/libraries/Oracle.sol";

import { UniswapV3TwapOracle, AxiomResponseStruct } from "../../../src/periphery/Axiom/UniswapV3TwapOracle.sol";
import { BaseTest } from "../../utils/Base.t.sol";

contract UniswapV3TwapOracleTest is BaseTest {
    UniswapV3TwapOracle internal _uniswapV3TwapOracle;
    address public constant AXIOM_V1_QUERY_GOERLI_ADDR = 0x4Fb202140c5319106F15706b1A69E441c9536306;

    uint256 internal goerliFork;
    uint256 GOERLI_FORK_BLOCK = 9_837_354;
    string GOERLI_RPC_URL = vm.envString("GOERLI_RPC_URL");

    function setUp() public virtual {
        goerliFork = vm.createFork(GOERLI_RPC_URL);
        vm.selectFork(goerliFork);
        vm.rollFork(GOERLI_FORK_BLOCK);

        initializeBase();
        _uniswapV3TwapOracle = new UniswapV3TwapOracle(AXIOM_V1_QUERY_GOERLI_ADDR);
    }

    /* ===================================================================================== */
    /* Success                                                                               */
    /* ===================================================================================== */

    function test_ValidData_Success() external {
        IAxiomV1Query.BlockResponse[] memory blockResponses;
        IAxiomV1Query.AccountResponse[] memory accountResponses;
        IAxiomV1Query.StorageResponse[] memory storageResponses = new IAxiomV1Query.StorageResponse[](2);

        storageResponses[0] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_798_709,
            addr: address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373),
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
            addr: address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373),
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

        (
            int56 twaTick,
            uint160 twaLiquidity,
            Oracle.Observation memory startObservation,
            Oracle.Observation memory endObservation
        ) = _uniswapV3TwapOracle.verifyUniswapV3TWAP(
            AxiomResponseStruct({
                keccakBlockResponse: bytes32(0x88ff4802a72f005ed9f524a0d09ed10e4d3fa9c75bef1e3cc61ffe1f76452938),
                keccakAccountResponse: bytes32(0xf08dc7b7d6c2fe7436d94938e3ebe3e834061b5e59b814e6ebacd0f7a7d6ea8f),
                keccakStorageResponse: bytes32(0x1d401261f04d5b526c5c75b21b1da3ee14c59d1b06d3e219f17814f192424866),
                blockResponses: blockResponses,
                accountResponses: accountResponses,
                storageResponses: storageResponses
            })
        );

        assertEq(twaTick, 202_269);
        assertEq(twaLiquidity, 425_692_773_283_842);
        assertEq(startObservation.blockTimestamp, 1_696_284_792);
        assertEq(endObservation.blockTimestamp, 1_696_337_040);
    }
}
