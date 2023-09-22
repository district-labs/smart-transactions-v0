import { keccak256, encodePacked } from 'viem';

export function generateIntentModuleId(
  name: string,
  version: string
): `0x${string}` {
  return keccak256(encodePacked(['string', 'string'], [name, version]));
}
