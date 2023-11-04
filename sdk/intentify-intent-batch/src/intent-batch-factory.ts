import { IntentBatch, generateIntentId } from "@district-labs/intentify-core"
import {
  decodeAbiParameters,
  encodeAbiParameters,
  encodePacked,
  keccak256,
} from "viem"

import { IntentBatchManager } from "./intent-batch-manager"
import { ChainToPublicClient, IntentModule } from "./types"

export class IntentBatchFactory {
  modules: IntentModule[]
  clients: ChainToPublicClient | undefined

  constructor(modules: IntentModule[], clients?: ChainToPublicClient) {
    this.modules = modules
    this.clients = clients
  }

  getModule(name: string) {
    const module = this.modules.find((m) => m.name === name)
    if (!module) {
      throw new Error(`Module not found: ${name}`)
    }
    return module
  }

  getModuleByAddress(address: `0x${string}`) {
    const module = this.modules.find((m) =>
      Object.values(m.deployed).some((d) => d === address)
    )
    if (!module) {
      throw new Error(`Module not found: ${address}`)
    }
    return module
  }

  create(chainId: number, root?: `0x${string}`) {
    if (!root) {
      throw new Error("Root address is required")
    }
    return new IntentBatchManager(this, chainId, root)
  }

  target(name: string, chainId: number) {
    const module = this.modules.find((m) => m.name === name)?.deployed[chainId]
    if (!module) {
      throw new Error(`Module not found: ${name}`)
    }

    return module
  }

  encode(name: string, args: string[]) {
    const module = this.modules.find((m) => m.name === name)
    if (!module) {
      throw new Error(`Module not found: ${name}`)
    }

    return encodeAbiParameters(module.abi, args)
  }

  decode(args: any[], data: `0x${string}`) {
    return decodeAbiParameters(args, data)
  }

   async validate(intentBatch: IntentBatch, chainId: number, validationArgs?: {
    name: string,
    args: any
  }[]) {
    const results = intentBatch.intents.map(async (intent) => {
      // We add a try/catch statement around validation because getModuleByAddress throws an error if a module is unavailable.
      // There are instances where we want to ignore this error because we don't care about validating specific intents.
      // For example the api/infra/invalidate endpoint only cares about TimestampRange and BlockNumberRange intents.
      // The service might pass intents like Erc20LimitOrder even though it wants to ignore those validations.
      try {
        const module = this.getModuleByAddress(intent.target)
        if(module.validate) {
          let validationArguments = {}
          const intentToValidate = validationArgs?.find(args => args.name == module.name)
          if(this.clients) {
            const publicClient = this?.clients[chainId]
           if(!publicClient && !intentToValidate)  {
            throw new Error(`Provide publicClient or validation arguments for ${module.name}`)
           }
            validationArguments = {
              ...intentToValidate?.args,
              publicClient
            }
          } else {
            if(!intentToValidate)  {
              throw new Error(`Provide validation arguments for ${module.name}`)
            }
            validationArguments = {
              ...intentToValidate?.args
            }
          }
          const validation = await module.validate(module.abi, intent.data, validationArguments)
          return {
            name: module.name,
            results: validation
          }
        } else {
          return {
            name: module.name,
            results: []
          }
        }
      } catch (error) {
        return undefined
      }
    })
    return (await Promise.all(results)).filter((value) => value !== undefined)
  }

  decodeIntentBatch(intentBatch: IntentBatch) {
    return intentBatch.intents.map((intent) => {
      const module = this.getModuleByAddress(intent.target)
      const decoded = this.decode(module.abi, intent.data)
      console.log(decoded,  module,'decoded')
      return {
        intentId: generateIntentId(module.name), // TODO: Update to use dynamic module version.
        name: module.name,
        intentArgs: decoded.map((arg: any, i: number) => ({
          name: module.abi[i].name,
          type: module.abi[i].type,
          value: String(arg),
        })),
        data: intent.data,
        target: intent.target,
        root: intent.root,
        value: intent.value,
      }
    })
  }

  /**
   * @description Returns the intent batch ID for a given intent batch.
   * @param intentBatch
   * @returns id - A deterministic ID for the intent batch.
   */
  getIntentBatchId(intentBatch: IntentBatch) {
    const moduleNames = intentBatch.intents
      .map((intent) => {
        const module = this.getModuleByAddress(intent.target)
        return module.name
      })
      .sort()
    return keccak256(encodePacked(["string[]"], [moduleNames]))
  }

  /**
   * @description Returns the strategy ID for a given array of intent batches.
   * @param intentBatches
   * @returns id - A deterministic ID for the strategy.
   */
  getStrategyId(intentBatches: IntentBatch[]) {
    const intentBatchIds = intentBatches
      .map((intentBatch) => {
        return this.getIntentBatchId(intentBatch)
      })
      .sort()
    return keccak256(encodePacked(["bytes32[]"], [intentBatchIds]))
  }

  generateIntentBatchId(intentBatchIds: string[]) {
    const intentBatchIdsSorted = intentBatchIds.sort()
    return keccak256(encodePacked(["string[]"], [intentBatchIdsSorted]))
  }

  generateStrategyId(intentBatchIds: string[][]) {
    const intentBatchIdsSorted = intentBatchIds
      .map((intentBatch) => {
        return this.generateIntentBatchId(intentBatch)
      })
      .sort()
    return keccak256(encodePacked(["bytes32[]"], [intentBatchIdsSorted]))
  }
}
