import { ax } from "..";
import { END_BLOCK, START_BLOCK, UNI_V3_POOL_ADDR } from "../.";


export async function GET(){

  try {
      const keccakQueryResponse = "0x0ed3360bc2b0a25033651c9d6bbe2b1a1e19ea721e8f9f67506f5f06b6829add";

    const responseTree = await ax.query.getResponseTreeForKeccakQueryResponse(keccakQueryResponse);
    
    const keccakBlockResponse = responseTree.blockTree.getHexRoot();
    const keccakAccountResponse = responseTree.accountTree.getHexRoot();
    const keccakStorageResponse = responseTree.storageTree.getHexRoot();

    const validationWitnessStart = ax.query.getValidationWitness(responseTree,START_BLOCK, UNI_V3_POOL_ADDR, 8)
    const validationWitnessEnd = ax.query.getValidationWitness(responseTree,END_BLOCK, UNI_V3_POOL_ADDR, 8)
    
    if (!validationWitnessStart || !validationWitnessEnd) return new Response("Validation Witness not found", { status: 500 });
       
    const responseData = {
    keccakBlockResponse,
    keccakAccountResponse,
    keccakStorageResponse,
    blockResponses: [],
    accountResponses: [
      validationWitnessStart.accountResponse,
      validationWitnessEnd.accountResponse,
    ],
    storageResponses: [
      // validationWitnessStart.storageResponse,
      // validationWitnessEnd.storageResponse,
    ],
  };

  
    return new Response(JSON.stringify({success: true, responseData}), { status: 200 })

  } catch (e) {
    console.error(e);
    return new Response("An Error ocurred while sending the query", { status: 500 });
  }
}