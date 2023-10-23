# Intent Batch SDK


```ts
intentBatchFactory = new IntentBatchFactory([
    {
        name: 'TimestampRange',
        
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
]);

intentBatch = intentBatchFactory.create('0x000000000000000000000000000000000000dEaD');
intentBatch.nonce("standard", 0)
intentBatch.add("TimestampRange", [startTime, endTime])
const data = intentBatch.generate()
/**
{
    "nonce": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "root": "0x000000000000000000000000000000000000dEaD",
    "intents": [
        {
            "data": "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002",
            "root": "0x000000000000000000000000000000000000dEaD",
            "target": "0x000000000000000000000000000000000000dEaD",
            "value": BigInt(0),
        },
        ],
}
 * /
```