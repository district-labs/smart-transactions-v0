export interface GetAxiomResponseResult {
  responseData: {
    keccakBlockResponse: `0x${string}`;
    keccakAccountResponse: `0x${string}`;
    keccakStorageResponse: `0x${string}`;
    blockResponses: {
      blockNumber: number;
      blockHash: `0x${string}`;
      leafIdx: number;
      proof: [
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
      ];
    }[];
    accountResponses: {
      blockNumber: number;
      addr: `0x${string}`;
      nonce: `0x${string}`;
      balance: `0x${string}`;
      storageRoot: `0x${string}`;
      codeHash: `0x${string}`;
      leafIdx: number;
      proof: [
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
      ];
    }[];

    storageResponses: {
      blockNumber: number;
      addr: `0x${string}`;
      value: `0x${string}`;
      slot: number;
      leafIdx: number;
      proof: [
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
        `0x${string}`,
      ];
    }[];
  };
}
