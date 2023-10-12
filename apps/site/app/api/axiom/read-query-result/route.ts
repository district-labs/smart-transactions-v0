import { ax } from ".."
import { UNI_V3_POOL_ADDR } from "../."

export async function GET() {
  try {
    const keccakQueryResponse =
      "0x3e24c4c99e71ede2e621cd757f52c17221d270964b85b45bee48385802e51a82"

    const responseTree =
      await ax.query.getResponseTreeForKeccakQueryResponse(keccakQueryResponse)

    const keccakBlockResponse = responseTree.blockTree.getHexRoot()
    const keccakAccountResponse = responseTree.accountTree.getHexRoot()
    const keccakStorageResponse = responseTree.storageTree.getHexRoot()

    const validationWitness1 = ax.query.getValidationWitness(
      responseTree,
      9848630,
      UNI_V3_POOL_ADDR,
      8
    )

    if (!validationWitness1)
      return new Response("Validation Witness not found", { status: 500 })

    const responseData = {
      keccakBlockResponse,
      keccakAccountResponse,
      keccakStorageResponse,
      blockResponses: [validationWitness1.blockResponse],
      accountResponses: [],
      storageResponses: [
        validationWitness1.storageResponse,
        // validationWitness2.storageResponse,
        // validationWitness3.storageResponse,
      ],
    }

    return new Response(JSON.stringify({ success: true, responseData }), {
      status: 200,
    })
  } catch (e) {
    console.error(e)
    return new Response("An Error ocurred while sending the query", {
      status: 500,
    })
  }
}
