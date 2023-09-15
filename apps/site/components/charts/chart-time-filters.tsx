import { Button } from "../ui/button"
import { Toggle } from "../ui/toggle"

export interface ChartTimeFiltersOptions {
  range: "1" | "7" | "30" | "90" | "365" | "1095"
  setRange: React.Dispatch<
    React.SetStateAction<"1" | "7" | "30" | "90" | "365" | "1095">
  >
}

export function ChartTimeFilters({ range, setRange }: ChartTimeFiltersOptions) {
  const isFilterSelected = (filter: string) => filter === range

  return (
    <div className="mt-2 flex justify-end space-x-2 text-muted-foreground lg:mt-0">
      <Toggle
        aria-label="Toggle 1D"
        pressed={isFilterSelected("1")}
        onPressedChange={() => setRange("1")}
      >
        1D
      </Toggle>
      <Toggle
        aria-label="Toggle 1W"
        pressed={isFilterSelected("7")}
        onPressedChange={() => setRange("7")}
      >
        1W
      </Toggle>
      <Toggle
        aria-label="Toggle 1M"
        pressed={isFilterSelected("30")}
        onPressedChange={() => setRange("30")}
      >
        1M
      </Toggle>
      <Toggle
        aria-label="Toggle 3M"
        pressed={isFilterSelected("90")}
        onPressedChange={() => setRange("90")}
      >
        3M
      </Toggle>
      <Toggle
        aria-label="Toggle 1Y"
        pressed={isFilterSelected("365")}
        onPressedChange={() => setRange("365")}
      >
        1Y
      </Toggle>
      <Toggle
        aria-label="Toggle 3Y"
        pressed={isFilterSelected("1095")}
        onPressedChange={() => setRange("1095")}
      >
        3Y
      </Toggle>
    </div>
  )
}
