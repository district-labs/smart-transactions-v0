import { invalidateIntentsApi } from "@district-labs/intentify-api-actions";

export async function invalidateIntentBatches() {
  try {
    await invalidateIntentsApi()
  } catch (error) {
    console.log(error);
    return error;
  }
}
