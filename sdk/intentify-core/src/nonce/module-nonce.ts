import type { Hex } from "viem";
import { encodePacked } from "viem";
import { NonceType } from "../types";

export function encodeModuleNonce(): Hex {
  return encodePacked(["uint8", "uint248"], [NonceType.Module, BigInt(0)]);
}
