import type { Hex } from 'viem';
import { encodePacked } from 'viem';
import { NonceType } from '../types';


export function encodeStandardNonce(accumulator: bigint): Hex {
  return encodePacked(['uint8', 'uint248'], [NonceType.Standard, accumulator]);
}
