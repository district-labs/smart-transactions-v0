import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Input as InputCore, Label } from "@district-labs/ui-react"

export type InputConfig = {
  className?: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

type Input = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  config: InputConfig
}

export const Input = ({ path, intentBatch, setIntentBatch, config }: Input) => {
  return (
    <div className={config?.className}>
      {config.label && (
        <Label htmlFor="minTimestamp" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
      <InputCore
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
