/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Token } from "@/types"
import {
  useGetIntentifyModuleAddress,
  useGetIntentLimitOrderAddress,
  useGetIntentTimestampBeforeAddress,
  useGetIntentTokenRouterAddress,
} from "@district-labs/intentify-react"
import { generateIntentBatchEIP712 } from "@district-labs/intentify-utils"
import { useMutation } from "@tanstack/react-query"
import { encodeAbiParameters, encodePacked, parseUnits } from "viem"
import { useSignTypedData } from "wagmi"

import { expiryToTimestamp } from "./utils"

interface IUsePlaceOrder {
  expiry: string
  chainId: number
  tokenOut: Token
  amountOut: number | undefined
  tokenIn: Token
  amountIn: number | undefined
}

export function usePlaceOrder({
  expiry,
  chainId,
  tokenOut,
  amountOut,
  tokenIn,
  amountIn,
}: IUsePlaceOrder) {
  const { isLoading: isLoadingSign, signTypedDataAsync } = useSignTypedData()

  const intentifyAddress: `0x{string}` = useGetIntentifyModuleAddress(chainId)
  const timestampBeforeIntentAddress: `0x{string}` =
    useGetIntentTimestampBeforeAddress(chainId)
  const limitOrderIntentAddress: `0x{string}` =
    useGetIntentLimitOrderAddress(chainId)
  const tokenRouterReleaseIntentAddress: `0x{string}` =
    useGetIntentTokenRouterAddress(chainId)

  const mutationFn = async () => {
    const expiryTimestamp = expiryToTimestamp(expiry)

    const intentBatch = {
      nonce: encodePacked(["uint256"], [BigInt(0)]),
      // Eth address 42 characters of 0x + 0{40}
      root: intentifyAddress,
      intents: [
        {
          name: "TimestampBeforeIntent",
          version: "0.0.1",
          root: intentifyAddress,
          target: timestampBeforeIntentAddress,
          data: encodePacked(["uint128"], [BigInt(expiryTimestamp)]),
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
          name: "TokenRouterReleaseIntent",
          version: "0.0.1",
          root: intentifyAddress,
          target: tokenRouterReleaseIntentAddress,
          data: encodeAbiParameters(
            [
              { type: "address", name: "token" },
              { type: "uint256", name: "amount" },
            ],
            [
              tokenOut.address,
              parseUnits(amountOut?.toString() || "0", tokenOut.decimals),
            ]
          ),
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
              value: parseUnits(
                amountOut?.toString() || "0",
                tokenOut.decimals
              ).toString(),
            },
          ],
        },
        {
          name: "LimitOrderIntent",
          version: "0.0.1",
          root: intentifyAddress,
          target: limitOrderIntentAddress,
          data: encodeAbiParameters(
            [
              { type: "address", name: "tokenOut" },
              { type: "address", name: "tokenIn" },
              { type: "uint256", name: "amountOutMax" },
              { type: "uint256", name: "amountInMin" },
            ],
            [
              tokenOut.address,
              tokenIn.address,
              parseUnits(amountOut?.toString() || "0", tokenOut.decimals),
              parseUnits(amountIn?.toString() || "0", tokenIn.decimals),
            ]
          ),
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
              value: parseUnits(
                amountOut?.toString() || "0",
                tokenOut.decimals
              ).toString(),
            },
            {
              name: "amountInMin",
              type: "uint256",
              value: parseUnits(
                amountIn?.toString() || "0",
                tokenIn.decimals
              ).toString(),
            },
          ],
        },
      ],
    }

    const intentBatchEIP712 = generateIntentBatchEIP712({
      chainId: chainId,
      verifyingContract: intentifyAddress,
      intentBatch: intentBatch,
    })

    const signature = await signTypedDataAsync(intentBatchEIP712)

    const body = {
      intentBatchEIP712,
      intentBatchExecution: {
        chainId,
        signature,
        intentBatch,
        hooks: [
          {
            target: "0x0000000000000000000000000000000000000000",
            data: "0x",
          },
          {
            target: "0x0000000000000000000000000000000000000000",
            data: "0x",
          },
          {
            target: "0x0000000000000000000000000000000000000000",
            data: "0x",
          },
        ],
      },
    }

    const response = await fetch("/api/db/new-limit-order", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data: {
      ok: true
    } = await response.json()

    return data
  }

  const mutationResult = useMutation(
    ["place-order", expiry, chainId, tokenOut, amountOut, tokenIn, amountIn],
    {
      mutationFn,
    }
  )

  return {
    mutationResult,
    isLoadingSign,
  }
}
