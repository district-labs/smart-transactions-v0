import { useMemo, type HTMLAttributes } from "react"
import { useNetwork, type Address, type Chain } from "wagmi"

import { cn } from "@/lib/utils"

const useBlockExplorerLink = ({
  chainId,
  chain,
  chains,
}: {
  chainId?: number
  chain?: Chain
  chains?: Chain[]
}):
  | {
      name: string
      url: string
    }
  | undefined => {
  return useMemo(() => {
    if (!chainId) {
      return chain?.blockExplorers?.default
    }
    if (!chains) return undefined
    const chainFiltered = chains.filter(
      (chain: { id: number }) => chain.id === chainId
    )[0]
    if (!chainFiltered) return undefined
    return chainFiltered?.blockExplorers?.default
  }, [chain, chainId])
}

interface BlockExplorerLinkProps extends HTMLAttributes<HTMLSpanElement> {
  address: Address | undefined
  chainId?: number
  showExplorerName?: boolean
  type?: "address" | "tx"
  customBlockExplorer?: {
    name: string
    url: string
  }
}

export const BlockExplorerLink = ({
  address,
  children,
  className,
  chainId,
  showExplorerName,
  type = "address",
  customBlockExplorer,
  ...props
}: BlockExplorerLinkProps) => {
  const { chain, chains } = useNetwork()

  const blockExplorer = useBlockExplorerLink({ chainId, chain, chains })
  const selectedBlockExplorer = customBlockExplorer ?? blockExplorer

  if (!address) return null

  return (
    <span
      className={cn("overflow-x-auto font-medium underline", className)}
      {...props}
    >
      {selectedBlockExplorer && (
        <a
          href={`${selectedBlockExplorer.url}/${type}/${address}`}
          rel="noreferrer"
          target="_blank"
        >
          {showExplorerName ? selectedBlockExplorer.name : children ?? address}
        </a>
      )}
    </span>
  )
}
