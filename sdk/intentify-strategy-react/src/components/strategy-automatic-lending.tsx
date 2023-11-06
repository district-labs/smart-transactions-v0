"use client"

import { useEffect, useState } from "react"
import {
  IntentBatch,
  Token,
  type TokenList,
} from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentAaveV3SupplyBalanceContinual,
  intentAaveV3SupplyBalanceContinualFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import numeral from "numeral"
import { useImmer } from "use-immer"
import { parseUnits } from "viem"

import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { StrategyChildrenCallback } from "../types"
import { deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"
import { NonceStatement } from "./nonce-statement"
import { useDynamicNonce } from "./use-dynamic-nonce"

export type StrategyAutomaticLending = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    tokenOut: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    minBalance: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    balanceDelta: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    intentContainerStatement: {
      className: string
      label: string
    }
    intentStatement: {
      className: string
      label: string
    }
    nonceStatement: {
      className: string
      label: string
    }
  }
  onIntentBatchGenerated: (intentBatchEIP712: IntentBatch) => void
  children: (props: StrategyChildrenCallback) => React.ReactNode
}

export function StrategyAutomaticLending({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyAutomaticLending) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentAaveV3SupplyBalanceContinual,
    },
    defaultValues
  )

  const [intentBatch, setIntentBatch] = useImmer(startingState)

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

    intentBatchManager.add("AaveV3SupplyBalanceContinual", [
      intentBatch.aaveV3SupplyBalanceContinual.tokenOut.address,
      parseUnits(
        String(intentBatch.aaveV3SupplyBalanceContinual.minBalance),
        intentBatch.aaveV3SupplyBalanceContinual.tokenOut.decimals
      ),
      parseUnits(
        String(intentBatch.aaveV3SupplyBalanceContinual.balanceDelta),
        intentBatch.aaveV3SupplyBalanceContinual.tokenOut.decimals
      ),
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
        {intentAaveV3SupplyBalanceContinualFields.TokenOut(
          intentBatch,
          setIntentBatch,
          tokenList,
          config?.tokenOut
        )}
        <div className="grid grid-cols-2 gap-x-4">
          {intentAaveV3SupplyBalanceContinualFields.BalanceDelta(
            intentBatch,
            setIntentBatch,
            config?.balanceDelta
          )}
          {intentAaveV3SupplyBalanceContinualFields.MinBalance(
            intentBatch,
            setIntentBatch,
            config?.minBalance
          )}
        </div>
        <div className={config?.intentContainerStatement?.className}>
          <NonceStatement
            className={config?.nonceStatement?.className}
            nonce={intentBatch.nonce}
          />
          <IntentStatement
            token={intentBatch?.aaveV3SupplyBalanceContinual?.tokenOut}
            minBalance={intentBatch?.aaveV3SupplyBalanceContinual?.minBalance}
            balanceDelta={
              intentBatch?.aaveV3SupplyBalanceContinual?.balanceDelta
            }
          />
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

type IntentStatement = React.HTMLAttributes<HTMLElement> & {
  token: Token
  minBalance: string
  balanceDelta: string
}

const IntentStatement = ({
  className,
  token,
  minBalance,
  balanceDelta,
}: IntentStatement) => {
  const [balanceDeltaFormatted, setBalanceDeltaFormatted] = useState<string>()
  const [minimumAccountBalance, setMinimumAccountBalance] = useState<string>()
  useEffect(() => {
    if (token && minBalance && balanceDelta) {
      setBalanceDeltaFormatted(numeral(balanceDelta).format("0,0"))
      const floor = BigInt(minBalance) + BigInt(balanceDelta)
      setMinimumAccountBalance(numeral(floor).format("0,0"))
    }
  }, [token, minBalance, balanceDelta])

  if (!token || !minBalance || !balanceDelta)
    return (
      <div className={className}>
        <p className="">
          Please fill out the form to generate an intent statement.
        </p>
      </div>
    )

  return (
    <div className={className}>
      Automatically lend{" "}
      <span className="font-bold">
        {balanceDeltaFormatted}+ {token?.symbol}
      </span>{" "}
      when you account contains{" "}
      <span className="font-bold">
        {minimumAccountBalance}+ {token?.symbol}.
      </span>
    </div>
  )
}
