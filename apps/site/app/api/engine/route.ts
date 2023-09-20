// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(req: Request) {
    const res = new Response()

    console.log('Hello from Cron Job')
    return res;
}
