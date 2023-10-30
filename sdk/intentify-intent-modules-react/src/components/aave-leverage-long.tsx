import type { Token } from "@district-labs/intentify-core"

import { Select } from "./fields/select"
import { Slider } from "./fields/slider"
import { TokenSelect } from "./fields/token-select"

type AaveLeverageLong = {
  aaveLeverageLong: {
    supplyAsset: Token | undefined
    borrowAsset: Token | undefined
    interestRateMode: string
    minHealthFactor: string
    fee: number
  }
}

export const intentAaveLeverageLong = {
  aaveLeverageLong: {
    supplyAsset: undefined,
    borrowAsset: undefined,
    interestRateMode: "1",
    minHealthFactor: "1",
    fee: 1,
  },
} as AaveLeverageLong

export const intentAaveLeverageLongFields = {
  SupplyAsset: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <TokenSelect
      config={config}
      intentBatch={intentBatch}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      path={["aaveLeverageLong", "supplyAsset"]}
    />
  ),
  BorrowAsset: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <TokenSelect
      config={config}
      intentBatch={intentBatch}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      path={["aaveLeverageLong", "borrowAsset"]}
    />
  ),
  InterestRateMode: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <Select
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      path={["aaveLeverageLong", "interestRateMode"]}
      options={[
        {
          value: "1",
          label: "Variable",
        },
        {
          value: "2",
          label: "Stable",
        },
      ]}
    />
  ),
  MinHealthFactor: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
      classNameValue?: string
      min?: number
      max?: number
      step?: number
    }
  ) => (
    <Slider
      config={config}
      intentBatch={intentBatch}
      setIntentBatch={setIntentBatch}
      path={["aaveLeverageLong", "minHealthFactor"]}
    />
  ),
  Fee: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
      classNameValue?: string
      min?: number
      max?: number
      step?: number
    }
  ) => (
    <Slider
      config={{ ...config, valueLabel: "%" }}
      intentBatch={intentBatch}
      setIntentBatch={setIntentBatch}
      path={["aaveLeverageLong", "fee"]}
    />
  ),
}
