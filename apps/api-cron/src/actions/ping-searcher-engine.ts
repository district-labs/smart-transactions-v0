import { executeIntentBatchesSearcherApi } from "@district-labs/intentify-api-actions";
export async function pingSearcherEngine() {
    try {
       await executeIntentBatchesSearcherApi()
    } catch (error) {
        console.log(error)
        return error;
    }
}