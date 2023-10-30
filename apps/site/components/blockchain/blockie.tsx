import * as React from "react"
import { ADDRESS_ZERO } from "@district-labs/intentify-core"
import makeBlockie from "ethereum-blockies-base64"

import { cn } from "@/lib/utils"

type Blockie = React.HTMLAttributes<HTMLElement> & {
  address: `0x${string}`
}

export const Blockie = ({ className, address }: Blockie) => {
  const classes = cn(className)

  return <img className={classes} src={makeBlockie(address || ADDRESS_ZERO)} />
}
