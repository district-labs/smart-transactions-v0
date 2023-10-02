import { erc20MintableABI } from "@/integrations/erc20/abis/erc20-mintable-abi"
import type {
    Relayer,
    RelayerTransaction,
} from "@openzeppelin/defender-relay-client"
import { encodeFunctionData, type Address } from "viem"

import { getRelayerByChainId } from "@/lib/openzeppelin-defender/relayer"
import { routeSwapExactInput } from "@/lib/uniswap-v3/routing"

import { goerliPublicClient } from "../../blockchain-clients"
import { factoryABI, poolABI, quoterV2ABI } from "./abis"
import { sqrtPriceX96ToPrice } from "./utils"
import { Univ3AdjustPriceSchema } from "./validation"

export const maxDuration = 5 * 60 // 5 minutes

const UNIV3_QUOTER_V2_ADDRESS = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"
const UNIV3_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
const TX_STEP_USDC = BigInt(500) * BigInt(10) ** BigInt(6)
const TX_STEP_ETH = BigInt(3) * BigInt(10) ** BigInt(17)

async function getTokenDetails(
  address: string
): Promise<{ address: Address; decimals: number }> {
  return {
    address: address as Address,
    decimals: await goerliPublicClient.readContract({
      address: address as Address,
      abi: erc20MintableABI,
      functionName: "decimals",
    }),
  }
}

function isOperationGT(
  currentInversePrice: bigint,
  targetInversePrice: bigint
): boolean {
  return currentInversePrice < BigInt(targetInversePrice)
}

async function executeRelayerTransaction(
  relayer: Relayer,
  details: { to: string; data: string }
): Promise<RelayerTransaction> {
  const txReceipt = await relayer.sendTransaction({
    ...details,
    gasLimit: 500000,
    speed: "fast",
  })
  console.log("Transaction Receipt:", txReceipt.hash)
  await goerliPublicClient.waitForTransactionReceipt({
    hash: txReceipt.hash as `0x${string}`,
  })
  return txReceipt
}

export async function POST(req: Request) {
  try {
    const {
      poolFee,
      chainId,
      token0: token0Address,
      token1: token1Address,
      targetPrice: targetInversePrice,
    } = Univ3AdjustPriceSchema.parse(await req.json())

    if (targetInversePrice <= 0) {
      return new Response("Target price must be greater than 0", {
        status: 400,
      })
    }

    const [token0, token1] = await Promise.all(
      [token0Address, token1Address].map(getTokenDetails)
    )

    const poolAddress = await goerliPublicClient.readContract({
      address: UNIV3_FACTORY_ADDRESS,
      abi: factoryABI,
      functionName: "getPool",
      args: [token0.address, token1.address, poolFee],
    })

    const [currentSqrtPriceX96] = await goerliPublicClient.readContract({
      address: poolAddress,
      abi: poolABI,
      functionName: "slot0",
    })

    const currentInversePrice =
      BigInt(1e12) / sqrtPriceX96ToPrice(currentSqrtPriceX96.toString())

    if (currentInversePrice === BigInt(targetInversePrice)) {
      return new Response(
        JSON.stringify({
          message: "Operation not needed",
          currentInversePrice: currentInversePrice.toString(),
          targetInversePrice: targetInversePrice.toString(),
        }),
        { status: 200 }
      )
    }

    const operationGT = isOperationGT(
      currentInversePrice,
      BigInt(targetInversePrice)
    )
    const tokens = operationGT ? [token0, token1] : [token1, token0]
    const TX_STEP = operationGT ? TX_STEP_USDC : TX_STEP_ETH

    let inversePrice = currentInversePrice
    let step = BigInt(1)
    let sqrtPriceX96After: bigint = BigInt(1)

    while (
      (operationGT && inversePrice < targetInversePrice) ||
      (!operationGT && inversePrice > targetInversePrice)
    ) {
      const data = await goerliPublicClient.simulateContract({
        address: UNIV3_QUOTER_V2_ADDRESS,
        abi: quoterV2ABI,
        args: [
          {
            tokenIn: tokens[0].address,
            tokenOut: tokens[1].address,
            fee: poolFee,
            amountIn: TX_STEP * step,
            sqrtPriceLimitX96: BigInt(0),
          },
        ],
        functionName: "quoteExactInputSingle",
      })

      sqrtPriceX96After = data.result[1]
      inversePrice =
        BigInt(1e12) / sqrtPriceX96ToPrice(sqrtPriceX96After.toString())
      step += BigInt(1)
    }

    // Execute transaction using OpenZeppelin Defender Relayer
    const { relayer } = getRelayerByChainId(chainId)
    const relayerAddress = (await relayer.getRelayer()).address as Address

    await executeRelayerTransaction(relayer, {
      to: tokens[0].address,
      data: encodeFunctionData({
        abi: erc20MintableABI,
        functionName: "mint",
        args: [relayerAddress, TX_STEP * step],
      }),
    })

    // Uniswap V3 routing
    const route = await routeSwapExactInput({
      chainId,
      amountIn: (TX_STEP * step).toString(),
      inputToken: tokens[0],
      outputToken: tokens[1],
      recipient: relayerAddress,
    })

    if (!route?.methodParameters) throw new Error("route not found")
    const { to: uniV3SwapperAddress, calldata: uniV3SwapData } =
      route.methodParameters

    await executeRelayerTransaction(relayer, {
      to: tokens[0].address,
      data: encodeFunctionData({
        abi: erc20MintableABI,
        functionName: "approve",
        args: [uniV3SwapperAddress as Address, TX_STEP * step],
      }),
    })

    const swapTxReceipt = await executeRelayerTransaction(relayer, {
      to: uniV3SwapperAddress,
      data: uniV3SwapData,
    })

    return new Response(
      JSON.stringify({
        swapTx: swapTxReceipt.hash,
        initialPrice: (
          BigInt(1e12) / sqrtPriceX96ToPrice(currentSqrtPriceX96.toString())
        ).toString(),
        targetPrice: targetInversePrice.toString(),
        priceAfter: (
          BigInt(1e12) / sqrtPriceX96ToPrice(sqrtPriceX96After.toString())
        ).toString(),
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error("POST endpoint error:", err)
    return new Response("Error while submitting transaction", { status: 500 })
  }
}
