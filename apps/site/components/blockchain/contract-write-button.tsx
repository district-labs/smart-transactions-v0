import React, { ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "../ui/button"

interface ContractWriteButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoadingTx: boolean
  isLoadingWrite: boolean
  write?: boolean
  loadingWriteText?: any
  loadingTxText?: string
  text?: string
}

export const ContractWriteButton = ({
  children,
  className,
  isLoadingTx,
  isLoadingWrite,
  write = true,
  loadingWriteText = "Sign the transaction in your wallet",
  loadingTxText = "Writing...",
  ...props
}: ContractWriteButtonProps) => {
  return (
    <Button
      className={className}
      disabled={!write || isLoadingWrite || isLoadingTx}
      {...props}
    >
      {isLoadingWrite ? (
        <Loader2 className="animate-spin" size={18} />
      ) : isLoadingTx ? (
        loadingTxText
      ) : (
        children
      )}
    </Button>
  )
}
