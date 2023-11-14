import type { Hex } from "viem";
import { encodePacked } from "viem";
import { NonceType } from "../types";

export function encodeStandardNonce(accumulator: bigint): Hex {
  return encodePacked(["uint8", "uint248"], [NonceType.Standard, accumulator]);
}

export function decodeStandardNonce(nonceData: Hex) {
  const accumulator = nonceData.slice(4, 4);
  return [BigInt(`0x${accumulator}`)];
}
