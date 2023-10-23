import type { Token } from "@district-labs/intentify-core"
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
} from "@district-labs/ui-react"

import { TokenSelect } from "./fields/token-select"

const defaultToken = {
  name: "DAI",
  symbol: "DAI",
  address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6b175474e89094c44da98b954eedeac495271d0f/logo.png",
}

export const strategyLeverageLong = {
  aaveLeverageLong: {
    supplyToken: defaultToken,
    borrowToken: defaultToken,
    interestRateMode: "0",
    minHealthFactor: "1",
  },
} as {
  aaveLeverageLong: {
    supplyToken: Token
    borrowToken: Token
    interestRateMode: string
    minHealthFactor: string
  }
}

export const strategyLeverageLongForm = {
  aaveLeverageLong: {
    SupplyToken: (intentBatch: any, setIntentBatch: any, tokenList: any) => (
      <div className="">
        <Label htmlFor="supply" className="text-muted-foreground">
          Supply
        </Label>
        <TokenSelect
          tokenList={tokenList}
          selectedToken={intentBatch["aaveLeverageLong"]["supplyToken"]}
          setSelectedToken={(newToken) =>
            setIntentBatch((draft: any) => {
              draft["aaveLeverageLong"]["supplyToken"] = newToken
            })
          }
        />
      </div>
    ),
    BorrowToken: (intentBatch: any, setIntentBatch: any, tokenList: any) => (
      <div className="">
        <Label htmlFor="borrow" className="text-muted-foreground">
          Borrow
        </Label>
        <TokenSelect
          tokenList={tokenList}
          selectedToken={intentBatch.aaveLeverageLong.borrowToken}
          setSelectedToken={(newToken) =>
            setIntentBatch((draft: any) => {
              draft.aaveLeverageLong.borrowToken = newToken
            })
          }
        />
      </div>
    ),
    InterestRateMode: (intentBatch: any, setIntentBatch: any) => (
      <div className="grid gap-2">
        <Label htmlFor="selling">Interest Rate Mode</Label>
        <Select
          onValueChange={(value: any) =>
            setIntentBatch((draft: any) => {
              draft.aaveLeverageLong.interestRateMode = value
            })
          }
          value={intentBatch.aaveLeverageLong.interestRateMode}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Select Interest Rate Mode</SelectItem>
            <SelectItem value="1">Variable</SelectItem>
            <SelectItem value="2">Stable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    MinHealthFactor: (intentBatch: any, setIntentBatch: any) => (
      <div className="grid gap-2">
        <Label htmlFor="selling">Minimum Health Factor</Label>
        <div className="flex">
          <Slider
            defaultValue={[
              Number(intentBatch.aaveLeverageLong.minHealthFactor),
            ]}
            min={1}
            max={3}
            step={0.01}
            onValueChange={(value: any) =>
              setIntentBatch((draft: any) => {
                draft.aaveLeverageLong.minHealthFactor = value
              })
            }
          />
          <span className="pl-3 text-xl font-medium">
            {intentBatch.aaveLeverageLong.minHealthFactor}
          </span>
        </div>
      </div>
    ),
  },
}
