import { roles, signJwt, verifyJwt } from "@/lib/jwt"

export async function GET(req: Request): Promise<Response> {
  // Extract role from URL
  const url = new URL(req.url)
  const role = url.searchParams.get("role")

  // Validate role
  if (!role || !roles?.includes(role)) {
    return new Response(
      JSON.stringify({
        error: "Invalid or missing 'role' parameter",
      }),
      { status: 422 }
    )
  }

  // Create payload and sign it
  const payload = {
    id: "engine-runner",
    url: "https://engine.llama.fi",
    roles: [role],
  }
  const jwt = await signJwt(payload)

  // Verify JWT
  const verifiedPayload = await verifyJwt(jwt)

  // Return response
  return new Response(
    JSON.stringify(
      {
        jwt,
        verifiedPayload,
      },
      null,
      2
    )
  )
}
