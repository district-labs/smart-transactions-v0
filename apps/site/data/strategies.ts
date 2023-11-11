import tokenListGoerli from "@/data/lists/token-list-testnet.json"
import { findTokenFromList } from "@/integrations/erc20/utils/find-token-from-list"
import { ADDRESS_ZERO } from "@district-labs/intentify-core"

import { FormStrategyAutomaticLending } from "@/components/strategies/form-strategy-automatic-lending"
import { FormStrategyAutomaticLiquidate } from "@/components/strategies/form-strategy-automatic-liquidate"
import { FormStrategyAutomaticSaving } from "@/components/strategies/form-strategy-automatic-saving"
import FormStrategyLeverageLong from "@/components/strategies/form-strategy-leverage-long"
import { FormStrategyLimitOrder } from "@/components/strategies/form-strategy-limit-order"
import FormStrategyRecurringPayment from "@/components/strategies/form-strategy-recurring-payment"
import { StrategyTable } from "@/components/tables/strategy-table"
import { ViewFormsStrategyMeanReversion } from "@/components/view/view-forms-strategy-mean-reversion"
import { ViewTablesStrategyMeanReversion } from "@/components/view/view-tables-strategy-mean-reversion"

import { columnsAutomaticLending } from "./columns/columns-automatic-lending"
import { columnsAutomaticLiquidate } from "./columns/columns-automatic-liquidate"
import { columnsAutomaticSaving } from "./columns/columns-automatic-saving"
import { columnsLeverageLong } from "./columns/columns-leverage-long"
import { columnsLimitOrder } from "./columns/columns-limit-order"
import { columnsMeanReversionBuy } from "./columns/columns-mean-reversion-buy"
import { columnsRecurringPayment } from "./columns/columns-recurring-payment"
import { transformToAutomaticLending } from "./transforms/transform-to-automatic-lending"
import { transformToAutomaticLiquidate } from "./transforms/transform-to-automatic-liquidate"
import { transformToAutomaticSaving } from "./transforms/transform-to-automatic-saving"
import { transformToLeverageLong } from "./transforms/transform-to-leverage-long"
import { transformToLimitOrder } from "./transforms/transform-to-limit-order"
import { transformToMeanReversionBuy } from "./transforms/transform-to-mean-reversion-buy"
import { transformToRecurringPayment } from "./transforms/transform-to-recurring-payment"

export const strategies = {
  "0x22ffb702ee9a3bd196987c66bcad309a3576c8ec14a4101b611fc694663da6ba": {
    id: "0x22ffb702ee9a3bd196987c66bcad309a3576c8ec14a4101b611fc694663da6ba",
    name: "District Subscription",
    alias: "recurring-transfer",
    description:
      "Subscribe to District Finance for 7 days. Recurring transfer of 10 DIS.",
    createdBy: {
      name: "District Finance",
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [5],
    overrideValues: {
      nonce: {
        type: "time",
        args: [0, 86400, 7],
      },
      erc20Transfer: {
        tokenOut: findTokenFromList(tokenListGoerli, "DIS", 5),
        amountOut: 10,
        to: ADDRESS_ZERO,
      },
    },
    IntentForm: FormStrategyRecurringPayment,
    IntentTable: StrategyTable,
    transformData: transformToRecurringPayment,
    tableColumns: columnsRecurringPayment,
  },
  "0x564369be27beaca3a73a1da91280164eaa81e9a66d5e43c2a180c78fef295505": {
    id: "0x564369be27beaca3a73a1da91280164eaa81e9a66d5e43c2a180c78fef295505",
    name: "Limit Order",
    alias: "limit-order",
    description: "Swap tokens at a specified exchange rate and time range.",
    createdBy: {
      name: "District Finance",
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [5],
    overrideValues: {
      erc20LimitOrder: {
        tokenOut: tokenListGoerli.tokens[0],
        tokenIn: tokenListGoerli.tokens[2],
      },
    },
    IntentForm: FormStrategyLimitOrder,
    IntentTable: StrategyTable,
    transformData: transformToLimitOrder,
    tableColumns: columnsLimitOrder,
  },
  "0x862579b2580594878e5e916a94308de27b43bbe8f3775978d2c14964ad485da2": {
    id: "0x862579b2580594878e5e916a94308de27b43bbe8f3775978d2c14964ad485da2",
    name: "Liquidate Balance",
    alias: "liquidate-balance",
    description: "Automatically liquidate a position at spot price.",
    createdBy: {
      name: "District Finance",
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [5],
    overrideValues: {},
    IntentForm: FormStrategyAutomaticLiquidate,
    IntentTable: StrategyTable,
    transformData: transformToAutomaticLiquidate,
    tableColumns: columnsAutomaticLiquidate,
  },
  "0xeb597abd3d72972a0bb1199caa65378889d54e1a0edcb1017235626f5f12a4d3": {
    id: "0xeb597abd3d72972a0bb1199caa65378889d54e1a0edcb1017235626f5f12a4d3",
    name: "Recurring Prize Savings Deposit",
    alias: "recurring-prize-savings-deposit",
    description:
      "Automatically deposit into a prize savings account and win prizes.",
    createdBy: {
      name: "District Finance",
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [],
    overrideValues: {},
    IntentForm: FormStrategyAutomaticSaving,
    IntentTable: StrategyTable,
    transformData: transformToAutomaticSaving,
    tableColumns: columnsAutomaticSaving,
  },
  "0xd5720c3e00f3ea3b1179e3b10c7a033f9db23cad12b68ddabf7c392b604812a3": {
    id: "0xd5720c3e00f3ea3b1179e3b10c7a033f9db23cad12b68ddabf7c392b604812a3",
    name: "Automatic Lending",
    alias: "automatic-lending",
    description: "Automatically lend an asset using the Aave V3 protocol.",
    createdBy: {
      name: "District Finance",
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [],
    overrideValues: {},
    IntentForm: FormStrategyAutomaticLending,
    IntentTable: StrategyTable,
    transformData: transformToAutomaticLending,
    tableColumns: columnsAutomaticLending,
  },
  "0x89033b533d9a8e6875cfd119a1bbaa4727cdd207c9b38a234022402b30e0a861": {
    id: "0x89033b533d9a8e6875cfd119a1bbaa4727cdd207c9b38a234022402b30e0a861",
    name: "Leverage Long",
    alias: "leveraged-long",
    description: "Leverage long an asset by borrowing and buying more of it.",
    createdBy: {
      name: "District Finance",
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [],
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
      pfp: "/apple-touch-icon.png",
    },
    chainsSupported: [],
    overrideValues: {},
    IntentForm: ViewFormsStrategyMeanReversion,
    IntentTable: ViewTablesStrategyMeanReversion,
    transformData: transformToMeanReversionBuy,
    tableColumns: columnsMeanReversionBuy,
  },
}
