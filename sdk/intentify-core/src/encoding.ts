import { DimensionalNonce, EIP712Domain, Intent, IntentBatch } from "./types";
import { keccak256, encodePacked, toBytes } from 'viem'
import { stringToBytes } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'

// Define the TypeHash constants
const EIP712DOMAIN_TYPEHASH = keccak256(
  stringToBytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
);

const DIMENSIONALNONCE_TYPEHASH = keccak256(
  stringToBytes("DimensionalNonce(uint128 queue,uint128 accumulator)")
);

const INTENT_TYPEHASH = keccak256(
  stringToBytes("Intent(address root,address target,uint256 value,bytes data)")
);

const INTENTBATCH_TYPEHASH = keccak256(
  stringToBytes("IntentBatch(address root,bytes nonce,Intent[] intents)Intent(address root,address target,uint256 value,bytes data)")
);


// Define the TypeScript functions
export function getEIP712DomainPacketHash(domain: EIP712Domain): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters('string name, string version, uint256 chainId, address verifyingContract'),
      [EIP712DOMAIN_TYPEHASH, domain.version, domain.chainId, domain.verifyingContract]
    )
  );
}

export function getDimensionalNoncePacketHash(nonce: DimensionalNonce): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters('bytes32 hash, uint128 queue, uint128 accumulator'),
      [DIMENSIONALNONCE_TYPEHASH, nonce.queue, nonce.accumulator]
    )
  );
}

export function getIntentPacketHash(intent: Intent): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters('bytes32, address, address, uint256, bytes'),
      [INTENT_TYPEHASH, intent.root, intent.target, intent.value, intent.data]
    )
  );
}

export function getIntentArrayPacketHash(intents: Intent[]): `0x${string}` {
  let encoded = '0x';
  for (const intent of intents) {
    encoded += getIntentPacketHash(intent).slice(2); // Remove the '0x' prefix and concatenate
  }
  return keccak256(encoded as `0x${string}`);
}

export function getIntentBatchPacketHash(intentBatch: IntentBatch): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters('bytes32, address, bytes, bytes32'),
      [INTENTBATCH_TYPEHASH, intentBatch.root, intentBatch.nonce, getIntentArrayPacketHash(intentBatch.intents)]
    )
  );
}

export function getIntentBatchTypedDataHash(domainSeparator?: `0x${string}`, intentBatch?: IntentBatch): `0x${string}` | undefined {
  if(!domainSeparator || !intentBatch) return undefined
  const hash = keccak256(
    encodePacked(['string', 'bytes32', 'bytes32'], ['\x19\x01', domainSeparator, getIntentBatchPacketHash(intentBatch)])
  );

  return hash;
}