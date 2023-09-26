import { createWalletClient, http } from "viem"
import { goerli } from "viem/chains"

import { routeSwapExactOutput } from "@/lib/uniswap-v3/routing"

const chainId = 5

const TEST_WETH = {
  address: "0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739",
  decimals: 18,
} as const

const TEST_USDC = {
  address: "0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB",
  decimals: 6,
} as const

export async function GET() {
  try {
    const route = await routeSwapExactOutput({
      chainId,
      amountOut: 150,
      inputToken: TEST_WETH,
      outputToken: TEST_USDC,
      recipient: "0x4596039A69602b115752006Ef8425f43d6E80a6f",
    })

    if (!route?.methodParameters) throw new Error("route not found")
    const client = createWalletClient({
      chain: goerli,
      transport: http(),
    })

    //   const hash = await client.sendTransaction({
    //   account,
    //   data: route.methodParameters?.calldata as `0x${string}`,
    //   to: route.methodParameters?.to as `0x${string}`,
    //   value: BigInt(0)
    // })

    return new Response(JSON.stringify({ ok: true, routeParams: route }), {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return new Response(JSON.stringify({ ok: false, error: "error" }), {
      status: 500,
    })
  }
}
