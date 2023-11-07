"use client"

import { useEffect, useState } from "react"
import {
  IntentBatch,
  Vault,
  type VaultList,
} from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentERC4626DepositBalanceContinual,
  intentERC4626DepositBalanceContinualFields,
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

export type StrategyAutomaticSavings = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  vaultList: VaultList
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
  }
  onIntentBatchGenerated: (intentBatchEIP712: IntentBatch) => void
  children: (props: StrategyChildrenCallback) => React.ReactNode
}

export function StrategyAutomaticSavings({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  vaultList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyAutomaticSavings) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentERC4626DepositBalanceContinual,
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

    intentBatchManager.add("Erc4626DepositBalanceContinual", [
      intentBatch.erc4626DepositBalanceContinual.tokenOut.address,
      parseUnits(
        String(intentBatch.erc4626DepositBalanceContinual.minBalance),
        intentBatch.erc4626DepositBalanceContinual.tokenOut.decimals
      ),
      parseUnits(
        String(intentBatch.erc4626DepositBalanceContinual.balanceDelta),
        intentBatch.erc4626DepositBalanceContinual.tokenOut.decimals
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
        {intentERC4626DepositBalanceContinualFields.TokenOut(
          intentBatch,
          setIntentBatch,
          vaultList,
          config?.tokenOut
        )}
        <div className="grid grid-cols-2 gap-x-4">
          {intentERC4626DepositBalanceContinualFields.BalanceDelta(
            intentBatch,
            setIntentBatch,
            config?.balanceDelta
          )}
          {intentERC4626DepositBalanceContinualFields.MinBalance(
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
            className={config?.intentStatement?.className}
            vault={intentBatch?.erc4626DepositBalanceContinual?.tokenOut}
            minBalance={intentBatch?.erc4626DepositBalanceContinual?.minBalance}
            balanceDelta={
              intentBatch?.erc4626DepositBalanceContinual?.balanceDelta
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
  vault: Vault
  minBalance: string
  balanceDelta: string
}

const IntentStatement = ({
  className,
  vault,
  minBalance,
  balanceDelta,
}: IntentStatement) => {
  const [balanceDeltaFormatted, setBalanceDeltaFormatted] = useState<string>()
  const [minimumAccountBalance, setMinimumAccountBalance] = useState<string>()
  useEffect(() => {
    if (vault && minBalance && balanceDelta) {
      setBalanceDeltaFormatted(numeral(balanceDelta).format("0,0"))
      const floor = BigInt(minBalance) + BigInt(balanceDelta)
      setMinimumAccountBalance(numeral(floor).format("0,0"))
    }
  }, [vault, minBalance, balanceDelta])

  if (!vault || !minBalance || !balanceDelta)
    return (
      <div className={className}>
        <p className="">
          Please fill out the form to generate an intent statement.
        </p>
      </div>
    )

  return (
    <div className={className}>
      Automatically save{" "}
      <span className="font-bold">
        {balanceDeltaFormatted}+ {vault?.asset?.symbol} in <span className='font-normal'>the PoolTogether</span> {vault?.name}
      </span>{" "} vault when you account contains{" "}
      <span className="font-bold">
        {minimumAccountBalance}+ ${vault?.asset.symbol}.
      </span>
    </div>
  )
}
