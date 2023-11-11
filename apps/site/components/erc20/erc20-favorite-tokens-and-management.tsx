import * as React from "react"
import Image from "next/image"
import tokenList from "@/data/lists/token-list-testnet.json"
import { useFindTokenFromList } from "@/integrations/erc20/hooks/use-find-token-from-list"
import {
  IsSafeCounterfactual,
  IsSafeMaterialized,
} from "@district-labs/intentify-core-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@district-labs/ui-react"
import { useChainId } from "wagmi"

import { cn } from "@/lib/utils"

import { ResponsiveMobileAndDesktop } from "../shared/responsive-mobile-and-desktop"
import { ViewCreateAndSetupSmartWallet } from "../view/view-create-and-setup-smart-wallet"
import { ERC20BalanceSafe } from "./erc20-balanceOf-safe"
import { Erc20CardTokenOverview } from "./erc20-card-token-overview"

type Erc20FavoriteTokensAndManagement = React.HTMLAttributes<HTMLElement>

export const Erc20FavoriteTokensAndManagement = ({
  className,
}: Erc20FavoriteTokensAndManagement) => {
  const classes = cn(
    "py-2 px-4 rounded-2xl bg-background shadow-sm border-2 border-neutral-100 dark:border-neutral-800 flex justify-between",
    className
  )

  return (
    <div className="">
      <div className={classes}>
        <div className="flex items-center justify-between gap-x-4">
          <ResponsiveMobileAndDesktop>
            <>
              <Erc20Token symbol="WETH" />
              <Erc20Token symbol="USDC" />
            </>
            <>
              <Erc20Token symbol="WETH" />
              <Erc20Token symbol="USDC" />
              <Erc20Token symbol="DIS" />
              <Erc20Token symbol="RIZZ" />
            </>
          </ResponsiveMobileAndDesktop>
        </div>
        <Sheet>
          <SheetTrigger className="cursor-pointer text-xs font-medium hover:opacity-80">
            Manage Tokens
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full w-full">
            <IsSafeCounterfactual>
              <ViewCreateAndSetupSmartWallet />
            </IsSafeCounterfactual>
            <IsSafeMaterialized>
              <SheetHeader>
                <SheetTitle>Token Manage</SheetTitle>
                <SheetDescription>
                  Manage your favorite tokens.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-10 grid gap-5">
                <Erc20CardTokenOverview symbol="WETH" mintAmount={1} />
                <Erc20CardTokenOverview symbol="USDC" mintAmount={1000} />
                <Erc20CardTokenOverview symbol="DIS" mintAmount={10} />
                <Erc20CardTokenOverview symbol="RIZZ" mintAmount={5} />
              </div>
            </IsSafeMaterialized>
          </SheetContent>
        </Sheet>
      </div>
      <span className="text-light mx-auto mt-1 block w-full text-center text-2xs">
        Favorite Tokens
      </span>
    </div>
  )
}

type Erc20Token = React.HTMLAttributes<HTMLElement> & {
  symbol: string
}

export const Erc20Token = ({ className, symbol }: Erc20Token) => {
  const classes = cn(" flex items-center gap-x-2", className)
  const chainId = useChainId()
  const token = useFindTokenFromList(tokenList, symbol, chainId)

  if (!token) return null

  return (
    <div className={classes}>
      <Image
        width={48}
        height={48}
        src={token.logoURI}
        className="h-6 w-6 rounded-full"
        alt={token.name}
      />
      <ERC20BalanceSafe
        address={token.address as `0x${string}`}
        chainId={token.chainId}
      />
      <span className="text-2xs font-medium">{token.symbol}</span>
    </div>
  )
}
