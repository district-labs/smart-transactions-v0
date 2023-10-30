import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Label, Slider as SliderCore } from "@district-labs/ui-react"

export type SliderConfig = {
  className: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
  classNameValue?: string
  valueLabel?: string
  classNameValueLabel?: string
  min?: number
  max?: number
  step?: number
}

type Slider = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  config: SliderConfig
}

export const Slider = ({
  path,
  intentBatch,
  setIntentBatch,
  config,
}: Slider) => {
  return (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="fee" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <div className="flex">
        <SliderCore
          value={[Number(getValueFromPath(intentBatch, path))]}
          min={config?.min || 1}
          max={config?.max || 5}
          step={config?.step || 0.1}
          onValueChange={(value: any) =>
            setIntentBatch((draft: any) => {
              setValueFromPath(draft, path, value[0])
            })
          }
        />
        <span className={config?.classNameValue}>
          <span className="">{getValueFromPath(intentBatch, path)}</span>{" "}
          {config?.valueLabel && (
            <span className={config?.classNameValueLabel}>
              {config?.valueLabel}
            </span>
          )}
        </span>
      </div>
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  )
}
