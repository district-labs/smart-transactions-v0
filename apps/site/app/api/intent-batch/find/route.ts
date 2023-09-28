import { NextRequest } from "next/server"
import { db } from "@/db"
import { isAddress } from "viem"

export async function GET(request: NextRequest) {
  try {
    const root = request.nextUrl.searchParams.get("root")
    if (!root || !isAddress(root)) {
      throw new Error("Smart Wallet Address (root) is required")
    }
    const results = await db.query.intentBatch.findMany({
      where: (intentBatch, { eq }) => eq(intentBatch.root, root),
      with: {
        intents: true,
        intentBatchExecution: {
          with: {
            hooks: true,
          },
        },
        strategy: {
          with: {
            manager: true,
          },
        },
      },
    })
    return new Response(JSON.stringify(results, null, 2))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response(JSON.stringify({ ok: false }))
  }
}
