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