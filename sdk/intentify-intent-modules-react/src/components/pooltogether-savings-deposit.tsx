import type { Token } from "@district-labs/intentify-core"
import { Input, Label } from "@district-labs/ui-react"

import { TokenSelect } from "./fields/core/token-select"

type IntentPoolTogetherSavingsDeposit = {
  poolTogetherSavingsDeposit: {
    minThreshold: number
    minDeposit: number
    supplyAsset: Token | undefined
  }
}

export const intentPoolTogetherSavingsDeposit = {
  poolTogetherSavingsDeposit: {
    minThreshold: 0,
    minDeposit: 0,
    supplyAsset: undefined,
  },
} as IntentPoolTogetherSavingsDeposit

export const intentPoolTogetherSavingsDepositFields = {
  MinThreshold: (
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
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="fee" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={intentBatch?.poolTogetherSavingsDeposit?.minThreshold || 0}
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["poolTogetherSavingsDeposit"]["minThreshold"] =
              event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  MinDeposit: (
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
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="fee" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={intentBatch?.poolTogetherSavingsDeposit?.minDeposit || 0}
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["poolTogetherSavingsDeposit"]["minDeposit"] =
              event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
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
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="supply" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <TokenSelect
        tokenList={tokenList}
        selectedToken={intentBatch["poolTogetherSavingsDeposit"]["supplyAsset"]}
        setSelectedToken={(newToken) =>
          setIntentBatch((draft: any) => {
            draft["poolTogetherSavingsDeposit"]["supplyAsset"] = newToken
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
}
