import * as React from "react"
import Image from "next/image"

import { CHAIN_ID_TO_HUMAN_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

type ChainIdToNetworkDetails = React.HTMLAttributes<HTMLElement> & {
  chainId: number
  classNameLabel?: string
  classNameImage?: string
}

export const ChainIdToNetworkDetails = ({
  className,
  classNameImage = "h-4 w-4",
  classNameLabel,
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

  if (!chainDetails) return <span className={classes}>Unknown Network</span>
  return (
    <div className={classes}>
      {chainDetails.imgURL && (
        <Image
          width={32}
          height={32}
          src={chainDetails.imgURL}
          className={classNameImage}
          alt="Network Icon"
        />
      )}
      <span className={classNameLabel}>{chainDetails.name}</span>
    </div>
  )
}
