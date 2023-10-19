# Intent Batch SDK


```ts
intentBatchFactory = new IntentBatchFactory;
intentBatchFactory.addModule({
    name: 'TimestampRange',
    args: ['uint128', 'uint128']
})

intentBatch = intentBatchFactory.create();
intentBatch.nonce("Standard")
intentBatch.add("TimestampRange", [startTime, endTime])

const eip712Data = intentBatch.createEip712Data()
```