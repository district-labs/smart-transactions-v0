"use client"

import { useEffect } from "react"
import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import {
  useIntentifySafeModuleGetDimensionalNonce,
  useIntentifySafeModuleGetStandardNonce,
} from "@district-labs/intentify-core-react"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20SwapSpotPrice,
  intentErc20SwapSpotPriceFields,
  intentUniswapV3HistoricalTwapPercentageChange,
  intentUniswapV3HistoricalTwapPercentageChangeFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import {
  Card,
  CardContent,
  CardFooter,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@district-labs/ui-react"
import { useImmer } from "use-immer"

import { StrategyChildrenCallback } from "../types"
import { deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"

export type StrategyMeanReversion = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    // erc20-swap-spot-price
    tokenOutAndAmount: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenIn: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenAmountExpected: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    thresholdSeconds: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    isBuy: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    // uniswapv3-historical-twap-percentage-change
    uniswapV3Pool: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    numeratorTrigger: {
      labelTrigger: string
      classNameTrigger: string
    }
    denominatorTrigger: {
      labelTrigger: string
      classNameTrigger: string
    }
    numeratorReferenceBlockOffset: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    numeratorBlockWindow: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    numeratorBlockWindowTolerance: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    denominatorReferenceBlockOffset: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    denominatorBlockWindow: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    denominatorBlockWindowTolerance: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    minPercentageDifference: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    maxPercentageDifference: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  }
  onIntentBatchGenerated: (intentBatchEIP712: IntentBatch) => void
  children: (props: StrategyChildrenCallback) => React.ReactNode
}

