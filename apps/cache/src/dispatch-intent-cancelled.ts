const siteUrl = process.env.SITE_URL
if(!siteUrl) throw new Error("SITE_URL not set")
export async function dispatchIntentCancelled(chainId: number, intentBatchId: `0x${string}`, transactionHash: `0x${string}`){
    try {
        await fetch(`${siteUrl}/api/events/cancelled`, {
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
    } catch (error) {
        console.log(error)
    }
}