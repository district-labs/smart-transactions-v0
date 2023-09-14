// @ts-nocheck
"use client";
import { generateIntentBatchEIP712 } from "@district-labs/intentify-utils";
import type { IntentBatch } from "@district-labs/intentify-utils";
import { constants } from "ethers";
import * as React from "react";
import { useChainId, useSignTypedData } from "wagmi";
import { cn } from "../utils";

type SignIntentBundle = React.HTMLAttributes<HTMLElement> & {
  verifyingContract: string;
  intentBatch: IntentBatch;
  onSuccess?: (res) => void;
  onError?: (res) => void;
  onLoading?: () => void;
};

export const SignIntentBundle = ({
  children,
  className,
  verifyingContract = constants.AddressZero,
  intentBatch,
  onSuccess,
  onError,
  onLoading,
}: SignIntentBundle) => {
  const classes = cn(className);
  const chainId = useChainId();

  const { data, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData(
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
      onError?.();
    }
  }, [isError, onError]);

  React.useEffect(() => {
    if (isLoading) {
      onLoading?.();
    }
  }, [isLoading, onLoading]);

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span onClick={handleSign} className={classes}>
      {children}
    </span>
  );
};
