import type { Token, TokenList } from "@district-labs/intentify-core"
import { Label } from "@district-labs/ui-react"

import { TokenInputAmount } from "./fields/token-input-amount"

interface Erc20LimitOrderTokenFieldConfig {
  label: string
  tokenList: TokenList
}

const defaultToken = {
  chainId: 5,
  address: "0x27326DeB3c3dc9EEf9C5769e7C2960C465B50156",
  name: "Test Wrapped ETH",
  symbol: "testWETH",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
}

export const intentErc20LimitOrder = {
  erc20LimitOrder: {
    tokenOut: defaultToken,
    tokenIn: defaultToken,
    amountOut: "0",
    amountIn: "1",
  },
} as {
  erc20LimitOrder: {
    tokenOut: Token
    tokenIn: Token
    amountOut: string
    amountIn: string
  }
}

export const intentErc20LimitOrderFields = {
  tokenOutAndAmount: (
    intentBatch: any,
    setIntentBatch: any,
    config: Erc20LimitOrderTokenFieldConfig
  ) => (
    <>
      {config.label && (
        <Label htmlFor="tokenOut" className="text-muted-foreground">
          {config.label}
        </Label>
      )}
      <TokenInputAmount
        tokenList={config.tokenList}
        amount={intentBatch["erc20LimitOrder"]["amountOut"]}
        setAmount={(newAmount) =>
          setIntentBatch((draft: any) => {
            draft["erc20LimitOrder"]["amountOut"] = newAmount
          })
        }
        selectedToken={intentBatch["erc20LimitOrder"]["tokenOut"]}
        setSelectedToken={(newToken) =>
          setIntentBatch((draft: any) => {
            draft["erc20LimitOrder"]["tokenOut"] = newToken
          })
        }
      />
    </>
  ),
  tokenInAndAmount: (
    intentBatch: any,
    setIntentBatch: any,
    config: Erc20LimitOrderTokenFieldConfig
  ) => (
    <>
      {config.label && (
        <Label htmlFor="tokenOut" className="text-muted-foreground">
          {config.label}
        </Label>
      )}
      <TokenInputAmount
        tokenList={config.tokenList}
        amount={intentBatch["erc20LimitOrder"]["amountIn"]}
        setAmount={(newAmount) =>
          setIntentBatch((draft: any) => {
            draft["erc20LimitOrder"]["amountIn"] = newAmount
          })
        }
        selectedToken={intentBatch["erc20LimitOrder"]["tokenIn"]}
        setSelectedToken={(newToken) =>
          setIntentBatch((draft: any) => {
            draft["erc20LimitOrder"]["tokenIn"] = newToken
          })
        }
      />
    </>
  ),
}
