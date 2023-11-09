import {
  encodeAbiParameters,
  encodePacked,
  keccak256,
  parseAbiParameters,
  toBytes
} from "viem";
import { DimensionalNonce, EIP712Domain, Intent, IntentBatch } from "./types";

// Define the TypeHash constants
const EIP712DOMAIN_TYPEHASH = keccak256(
  toBytes(
    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)",
  ),
);

const DIMENSIONALNONCE_TYPEHASH = keccak256(
  toBytes("DimensionalNonce(uint128 queue,uint128 accumulator)"),
);

const INTENT_TYPEHASH = keccak256(
  toBytes("Intent(address root,address target,uint256 value,bytes data)"),
);

const INTENTBATCH_TYPEHASH = keccak256(
  toBytes(
    "IntentBatch(address root,bytes nonce,Intent[] intents)Intent(address root,address target,uint256 value,bytes data)",
  ),
);

// Define the TypeScript functions
export function getEIP712DomainPacketHash(domain: EIP712Domain): `0x${string}` {
  const encodedData = encodeAbiParameters([
      {name:"EIP712DOMAIN_TYPEHASH", type:"bytes32"},
      {name:"name", type:"string"},
      {name:"version", type:"string"},
      {name:"chainId", type:"uint256"},
      {name:"verifyingContract", type:"address"}
    ],
      [EIP712DOMAIN_TYPEHASH, keccak256(toBytes(domain.name)), keccak256(toBytes(domain.version)), domain.chainId, domain.verifyingContract])
    const DOMAIN_SEPARATOR = keccak256(encodedData)
return DOMAIN_SEPARATOR
}

export function getDimensionalNoncePacketHash(
  nonce: DimensionalNonce,
): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters("bytes32 hash, uint128 queue, uint128 accumulator"),
      [DIMENSIONALNONCE_TYPEHASH, nonce.queue, nonce.accumulator],
    ),
  );
}

export function getIntentPacketHash(intent: Intent): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters("bytes32, address, address, uint256, bytes"),
      [
        INTENT_TYPEHASH,
        intent.root,
        intent.target,
        intent.value,
        keccak256(intent.data),
      ],
    ),
  );
}

export function getIntentArrayPacketHash(intents: Intent[]): `0x${string}` {
  let encoded = "0x";
  for (const intent of intents) {
    encoded += getIntentPacketHash(intent).slice(2); // Remove the '0x' prefix and concatenate
  }
  return keccak256(encoded as `0x${string}`);
}

export function getIntentBatchPacketHash(
  intentBatch: IntentBatch,
): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters("bytes32, address, bytes, bytes32"),
      [
        INTENTBATCH_TYPEHASH,
        intentBatch.root,
        keccak256(intentBatch.nonce),
        getIntentArrayPacketHash(intentBatch.intents),
      ],
    ),
  );
}

export function getIntentBatchTypedDataHash(
  domainSeparator?: `0x${string}`,
  intentBatch?: IntentBatch,
): `0x${string}` | undefined {
  if (!domainSeparator || !intentBatch) return undefined;
  const hash = keccak256(
    encodePacked(
      ["string", "bytes32", "bytes32"],
      ["\x19\x01", domainSeparator, getIntentBatchPacketHash(intentBatch)],
    ),
  );

  return hash;
}
