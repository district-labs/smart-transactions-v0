import { constants } from "ethers";
import * as React from "react";
import { encodeFunctionData } from "viem";
import { useChainId, useContractWrite, useWalletClient } from "wagmi";
import { useGetSafeAddress } from "..";
import {
  safeABI,
  usePrepareSafeExecTransaction,
  useSafeGetTransactionHash,
  useSafeNonce,
} from "../blockchain";
import { ADDRESS_ZERO } from "../data";
import { useGetIntentifyModuleAddress } from "../hooks/use-get-intentify-module-address";
import { cn } from "../utils";

type EnableSafeIntentModule = React.HTMLAttributes<HTMLElement> & {
  safeAddressOverride: `0x${string}`;
  signMessageComponent?: React.ReactNode;
  signTransactionComponent?: React.ReactNode;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  onLoading?: () => void;
};

export const EnableSafeIntentModule = ({
  children,
  signMessageComponent = <button type="button">Sign Message</button>,
  signTransactionComponent = <button type="button">Execute Transaction</button>,
  className,
  safeAddressOverride,
}: EnableSafeIntentModule) => {
  const classes = cn(className);
  const chainId = useChainId();
  const intentifyModuleAddress = useGetIntentifyModuleAddress(chainId);
  const safeAddress = useGetSafeAddress();
  const [signature, setSignature] = React.useState<{
    signed: boolean;
    signature: `0x${string}`;
  }>({
    signed: false,
    signature: "0x",
  });

  const nonce = useSafeNonce({
    address: safeAddress,
    enabled: true,
  });

  const transactionHash = useSafeGetTransactionHash({
    address: safeAddress,
    args: [
      safeAddress || safeAddressOverride || ADDRESS_ZERO, // to
      BigInt(0), // value
      encodeFunctionData({
        abi: safeABI,
        functionName: "enableModule",
        args: [intentifyModuleAddress],
      }), // data
      0, // operation
      BigInt(0), // safeTxGas
      BigInt(0), // baseGas
      BigInt(0), // gasPrice
      constants.AddressZero, // gasToken
      constants.AddressZero, // refundReceiver
      nonce.data as bigint, // nonce
    ],
  });

  const { config } = usePrepareSafeExecTransaction({
    address: safeAddress,
    args: [
      safeAddress || safeAddressOverride || ADDRESS_ZERO, // to
      BigInt(0), // value
      encodeFunctionData({
        abi: safeABI,
        functionName: "enableModule",
        args: [intentifyModuleAddress],
      }), // data
      0, // operation
      BigInt(0), // safeTxGas
      BigInt(0), // baseGas
      BigInt(0), // gasPrice
      constants.AddressZero, // gasToken
      constants.AddressZero, // refundReceiver
      signature.signature, // signatures
    ],
    enabled: signature.signed,
  });

  const _safe = useContractWrite(config);

  const { data: walletClient } = useWalletClient();

  const handleSignTransaction = async () => {
    const signMessageData = await walletClient?.signMessage?.({
      message: {
        raw: transactionHash.data as `0x${string}`,
      },
    });
    if (!signMessageData) return;
    const bitShiftedSig = signMessageData
      .replace(/1b$/, "1f")
      .replace(/1c$/, "20");
    setSignature({
      signed: true,
      signature: bitShiftedSig as `0x${string}`,
    });
  };

  const handleSubmitTransaction = () => {
    _safe?.write?.();
  };

  if (!signature.signed) {
    return (
      // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <span onClick={handleSignTransaction} className={classes}>
        {signMessageComponent}
      </span>
    );
  }

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span onClick={handleSubmitTransaction} className={classes}>
      {signTransactionComponent}
    </span>
  );
};
