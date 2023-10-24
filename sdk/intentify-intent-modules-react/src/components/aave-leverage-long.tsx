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
  chainId: 5,
  address: "0x27326DeB3c3dc9EEf9C5769e7C2960C465B50156",
  name: "Test Wrapped ETH",
  symbol: "testWETH",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
}

type AaveLeverageLong = {
  aaveLeverageLong: {
    supplyToken: Token
    borrowToken: Token
    interestRateMode: string
    minHealthFactor: string
  }
}

export const intentAaveLeverageLong = {
  aaveLeverageLong: {
    supplyToken: defaultToken,
    borrowToken: defaultToken,
    interestRateMode: "0",
    minHealthFactor: "1",
  },
} as AaveLeverageLong

export const intentAaveLeverageLongFields = {
  SupplyToken: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: any,
    config: {
      label: string
      classNameLabel?: string
    }
  ) => (
    <div className="">
      {config.label && (
        <Label htmlFor="supply" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
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
  BorrowToken: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: any,
    config: {
      label: string
      classNameLabel?: string
    }
  ) => (
    <div className="">
      {config.label && (
        <Label htmlFor="borrow" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
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
  InterestRateMode: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      label: string
      className: string
      classNameLabel?: string
    }
  ) => (
    <div className={config.className}>
      {config.label && (
        <Label htmlFor="interestRateMode" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
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
  MinHealthFactor: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      label: string
      className: string
      classNameLabel?: string
      classNameValue?: string
      min?: number
      max?: number
      step?: number
    }
  ) => (
    <div className={config.className}>
      {config.label && (
        <Label htmlFor="interestRateMode" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
      <div className="flex">
        <Slider
          defaultValue={[Number(intentBatch.aaveLeverageLong.minHealthFactor)]}
          min={config.min || 1}
          max={config.max || 3}
          step={config.step || 0.01}
          onValueChange={(value: any) =>
            setIntentBatch((draft: any) => {
              draft.aaveLeverageLong.minHealthFactor = value
            })
          }
        />
        <span className={config.classNameValue}>
          {intentBatch.aaveLeverageLong.minHealthFactor}
        </span>
      </div>
    </div>
  ),
}
