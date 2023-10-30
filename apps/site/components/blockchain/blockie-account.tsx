import * as React from "react"
import { ADDRESS_ZERO } from "@district-labs/intentify-core"
import makeBlockie from "ethereum-blockies-base64"
import { useAccount } from "wagmi"

import { cn } from "@/lib/utils"

type BlockieAccount = React.HTMLAttributes<HTMLElement>

export const BlockieAccount = ({ children, className }: BlockieAccount) => {
  const classes = cn(className)
  const { address } = useAccount()

  return (
    <span className={classes}>
      <img src={makeBlockie(address || ADDRESS_ZERO)} />
    </span>
  )
}
