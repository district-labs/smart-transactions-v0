import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import {
  AlphaRouter,
  SwapType,
  type SwapOptionsSwapRouter02
} from '@uniswap/smart-order-router'
import { ethers } from 'ethers'
import JSBI from 'jsbi'

function countDecimals(x: number) {
  if (Math.floor(x) === x) {
    return 0
  }
  return x.toString().split('.')[1].length || 0
}

export function fromReadableAmount(amount: number, decimals: number): JSBI {
  const extraDigits = Math.pow(10, countDecimals(amount))
  const adjustedAmount = amount * extraDigits
  // eslint-disable-next-line
  return JSBI.divide(
    // eslint-disable-next-line
    JSBI.multiply(
      // eslint-disable-next-line
      JSBI.BigInt(adjustedAmount),
      // eslint-disable-next-line
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    // eslint-disable-next-line
    JSBI.BigInt(extraDigits)
  )
}



const input = {
  chainId: 5
}


// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}

const TEST_WETH_TOKEN = new Token(
  5,
  '0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739',
  18,
  'WETH',
  'Wrapped Ether'
)

const TEST_USDC_TOKEN = new Token(
  5,
  '0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB',
  6,
  'USDC',
  'USD Coin'
)


// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment
  rpc: {
    local: string
    goerli: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    in: Token
    amountIn: number
    out: Token
  }
}


export const config: ExampleConfig = {
  env: Environment.LOCAL,
  rpc: {
    local: 'http://localhost:8545',
    goerli: 'https://eth-goerli.g.alchemy.com/v2/db-FH5BVUG8oRJ_iE5EjCEQsBRWuXU2X',
  },
  wallet: {
    address: '0x4596039A69602b115752006Ef8425f43d6E80a6f',
    privateKey:
      'a3569f2c16ba1d72ef6aca63f070a399066cc7bcd62d666f1ad60282a6f06ec3',
  },
  tokens: {
    in: TEST_WETH_TOKEN,
    amountIn: 0.001,
    out: TEST_USDC_TOKEN,
  },
}

export  async function GET(req:Request){
  try{

    const router = new AlphaRouter({
    chainId: input.chainId,
    provider: new ethers.providers.JsonRpcProvider(
 config.rpc.goerli
),
  })


  const options: SwapOptionsSwapRouter02 = {
    recipient: config.wallet.address,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  }

  const route = await router.route(
    CurrencyAmount.fromRawAmount(
      config.tokens.in,
      // eslint-disable-next-line
      fromReadableAmount(
        config.tokens.amountIn,
        config.tokens.in.decimals
      ).toString()
    ),
    config.tokens.out,
    TradeType.EXACT_INPUT,
    options
  )

  
  console.log("route", route)
return new Response(
  JSON.stringify({ ok: true, routeParams: route }),
  { status: 200 }
)
  } catch(e){
    return new Response(
      JSON.stringify({ ok: false, error:"error"}),
      { status: 500 }
    )
  }
}