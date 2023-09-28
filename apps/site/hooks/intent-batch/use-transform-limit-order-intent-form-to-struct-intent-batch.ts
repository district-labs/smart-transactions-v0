
import { useGetIntentLimitOrderAddress, useGetIntentTimestampBeforeAddress, useGetIntentTokenRouterAddress, useGetSafeAddress } from "@district-labs/intentify-react";
import { useEffect, useState } from "react";
import { expiryToTimestamp } from "@/app/(app)/limit/utils";
import { encodeAbiParameters, encodePacked, keccak256, parseUnits } from "viem";
import { IntentBatch } from "@district-labs/intentify-utils";
import { useGenerateNonBlockingNonce } from "../intent/use-generate-non-blocking-nonce";
import type { Token } from "@/types/token-list";

type Input = {
    expiry: string
    chainId: number
    tokenOut: Token | undefined
    amountOut: number | undefined
    tokenIn: Token | undefined
    amountIn: number | undefined
}   

export function useTransformLimitOrderIntentFormToStructIntentBatch({
    expiry,
    chainId,
    tokenOut,
    amountOut,
    tokenIn,
    amountIn
}: Input): IntentBatch | undefined {
    const safeAddress = useGetSafeAddress()
    const timestampBeforeIntentAddress = useGetIntentTimestampBeforeAddress(chainId)
    const limitOrderIntentAddress = useGetIntentLimitOrderAddress(chainId)
    const tokenRouterReleaseIntentAddress = useGetIntentTokenRouterAddress(chainId)
    const salt = keccak256(encodePacked(["string", "uint256", `address`, "uint256",  `address`, "uint256"  
  ], [expiry, BigInt(chainId), tokenOut?.address as `0x${string}`, BigInt(amountOut || 0), tokenIn?.address as `0x${string}`, BigInt(amountIn || 0)
    ]))
    const nonce = useGenerateNonBlockingNonce(salt)
    const [ apiIntentBatch, setApiIntentBatch ] = useState<IntentBatch>()
    useEffect( () => { 
        if (!tokenOut) {
            throw new Error("tokenOut is undefined")
          }
      
          if (!tokenIn) {
            throw new Error("tokenIn is undefined")
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
            nonce: nonce,
            root: safeAddress as `0x${string}`,
            intents: [
              {
                root: safeAddress as `0x${string}`,
                target: timestampBeforeIntentAddress,
                data: encodePacked(["uint128"], [BigInt(expiryTimestamp)]),
                value: BigInt(0),
              },
              {
                root: safeAddress as `0x${string}`,
                target: tokenRouterReleaseIntentAddress,
                data: encodeAbiParameters(
                  [
                    { type: "address", name: "token" },
                    { type: "uint256", name: "amount" },
                  ],
                  [tokenOut.address as `0x${string}`, parsedAmountOut]
                ),
                value: BigInt(0),
              },
              {
                root: safeAddress as `0x${string}`,
                target: limitOrderIntentAddress,
                data: encodeAbiParameters(
                  [
                    { type: "address", name: "tokenOut" },
                    { type: "address", name: "tokenIn" },
                    { type: "uint256", name: "amountOutMax" },
                    { type: "uint256", name: "amountInMin" },
                  ],
                  [tokenOut.address as `0x${string}`, tokenIn.address as `0x${string}`, parsedAmountOut, parsedAmountIn]
                ),
                value: BigInt(0),
              },
            ],
          }
          setApiIntentBatch(intentBatch)
    }, [expiry, chainId, tokenOut, amountOut, tokenIn, amountIn, safeAddress, timestampBeforeIntentAddress, limitOrderIntentAddress, tokenRouterReleaseIntentAddress])

    return apiIntentBatch
}
