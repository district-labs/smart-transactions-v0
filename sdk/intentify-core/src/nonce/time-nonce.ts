import type { Hex } from "viem";
import { decodeAbiParameters, encodePacked } from "viem";
import { NonceType } from "../types";

export function encodeTimeNonce(id: number, delta: bigint, count: bigint): Hex {
  return encodePacked(
    ["uint8", "uint32", "uint128", "uint88"],
    [NonceType.Time, id, delta, count],
  );
}

export function decodeTimeNonce(
  nonceData: Hex,
) {
  const id = nonceData.slice(4, 4 + 8);
  const delta = nonceData.slice(12, 12 + 32);
  const count = nonceData.slice(44);
  return [BigInt(id), BigInt(`0x${delta}`), BigInt(count)]
}