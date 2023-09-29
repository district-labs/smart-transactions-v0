import type { Hex } from 'viem';
import { encodePacked } from 'viem';
import { NonceType } from '../types';


export function encodeTimeNonce(id: number, delta: bigint, count: bigint): Hex {
    return encodePacked(['uint8', 'uint32', 'uint128', 'uint88'], [NonceType.Time, id, delta, count]);
}
