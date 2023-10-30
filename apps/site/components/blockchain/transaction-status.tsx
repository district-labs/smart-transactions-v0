import { HTMLAttributes, useEffect } from "react"
import { BaseError } from "viem"

import { toast } from "../ui/use-toast"

interface TransactionStatusProps extends HTMLAttributes<HTMLDivElement> {
  error?: BaseError
  isError: boolean
  isLoadingTx: boolean
  isSuccess: boolean
  hash?: `0x${string}`
}

export const TransactionStatus = ({
  className,
  error,
  isError,
  isLoadingTx,
  isSuccess,
  hash,
  ...props
}: TransactionStatusProps) => {
  useEffect(() => {
    if (isSuccess)
      toast({
        description: `Transaction successfully executed`,
      })
  }, [hash, isSuccess])

  useEffect(() => {
    if (isError)
      toast({
        description: `Transaction failed`,
        variant: "destructive",
      })
  }, [hash, isError])

  useEffect(() => {
    if (isLoadingTx)
      toast({
        description: `Transaction is being processed`,
      })
  }, [hash, isLoadingTx])

  return null
}
