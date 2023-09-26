export async function dispatchIntentExecution(chainId: number, intentBatchId: `0x${string}`, transactionHash: `0x${string}`){
    const res = await fetch(`http://localhost:3000/api/events/executed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chainId,
            intentBatchId,
            transactionHash
        })
    })
}