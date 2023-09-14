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
import { EIP712_SAFE_TX_TYPE } from "@/utils/execution";
import { constants, ethers, utils } from "ethers";
import { _TypedDataEncoder } from "ethers/lib/utils";
import * as React from "react";
import { encodeFunctionData } from "viem";
import {
	useAccount,
	useChainId,
	useContractWrite,
	useSignMessage,
} from "wagmi";

type SafeSignature = {
	signer: string;
	data: string;
	dynamic: boolean;
};

const calculateSafeTransactionHash = (
	safeAddress: string,
	safeTx: any,
	chainId: number,
): string => {
	return _TypedDataEncoder.hash(
		{ verifyingContract: safeAddress, chainId },
		EIP712_SAFE_TX_TYPE,
		safeTx,
	);
};

const buildSignatureBytes = (signatures: SafeSignature[]): `0x{string}` => {
	const SIGNATURE_LENGTH_BYTES = 65;
	signatures.sort((left, right) =>
		left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()),
	);

	let signatureBytes = "0x" as `0x{string}`;
	let dynamicBytes = "";
	for (const sig of signatures) {
		if (sig.dynamic) {
			/* 
              A contract signature has a static part of 65 bytes and the dynamic part that needs to be appended 
              at the end of signature bytes.
              The signature format is
              Signature type == 0
              Constant part: 65 bytes
              {32-bytes signature verifier}{32-bytes dynamic data position}{1-byte signature type}
              Dynamic part (solidity bytes): 32 bytes + signature data length
              {32-bytes signature length}{bytes signature data}
          */
			const dynamicPartPosition = (
				signatures.length * SIGNATURE_LENGTH_BYTES +
				dynamicBytes.length / 2
			)
				.toString(16)
				.padStart(64, "0");
			const dynamicPartLength = (sig.data.slice(2).length / 2)
				.toString(16)
				.padStart(64, "0");
			const staticSignature = `${sig.signer
				.slice(2)
				.padStart(64, "0")}${dynamicPartPosition}00`;
			const dynamicPartWithLength = `${dynamicPartLength}${sig.data.slice(2)}`;

			signatureBytes += staticSignature;
			dynamicBytes += dynamicPartWithLength;
		} else {
			signatureBytes += sig.data.slice(2);
		}
	}

	// @ts-ignore
	return signatureBytes + dynamicBytes;
};

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
	const account = useAccount();
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

	// const encodedData = useSafeEncodeTransactionData({
	// 	address: safeAddress,
	// 	args: [
	// 		safeAddress, // to
	// 		BigInt(0), // value
	// 		"0x",
	// 		// encodeFunctionData({
	// 		// 	abi: safeABI,
	// 		// 	functionName: "enableModule",
	// 		// 	args: [intentifyModuleAddress],
	// 		// }), // data
	// 		0, // operation
	// 		BigInt(0), // safeTxGas
	// 		BigInt(0), // baseGas
	// 		BigInt(0), // gasPrice
	// 		constants.AddressZero, // gasToken
	// 		constants.AddressZero, // refundReceiver
	// 		nonce.data as bigint, // nonce
	// 	],
	// });

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

	const TX = {
		to: safeAddress, // to
		value: BigInt(0), // value
		data: "0x",
		// encodeFunctionData({
		// 	abi: safeABI,
		// 	functionName: "enableModule",
		// 	args: [intentifyModuleAddress],
		// }), // data
		operation: 0, // operation
		safeTxGas: BigInt(0), // safeTxGas
		baseGas: BigInt(0), // baseGas
		gasPrice: BigInt(0), // gasPrice
		gasToken: constants.AddressZero, // gasToken
		refundReceiver: constants.AddressZero, // refundReceiver
		nonce: nonce.data as bigint, // nonce
	};

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
			signature.signature, // signatures
		],
		enabled: signature.signed,
	});

	// const checkSignatures = useSafeCheckSignatures({
	// 	address: safeAddress,
	// 	// @ts-ignore
	// 	args: [transactionHash.data, encodedData.data, signature.signature],
	// });

	// console.log(checkSignatures.data, "checkSignaturescheckSignatures");

	const _safe = useContractWrite(config);

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
			// const r = signMessageData.substring(0, 66);
			// const s = `0x${signMessageData.substring(66, 130)}`;
			// const v = `0x${signMessageData.substring(130, 132)}`;
			// console.log(r, s, v, "rsv");
			// const bitShiftedSig = `${signMessageData.slice(0, -2)}20`;
			const bitShiftedSig = signMessageData
				.replace(/1b$/, "1f")
				.replace(/1c$/, "20");
			setSignature({
				signed: true,
				signature: buildSignatureBytes([
					{
						signer: account.address as `0x${string}`,
						data: bitShiftedSig,
						dynamic: false,
					},
				]),
			});
		}
	}, [signMessageData]);

	const handleSubmitTransaction = () => {
		_safe?.write?.();
	};

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
