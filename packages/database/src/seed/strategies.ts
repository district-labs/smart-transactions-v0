export const strategyLimitOrder = {
  id: "0x564369be27beaca3a73a1da91280164eaa81e9a66d5e43c2a180c78fef295505",
  name: "Limit Order",
  alias: "limit-order",
  description:
    "Swap ERC20 tokens at a specified rate and time range. The order will be executed if an order can be filled within the time range.",
};
export const strategyLeverageLong = {
  id: "0x89033b533d9a8e6875cfd119a1bbaa4727cdd207c9b38a234022402b30e0a861",
  name: "Leverage Long",
  alias: "leveraged-long",
  description:
    "Leverage long an asset by borrowing and buying more of it. You can set the leverage amount and the supply token.",
};
export const strategyMeanReversion = {
  id: "0xae273495d027882e4cfea961afd15f90b6f260d1a9f90add9e2b4322ec370517",
  name: "Mean Reversion",
  alias: "mean-reversion",
  description:
    "Buy/Sell an asset when it's price is above/below a certain threshold. Generally higher returns than holding or dollar cost averaging.",
};

export const strategyRecurringTransfer = {
  id: "0x37023ec377f004afa9c88dc62b789d15d781796030e62f0a57a328aa21131ffb",
  name: "Recurring Transfer",
  alias: "recurring-transfer",
  description:
    "Automatically transfer tokens to a specified address at a specified time interval. ",
};

// export const strategySmartCash = {
//   id: "0x4",
//   name: "Smart Cash",
//   alias: "smart-cash",
//   description:
//     "Automatically deposit stablecoins into lending protocols in the highest yield.",
// }

export const strategiesBeta = [
  // strategyLimitOrder,
  // strategyLeverageLong,
  // strategyMeanReversion,
  strategyRecurringTransfer,
  // strategySmartCash
];
