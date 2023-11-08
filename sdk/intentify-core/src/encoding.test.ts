import { hashTypedData, toHex } from 'viem'
import { expect, test } from "vitest"
import { eip712Types } from './eip712-types'
import { ADDRESS_ZERO } from './constants'


test("encode module arguments from intent batch factory", () => {
    const intentBatch = {
        root: ADDRESS_ZERO,
        nonce:'0x0000000000000000000000000000000000000000000000000000000000000000',
        intents: [{
          root: ADDRESS_ZERO,
          target: ADDRESS_ZERO,
          value: 0,
          data: '0x',
        }],
      }

      console.log(intentBatch)


    const result = hashTypedData({
        domain: {
          name: 'Intentify Safe Module',
          version: '0',
          chainId: 31337,
          verifyingContract: '0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f',
        },
        types: eip712Types,
        primaryType: 'IntentBatch',
        message: intentBatch,
      })
      

    expect(result).toBe(
      "0xdadf946adb368f799b19d874f5d142a1ed27c339d3a480b9af5a90269e29d615"
    )
  })