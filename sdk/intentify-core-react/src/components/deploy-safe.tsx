import { constants } from "ethers";
import * as React from "react";
import { useAccount, useChainId, useContractWrite } from "wagmi";
import {
  usePrepareWalletFactoryCreateDeterministicWallet,
  useWalletFactoryGetDeterministicWalletAddress
} from "../blockchain";
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

  console.log(safeProxyAddress, 'safeProxyAddresssafeProxyAddress')

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

  const { config } = usePrepareWalletFactoryCreateDeterministicWallet({
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

  const handleSign = () => {
    walletFactory?.write?.();
  };

  return (
    <>
      {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <span onClick={handleSign} className={classes}>
        {children}
      </span>
      {displaySafeAddress && (
        <span className="text-xs ml-2">
          Deterministic Address: {deterministicWalletAddress.data}
        </span>
      )}
    </>
  );
};
