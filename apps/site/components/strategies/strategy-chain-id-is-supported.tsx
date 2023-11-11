import * as React from "react"
import { useNetwork } from "wagmi"

type StrategyChainIdIsSupported = React.HTMLAttributes<HTMLElement> & {
  chainsSupported: number[]
}

export const StrategyChainIdIsSupported = ({
  children,
  chainsSupported,
}: StrategyChainIdIsSupported) => {
  const { chain: currentChain } = useNetwork()

  const [isChainSupported, setIsChainSupported] = React.useState<boolean>()
  React.useEffect(() => {
    if (chainsSupported.includes(currentChain?.id || 0))
      setIsChainSupported(true)
    else setIsChainSupported(false)
  }, [currentChain?.id, chainsSupported])

  if (!currentChain) return null

  if (!isChainSupported) return <>{children}</>

  return null
}
