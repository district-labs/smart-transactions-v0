import { API_URL } from "../constants"
import { toObjectString } from "../utils"

export async function intentBatchCreate(intentBatch: any) {
    if (!intentBatch) throw new Error("No intent batch provided")
    const response = await fetch(`${API_URL}/intent-batch`, {
      method: "POST",
      credentials: "include",
      body: toObjectString(intentBatch),
      headers: {
        "Content-Type": "application/json",
      },
    })

  
    if (response.ok) {
      const data : {
        ok: true,
        intentBatchHash:`0x${string}`
      } = await response.json()

      return data
    }

    const data = await response.text()
    throw new Error(data)
}
