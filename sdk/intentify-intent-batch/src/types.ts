import { ChainToAddress } from "@district-labs/intentify-deployments"
import { AbiParameter } from "abitype"
import { type PublicClient } from "viem"

export type ChainToPublicClient = {
  [key: number]: PublicClient
}

export type IntentModuleAbi = {
  name: string
  type: string
  indexed?: boolean
}

export type IntentModule = {
  name: string
  deployed: ChainToAddress
  validate?: (abi: AbiParameter[], data: `0x${string}`, args: any) => any
  abi: IntentModuleAbi[]
}

export type ValidationResponse = {
  status: boolean
  errors?: {
    index: number
    msg: string
  }[]
}
