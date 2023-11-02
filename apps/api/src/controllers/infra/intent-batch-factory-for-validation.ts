import {
  IntentBatchFactory,
  timestampRange,
  blockNumberRange
} from "@district-labs/intentify-intent-batch"
import { createPublicClient, http } from "viem"
import { goerli, hardhat, mainnet } from "viem/chains"

const clientMainnet = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const clientGoerli = createPublicClient({
  chain: goerli,
  transport: http(),
})
const clientLocal = createPublicClient({
  chain: hardhat,
  transport: http(),
})

export const intentBatchFactoryForValidation = new IntentBatchFactory([timestampRange,
  blockNumberRange], {
  1: clientMainnet,
  5: clientGoerli,
  31337: clientLocal,
})
