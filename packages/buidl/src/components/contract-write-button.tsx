import { ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"


import { Button } from "@district-labs/ui-react"

interface ContractWriteButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoadingTx: boolean
  isLoadingWrite: boolean
  write?: boolean
  loadingTxText?: string
  text?: string
}

export const ContractWriteButton = ({
  children,
  className,
  isLoadingTx,
  isLoadingWrite,
  write = true,
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
        <Loader2 className="animate-spin mx-auto" size={18} />
      ) : isLoadingTx ? (
        loadingTxText
      ) : (
        children
      )}
    </Button>
  )
}
