import * as React from "react"
import { ADDRESS_ZERO } from "@district-labs/intentify-core"
import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import makeBlockie from "ethereum-blockies-base64"

import { cn } from "@/lib/utils"

type BlockieSmartWallet = React.HTMLAttributes<HTMLElement>

export const BlockieSmartWallet = ({ className }: BlockieSmartWallet) => {
  const classes = cn(className)
  const address = useGetSafeAddress()

  return <img className={classes} src={makeBlockie(address || ADDRESS_ZERO)} />
}
