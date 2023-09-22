import { encodePacked, keccak256 } from 'viem';

type IntentModuleIdentifiers = {
  name: string;
  version: string;
};

export function generateIntentBatchId(
  intentModules: IntentModuleIdentifiers[]
): `0x${string}` {
  const intentModuleIds = intentModules.map((intentModule) => {
    return keccak256(
      encodePacked(
        ['string', 'string'],
        [intentModule.name, intentModule.version]
      )
    );
  });
  return keccak256(encodePacked(['bytes32[]'], [intentModuleIds]));
}
