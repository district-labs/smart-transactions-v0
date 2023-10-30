import { Input, Label, Slider } from "@district-labs/ui-react"

export type IntentUniswapV3HistoricalTwapPercentageChange = {
  uniswapV3HistoricalTwapPercentageChange: {
    uniswapV3Pool: string
    numeratorReferenceBlockOffset: string
    numeratorBlockWindow: string
    numeratorBlockWindowTolerance: string
    denominatorReferenceBlockOffset: string
    denominatorBlockWindow: string
    denominatorBlockWindowTolerance: string
    minPercentageDifference: string
    maxPercentageDifference: boolean
  }
}

export const intentUniswapV3HistoricalTwapPercentageChange = {
  uniswapV3HistoricalTwapPercentageChange: {
    uniswapV3Pool: "0x",
    numeratorReferenceBlockOffset: "0",
    numeratorBlockWindow: "0",
    numeratorBlockWindowTolerance: "0",
    denominatorReferenceBlockOffset: "0",
    denominatorBlockWindow: "0",
    denominatorBlockWindowTolerance: "0",
    minPercentageDifference: "0",
    maxPercentageDifference: false,
  },
} as IntentUniswapV3HistoricalTwapPercentageChange

export const intentUniswapV3HistoricalTwapPercentageChangeFields = {
  UniswapV3Pool: (
    intentBatch: any,
    setIntentBatch: any,
    poolList: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "uniswapV3Pool"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"]["uniswapV3Pool"] =
              event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  // Time Range 1
  DenominatorReferenceBlockOffset: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "denominatorReferenceBlockOffset"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"][
              "denominatorReferenceBlockOffset"
            ] = event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  DenominatorReferenceBlockWindow: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "denominatorBlockWindow"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"][
              "denominatorBlockWindow"
            ] = event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),

  DenominatorBlockWindowTolerance: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "denominatorReferenceBlockOffset"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"][
              "denominatorReferenceBlockOffset"
            ] = event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  // --- Time Range 2 ---
  NumeratorReferenceBlockOffset: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "numeratorReferenceBlockOffset"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"][
              "numeratorReferenceBlockOffset"
            ] = event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  NumeratorReferenceBlockWindow: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "numeratorReferenceBlockOffset"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"][
              "numeratorReferenceBlockOffset"
            ] = event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),

  NumeratorBlockWindowTolerance: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="uniswapV3Pool" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <Input
        value={
          intentBatch["uniswapV3HistoricalTwapPercentageChange"][
            "numeratorReferenceBlockOffset"
          ]
        }
        onChange={(event: any) =>
          setIntentBatch((draft: any) => {
            draft["uniswapV3HistoricalTwapPercentageChange"][
              "numeratorReferenceBlockOffset"
            ] = event.target.value
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  // Price Differential
  MinPercentageDifference: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
      classNameValue?: string
      min: number
      max: number
      step: number
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label
          htmlFor="minPercentageDifference"
          className={config?.classNameLabel}
        >
          {config?.label}
        </Label>
      )}
      <div className="flex">
        <Slider
          defaultValue={[
            Number(
              intentBatch["uniswapV3HistoricalTwapPercentageChange"][
                "minPercentageDifference"
              ]
            ),
          ]}
          min={config?.min || 1}
          max={config?.max || 100}
          step={config?.step || 0.1}
          onValueChange={(value: any) =>
            setIntentBatch((draft: any) => {
              draft["uniswapV3HistoricalTwapPercentageChange"][
                "minPercentageDifference"
              ] = value[0]
            })
          }
        />
        <span className={config?.classNameValue}>
          <span className="">
            {
              intentBatch["uniswapV3HistoricalTwapPercentageChange"][
                "minPercentageDifference"
              ]
            }
          </span>{" "}
          <span className="">%</span>
        </span>
      </div>
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
  MaxPercentageDifference: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className?: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
      classNameValue?: string
      min: number
      max: number
      step: number
    }
  ) => (
    <div className={config?.className}>
      {config?.label && (
        <Label
          htmlFor="maxPercentageDifference"
          className={config?.classNameLabel}
        >
          {config?.label}
        </Label>
      )}
      <div className="flex">
        <Slider
          defaultValue={[
            Number(
              intentBatch["uniswapV3HistoricalTwapPercentageChange"][
                "maxPercentageDifference"
              ]
            ),
          ]}
          min={config?.min || 1}
          max={config?.max || 100}
          step={config?.step || 0.1}
          onValueChange={(value: any) =>
            setIntentBatch((draft: any) => {
              draft["uniswapV3HistoricalTwapPercentageChange"][
                "maxPercentageDifference"
              ] = value[0]
            })
          }
        />
        <span className={config?.classNameValue}>
          <span className="">
            {
              intentBatch["uniswapV3HistoricalTwapPercentageChange"][
                "maxPercentageDifference"
              ]
            }
          </span>{" "}
          <span className="">%</span>
        </span>
      </div>
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  ),
}
