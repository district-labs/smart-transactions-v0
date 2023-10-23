const adjustPriceBody = {
  chainId: 5,
  token0: "0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB",
  token1: "0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739",
  poolFee: 3000,
  randomTargetPrice: true,
}

const baseUrl = process.env.VERCEL_URL
  ? "https://" + process.env.VERCEL_URL
  : "http://localhost:3000"

console.log("baseUrl", baseUrl)
export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/api/uniswap/adjust-price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adjustPriceBody),
    })

    const body = await response.json()

    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.error(e)
    return new Response("Something went wrong", { status: 500 })
  }
}
