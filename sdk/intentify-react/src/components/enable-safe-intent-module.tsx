import { cn } from "../utils";
import {
	safeABI,
	usePrepareSafeExecTransaction,
	useSafeCheckNSignatures,
	useSafeCheckSignatures,
	useSafeEncodeTransactionData,
	useSafeGetTransactionHash,
	useSafeNonce,
} from "@/blockchain";
import { useGetIntentifyModuleAddress } from "@/hooks/use-get-intentify-module-address";
import { constants, utils } from "ethers";
import * as React from "react";
import { encodeFunctionData } from "viem";
import { useChainId, useContractWrite, useSignMessage } from "wagmi";

type EnableSafeIntentModule = React.HTMLAttributes<HTMLElement> & {
	safeAddress: `0x${string}`;
	onSuccess?: (res: any) => void;
	onError?: (res: any) => void;
	onLoading?: () => void;
};

export const EnableSafeIntentModule = ({
	children,
	className,
	safeAddress,
}: EnableSafeIntentModule) => {
	const classes = cn(className);
	const chainId = useChainId();
	const intentifyModuleAddress = useGetIntentifyModuleAddress(chainId);
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

	console.log(nonce, "noncenonce");

	const encodedData = useSafeEncodeTransactionData({
		address: safeAddress,
		args: [
			safeAddress, // to
			BigInt(0), // value
			"0x",
			// encodeFunctionData({
			// 	abi: safeABI,
			// 	functionName: "enableModule",
			// 	args: [intentifyModuleAddress],
			// }), // data
			0, // operation
			BigInt(0), // safeTxGas
			BigInt(0), // baseGas
			BigInt(0), // gasPrice
			constants.AddressZero, // gasToken
			constants.AddressZero, // refundReceiver
			nonce.data as bigint, // nonce
		],
	});

	const transactionHash = useSafeGetTransactionHash({
		address: safeAddress,
		args: [
			safeAddress, // to
			BigInt(0), // value
			"0x",
			// encodeFunctionData({
			// 	abi: safeABI,
			// 	functionName: "enableModule",
			// 	args: [intentifyModuleAddress],
			// }), // data
			0, // operation
			BigInt(0), // safeTxGas
			BigInt(0), // baseGas
			BigInt(0), // gasPrice
			constants.AddressZero, // gasToken
			constants.AddressZero, // refundReceiver
			nonce.data as bigint, // nonce
		],
	});

	console.log(signature.signature, "signature.signature");
	const { config } = usePrepareSafeExecTransaction({
		address: safeAddress,
		args: [
			safeAddress, // to
			BigInt(0), // value
			"0x",
			// encodeFunctionData({
			// 	abi: safeABI,
			// 	functionName: "enableModule",
			// 	args: [intentifyModuleAddress],
			// }), // data
			0, // operation
			BigInt(0), // safeTxGas
			BigInt(0), // baseGas
			BigInt(0), // gasPrice
			constants.AddressZero, // gasToken
			constants.AddressZero, // refundReceiver
			signature.signature, // signature
		],
		enabled: signature.signed,
	});

	const checkSignatures = useSafeCheckSignatures({
		address: safeAddress,
		// @ts-ignore
		args: [transactionHash.data, encodedData.data, signature.signature],
	});

	console.log(checkSignatures.data, "checkSignaturescheckSignatures");

	const safeProxyFactory = useContractWrite(config);

	const {
		data: signMessageData,
		error,
		isLoading,
		signMessage,
	} = useSignMessage({
		message: transactionHash.data,
	});

	const handleSignTransaction = () => {
		signMessage();
	};

	React.useEffect(() => {
		if (signMessageData) {
			setSignature({
				signed: true,
				signature: signMessageData,
			});
		}
	}, [signMessageData]);

	const handleSubmitTransaction = () => {
		safeProxyFactory?.write?.();
	};

	console.log(encodedData, "encodedData");
	console.log(transactionHash, "transactionHash");
	console.log(signMessageData, "signMessageData");

	if (!signature.signed) {
		return (
			// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
			<span onClick={handleSignTransaction} className={classes}>
				<button type="button">Sign Transaction</button>
			</span>
		);
	}

	return (
		// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<span onClick={handleSubmitTransaction} className={classes}>
			<button type="button">Execute Transaction</button>
			{/* {children} */}
		</span>
	);
};
