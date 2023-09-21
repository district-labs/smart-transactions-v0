import {
  type QueryObserverResult,
  type RefetchOptions,
  type RefetchQueryFilters,
  type QueryObserverResult,
  type RefetchOptions,
  type RefetchQueryFilters,
} from "@tanstack/react-query"

import { Toggle } from "../ui/toggle"

export interface ChartTimeFiltersOptions {
  range: "1d" | "7d" | "30d" | "90d" | "365d" | "1095d"
  setRange: React.Dispatch<
    React.SetStateAction<"1d" | "7d" | "30d" | "90d" | "365d" | "1095d">
  >
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<
      {
        timestamp: number
        price: number
      }[],
      unknown
    >
  >
}

export function ChartTimeFilters({
  range,
  setRange,
  refetch,
}: ChartTimeFiltersOptions) {
  const isFilterSelected = (filter: string) => filter === range

  return (
    <div className="mt-2 flex justify-end space-x-2 text-muted-foreground lg:mt-0">
      <Toggle
        aria-label="Toggle 1D"
        pressed={isFilterSelected("1d")}
        onPressedChange={() => {
          setRange("1d")
          refetch?.()
        }}
      >
        1D
      </Toggle>
      <Toggle
        aria-label="Toggle 1W"
        pressed={isFilterSelected("7d")}
        onPressedChange={() => {
          setRange("7d")
          refetch?.()
        }}
      >
        1W
      </Toggle>
      <Toggle
        aria-label="Toggle 1M"
        pressed={isFilterSelected("30d")}
        onPressedChange={() => {
          setRange("30d")
          refetch?.()
        }}
      >
        1M
      </Toggle>
      <Toggle
        aria-label="Toggle 3M"
        pressed={isFilterSelected("90d")}
        onPressedChange={() => {
          setRange("90d")
          refetch?.()
        }}
      >
        3M
      </Toggle>
      <Toggle
        aria-label="Toggle 1Y"
        pressed={isFilterSelected("365d")}
        onPressedChange={() => setRange("365d")}
      >
        1Y
      </Toggle>
      <Toggle
        aria-label="Toggle 3Y"
        pressed={isFilterSelected("1095d")}
        onPressedChange={() => {
          setRange("1095d")
          refetch?.()
        }}
      >
        3Y
      </Toggle>
    </div>
  )
}
