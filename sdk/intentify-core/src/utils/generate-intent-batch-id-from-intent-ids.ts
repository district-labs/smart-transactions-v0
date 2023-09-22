import { encodePacked, keccak256 } from 'viem';

export function generateIntentBatchIdFromIntentIds(
  intentIds: `0x{string}`[]
): `0x${string}` {
  return keccak256(encodePacked(['bytes32[]'], [intentIds]));
}
