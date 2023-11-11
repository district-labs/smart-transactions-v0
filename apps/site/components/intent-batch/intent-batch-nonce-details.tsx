import * as React from "react"
import {
  decodeDimensionalNonce,
  decodeStandardNonce,
  decodeTimeNonce,
} from "@district-labs/intentify-core"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@district-labs/ui-react"
import { HelpCircle } from "lucide-react"
import { type Hex } from "viem"

import { Row } from "../shared/row"

type IntentBatchNonceDetails = React.HTMLAttributes<HTMLElement> & {
  nonce: Hex
}

export const IntentBatchNonceDetails = ({ nonce }: IntentBatchNonceDetails) => {
  return (
    <TooltipProvider>
      <NonceSelection nonce={nonce} />
    </TooltipProvider>
  )
}

const NonceSelection = ({ nonce }: { nonce: Hex }) => {
  if (nonce?.startsWith("0x00")) {
    const [accumulator] = decodeStandardNonce(nonce)
    return (
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-x-1">
          <HelpCircle size={12} />
          <span className={"text-sm"}>Standard</span>
        </TooltipTrigger>
        <TooltipContent className="bg-card p-4 text-card-foreground">
          <h3 className="text-lg font-normal">Standard Nonce</h3>
          <span className="text-xs">Standard sequential transaction nonce</span>
          <hr className="my-2" />
          <div className="grid gap-y-2">
            <Row
              classNameLabel="text-sm"
              classNameValue="text-sm"
              label="Accumulator"
              value={accumulator.toString()}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  if (nonce?.startsWith("0x01")) {
    const [queue, accumulator] = decodeDimensionalNonce(nonce)
    return (
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-x-1">
          <HelpCircle size={12} />
          <span className={"text-sm"}>Dimensional</span>{" "}
        </TooltipTrigger>
        <TooltipContent className="bg-card p-4 text-card-foreground">
          <h3 className="text-lg font-normal">Dimensional Nonce</h3>
          <span className="text-xs">Multi-dimensional transaction nonce</span>
          <hr className="my-2" />
          <div className="grid gap-y-2">
            <Row
              classNameLabel="text-sm"
              classNameValue="text-sm"
              label="Queue"
              value={queue.toString()}
            />
            <Row
              classNameLabel="text-sm"
              classNameValue="text-sm"
              label="Accumulator"
              value={accumulator.toString()}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  if (nonce?.startsWith("0x02")) {
    const [id, delta, count] = decodeTimeNonce(nonce)
    return (
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-x-1">
          <HelpCircle size={12} />
          <span className={"text-sm"}>Time</span>{" "}
        </TooltipTrigger>
        <TooltipContent className="bg-card p-4 text-card-foreground">
          <h3 className="text-lg font-normal">Dimensional Nonce</h3>
          <span className="text-xs">Multi-dimensional transaction nonce</span>
          <hr className="my-2" />
          <div className="grid gap-y-2">
            <Row
              classNameLabel="text-sm"
              classNameValue="text-sm"
              label="ID"
              value={id.toString()}
            />
            <Row
              classNameLabel="text-sm"
              classNameValue="text-sm"
              label="Seconds Between"
              value={delta.toString()}
            />
            <Row
              classNameLabel="text-sm"
              classNameValue="text-sm"
              label="Limit"
              value={count.toString()}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  if (nonce?.startsWith("0x03")) {
    return (
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-x-1">
          <HelpCircle size={12} />
          <span className={"text-sm"}>Module</span>{" "}
        </TooltipTrigger>
        <TooltipContent className="bg-card p-4 text-card-foreground">
          <h3 className="text-lg font-normal">Module Nonce</h3>
          <span className="text-xs">
            Module transaction nonce. Execution rules managed by underlying
            intents
          </span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return null
}