export function StrategyMeanReversion({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyMeanReversion) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentErc20SwapSpotPrice,
      ...intentUniswapV3HistoricalTwapPercentageChange,
    },
    defaultValues
  )

  const [intentBatch, setIntentBatch] = useImmer(startingState)

  const { data: nonceStandardData, error: nonceStandardError } =
    useIntentifySafeModuleGetStandardNonce({
      address: intentifySafeModuleAddress,
      chainId: chainId,
      args: [root],
      enabled: intentBatch.nonce.type === "standard",
    })

  const { data: nonceDimensionalData, error: nonceDimensionalError } =
    useIntentifySafeModuleGetDimensionalNonce({
      address: intentifySafeModuleAddress,
      chainId: chainId,
      args: [root, intentBatch.nonce.args[0]],
      enabled: intentBatch.nonce.type === "dimensional",
    })

  useEffect(() => {
    if (
      intentBatch.nonce.type === "dimensional" &&
      config?.nonce?.dimensional?.defaultQueue
    ) {
      setIntentBatch((draft: any) => {
        draft["nonce"]["args"][0] = config?.nonce?.dimensional?.defaultQueue
      })
    }
  }, [intentBatch.nonce.type])

  const handleGenerateIntentBatch = async () => {
    if (!intentBatchFactory)
      throw new Error("Intent Batch Factory not initialized")
    if (!chainId) throw new Error("ChainId unavailable")
    const intentBatchManager = intentBatchFactory?.create(chainId, root)

    if (intentBatch.nonce.type === "standard") {
      intentBatchManager.nonce("standard", [nonceStandardData])
    }

    if (intentBatch.nonce.type === "dimensional") {
      intentBatchManager.nonce("dimensional", [
        intentBatch.nonce.args[0],
        nonceDimensionalData,
      ])
    }
    if (intentBatch.nonce.type === "time") {
      intentBatchManager.nonce("time", [
        intentBatch.nonce.args[0],
        intentBatch.nonce.args[1],
        intentBatch.nonce.args[2],
      ])
    }

    intentBatchManager.add("Erc20LimitOrder", [
      intentBatch.erc20LimitOrder.tokenIn.address,
      intentBatch.erc20LimitOrder.tokenOut.address,
      intentBatch.erc20LimitOrder.amountIn,
      intentBatch.erc20LimitOrder.amountOut,
    ])
    const intentBatchStruct = intentBatchManager.generate()
    onIntentBatchGenerated?.(intentBatchStruct)
  }

  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        <NonceManager
          intentBatch={intentBatch}
          setIntentBatch={setIntentBatch}
          nonceConfig={config?.nonce}
        />
        {/* UniswapV3 Pool Address */}
        {intentUniswapV3HistoricalTwapPercentageChangeFields.UniswapV3Pool(
          intentBatch,
          setIntentBatch,
          tokenList,
          config?.uniswapV3Pool
        )}
        {/* UniswapV3 Pool Address */}
        <div className="">
          {/* UniswapV3 Pool Address */}
          <div className="flex gap-x-4">
            <div className="flex-1">
              {intentErc20SwapSpotPriceFields.TokenOutAndAmount(
                intentBatch,
                setIntentBatch,
                tokenList,
                config?.tokenOutAndAmount
              )}
            </div>
            {intentErc20SwapSpotPriceFields.IsBuy(
              intentBatch,
              setIntentBatch,
              config?.isBuy
            )}
          </div>
        </div>
        {intentErc20SwapSpotPriceFields.TokenIn(
          intentBatch,
          setIntentBatch,
          tokenList,
          config?.tokenIn
        )}
        <div className="">
          <h3 className="mb-4 text-2xl font-bold">Time Ranges</h3>
          <div className="">
            <h3 className="text-lg font-medium">Time Range Baseline</h3>
            <div className="flex gap-x-4">
              <div className="flex-1">
                {intentUniswapV3HistoricalTwapPercentageChangeFields.NumeratorReferenceBlockOffset(
                  intentBatch,
                  setIntentBatch,
                  config?.numeratorReferenceBlockOffset
                )}
              </div>
              <div className="flex-1">
                {intentUniswapV3HistoricalTwapPercentageChangeFields.NumeratorReferenceBlockWindow(
                  intentBatch,
                  setIntentBatch,
                  config?.numeratorBlockWindow
                )}
              </div>
            </div>
            <div className="">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <span className={config?.numeratorTrigger?.classNameTrigger}>
                    {config?.numeratorTrigger?.labelTrigger ||
                      "Advanced Settings"}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {intentUniswapV3HistoricalTwapPercentageChangeFields.NumeratorBlockWindowTolerance(
                    intentBatch,
                    setIntentBatch,
                    config?.numeratorBlockWindowTolerance
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
            <h3 className="mt-6 text-lg font-medium">Time Range Delta</h3>
            <div className="flex w-full gap-x-4">
              <div className="flex-1">
                {intentUniswapV3HistoricalTwapPercentageChangeFields.DenominatorReferenceBlockOffset(
                  intentBatch,
                  setIntentBatch,
                  config?.denominatorReferenceBlockOffset
                )}
              </div>
              <div className="flex-1">
                {intentUniswapV3HistoricalTwapPercentageChangeFields.DenominatorReferenceBlockWindow(
                  intentBatch,
                  setIntentBatch,
                  config?.denominatorBlockWindow
                )}
              </div>
            </div>
            <div className="">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <span
                    className={config?.denominatorTrigger?.classNameTrigger}
                  >
                    {config?.denominatorTrigger?.labelTrigger ||
                      "Advanced Settings"}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {intentUniswapV3HistoricalTwapPercentageChangeFields.DenominatorBlockWindowTolerance(
                    intentBatch,
                    setIntentBatch,
                    config?.denominatorBlockWindowTolerance
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
        <h3 className="mt-6 text-lg font-medium">Price Range</h3>
        <div className="">
          {intentUniswapV3HistoricalTwapPercentageChangeFields.MaxPercentageDifference(
            intentBatch,
            setIntentBatch,
            config?.minPercentageDifference
          )}
          {intentUniswapV3HistoricalTwapPercentageChangeFields.MinPercentageDifference(
            intentBatch,
            setIntentBatch,
            config?.maxPercentageDifference
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3">
        {children({
          intentBatch,
          handleGenerateIntentBatch,
        })}
      </CardFooter>
    </Card>
  )
}
