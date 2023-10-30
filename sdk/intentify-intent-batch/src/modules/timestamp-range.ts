import { TimestampRangeIntent } from "@district-labs/intentify-deployments"

export const timestampRange = {
  name: "TimestampRange",
  deployed: TimestampRangeIntent,
  args: [
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
