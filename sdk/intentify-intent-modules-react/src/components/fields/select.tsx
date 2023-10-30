import { getValueFromPath, setValueFromPath } from "@/src/utils"
import {
  Label,
  SelectContent,
  Select as SelectCore,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@district-labs/ui-react"

export type SelectConfig = {
  className?: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

type Select = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  options: {
    value: string
    label: string
  }[]
  config: SelectConfig
}

export const Select = ({
  path,
  intentBatch,
  setIntentBatch,
  options,
  config,
}: Select) => {
  return (
    <div className={config?.className}>
      {config.label && (
        <Label htmlFor="minTimestamp" className={config.classNameLabel}>
          {config.label}
        </Label>
      )}
      <SelectCore
        value={getValueFromPath(intentBatch, path)}
        onValueChange={(value: any) =>
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, path, value)
          })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o, idx) => (
            <SelectItem value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </SelectCore>
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  )
}
