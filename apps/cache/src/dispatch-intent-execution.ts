import { Transaction } from "@ponder/core"
const siteUrl = process.env.PONDER_APP_API_URL
if(!siteUrl) throw new Error("PONDER_APP_API_URL not set")

export async function dispatchIntentExecution(chainId: number, intentBatchId: `0x${string}`, receipt: Transaction){
    try {
        await fetch(`${siteUrl}/service/events/executed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chainId,
                intentBatchId,
                transactionHash: receipt.hash,
                blockHash: receipt.blockHash,
                blockNumber: receipt.blockNumber.toString(),
                to: receipt.to,
            })
        })
    } catch (error) {
        console.log(error)
    }
  
}