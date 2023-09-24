type KeyList = {
  [key: number]: `0x${string}`;
};

export const ADDRESS_ZERO =
  '0x0000000000000000000000000000000000000000' as `0x${string}`;
export const DEFAULT_SALT = BigInt(0);

export const IntentifyModuleAddressList: KeyList = {
  5: '0xF783Cc471Cd4ED273056F1DD571b4beafa6A5CDE',
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
};

export const IntentifyBundlerAddressList: KeyList = {
  5: '0x00000',
  31337: '0x00000',
};

export const WalletFactoryAddressList: KeyList = {
  5: '0x99217B2931f90aa5CeFbFfC74816E24aF66A522D',
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};
3
// ----------------------------------------------
// Intent Modules
// ----------------------------------------------

export const TimestampAfterIntentAddressList: KeyList = {
  5: "0x1d25d7F82720c9D865796D7F202D5A541eC77f69",
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

export const TimestampBeforeIntentAddressList: KeyList = {
  5: "0x009aCa9aF72b6BA2287Aae905585e16553BF0D35",
  31337: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
};

export const TokenRouterReleaseIntentAddressList: KeyList = {
  5: "0x973F7Fc1324Be7371946F8307949e0cF471057Fd",
  31337: '0x00000',
};

export const LimitOrderIntentAddressList: KeyList = {
  5: "0xDF738aBeC406781cD4553A9430E3A09695C814B8",
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
};

export const TwapIntentAddressList: KeyList = {
  5: "0xc636F354ab2e623f49919ADA145e00b83c68f56E",
  31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
};

// ----------------------------------------------
// Safe
// ----------------------------------------------

export const SafeMultiCallAddressList: KeyList = {
  5: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
};

export const SafeProxyAddressList: KeyList = {
  5: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
};

export const SafeProxyFactoryAddressList: KeyList = {
  5: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
};
