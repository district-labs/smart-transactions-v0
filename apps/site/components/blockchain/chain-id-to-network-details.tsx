import * as React from "react"

import { CHAIN_ID_TO_HUMAN_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

type ChainIdToNetworkDetails = React.HTMLAttributes<HTMLElement> & {
  chainId: number
}

export const ChainIdToNetworkDetails = ({
  className,
  chainId,
}: ChainIdToNetworkDetails) => {
  const classes = cn(className, "flex items-center gap-x-1")
  const [chainDetails, setChainDetails] = React.useState<
    | {
        name: string
        imgURL?: string
      }
    | undefined
  >()
  React.useEffect(() => {
    setChainDetails(CHAIN_ID_TO_HUMAN_NAME[chainId])
  }, [chainId])

  if (!chainDetails) return <span className={classes}>unknown</span>
  return (
    <div className={classes}>
      <img src={chainDetails.imgURL} className="h-4 w-4" alt="Network Icon" />
      <span className="text-sm">{chainDetails.name}</span>
    </div>
  )
}
