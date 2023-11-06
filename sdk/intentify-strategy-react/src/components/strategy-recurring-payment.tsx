"use client"

import { useEffect, useState } from "react"
import {
  IntentBatch,
  Token,
  type TokenList,
} from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20Transfer,
  intentErc20TransferFields,
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

export type StrategyRecurringPayment = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
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
    tokenOutAndAmount: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    to: {
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

export function StrategyRecurringPayment({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyRecurringPayment) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentErc20Transfer,
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

    intentBatchManager.add("Erc20Transfer", [
      intentBatch.erc20Transfer.tokenOut.address,
      parseUnits(
        String(intentBatch.erc20Transfer.amountOut),
        intentBatch.erc20Transfer.tokenOut.decimals
      ),
      intentBatch.erc20Transfer.to,
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
        <div className="">
          {intentErc20TransferFields.tokenOutAndAmount(
            intentBatch,
            setIntentBatch,
            tokenList,
            config?.tokenOutAndAmount
          )}
        </div>
        <div className="">
          {intentErc20TransferFields.to(
            intentBatch,
            setIntentBatch,
            config?.to
          )}
        </div>
        <div className={config?.intentContainerStatement?.className}>
          <NonceStatement
            className={config?.nonceStatement?.className}
            nonce={intentBatch.nonce}
          />
          <IntentStatement
            className={config?.intentStatement?.className}
            token={intentBatch?.erc20Transfer?.tokenOut}
            amount={intentBatch?.erc20Transfer?.amountOut}
            to={intentBatch?.erc20Transfer?.to}
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
  amount: string
  to: string
}

const IntentStatement = ({ className, token, amount, to }: IntentStatement) => {
  const [balanceDeltaFormatted, setBalanceDeltaFormatted] = useState<string>()
  useEffect(() => {
    if (token && amount) {
      setBalanceDeltaFormatted(numeral(amount).format("0,0"))
    }
  }, [token, amount])

  if (!token || !amount || !to)
    return (
      <div className={className}>
        <p className="">
          Please fill out the form to generate an intent statement.
        </p>
      </div>
    )

  return (
    <div className={className}>
      Send{" "}
      <span className="font-bold">
        {balanceDeltaFormatted} {token?.symbol}
      </span>{" "}
      to <span className="font-bold">{to}.</span>
    </div>
  )
}
