import { formatUnits } from "viem"

import { useErc20Decimals } from "../generated/erc20-wagmi"
import { type ERC20ChainIdProps } from "./erc20-read"

interface ERC20ConvertBalance extends ERC20ChainIdProps {
  balance: bigint | number | string
  className?: string
}
export function ERC20ConvertBalance({
  address,
  chainId,
  balance,
  className,
  ...props
}: ERC20ConvertBalance) {
  const { data: decimals } = useErc20Decimals({
    address,
    chainId,
  })

  return (
    <span className={className} {...props}>
      {Number(
        formatUnits(BigInt(balance) || BigInt(0), decimals || 1)
      ).toLocaleString()}
    </span>
  )
}
