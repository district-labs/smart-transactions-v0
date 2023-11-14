import { constants } from "ethers";
import * as React from "react";
import { useAccount, useChainId, useContractWrite, useWaitForTransaction } from "wagmi";
import {
  usePrepareWalletFactoryCreateDeterministicWallet,
  useWalletFactoryGetDeterministicWalletAddress
} from "../blockchain";
import {  type BaseError } from "viem"
import { ContractWriteButton, TransactionStatus } from '@district-labs/buidl'
import { DEFAULT_SALT } from "@district-labs/intentify-core";
import { useGetSafeProxyAddress } from "../hooks/use-get-safe-proxy-address";
import { useGetWalletFactoryAddress } from "../hooks/use-get-wallet-factory-address";
import { cn } from "../utils";

type DeploySafe = React.HTMLAttributes<HTMLElement> & {
  salt?: bigint;
  displaySafeAddress?: boolean;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  onLoading?: () => void;
};

export const DeploySafe = ({
  children,
  className,
  salt = DEFAULT_SALT,
  displaySafeAddress,
  onSuccess,
  onError,
  onLoading,
}: DeploySafe) => {
  const classes = cn(className);
  const chainId = useChainId();
  const account = useAccount();
  const walletFactoryAddress = useGetWalletFactoryAddress(chainId);
  const safeProxyAddress = useGetSafeProxyAddress(chainId);

  const deterministicWalletAddress =
    useWalletFactoryGetDeterministicWalletAddress({
      address: walletFactoryAddress,
      args: [
        safeProxyAddress,
        account.address || constants.AddressZero,
        BigInt(salt),
      ],
      enabled: !!account?.address,
    });

  const { config, ...prepare } = usePrepareWalletFactoryCreateDeterministicWallet({
    address: walletFactoryAddress,
    args: [
      safeProxyAddress,
      account.address || constants.AddressZero,
      BigInt(salt),
    ],
    enabled: !!account?.address,
    onSuccess,
    onError,
  });

  const walletFactory = useContractWrite(config);

  const transaction = useWaitForTransaction({
    hash: walletFactory?.data?.hash as `0x${string}`,
    enabled: !!walletFactory?.data?.hash,
  })

  const handleSign = () => {
    walletFactory?.write?.();
  };

  return (
    <>
      <ContractWriteButton 
        className={classes}
        isLoadingTx={transaction.isLoading}
        isLoadingWrite={walletFactory.isLoading}
        loadingWriteText={() => <span className=''>Loading...</span>}
        loadingTxText="Deploying Wallet"
        type="submit"
        write={!!walletFactory.write}
        onClick={handleSign} 
      >
        {children}
      </ContractWriteButton>
      {displaySafeAddress && (
        <span className="text-xs ml-2">
          Deterministic Address: {deterministicWalletAddress.data}
        </span>
      )}
      <TransactionStatus
        error={prepare.error as BaseError}
        hash={walletFactory?.data?.hash}
        isError={prepare.isError}
        isLoadingTx={transaction.isLoading}
        isSuccess={transaction.isSuccess}
      />
    </>
  );
};
