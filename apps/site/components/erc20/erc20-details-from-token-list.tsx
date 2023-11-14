import * as React from "react"
import Image from "next/image"
import type { Token, TokenList } from "@district-labs/intentify-core"

import { cn } from "@/lib/utils"

type ERC20DetailsFromTokenList = React.HTMLAttributes<HTMLElement> & {
  tokenList: TokenList
  address: string
}

export const ERC20DetailsFromTokenList = ({
  className,
  tokenList,
  address,
}: ERC20DetailsFromTokenList) => {
  const classes = cn(className, "flex gap-x-1 items-center")

  const [selectedToken, setSelectedToken] = React.useState<Token>()
  React.useEffect(() => {
    setSelectedToken(
      tokenList.tokens.find((token) => token.address === address)
    )
  }, [tokenList, address])

  if (!selectedToken)
    return <span className="text-xs">Token Info Unavailable</span>

  return (
    <div className={classes}>
      <Image
        alt={selectedToken.name}
        width={32}
        height={32}
        src={selectedToken?.logoURI}
        className="inline-block h-5 w-5 rounded-full"
      />
      <div className="flex flex-col gap-y-1">
        <div className="flex gap-x-1">
          <span className="font-semibold">{selectedToken?.symbol}</span>
        </div>
      </div>
    </div>
  )
}
