import { executeIntentBatchesSearcherApi } from "@district-labs/intentify-api-actions";
import { env } from "../../env";

export async function pingSearcherEngine() {
    try {
       await executeIntentBatchesSearcherApi(env.SEARCHER_API_URL)
    } catch (error) {
        console.log(error)
        return error;
    }
}