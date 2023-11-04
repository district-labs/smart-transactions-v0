import tokenListGoerli from "@/data/token-list-district-goerli.json"

import FormStrategyLeverageLong from "@/components/forms/form-strategy-leverage-long"
import { FormStrategyLimitOrder } from "@/components/forms/form-strategy-limit-order"
import FormStrategyMeanReversion from "@/components/forms/form-strategy-mean-reversion"
import FormStrategyRecurringPayment from "@/components/forms/form-strategy-recurring-payment"
import FormStrategySavingsDeposit from "@/components/forms/form-strategy-savings-deposit"
import { StrategyTable } from "@/components/tables/strategy-table"
import { ViewFormsStrategyMeanReversion } from "@/components/view/view-forms-strategy-mean-reversion"
import { ViewTablesStrategyMeanReversion } from "@/components/view/view-tables-strategy-mean-reversion"

import { columnsLeverageLong } from "./tables/columns-leverage-long"
import { columnsLimitOrder } from "./tables/columns-limit-order"
import { columnsMeanReversionBuy } from "./tables/columns-mean-reversion-buy"
import { columnsRecurringPayment } from "./tables/columns-recurring-payment"
import { transformToLeverageLong } from "./transforms/transform-to-leverage-long"
import { transformToLimitOrder } from "./transforms/transform-to-limit-order"
import { transformToMeanReversionBuy } from "./transforms/transform-to-mean-reversion-buy"
import { transformToRecurringPayment } from "./transforms/transform-to-recurring-payment"

export const strategies = {
  "0x37023ec377f004afa9c88dc62b789d15d781796030e62f0a57a328aa21131ffb": {
    id: "0x37023ec377f004afa9c88dc62b789d15d781796030e62f0a57a328aa21131ffb",
    name: "Recurring Transfer",
    alias: "recurring-transfer",
    description:
      "Automatically transfer tokens to a specified address at a specified time interval. ",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },
    overrideValues: {
      nonce: {
        type: "time",
        args: [0, 6000, 7],
      },
    },
    IntentForm: FormStrategyRecurringPayment,
    IntentTable: StrategyTable,
    transformData: transformToRecurringPayment,
    tableColumns: columnsRecurringPayment,
  },
  // "0x5": {
  //   id: "0x5",
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
    overrideValues: {
      erc20LimitOrder: {
        tokenOut: tokenListGoerli.tokens[0],
        tokenIn: tokenListGoerli.tokens[2],
      },
      timestampRange: {
        minTimestamp: "2023-10-28T07:00",
        maxTimestamp: "2023-10-28T07:00",
      },
    },
    IntentForm: FormStrategyLimitOrder,
    IntentTable: StrategyTable,
    transformData: transformToLimitOrder,
    tableColumns: columnsLimitOrder,
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
    overrideValues: {},
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
      "Buy or sell token when it's price is above/below a certain threshold. Measures historical onchain price data.",
    createdBy: {
      name: "District Finance",
      pfp: "https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png",
    },
    overrideValues: {},
    // IntentForm: FormStrategyMeanReversion,
    IntentForm: ViewFormsStrategyMeanReversion,
    IntentTable: ViewTablesStrategyMeanReversion,
    transformData: transformToMeanReversionBuy,
    tableColumns: columnsMeanReversionBuy,
  }
}
