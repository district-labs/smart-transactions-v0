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
  5: '0x6d39bb7e7BF4eDE48E0CC62701E751D8deC07D2d',
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
};

export const IntentifyBundlerAddressList: KeyList = {
  5: '0x00000',
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

export const WalletFactoryAddressList: KeyList = {
  5: '0x7F73D8FE944d69eea972d3d226734C4dA68fE6a9',
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};
3
// ----------------------------------------------
// Intent Modules
// ----------------------------------------------

export const TimestampIntentAddressList: KeyList = {
  5: "0x4d60482Bb5D1fC0f537F2CDD3eaa701Ba260F043",
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

export const TokenRouterReleaseIntentAddressList: KeyList = {
  5: "0x973F7Fc1324Be7371946F8307949e0cF471057Fd",
  31337: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
};

export const LimitOrderIntentAddressList: KeyList = {
  5: "0xDF738aBeC406781cD4553A9430E3A09695C814B8",
  31337: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
};

export const TwapIntentAddressList: KeyList = {
  5: "0xc636F354ab2e623f49919ADA145e00b83c68f56E",
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
