import { cn } from "../utils";
import {
  safeABI,
  usePrepareSafeProxyFactoryCreateProxyWithNonce,
  useWalletFactoryGetDeterministicWalletAddress,
} from "@/blockchain";
import { useGetSafeProxyAddress } from "@/hooks/use-get-safe-proxy-address";
import { useGetSafeProxyFactoryAddress } from "@/hooks/use-get-safe-proxy-factory-address";
import { useGetWalletFactoryAddress } from "@/hooks/use-get-wallet-factory-address";
import { constants } from "ethers";
import * as React from "react";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId, useContractWrite } from "wagmi";

type DeploySafe = React.HTMLAttributes<HTMLElement> & {
  salt: number;
  displaySafeAddress?: boolean;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  onLoading?: () => void;
};

export const DeploySafe = ({
  children,
  className,
  salt = 1,
  displaySafeAddress,
}: DeploySafe) => {
  const classes = cn(className);
  const chainId = useChainId();
  const account = useAccount();
  const walletFactoryAddress = useGetWalletFactoryAddress(chainId);
  const safeProxyAddress = useGetSafeProxyAddress(chainId);
  const safeProxyFactoryAddress = useGetSafeProxyFactoryAddress(chainId);

  const setupData = encodeFunctionData({
    abi: safeABI,
    functionName: "setup",
    args: [
      [account?.address as `0x${string}`], // owners
      BigInt(1), // threshold
      constants.AddressZero, // to
      "0x", // data
      constants.AddressZero, // fallbackHandler
      constants.AddressZero, // paymentToken
      BigInt(0), // payment
      constants.AddressZero, // paymentReceiver
    ],
  });

  const deterministicWalletAddress =
    useWalletFactoryGetDeterministicWalletAddress({
      address: walletFactoryAddress,
      args: [safeProxyAddress, setupData, BigInt(salt)],
      enabled: true,
    });

  const { config } = usePrepareSafeProxyFactoryCreateProxyWithNonce({
    address: safeProxyFactoryAddress,
    args: [safeProxyAddress, setupData as `0x{string}`, BigInt(salt)],
    enabled: setupData?.length > 0,
  });

  const safeProxyFactory = useContractWrite(config);

  const handleSign = () => {
    safeProxyFactory?.write?.();
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
