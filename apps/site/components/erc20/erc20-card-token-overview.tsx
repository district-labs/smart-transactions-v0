import * as React from "react"
import Image from "next/image"
import tokenList from "@/data/lists/token-list-testnet.json"
import { ERC20TotalSupply } from "@/integrations/erc20/components/erc20-read"
import { useFindTokenFromList } from "@/integrations/erc20/hooks/use-find-token-from-list"
import { Card } from "@district-labs/ui-react"
import { useChainId } from "wagmi"

import { cn } from "@/lib/utils"

import { ERC20BalanceSafe } from "./erc20-balanceOf-safe"
import { Erc20MintTestnet } from "./erc20-mint-testnet"

type Erc20CardTokenOverview = React.HTMLAttributes<HTMLElement> & {
  symbol: string
  mintAmount?: number
}

export const Erc20CardTokenOverview = ({
  className,
  symbol,
  mintAmount = 1,
}: Erc20CardTokenOverview) => {
  const classes = cn(
    className,
    "grid grid-cols-12 gap-x-5 w-full p-4 rounded-lg shadow-sm"
  )
  const chainId = useChainId()
  const token = useFindTokenFromList(tokenList, symbol, chainId)

  if (!token) return null
  return (
    <Card className={classes}>
      <div className="col-span-4 flex items-center">
        <Image
          alt={token.name}
          height={48}
          width={48}
          className="h-10 w-10 rounded-full"
          src={token?.logoURI}
        />
        <div className="ml-4">
          <h3 className="text-lg font-medium">{token?.name}</h3>
          <h3 className="text-sm font-light">{token?.symbol}</h3>
        </div>
      </div>
      <div className="col-span-6 flex items-center gap-x-10">
        <div className="flex-1">
          <h3 className="text-2xl font-bold">
            <ERC20BalanceSafe
              address={token.address as `0x${string}`}
              chainId={chainId}
            />
          </h3>
          <h3 className="text-sm font-light">Balance</h3>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold">
            <ERC20TotalSupply
              address={token.address as `0x${string}`}
              chainId={chainId}
            />
          </h3>
          <h3 className="text-sm font-light">Total Supply</h3>
        </div>
      </div>
      <div className="col-span-2">
        <Erc20MintTestnet
          className="w-full"
          amount={mintAmount}
          address={token.address as `0x${string}`}
          decimals={token.decimals}
          symbol={token.symbol}
        />
      </div>
    </Card>
  )
}
