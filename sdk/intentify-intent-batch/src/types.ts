import { ChainToAddress } from "@district-labs/intentify-deployments"

export type IntentModuleArg = {
  name: string
  type: string
  indexed?: boolean
}

export type IntentModule = {
  name: string
  deployed: ChainToAddress
  args: IntentModuleArg[]
}
