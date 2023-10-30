import { Loader2 } from "lucide-react"
import { BaseError, parseEther, parseUnits } from "viem"
import { Address, useAccount, useWaitForTransaction } from "wagmi"
import { symbol } from "zod"

import { ContractWriteButton } from "@/components/blockchain/contract-write-button"
import { TransactionStatus } from "@/components/blockchain/transaction-status"

import {
  useErc20MintableMint,
  usePrepareErc20MintableMint,
} from "../../integrations/erc20/generated/erc20-wagmi"

type Erc20MintTestnetProps = React.HTMLAttributes<HTMLElement> & {
  address: Address
  amount: number
  decimals: number
  symbol?: string
}

export function Erc20MintTestnet({
  className,
  address,
  amount,
  decimals,
  symbol,
}: Erc20MintTestnetProps) {
  const { address: accountAddress } = useAccount()

  const { config, error, isError } = usePrepareErc20MintableMint({
    address,
    args: accountAddress
      ? [accountAddress, parseUnits(`${Number(amount)}`, decimals)]
      : undefined,
    enabled: Boolean(address),
  })

  const {
    data,
    write,
    isLoading: isLoadingWrite,
  } = useErc20MintableMint(config)

  const { isLoading: isLoadingTx, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const onSubmit = () => {
    write?.()
  }

  return (
    <>
      <ContractWriteButton
        className={className}
        onClick={onSubmit}
        isLoadingTx={isLoadingTx}
        isLoadingWrite={isLoadingWrite}
        loadingWriteText={() => <Loader2 className="animate-spin" size={18} />}
        loadingTxText="Minting..."
        type="submit"
        write={!!write}
      >
        Mint {amount} {symbol}
      </ContractWriteButton>
      <TransactionStatus
        error={error as BaseError}
        hash={data?.hash}
        isError={isError}
        isLoadingTx={isLoadingTx}
        isSuccess={isSuccess}
      />
    </>
  )
}
