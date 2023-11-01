import * as React from "react"

type Row = {
  label: string
  value?: string | number | React.ReactElement
  classNameLabel?: string
  classNameValue?: string
}
export const Row = ({ label, value, classNameLabel, classNameValue }: Row) => {
  return (
    <div className="flex flex-row justify-between">
      <span className={classNameLabel}>{label}</span>
      <span className={classNameValue}>{value}</span>
    </div>
  )
}
