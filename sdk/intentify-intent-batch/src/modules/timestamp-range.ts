import { TimestampRangeIntent } from "@district-labs/intentify-deployments"
import {validateTimestampRange} from '@district-labs/intentify-intent-batch-validate' 
export const timestampRange = {
  name: "TimestampRange",
  deployed: TimestampRangeIntent,
  validate: validateTimestampRange,
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

export default timestampRange
