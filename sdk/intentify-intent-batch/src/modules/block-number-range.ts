import { BlockNumberIntent } from "@district-labs/intentify-deployments"
import {validateBlockNumberRange} from '@district-labs/intentify-intent-batch-validate'

export const blockNumberRange = {
  name: "BlockNumberRange",
  deployed: BlockNumberIntent,
  validate: validateBlockNumberRange,
  abi: [
    {
      name: "start",
      type: "uint128",
    },
    {
      name: "end",
      type: "uint128",
    },
  ],
}

export default blockNumberRange
