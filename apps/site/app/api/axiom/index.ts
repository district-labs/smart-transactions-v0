import { env } from "@/env.mjs";
import { Axiom, type AxiomConfig } from "@axiom-crypto/core";
import { ethers } from "ethers";

export const UNI_V3_POOL_ADDR = "0x5c33044BdBbE55dAb3d526CE70F908aAF6990373";
export const START_BLOCK = 9798709;
export const END_BLOCK = 9802115;

const PROVIDER_URI = `https://eth-goerli.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_ID}`;

export const axiomConfig: AxiomConfig = {
    providerUri: PROVIDER_URI,
    version: "v1",    
    chainId: 5,
    // Mock proofs enabled for Goerli only
    mock: true 
};
export const ax = new Axiom(axiomConfig);

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URI);
const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);

export const axiomV1Query = new ethers.Contract(
    ax.getAxiomQueryAddress() as string, 
    ax.getAxiomQueryAbi(), 
    wallet
);