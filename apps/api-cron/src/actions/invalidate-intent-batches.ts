import { env } from "../env";

export async function invalidateIntentBatches() {
    try {
        await fetch(`${env.CORE_API_URL}infra/intents/invalidate`, {
            method: 'GET',
        });
    } catch (error) {
        console.log(error)
        return error;
    }
}