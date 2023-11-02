export async function invalidateIntentBatches() {
    try {
        const response = await fetch(`${process.env.API_URL}/infra/invalidate`, {
            method: 'GET',
        });
    } catch (error) {
        console.log(error)
        return 0;
    }
}