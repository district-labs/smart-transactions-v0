import { ChainToAddress } from "./types";

// Core Intents
export const BlockNumberIntent: ChainToAddress = {
  5: "0x4fd7156969d56F61924F65d632C4813E8b823cCb",
  31337: "0x100000000000000000000000000000000000dEaD",
};

export const TimestampRangeIntent: ChainToAddress = {
  5: "0x224B4cf31bf5aFa28B297f40479564450d8e9DF0",
  31337: "0x200000000000000000000000000000000000dEaD",
};

export const EthTipIntent: ChainToAddress = {
  5: "0x825ffFC8161c91D12706d0E88638057812697b84",
  31337: "0x300000000000000000000000000000000000dEaD",
};

// Erc20 Intents

export const Erc20SwapSpotPriceExactTokenInIntent: ChainToAddress = {
  5: "0x15B3298495101d4AE8CF30A0a637f67B118e4EB3",
  31337: "0x440000000000000000000000000000000000dEaD",
};

export const Erc20SwapSpotPriceExactTokenOutIntent: ChainToAddress = {
  5: "0x3C4dDB6f16d31b982Cb710D16c5Bd2AdB476fD00",
  31337: "0x550000000000000000000000000000000000dEaD",
};

export const Erc20TipIntent: ChainToAddress = {
  5: "0x6bEA157f8117B64D5Bbb89B21c9524ee4f388509",
  31337: "0x540000000000000000000000000000000000dEaD",
};

export const Erc20TransferIntent: ChainToAddress = {
  5: "0xc61700946Add84e29Ca20E974B37B0aBFb067343",
  31337: "0x510000000000000000000000000000000000dEaD",
};

export const Erc20LimitOrderIntent: ChainToAddress = {
  5: "0xF20dD07106dA1755AB84B3ee09BE39efc1d25115",
  31337: "0x600000000000000000000000000000000000dEaD",
};

export const Erc20RebalanceIntent: ChainToAddress = {
  5: "0x56d85748C8f721a441eF79095C21e986b9944385",
  31337: "0x120000000000000000000000000000000000dEaD",
};

export const Erc20SwapSpotPriceBalanceTokenOutIntent: ChainToAddress = {
  5: "0x707DFF21fcB5e4466C34ef0624765B898219AdeE",
  31337: "0x120000000000000000000000000000000000dEaD",
};

export const Erc4626DepositBalanceContinualIntent: ChainToAddress = {
  5: "0x48CB7253E55bf22d2A29E573ba32AC6AE6C4D393",
  31337: "0x123000000000000000000000000000000000dEaD",
};


// Oracle Intents
export const ChainlinkDataFeedIntent: ChainToAddress = {
  5: "0xB3e95871825417D4c6fe62858b5D583dC7413cA1",
  31337: "0x3100000000000000000000000000000000000dEaD",
};

export const UniswapV3TwapIntentIntent: ChainToAddress = {
  5: "0x9e905De2dd7960D05971D173946008480759369b",
  31337: "0x610000000000000000000000000000000000dEaD",
};

export const UniswapV3HistoricalTwapPercentageChangeIntent: ChainToAddress = {
  5: "0xf0447943C1940Da35Aa8312C5FBabd07E901354c",
  31337: "0x710000000000000000000000000000000000dEaD",
};

// DeFi Intents
export const AaveV3SupplyBalanceContinualIntent: ChainToAddress = {
  5: "0x888000000000000000000000000000000000dEaD",
  31337: "0x888000000000000000000000000000000000dEaD",
};
export const AaveLeverageLongIntent: ChainToAddress = {
  5: "0x770000000000000000000000000000000000dEaD",
  31337: "0x770000000000000000000000000000000000dEaD",
};



