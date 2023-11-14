import * as React from "react"
import Image from "next/image"
import { Button, Card } from "@district-labs/ui-react"
import { useNetwork, useSwitchNetwork, type Chain } from "wagmi"

import { cn } from "@/lib/utils"

type NetworkDetailsAndConnect = React.HTMLAttributes<HTMLElement> & {
  name: string
  chainId: number
  type: string
  imgURL: string
}

export const NetworkDetailsAndConnect = ({
  className,
  name,
  chainId,
  type,
  imgURL,
}: NetworkDetailsAndConnect) => {
  // const currentChainId = useChainId();
  const { chain: currentChain } = useNetwork()
  const { chains, switchNetwork } = useSwitchNetwork()
  const classes = cn("p-6 flex items-center justify-between", className)

  const [networkMetadata, setNetworkMetadata] = React.useState<Chain>()
  React.useEffect(() => {
    if (chains) {
      setNetworkMetadata(chains.find((chain: any) => chain.id == chainId))
    }
  }, [chains, chainId])

  return (
    <Card className={classes}>
      <div className="flex items-center gap-x-3">
        <Image
          width={32}
          height={32}
          src={imgURL}
          className="h-10 w-10"
          alt="Network Icon"
        />
        <h4 className="text-2xl font-medium">{name}</h4>
        <span className="text-sm">({type})</span>
      </div>
      <div className="flex items-center gap-x-1">
        {chainId === currentChain?.id ? (
          <Button variant="outline" size="lg" className="text-xs">
            Connected
          </Button>
        ) : networkMetadata?.id ? (
          <Button
            size="lg"
            className="text-xs"
            onClick={() => switchNetwork?.(networkMetadata.id)}
          >
            Connect
          </Button>
        ) : (
          <Button size="lg" className="text-xs" disabled>
            Unavailable
          </Button>
        )}
      </div>
    </Card>
  )
}
