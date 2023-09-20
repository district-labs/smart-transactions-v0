import { getIntentifySafeModule } from "./contracts"

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(req: Request) {
  const res = new Response()

  const intentifySafeModule = getIntentifySafeModule(5)

  console.log("Hello from Cron Job")
  return res
}
