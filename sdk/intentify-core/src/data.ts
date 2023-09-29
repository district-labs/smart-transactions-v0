type KeyList = {
  [key: number]: `0x${string}`;
};

export const ADDRESS_ZERO =
  '0x0000000000000000000000000000000000000000' as `0x${string}`;
export const DEFAULT_SALT = BigInt(0);

export const EngineHubAddressList: KeyList = {
  5: '0x18A4eA31d487A20E5eb7fE1521256D41e03B485c'
}

export const IntentifyModuleAddressList: KeyList = {
  5: '0xf2Af39A674FCfc8dE94B00f15d4d9D72F62A6F2B',
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
};

export const IntentifyBundlerAddressList: KeyList = {
  5: '0x56bC990F732f8DFd8939f9BcC9a747be883f12Ba',
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

export const WalletFactoryAddressList: KeyList = {
  5: '0xaBc92F5894ed3b78B1888B2009F907B24A344842',
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};
3
// ----------------------------------------------
// Intent Modules
// ----------------------------------------------

export const TimestampAfterIntentAddressList: KeyList = {
  5: "0x7D9F8faFDD50205a637Ca1536C4f03FEF729c03e",
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

export const TimestampBeforeIntentAddressList: KeyList = {
  5: "0xE822EaF8218731d2e67d469a9209c6Ef1e4eD8bC",
  31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
};

export const TokenRouterReleaseIntentAddressList: KeyList = {
  5: "0x428B483473aF298e940cb37165bfC7D4b012706b",
  31337: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
};

export const LimitOrderIntentAddressList: KeyList = {
  5: "0xDF738aBeC406781cD4553A9430E3A09695C814B8",
  31337: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
};

export const TwapIntentAddressList: KeyList = {
  5: "0x3fd447aB2f82d4af3f246ea056358942F2DF339d",
  31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
};

// ----------------------------------------------
// Safe
// ----------------------------------------------

export const SafeMultiCallAddressList: KeyList = {
  5: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
};

export const SafeProxyAddressList: KeyList = {
  5: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
};

export const SafeProxyFactoryAddressList: KeyList = {
  5: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
};
