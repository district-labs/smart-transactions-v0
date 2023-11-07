"use client"

import { HTMLAttributes } from "react"
import { formatUnits } from "viem"
import { Address } from "wagmi"

import { useGetSafeAddress } from '@district-labs/intentify-core-react' 
import { useErc20BalanceOf, useErc20Decimals } from "@/integrations/erc20/generated/erc20-wagmi"

export interface ERC20Props extends HTMLAttributes<HTMLElement> {
  address: Address
}

export interface ERC20ChainIdProps extends ERC20Props {
  chainId?: number
}

export function ERC20BalanceSafe({
  address,
  chainId,
  className,
  ...props
}: ERC20ChainIdProps) {
  const safeAddress = useGetSafeAddress()
  const { data: decimals, isSuccess: isSuccessDecimals } = useErc20Decimals({
    address,
    chainId,
  })
  const { data, isSuccess } = useErc20BalanceOf({
    chainId,
    address,
    args: safeAddress ? [safeAddress] : undefined,
    watch: true,
  })

  if (!isSuccess || !isSuccessDecimals) return <span className={className}>0</span>

  return (
    <span className={className} {...props}>
      {Number(formatUnits(BigInt(data || 0), decimals || 18)).toLocaleString()}
    </span>
  )
}
