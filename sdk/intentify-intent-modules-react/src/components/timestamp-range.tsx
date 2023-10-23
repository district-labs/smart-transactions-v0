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
  minTimestamp: (setIntentBatch: any, config: TimestampRangeFieldConfig) => (
    <>
      {config.label && (
        <Label htmlFor="minTimestamp" className="text-muted-foreground">
          {config.label}
        </Label>
      )}
      <Input
        type="number"
        onChange={(event:any) =>
          setIntentBatch((draft: any) => {
            draft["timestampRange"]["minTimestamp"] = (
              event.target as HTMLInputElement
            ).value
          })
        }
      />
    </>
  ),
  maxTimestamp: (setIntentBatch: any, config: TimestampRangeFieldConfig) => (
    <>
      {config.label && (
        <Label htmlFor="minTimestamp" className="text-muted-foreground">
          {config.label}
        </Label>
      )}
      <Input
        type="number"
        onChange={(event:any) =>
          setIntentBatch((draft: any) => {
            draft["timestampRange"]["maxTimestamp"] = (
              event.target as HTMLInputElement
            ).value
          })
        }
      />
    </>
  ),
}
