import { Input, Label } from "@district-labs/ui-react"

import { DateTimeLocal } from "./fields/datetime-local"

export type IntentTimestampRange = {
  timestampRange: {
    minTimestamp: string | undefined
    maxTimestamp: string | undefined
  }
}

export const intentTimestampRange = {
  timestampRange: {
    minTimestamp: undefined,
    maxTimestamp: undefined,
  },
} as IntentTimestampRange

export const intentTimestampRangeFields = {
  minTimestamp: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <DateTimeLocal
      config={config}
      intentBatch={intentBatch}
      setIntentBatch={setIntentBatch}
      path={["timestampRange", "minTimestamp"]}
    />
  ),
  maxTimestamp: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <DateTimeLocal
      config={config}
      intentBatch={intentBatch}
      setIntentBatch={setIntentBatch}
      path={["timestampRange", "maxTimestamp"]}
    />
  ),
}
