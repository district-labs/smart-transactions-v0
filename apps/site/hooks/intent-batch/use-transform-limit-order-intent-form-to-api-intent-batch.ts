import { expiryToTimestamp } from "@/app/(app)/limit/utils";
import { useGetIntentLimitOrderAddress, useGetIntentTimestampBeforeAddress, useGetIntentTokenRouterAddress, useGetSafeAddress } from "@district-labs/intentify-react";
import { generateIntentModuleId } from "@district-labs/intentify-utils";
import { useEffect, useState } from "react";
import { encodeAbiParameters, encodePacked, parseUnits } from "viem";
import type { ApiIntentBatch } from "@/lib/validations/api/intent-batch";
import type { Token } from "@/types/token-list";

type Input = {
    expiry: string
    chainId: number
    userId: string | undefined
    tokenOut: Token | undefined
    amountOut: number | undefined
    tokenIn: Token | undefined
    amountIn: number | undefined
    domainSeparator: string | undefined
    intentBatchHash: string | undefined
    signature: string | undefined
}   

export function useTransformLimitOrderIntentFormToApiIntentBatch({
    expiry,
    chainId,
    userId,
    tokenOut,
    amountOut,
    tokenIn,
    amountIn,
    domainSeparator,
    intentBatchHash,
    signature
}: Input): ApiIntentBatch | undefined {
    const safeAddress = useGetSafeAddress()
    const timestampBeforeIntentAddress = useGetIntentTimestampBeforeAddress(chainId)
    const limitOrderIntentAddress = useGetIntentLimitOrderAddress(chainId)
    const tokenRouterReleaseIntentAddress = useGetIntentTokenRouterAddress(chainId)

    const [ apiIntentBatch, setApiIntentBatch ] = useState<ApiIntentBatch>()
    useEffect( () => { 
          if (!tokenOut) {
            throw new Error("tokenOut is undefined")
          }
      
          if (!tokenIn) {
            throw new Error("tokenIn is undefined")
          }
      
          if(!domainSeparator) {
            return undefined
          }

          if(!intentBatchHash) {
            return undefined
          }

          if(!signature) {
            return undefined
          }

          if(!userId) {
            return undefined
          }
      
          const expiryTimestamp = expiryToTimestamp(expiry)
          const parsedAmountIn = parseUnits(
            (amountIn?.toString() || "0") as `${number}`,
            tokenIn.decimals
          )
          const parsedAmountOut = parseUnits(
            (amountOut?.toString() || "0") as `${number}`,
            tokenOut.decimals
          )
      
          const intentBatch = {
            nonce: encodePacked(["uint256"], [BigInt(0)]) as string,
            root: safeAddress as string,
            intentBatchHash: intentBatchHash,
            signature: signature,
            chainId,
            userId,
            intents: [
              {
                intentId: generateIntentModuleId("TimestampBeforeIntent", "1") as string,
                root: safeAddress as string,
                target: timestampBeforeIntentAddress as string,
                data: encodePacked(["uint128"], [BigInt(expiryTimestamp)]) as string,
                value: "0",
                intentArgs: [
                  {
                    name: "timestamp",
                    type: "uint256",
                    value: expiryTimestamp,
                  },
                ],
              },
              {
                intentId: generateIntentModuleId("TokenRouterReleaseIntent", "1") as string,
                root: safeAddress as string,
                target: tokenRouterReleaseIntentAddress as string,
                data: encodeAbiParameters(
                  [
                    { type: "address", name: "token" },
                    { type: "uint256", name: "amount" },
                  ],
                  [tokenOut.address as `0x${string}`, parsedAmountOut]
                ) as string,
                value: "0",
                intentArgs: [
                  {
                    name: "token",
                    type: "address",
                    value: tokenOut.address,
                  },
                  {
                    name: "amount",
                    type: "uint256",
                    value: parsedAmountOut.toString(),
                  },
                ],
              },
              {
                intentId: generateIntentModuleId("LimitOrderIntent", "1") as string,
                root: safeAddress as string,
                target: limitOrderIntentAddress,
                data: encodeAbiParameters(
                  [
                    { type: "address", name: "tokenOut" },
                    { type: "address", name: "tokenIn" },
                    { type: "uint256", name: "amountOutMax" },
                    { type: "uint256", name: "amountInMin" },
                  ],
                  [tokenOut.address as `0x${string}`, tokenIn.address as `0x${string}`, parsedAmountOut, parsedAmountIn]
                ) as string,
                value: "0",
                intentArgs: [
                  {
                    name: "tokenOut",
                    type: "address",
                    value: tokenOut.address,
                  },
                  {
                    name: "tokenIn",
                    type: "address",
                    value: tokenIn.address,
                  },
                  {
                    name: "amountOutMax",
                    type: "uint256",
                    value: parsedAmountOut.toString(),
                  },
                  {
                    name: "amountInMin",
                    type: "uint256",
                    value: parsedAmountIn.toString(),
                  },
                ],
              },
            ],
          }
          setApiIntentBatch({intentBatch})
    }, [expiry, chainId, userId, tokenOut, amountOut, tokenIn, amountIn, domainSeparator, intentBatchHash, signature, safeAddress, timestampBeforeIntentAddress, limitOrderIntentAddress, tokenRouterReleaseIntentAddress])

    return apiIntentBatch
}
