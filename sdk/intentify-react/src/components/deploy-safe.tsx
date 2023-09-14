import { cn } from "../utils";
import {
  multiSendABI,
  safeABI,
  safeProxyFactoryABI,
  usePrepareSafeProxyFactoryCreateProxyWithNonce,
  usePrepareWalletFactoryCreateDeterministicWallet,
  useWalletFactoryGetDeterministicWalletAddress,
} from "@/blockchain";
import { useGetIntentifyModuleAddress } from "@/hooks/use-get-intentify-module-address";
import {
  useGetSafeMultiCallAddress,
  useGetSafeMultiCallAddress,
} from "@/hooks/use-get-safe-multi-call-address";
import { useGetSafeProxyAddress } from "@/hooks/use-get-safe-proxy-address";
import { useGetSafeProxyFactoryAddress } from "@/hooks/use-get-safe-proxy-factory-address";
import { useGetWalletFactoryAddress } from "@/hooks/use-get-wallet-factory-address";
import { buildMultiSendSafeTx, encodeMultiSend } from "@/utils/multisend";
import { constants, ethers } from "ethers";
import * as React from "react";
import { createPublicClient, encodeFunctionData, http } from "viem";
import { useAccount, useChainId, useContractWrite } from "wagmi";

type DeploySafe = React.HTMLAttributes<HTMLElement> & {
  salt: number;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  onLoading?: () => void;
};

export const DeploySafe = ({ children, className, salt = 1 }: DeploySafe) => {
  const classes = cn(className);
  const chainId = useChainId();
  const account = useAccount();
  const multiCallAddress = useGetSafeMultiCallAddress(chainId);
  const walletFactoryAddress = useGetWalletFactoryAddress(chainId);
  const intentifyModuleAddress = useGetIntentifyModuleAddress(chainId);
  const safeProxyAddress = useGetSafeProxyAddress(chainId);
  const safeProxyFactoryAddress = useGetSafeProxyFactoryAddress(chainId);

  const MultiSendContract = new ethers.Contract(multiCallAddress, multiSendABI);

  const deterministicWalletAddress =
    useWalletFactoryGetDeterministicWalletAddress({
      address: walletFactoryAddress,
      args: [safeProxyAddress, BigInt(salt)],
      enabled: true,
    });

  console.log(deterministicWalletAddress, "deterministicWalletAddress");

  // const enableModuleData = encodeMultiSend([
  // 	{
  // 		to: deterministicWalletAddress.data as `0x{string}`, // WHAT ADDRESS SHOULD THIS BE?
  // 		value: 0,
  // 		data: encodeFunctionData({
  // 			abi: safeABI,
  // 			functionName: "enableModule",
  // 			args: [intentifyModuleAddress],
  // 		}),
  // 		operation: 1,
  // 	},
  // ]);

  const [enableModuleData, setEnableModuleData] = React.useState<string>("");
  React.useEffect(() => {
    if (deterministicWalletAddress.data && intentifyModuleAddress) {
      console.log(
        deterministicWalletAddress.data,
        "deterministicWalletAddress.data",
      );
      const data = encodeMultiSend([
        {
          to: deterministicWalletAddress.data as `0x{string}`, // WHAT ADDRESS SHOULD THIS BE?
          value: 0,
          data: encodeFunctionData({
            abi: safeABI,
            functionName: "enableModule",
            args: [intentifyModuleAddress],
          }),
          operation: 0,
        },
      ]);

      const data2 = encodeFunctionData({
        abi: safeABI,
        functionName: "setup",
        args: [
          [account?.address as `0x${string}`], // owners
          BigInt(1), // threshold
          // constants.AddressZero, // to
          // "0x", // data
          multiCallAddress as `0x{string}`, // to
          data as `0x${string}`, // data
          constants.AddressZero, // fallbackHandler
          constants.AddressZero, // paymentToken
          BigInt(0), // payment
          constants.AddressZero, // paymentReceiver
        ],
      });
      setEnableModuleData(data2);
    }
  }, [deterministicWalletAddress.data, intentifyModuleAddress]);

  console.log(enableModuleData);

  const { config } = usePrepareWalletFactoryCreateDeterministicWallet({
    address: walletFactoryAddress,
    args: [safeProxyAddress, enableModuleData as `0x{string}`, BigInt(salt)],
    enabled: enableModuleData?.length > 0,
  });

  const safeProxyFactory = useContractWrite(config);

  const handleSign = () => {
    safeProxyFactory?.write?.();
  };

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span onClick={handleSign} className={classes}>
      {children}
    </span>
  );
};
