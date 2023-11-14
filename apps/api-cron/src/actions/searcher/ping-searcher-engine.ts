import { env } from "../../env";

export async function pingSearcherEngine() {
    try {
        await fetch(`${env.SEARCHER_API_URL}engine`, {
            method: 'GET',
        });
    } catch (error) {
        console.log(error)
        return error;
    }
}