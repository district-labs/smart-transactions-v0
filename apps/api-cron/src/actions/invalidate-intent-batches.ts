export async function invalidateIntentBatches() {
    try {
        await fetch(`${process.env.API_URL}/infra/intents/invalidate`, {
            method: 'GET',
        });
    } catch (error) {
        console.log(error)
        return error;
    }
}