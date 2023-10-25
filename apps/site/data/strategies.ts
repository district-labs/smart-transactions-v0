import { transformLimitOrderIntentQueryToLimitOrderData } from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
import FormStrategyLeverageLong from "@/components/forms/form-strategy-leverage-long"
import { FormStrategyLimitOrder } from "@/components/forms/form-strategy-limit-order"
import { StrategyTable } from "@/components/tables/strategy-table"

import { limitOrderTableColumns } from "./tables/limit-order"

export const strategies = {
  "0xeb177b2ff21772a31e2134748222bc3fe03647fd2a302adcbfcd81c75f08755e": {
    id: "0xeb177b2ff21772a31e2134748222bc3fe03647fd2a302adcbfcd81c75f08755e",
    name: "Limit Order",
    alias: "limit-order",
    description:
      "Swap ERC20 tokens at a specified rate and time range. The order will be executed if an order can be filled within the time range.",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },
    intentBatches: [
      {
        id: "0x07aa5e15d4e202938899c76793e1e80b05efcb9cf1548dc9e34fa8813466f4f1",
        intents: ["TimestampRange", "Erc20LimitOrder"],
      },
    ],
    IntentForm: FormStrategyLimitOrder,
    IntentTable: StrategyTable,
    transformData: transformLimitOrderIntentQueryToLimitOrderData,
    tableColumns: limitOrderTableColumns,
  },
  "0x2": {
    id: "0x2",
    name: "Leverage Long",
    alias: "leveraged-long",
    description:
      "Leverage long an asset by borrowing and buying more of it. You can set the leverage amount and the supply token.",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },
    intentBatches: [
      {
        id: "0x07aa5e15d4e202938899c76793e1e80b05efcb9cf1548dc9e34fa8813466f4f1",
        intents: ["TimestampRange", "Erc20LimitOrder"],
      },
    ],
    IntentForm: FormStrategyLeverageLong,
    IntentTable: StrategyTable,
    transformData: transformLimitOrderIntentQueryToLimitOrderData,
    tableColumns: limitOrderTableColumns,
  },
}
