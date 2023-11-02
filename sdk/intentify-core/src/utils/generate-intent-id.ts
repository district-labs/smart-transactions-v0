import { encodePacked, keccak256 } from "viem";

export function generateIntentId(name: string): `0x${string}` {
  return keccak256(encodePacked(["string"], [name]));
}
