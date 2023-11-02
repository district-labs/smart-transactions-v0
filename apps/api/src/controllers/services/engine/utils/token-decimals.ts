import { erc20ABI } from "@district-labs/intentify-core";
import { publicClients } from "../../../../blockchain-clients";

const tokenDecimalsByChainId: Record<number, Record<string, number>> = {
  5: {
    "0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739": 18,
    "0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB": 6,
  },
};

export async function getTokenDecimals({
  chainId,
  tokenAddress,
}: {
  chainId: number;
  tokenAddress: `0x${string}`;
}) {
  if (!tokenDecimalsByChainId[chainId][tokenAddress]) {
    // Read the token decimals from the blockchain
    const publicClient = publicClients[chainId];

    if (!publicClient) {
      throw new Error(`No public client found for chainId ${chainId}`);
    }

    const tokenDecimals = (await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "decimals",
    })) as number | undefined;

    if (!tokenDecimals) {
      throw new Error(
        `No token decimals found for chainId ${chainId} and tokenAddress ${tokenAddress}`,
      );
    }

    return tokenDecimals;
  }
  return tokenDecimalsByChainId[chainId][tokenAddress];
}
