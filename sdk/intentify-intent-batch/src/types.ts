import { AbiParameter } from 'abitype' 
import { ChainToAddress } from "@district-labs/intentify-deployments"

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
