import * as React from "react"

import { cn } from "@/lib/utils"

import { ChainIdToNetworkDetails } from "../blockchain/chain-id-to-network-details"

type Props = React.HTMLAttributes<HTMLElement> & {
  chainsSupported: number[]
}

export const ChainsSupportedList = ({ className, chainsSupported }: Props) => {
  const classes = cn(className)
  if (chainsSupported?.length < 1) {
    return <span className="text-xs">Coming Soon</span>
  }
  return (
    <div className={classes}>
      {chainsSupported.map((chainId) => (
        <ChainIdToNetworkDetails key={chainId} chainId={chainId} />
      ))}
    </div>
  )
}
