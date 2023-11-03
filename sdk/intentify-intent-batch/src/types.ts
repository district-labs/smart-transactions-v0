import { ChainToAddress } from "@district-labs/intentify-deployments"
import { type PublicClient } from "viem"

export type ChainToPublicClient = {
  [key: number]: PublicClient
}

export type IntentModuleAbi = {
  name: string
  type: string
  internalType?: string
}

export type IntentModule = {
  name: string
  deployed: ChainToAddress
  validate?: (abi: any, data: `0x${string}`, args: any) => any
  abi: any
}

export type IntentValidation = {
  name: string
  results: ValidationResponse
}

export type ValidationResponse = {
  status: boolean
  errors?: {
    index: number
    msg: string
  }[]
}
