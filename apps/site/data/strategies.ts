import FormStrategyLeverageLong from "@/components/forms/form-strategy-leverage-long"
import { FormStrategyLimitOrder } from "@/components/forms/form-strategy-limit-order"
import FormStrategyMeanReversion from "@/components/forms/form-strategy-mean-reversion"
import FormStrategySavingsDeposit from "@/components/forms/form-strategy-savings-deposit"
import { StrategyTable } from "@/components/tables/strategy-table"

import { columnsLeverageLong } from "./tables/columns-leverage-long"
import { limitOrderTableColumns } from "./tables/limit-order"
import { transformToLeverageLong } from "./transforms/transform-to-leverage-long"
import { transformToLimitOrder } from "./transforms/transform-to-limit-order"

export const strategies = {
  "0x564369be27beaca3a73a1da91280164eaa81e9a66d5e43c2a180c78fef295505": {
    id: "0x564369be27beaca3a73a1da91280164eaa81e9a66d5e43c2a180c78fef295505",
    name: "Limit Order",
    alias: "limit-order",
    description:
      "Swap ERC20 tokens at a specified rate and time range. The order will be executed if an order can be filled within the time range.",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },

    IntentForm: FormStrategyLimitOrder,
    IntentTable: StrategyTable,
    transformData: transformToLimitOrder,
    tableColumns: limitOrderTableColumns,
  },
  "0x89033b533d9a8e6875cfd119a1bbaa4727cdd207c9b38a234022402b30e0a861": {
    id: "0x89033b533d9a8e6875cfd119a1bbaa4727cdd207c9b38a234022402b30e0a861",
    name: "Leverage Long",
    alias: "leveraged-long",
    description:
      "Leverage long an asset by borrowing and buying more of it. You can set the leverage amount and the supply token.",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },
    IntentForm: FormStrategyLeverageLong,
    IntentTable: StrategyTable,
    transformData: transformToLeverageLong,
    tableColumns: columnsLeverageLong,
  },
  "0xae273495d027882e4cfea961afd15f90b6f260d1a9f90add9e2b4322ec370517": {
    id: "0xae273495d027882e4cfea961afd15f90b6f260d1a9f90add9e2b4322ec370517",
    name: "Mean Reversion",
    alias: "mean-reversion",
    description:
    "Buy/Sell an asset when it's price is above/below a certain threshold. Uses historical UniswapV3 token prices via zero-knowledge storage proof.",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },
    IntentForm: FormStrategyMeanReversion,
    IntentTable: StrategyTable,
    transformData: transformToLeverageLong,
    tableColumns: columnsLeverageLong,
  },
  // "0x4": {
  //   id: "0x4",
  //   name: "Automatic Savings Deposit",
  //   alias: "automatic-savings-deposit",
  //   description:
  //     "Automatically deposit into a PoolTogether savings account for a chance to win prizes. Minimum token balance required.",
  //   createdBy: {
  //     name: "District Finance",
  //     pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
  //   },
  //   IntentForm: FormStrategySavingsDeposit,
  //   IntentTable: StrategyTable,
  //   transformData: transformToLeverageLong,
  //   tableColumns: columnsLeverageLong,
  // },
}
