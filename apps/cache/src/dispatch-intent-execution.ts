const siteUrl = process.env.SITE_URL
if(!siteUrl) throw new Error("SITE_URL not set")

export async function dispatchIntentExecution(chainId: number, intentBatchId: `0x${string}`, transactionHash: `0x${string}`){
    const res = await fetch(`${siteUrl}/api/events/executed`, {
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