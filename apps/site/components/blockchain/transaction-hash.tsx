"use client"

import Image from "next/image"
import { type Hex } from "viem"
import { useNetwork } from "wagmi"

import { cn } from "@/lib/utils"

import { IsDarkTheme } from "../shared/is-dark-theme"
import { IsLightTheme } from "../shared/is-light-theme"
import { LinkComponent } from "../shared/link-component"

type TransactionHash = React.HTMLAttributes<HTMLElement> & {
  transactionHash: Hex
  truncate?: boolean
  isLink?: boolean
}

export const TransactionHash = ({
  transactionHash,
  className,
  truncate,
  isLink,
  ...props
}: TransactionHash) => {
  const classes = cn(className, "flex items-center gap-x-1")
  const { chain } = useNetwork()
  const blockExplorerUrl = chain?.blockExplorers?.default.url
  const formattedTransaction = truncate
    ? `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`
    : transactionHash

  if (isLink && blockExplorerUrl) {
    return (
      <LinkComponent
        isExternal
        className={classes}
        href={`${blockExplorerUrl}/tx/${transactionHash}`}
        {...props}
      >
        <IsDarkTheme>
          <Image
            alt="Etherscan"
            src="/images/etherscan-light.svg"
            width={16}
            height={16}
          />
        </IsDarkTheme>
        <IsLightTheme>
          <Image
            alt="Etherscan"
            src="/images/etherscan-dark.svg"
            width={16}
            height={16}
          />
        </IsLightTheme>
        {formattedTransaction}
      </LinkComponent>
    )
  }

  return (
    <span className={classes} {...props}>
      {formattedTransaction}
    </span>
  )
}
