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

function toDateInputValue(epoch?: number) {
  if(typeof epoch !== 'number') { 
    return new Date().getFullYear()
  } else {
    const date = new Date(epoch * 1000)
    // Pad the month, day, hours and minutes with leading zeros, if required
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    
    // Format the datetime-local input value in the required format
    var dateTimeLocalFormat = date.getFullYear() + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
   
    return dateTimeLocalFormat
  }
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
        defaultValue={toDateInputValue()}
        type="datetime-local"
        value={toDateInputValue(getValueFromPath(intentBatch, path))}
        onChange={(event: any) => {
          const date = new Date(event.target.value)
          const epoch = Math.floor(date.getTime() / 1000)
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, path, epoch)
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
