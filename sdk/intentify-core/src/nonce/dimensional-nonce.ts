import type { Hex } from "viem";
import { encodePacked } from "viem";
import { NonceType } from "../types";

export function encodeDimensionalNonce(
  queue: bigint,
  accumulator: bigint,
): Hex {
  return encodePacked(
    ["uint8", "uint120", "uint128"],
    [NonceType.Dimensional, queue, accumulator],
  );
}

export function decodeDimensionalNonce(nonceData: Hex) {
  const queue = nonceData.slice(4, 4 + 30);
  const accumulator = nonceData.slice(34, 34 + 32);
  return [BigInt(`0x${queue}`), BigInt(`0x${accumulator}`)];
}
