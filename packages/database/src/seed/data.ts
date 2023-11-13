export const SEED_USER_ADDRESS = "0x4596039A69602b115752006Ef8425f43d6E80a6f";
export const STRATEGY_ID = 1;

export const INTENT_BATCH_DATA = {
  intentBatchHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  nonce: "0x0000000000000000000000000000000000000000000000000000000000000000",
  // Eth address 42 characters of 0x + 0{40}
  root: "0xF783Cc471Cd4ED273056F1DD571b4beafa6A5CDE",
  chainId: 5,
  signature:
    "0x30d4156e7fd616bd8d5b133b494d8081362d536725371f1359150cbc4946332571293c16837fdb325c9d1963ee3692eba4daef2b40518dd3edd75bf434ea2a081b",
  intents: [
    {
      intentId:
        "0x588617bbd20062df159d68794269d3d6318bb44bdea3a6963d146ad5aafdb0be",
      root: "0xF783Cc471Cd4ED273056F1DD571b4beafa6A5CDE",
      target: "0x009aCa9aF72b6BA2287Aae905585e16553BF0D35",
      data: "0x0000000000000000000000006512c9b5",
      value: "0",
      intentArgs: [{ name: "timestamp", type: "uint256", value: 1695730101 }],
    },
    {
      intentId:
        "0x442b009e32aff0b209576058382fa39b6fe50c61d51aa1361cf1bad9398cd893",
      root: "0xF783Cc471Cd4ED273056F1DD571b4beafa6A5CDE",
      target: "0x973F7Fc1324Be7371946F8307949e0cF471057Fd",
      data: "0x000000000000000000000000d35cceead182dcee0f148ebac9447da2c4d449c40000000000000000000000000000000000000000000000000000000059682f00",
      value: "0",
      intentArgs: [
        {
          name: "token",
          type: "address",
          value: "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
        },
        { name: "amount", type: "uint256", value: "1500000000" },
      ],
    },
    {
      intentId:
        "0xfcad8cc1884827b88c5a3753edd277a68ad6ee981f7a9dd07f82a48980ebaf94",
      root: "0xF783Cc471Cd4ED273056F1DD571b4beafa6A5CDE",
      target: "0xDF738aBeC406781cD4553A9430E3A09695C814B8",
      data: "0x000000000000000000000000d35cceead182dcee0f148ebac9447da2c4d449c4000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60000000000000000000000000000000000000000000000000000000059682f000000000000000000000000000000000000000000000000000de0b6b3a7640000",
      value: "0",
      intentArgs: [
        {
          name: "tokenOut",
          type: "address",
          value: "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
        },
        {
          name: "tokenIn",
          type: "address",
          value: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        },
        { name: "amountOutMax", type: "uint256", value: "1500000000" },
        { name: "amountInMin", type: "uint256", value: "1000000000000000000" },
      ],
    },
  ],
};
