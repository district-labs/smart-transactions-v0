import { Input, Label } from "@district-labs/ui-react"

interface TimestampRangeFieldConfig {
  label: string
}

export type TimestampRange = {
  timestampRange: {
    minTimestamp: number
    maxTimestamp: number
  }
}

export const intentTimestampRange = {
  timestampRange: {
    minTimestamp: 0,
    maxTimestamp: 0,
  },
} as TimestampRange

export const intentTimestampRangeFields = {
  minTimestamp: (
    setIntentBatch: any,
    config: {
      label: string
      classNameLabel?: string
    }
  ) => (
    <div>
      {config.label && (
        <Label htmlFor="minTimestamp" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
      <Input
        type="datetime-local"
        onChange={(event: any) => {
          const date = new Date(event.target.value)
          const epoch = Math.floor(date.getTime() / 1000)
          setIntentBatch((draft: any) => {
            draft["timestampRange"]["minTimestamp"] = epoch
          })
        }}
      />
    </div>
  ),
  maxTimestamp: (
    setIntentBatch: any,
    config: {
      label: string
      classNameLabel?: string
    }
  ) => (
    <div>
      {config.label && (
        <Label htmlFor="minTimestamp" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
      <Input
        type="datetime-local"
        onChange={(event: any) => {
          const date = new Date(event.target.value)
          const epoch = Math.floor(date.getTime() / 1000)
          setIntentBatch((draft: any) => {
            draft["timestampRange"]["maxTimestamp"] = epoch
          })
        }}
      />
    </div>
  ),
}
