```js
const IntentBatch = {
    root: 'address'
    nonce: {
        queue: 'uint128',
        accumulator: 'uint128'
    }
    intents: [
        {
            hooking: 'boolean' // prevent running hooks on this intent. critical for enforcing final intent outcomes.
            target: 'address'
            terms: 'bytes'
        }
    ]
}
```

```js
const IntentBatchExecution = {
    batch: IntentBatch
    map: ['boolean'] // executes hooks for an intent. if TRUE the intent `hooking` must also be TRUE.
    hooks: [
        {
            pre: ['bytes']
            post: ['bytes']
        }
    ]
}
```

