import { encodeDimensionalNonce } from "@district-labs/intentify-core";
import type { Hex } from "viem";

// (BigInt(2) ** BigInt(120)) - BigInt(1);
const UINT120MAX = BigInt('1329227995784915872903807060280344575')

// (BigInt(2) ** BigInt(128)) - BigInt(1);
const UINT128MAX = BigInt('340282366920938463463374607431768211455')

export function useGenerateNonBlockingNonce(queueSalt: Hex): `0x${string}` {
    const queue = BigInt(queueSalt) & UINT120MAX;
    const nonce = BigInt(0) & UINT128MAX;
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return encodeDimensionalNonce(queue, nonce)
}