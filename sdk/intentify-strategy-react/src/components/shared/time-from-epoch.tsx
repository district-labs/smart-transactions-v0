"use client"

import * as React from "react"
import classNames from "clsx"
import { DateTime } from "luxon"

import { selectDateTimeTypeAndLength } from "./select-date-time-type-and-length"

interface TimeFromEpochProps {
  className?: string
  date?: number | string
  length?: number
  type?: "DATETIME" | "DATE" | "TIME"
}

export const TimeFromEpoch = ({
  className,
  date,
  type = "DATE",
  length = 1,
}: TimeFromEpochProps) => {
  const [timestamp, setTimestamp] = React.useState<string>("")
  React.useEffect(() => {
    if (date) {
      setTimestamp(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        DateTime.fromSeconds(Number(date)).toLocaleString(
          selectDateTimeTypeAndLength(type, length)
        )
      )
    }
  }, [date])
  const containerClassName = classNames(className, "TimeFromEpoch")
  return <span className={containerClassName}>{timestamp}</span>
}

export default TimeFromEpoch
