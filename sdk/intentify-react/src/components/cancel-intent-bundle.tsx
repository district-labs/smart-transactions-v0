"use client";
import { useGetSafeAddress } from "..";
import { cn } from "../utils";
import {
	intentifySafeModuleABI,
	usePrepareSafeExecTransaction,
	useSafeGetTransactionHash,
	useSafeNonce,
} from "@/blockchain";
import { ADDRESS_ZERO } from "@/data";
import type { IntentBatch } from "@district-labs/intentify-utils";
import { constants } from "ethers";
import * as React from "react";
import { encodeFunctionData } from "viem";
import { useContractWrite, useWalletClient } from "wagmi";

type CancelIntentBundle = React.HTMLAttributes<HTMLElement> & {
	safeAddressOverride: `0x${string}`;
	verifyingContract: string;
	intentBatch: IntentBatch;
	signMessageComponent?: React.ReactNode;
	signTransactionComponent?: React.ReactNode;
	loadingComponent?: React.ReactNode;
	onSuccess?: (res: any) => void;
	onError?: (res: any) => void;
	onLoading?: () => void;
};

export const CancelIntentBundle = ({
	className,
	safeAddressOverride,
	intentBatch,
	signMessageComponent = <button type="button">Approve Cancel</button>,
	signTransactionComponent = <button type="button">Cancel Intent</button>,
	loadingComponent = <button type="button">Loading...</button>,
	onSuccess,
	onError,
	onLoading,
}: CancelIntentBundle) => {
	const classes = cn(className);
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

	const TRANSACTION: readonly [
		`0x${string}`,
		bigint,
		`0x${string}`,
		number,
		bigint,
		bigint,
		bigint,
		`0x${string}`,
		`0x${string}`,
	] = [
		safeAddress || safeAddressOverride || ADDRESS_ZERO, // to
		BigInt(0), // value
		encodeFunctionData({
			abi: intentifySafeModuleABI,
			functionName: "cancelIntentBatch",
			args: [intentBatch],
		}), // data
		0, // operation
		BigInt(0), // safeTxGas
		BigInt(0), // baseGas
		BigInt(0), // gasPrice
		constants.AddressZero, // gasToken
		constants.AddressZero, // refundReceiver
	];

	const transactionHash = useSafeGetTransactionHash({
		address: safeAddress,
		args: [...TRANSACTION, nonce.data as bigint],
	});

	const { config } = usePrepareSafeExecTransaction({
		address: safeAddress,
		args: [...TRANSACTION, signature.signature],
		enabled: signature.signed,
		onSuccess: (data) => {
			onSuccess?.(data);
		},
		onError: (data) => {
			onError?.(data);
		},
	});

	const _safe = useContractWrite(config);

	const { data: walletClient } = useWalletClient();

	const handleSubmitTransaction = () => {
		_safe?.write?.();
	};

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

	if (_safe.isLoading) {
		return (
			// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
			<span>{loadingComponent}</span>
		);
	}

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
