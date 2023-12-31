import {
  encodeDimensionalNonce,
  encodeModuleNonce,
  encodeStandardNonce,
  encodeTimeNonce,
} from "@district-labs/intentify-core"
import type { Intent, IntentBatch } from "@district-labs/intentify-core"

import { IntentBatchFactory } from "./intent-batch-factory"
import { IntentModule } from "./types"

export class IntentBatchManager {
  _factory: IntentBatchFactory
  _chainId: number
  _root: `0x${string}`
  _nonce: `0x${string}` = "0x00"
  _intents: Intent[] = []
  _metadata: IntentModule[] = []

  constructor(
    factory: IntentBatchFactory,
    chainId: number,
    root: `0x${string}`
  ) {
    this._chainId = chainId
    this._factory = factory
    this._root = root
  }

  nonce(type: string, args: any[]) {
    let encodedNonce
    switch (type) {
      case "standard":
        encodedNonce = encodeStandardNonce(args[0])
        break
      case "dimensional":
        encodedNonce = encodeDimensionalNonce(args[0], args[1])
        break
      case "time":
        encodedNonce = encodeTimeNonce(args[0], args[1], args[2])
        break
      case "module":
        encodedNonce = encodeModuleNonce()
        break
      default:
        throw new Error(`Unknown nonce type: ${type}`)
    }

    this._nonce = encodedNonce
  }

  add(name: string, args: string[]) {
    const encodedArguments = this._factory.encode(name, args)
    this._metadata.push(this._factory.getModule(name))
    this._intents.push({
      root: this._root,
      target: this._factory.target(name, this._chainId),
      data: encodedArguments,
      value: BigInt(0),
    })
    return encodedArguments
  }

  generate(): IntentBatch {
    if (this._nonce === "0x00") throw new Error("Nonce not set")
    return {
      root: this._root,
      nonce: this._nonce,
      intents: this._intents,
    }
  }
}
