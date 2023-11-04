"use client"

import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20SwapSpotPriceExactTokenIn,
  intentErc20SwapSpotPriceExactTokenInFields,
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
import { parseUnits } from "viem"

import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { tokenToChainLinkFeed } from "../token-to-chainlink-feed"
import { StrategyChildrenCallback } from "../types"
import { decimalToBigInt, deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"
import { useDynamicNonce } from "./use-dynamic-nonce"
import { useEffect } from "react"

export type StrategyMeanReversionBuy = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    // erc20-swap-spot-price
    tokenInAndAmount: {
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
    tokenOutAmount: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenOutPriceFeed: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    chainlinkTrigger: {
      labelTrigger: string
      classNameTrigger: string
    }
    tokenInPriceFeed: {
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

export function StrategyMeanReversionBuy({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyMeanReversionBuy) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentErc20SwapSpotPriceExactTokenIn,
      ...intentUniswapV3HistoricalTwapPercentageChange,
    },
    defaultValues
  )

  const [intentBatch, setIntentBatch] = useImmer(startingState)

  useEffect( () => { 
    if(chainId)  {
        setIntentBatch((draft:any) => {
            draft.ec20SwapSpotPriceExactTokenIn.tokenInPriceFeed = tokenToChainLinkFeed(
                intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenIn?.address
              )
        })
    }
  }, [intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenIn])

  useEffect( () => { 
    if(chainId)  {
        setIntentBatch((draft:any) => {
            draft.ec20SwapSpotPriceExactTokenIn.tokenOutPriceFeed = tokenToChainLinkFeed(
                intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenOut?.address
              )
        })
    }
  }, [intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenOut])

  const nonceData = useDynamicNonce({
    address: intentifySafeModuleAddress,
    chainId,
    intentBatch,
    root,
    setIntentBatch,
    config,
  })

  const handleGenerateIntentBatch = async () => {
    if (!intentBatchFactory)
      throw new Error("Intent Batch Factory not initialized")
    if (!chainId) throw new Error("ChainId unavailable")
    const intentBatchManager = intentBatchFactory?.create(chainId, root)

    setIntentBatchManagerNonce(intentBatchManager, intentBatch, {
      standard: nonceData.standard,
      dimensional: nonceData.dimensional,
    })
    intentBatchManager.add("Erc20SwapSpotPriceExactTokenIn", [
      intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenOut?.address,
      intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenIn?.address,
      intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenOutPriceFeed,
      intentBatch?.ec20SwapSpotPriceExactTokenIn?.tokenInPriceFeed,
      parseUnits(
        String(intentBatch.ec20SwapSpotPriceExactTokenIn?.tokenInAmount),
        intentBatch.ec20SwapSpotPriceExactTokenIn.tokenIn.decimals
      ),
      intentBatch?.ec20SwapSpotPriceExactTokenIn?.thresholdSeconds || 3600,
    ])

    intentBatchManager.add("UniswapHistoricalV3TwapPercentageChange", [
      intentBatch?.uniswapV3HistoricalTwapPercentageChange?.uniswapV3Pool,
      intentBatch?.uniswapV3HistoricalTwapPercentageChange
        ?.numeratorReferenceBlockOffset,
      intentBatch?.uniswapV3HistoricalTwapPercentageChange
        ?.numeratorBlockWindow,
      intentBatch?.uniswapV3HistoricalTwapPercentageChange
        ?.numeratorBlockWindowTolerance,
      intentBatch?.uniswapV3HistoricalTwapPercentageChange
        ?.denominatorReferenceBlockOffset,
      intentBatch?.uniswapV3HistoricalTwapPercentageChange
        ?.denominatorBlockWindow,
      intentBatch?.uniswapV3HistoricalTwapPercentageChange
        ?.denominatorBlockWindowTolerance,
      decimalToBigInt(
        intentBatch?.uniswapV3HistoricalTwapPercentageChange
          ?.minPercentageDifference,
        4
      ),
      decimalToBigInt(
        intentBatch?.uniswapV3HistoricalTwapPercentageChange
          ?.maxPercentageDifference,
        4
      ),
    ])
    const intentBatchStruct = intentBatchManager.generate()
    onIntentBatchGenerated?.(intentBatchStruct)
  }
  return (
    <Card>
      <CardContent className="grid gap-4 pt-4">
        <NonceManager
          intentBatch={intentBatch}
          setIntentBatch={setIntentBatch}
          nonceConfig={config?.nonce}
        />
        {/* Token Out & Amount */}
        <div className="">
          <div className="flex gap-x-4">
            <div className="flex-1">
              {intentErc20SwapSpotPriceExactTokenInFields.TokenInAndAmount(
                intentBatch,
                setIntentBatch,
                tokenList,
                config?.tokenInAndAmount
              )}
            </div>
          </div>
        </div>
        {intentErc20SwapSpotPriceExactTokenInFields.TokenOut(
          intentBatch,
          setIntentBatch,
          tokenList,
          config?.tokenIn
        )}
        {/* Advanced Fields : Chainlink Data Feeds */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <span className={config?.chainlinkTrigger?.classNameTrigger}>
              {config?.chainlinkTrigger?.labelTrigger || "Advanced Settings"}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="grid gap-6 pt-4">
            {intentErc20SwapSpotPriceExactTokenInFields.TokenOutPriceFeed(
              intentBatch,
              setIntentBatch,
              config?.tokenOutPriceFeed
            )}
            {intentErc20SwapSpotPriceExactTokenInFields.TokenInPriceFeed(
              intentBatch,
              setIntentBatch,
              config?.tokenInPriceFeed
            )}
            {intentErc20SwapSpotPriceExactTokenInFields.ThresholdSeconds(
              intentBatch,
              setIntentBatch,
              config?.thresholdSeconds
            )}
          </CollapsibleContent>
        </Collapsible>
        <hr className="" />
        <div className="">
        {/* UniswapV3 Pool Address */}
            {intentUniswapV3HistoricalTwapPercentageChangeFields.UniswapV3Pool(
            intentBatch,
            setIntentBatch,
            config?.uniswapV3Pool
            )}
          <div className="mt-4">
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
          {intentUniswapV3HistoricalTwapPercentageChangeFields.MinPercentageDifference(
            intentBatch,
            setIntentBatch,
            config?.minPercentageDifference
          )}
          {intentUniswapV3HistoricalTwapPercentageChangeFields.MaxPercentageDifference(
            intentBatch,
            setIntentBatch,
            config?.maxPercentageDifference
          )}
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
