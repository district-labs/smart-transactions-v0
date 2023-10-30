import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Input, Label } from "@district-labs/ui-react"

export type DateTimeLocalConfig = {
  className?: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

type DateTimeLocal = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  config: DateTimeLocalConfig
}

export const DateTimeLocal = ({
  path,
  intentBatch,
  setIntentBatch,
  config,
}: DateTimeLocal) => {
  return (
    <div className={config?.className}>
      {config.label && (
        <Label htmlFor="minTimestamp" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
      <Input
        type="datetime-local"
        value={getValueFromPath(intentBatch, path)}
        onChange={(event: any) => {
          const date = new Date(event.target.value)
          const epoch = Math.floor(date.getTime() / 1000)
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, path, event.target.value)
          })
        }}
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  )
}
