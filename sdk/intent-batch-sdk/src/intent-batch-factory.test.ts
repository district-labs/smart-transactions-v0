
import { expect, test } from 'vitest'
import { IntentBatchFactory } from './intent-batch-factory'
import { IntentModule } from './types'

const modules: IntentModule[] = [
    {
        name: 'TimestampRange',
        target: '0x000000000000000000000000000000000000dEaD',
        args: [
            {
                name: 'start',
                type: 'uint128',
            },
            {
                name: 'end',
                type: 'uint128',
            }
        ]
    }
]

test('encode module arguments from intent batch factory', () => {
    const intentBatchFactory = new IntentBatchFactory(modules)
    const result = intentBatchFactory.encode('TimestampRange', ['1', '2'])
    expect(result).toBe('0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002')
})

test('encode module arguments from intent batch manager', () => {
    const intentBatchFactory = new IntentBatchFactory(modules)
    const intentBatch = intentBatchFactory.create('0x000000000000000000000000000000000000dEaD')
    const result = intentBatch.add('TimestampRange', ['1', '2'])
    expect(result).toBe('0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002')
})

test('generate intent batch', () => {
    const intentBatchFactory = new IntentBatchFactory(modules)
    const intentBatch = intentBatchFactory.create('0x000000000000000000000000000000000000dEaD')

    intentBatch.nonce('standard', ['1'])
    intentBatch.add('TimestampRange', ['1', '2'])

    expect(intentBatch.generate()).toEqual({
        "intents": [
            {
              "data": "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002",
              "root": "0x000000000000000000000000000000000000dEaD",
              "target": "0x000000000000000000000000000000000000dEaD",
              "value": BigInt(0),
            },
          ],
          "nonce": "0x0000000000000000000000000000000000000000000000000000000000000001",
          "root": "0x000000000000000000000000000000000000dEaD",
    })
})