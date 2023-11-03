import { encodePacked, keccak256 } from "viem";
import { generateIntentId } from "./generate-intent-id";

type IntentModuleIdentifiers = {
  name: string;
};

export function generateIntentBatchId(
  intentModules: IntentModuleIdentifiers[],
): `0x${string}` {
  const intentModuleIds = intentModules.map((intentModule) => {
    return generateIntentId(intentModule.name);
  });
  return keccak256(encodePacked(["bytes32[]"], [intentModuleIds]));
}
