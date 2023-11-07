import { ChainToAddress } from "./types";

export const ADDRESS_ZERO =
  '0x0000000000000000000000000000000000000000' as `0x${string}`;

export const IntentifySafeModule: ChainToAddress = {
  5: "0x0ff94e0779AB272e9f3E816e43da62A3bf864fa0",
  31337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
};

export const IntentifyBundler: ChainToAddress = {
    5: '0xD75faDb78fD134E7Ba88EFa9B969d4C9502CAaa1',
    31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  };

export const WalletFactory: ChainToAddress = {
  5: "0x48Aaa7D3A866202AE60d9e6e5d8A321B9D7a9e8A",
  31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
};

export const WalletFactoryTestnet: ChainToAddress = {
  5: "0x48Aaa7D3A866202AE60d9e6e5d8A321B9D7a9e8A",
  31337: "0x000000000000000000000000000000000000dEaD",
};

export const EngineHub: ChainToAddress = {
  5: '0x18A4eA31d487A20E5eb7fE1521256D41e03B485c'
}

// ----------------------------------------------
// Safe
// ----------------------------------------------

export const SafeMultiCall: ChainToAddress = {
    5: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
    31337: "0x000000000000000000000000000000000000dEaD",
  };
  
  export const SafeProxy: ChainToAddress = {
    5: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
    31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  };
  
  export const SafeProxyFactory: ChainToAddress = {
    5: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
    31337: "0x000000000000000000000000000000000000dEaD",
  };
  