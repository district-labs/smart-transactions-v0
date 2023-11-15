import { invalidateIntentsApi } from "@district-labs/intentify-api-actions";
import { env } from "../../env";

export async function invalidateIntentBatches() {
  try {
    await invalidateIntentsApi(env.CORE_API_URL)
  } catch (error) {
    console.log(error);
    return error;
  }
}
