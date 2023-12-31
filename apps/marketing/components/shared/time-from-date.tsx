"use client"

import * as React from "react"
import classNames from "clsx"
import { DateTime } from "luxon"

import { selectDateTimeTypeAndLength } from "@/lib/utils/select-date-time-type-and-length"

interface TimeFromDateProps {
  className?: string
  date?: Date | null
  length?: number
  type?: "DATETIME" | "DATE" | "TIME"
}

export const TimeFromDate = ({
  className,
  date,
  type = "DATE",
  length = 1,
}: TimeFromDateProps) => {
  const [timestamp, setTimestamp] = React.useState<string>("")
  React.useEffect(() => {
    if (date) {
      setTimestamp(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        DateTime.fromJSDate(date).toLocaleString(
          selectDateTimeTypeAndLength(type, length)
        )
      )
    }
  }, [])
  const containerClassName = classNames(className, "TimeFromDate")
  return <span className={containerClassName}>{timestamp}</span>
}
