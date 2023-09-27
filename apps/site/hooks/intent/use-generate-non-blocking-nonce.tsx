import { encodeDimensionalNonce } from "@district-labs/intentify-utils";
import { BigNumber } from "ethers";
import type { Hex } from "viem";

// const UINT32MAX = BigNumber.from('4294967295');
const UINT120MAX = BigNumber.from('2').pow(120).sub(1);
const UINT128MAX = BigNumber.from('2').pow(128).sub(1);

export function useGenerateNonBlockingNonce(salt: Hex): `0x${string}` {
    const queue = BigInt(BigNumber.from(salt).and(UINT120MAX).toHexString())
    const nonce = BigInt(BigNumber.from(0).and(UINT128MAX).toHexString())
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return encodeDimensionalNonce(queue, nonce)
} 