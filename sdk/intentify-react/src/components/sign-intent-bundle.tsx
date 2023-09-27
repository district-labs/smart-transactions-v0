"use client";

import type { IntentBatch } from "@district-labs/intentify-utils";
import { generateIntentBatchEIP712 } from "@district-labs/intentify-utils";
import { constants } from "ethers";
import * as React from "react";
import { useChainId, useSignTypedData } from "wagmi";
import { cn } from "../utils";

type SignIntentBundle = React.HTMLAttributes<HTMLElement> & {
  verifyingContract?: `0x${string}`;
  intentBatch: IntentBatch;
  loadingComponent?: React.ReactNode;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
  onLoading?: () => void;
};

export const SignIntentBundle = ({
  children,
  className,
  verifyingContract = constants.AddressZero,
  intentBatch,
  loadingComponent = <button type="button">Loading...</button>,
  onSuccess,
  onError,
  onLoading,
}: SignIntentBundle) => {
  const classes = cn(className);
  const chainId = useChainId();

  const { data, error, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData(
      // @ts-ignore
      generateIntentBatchEIP712({
        chainId: chainId,
        verifyingContract: verifyingContract,
        intentBatch: intentBatch,
      }),
    );

  const handleSign = () => {
    signTypedData();
  };

  React.useEffect(() => {
    if (isSuccess) {
      onSuccess?.(data);
    }
  }, [data, isSuccess, onSuccess]);

  React.useEffect(() => {
    if (isError) {
      onError?.(error);
    }
  }, [isError, onError]);

  React.useEffect(() => {
    if (isLoading) {
      onLoading?.();
    }
  }, [isLoading, onLoading]);

  if (isLoading) {
    return loadingComponent;
  }

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span onClick={handleSign} className={classes}>
      {children}
    </span>
  );
};
