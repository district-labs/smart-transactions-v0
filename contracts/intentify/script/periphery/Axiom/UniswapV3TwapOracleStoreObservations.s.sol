// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import { console2 } from "forge-std/console2.sol";
import { IAxiomV1Query } from "axiom-v1/contracts/interfaces/IAxiomV1Query.sol";
import { UniswapV3TwapOracle, AxiomResponseStruct } from "../../../src/periphery/Axiom/UniswapV3TwapOracle.sol";

contract LimitOrderIntentDeploy is Script {
    function getAxiomRespose(address uniV3PoolAddress) public pure returns (AxiomResponseStruct memory axiomResponse) {
        IAxiomV1Query.BlockResponse[] memory blockResponses;
        IAxiomV1Query.AccountResponse[] memory accountResponses;
        IAxiomV1Query.StorageResponse[] memory storageResponses = new IAxiomV1Query.StorageResponse[](1);

        storageResponses[0] = IAxiomV1Query.StorageResponse({
            blockNumber: 9_848_630,
            addr: uniV3PoolAddress,
            slot: 8,
            value: 452_312_848_583_266_388_405_929_743_242_968_174_120_889_316_368_109_357_035_745_887_406_725_532_816,
            leafIdx: 0,
            proof: [
                bytes32(0x0000000000000000000000000000000000000000000000000000000000000000),
                bytes32(0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5),
                bytes32(0xb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d30),
                bytes32(0x21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85),
                bytes32(0xe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a19344),
                bytes32(0x0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d)
            ]
        });

        axiomResponse = AxiomResponseStruct({
            keccakBlockResponse: bytes32(0x63b5c1a9c2e15db2cc440f14f4c3d2e458545f1a25d541a1d3eacabfdbff06ba),
            keccakAccountResponse: bytes32(0x51948aa07d71727d38277c028ab3d5624c318a3036038962a6291ed0c49b43b2),
            keccakStorageResponse: bytes32(0x0d4fb8f430b084f0ac182a4310619f563180c2124b8e3d363a9427ade4276b1f),
            blockResponses: blockResponses,
            accountResponses: accountResponses,
            storageResponses: storageResponses
        });
    }

    function run(address uniswapV3TwapOracleAddress, address uniV3PoolAddress) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UniswapV3TwapOracle uniswapV3TwapOracle = UniswapV3TwapOracle(uniswapV3TwapOracleAddress);

        AxiomResponseStruct memory axiomResponse = getAxiomRespose(uniV3PoolAddress);

        uniswapV3TwapOracle.storeObservations(axiomResponse);

        vm.stopBroadcast();
    }

    function getObservations() external {
        // UniswapV3TwapOracle uniswapV3TwapOracle = UniswapV3TwapOracle(uniswapV3TwapOracleAddress);
        bytes32 hash1 = keccak256(abi.encode(address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373), 9_798_709));
        bytes32 hash2 = keccak256(abi.encode(address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373), 9_802_115));
        bytes32 hash3 = keccak256(abi.encode(address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373), 9_759_424));
        bytes32 hash4 = keccak256(abi.encode(address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373), 9_844_237));
        bytes32 hash5 = keccak256(abi.encode(address(0x5c33044BdBbE55dAb3d526CE70F908aAF6990373), 9_845_193));

        console2.log("hashes:");
        console2.logBytes32(hash1);
        console2.logBytes32(hash2);
        console2.logBytes32(hash3);
        console2.logBytes32(hash4);
        console2.logBytes32(hash5);
    }
}
