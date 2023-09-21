import type { NewLimitOrderSchema } from "@/lib/validations/db/new-limit-order"
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

  const intentifyAddress: string = useGetIntentifyModuleAddress(chainId)
  const timestampBeforeIntentAddress: string =
    useGetIntentTimestampBeforeAddress(chainId)
  const limitOrderIntentAddress: string = useGetIntentLimitOrderAddress(chainId)
  const tokenRouterReleaseIntentAddress: string =
    useGetIntentTokenRouterAddress(chainId)

  const mutationFn = async () => {
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
      nonce: encodePacked(["uint256"], [BigInt(0)]),
      // Eth address 42 characters of 0x + 0{40}
      root: intentifyAddress,
      chainId,
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
            [tokenOut.address, parsedAmountOut]
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
              value: parsedAmountOut.toString(),
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
            [tokenOut.address, tokenIn.address, parsedAmountOut, parsedAmountIn]
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

    const intentBatchEIP712 = generateIntentBatchEIP712({
      chainId: chainId,
      verifyingContract: intentifyAddress,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      intentBatch: intentBatch,
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const signature = await signTypedDataAsync(intentBatchEIP712)

    const body: NewLimitOrderSchema = {
      intentBatchEIP712,
      intentBatch: {
        ...intentBatch,
        signature,
      },
    }

    const response = await fetch("/api/db/new-limit-order", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data: {
        ok: true
      } = await response.json()

      return data
    }

    const data = await response.text()
    throw new Error(data)
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
