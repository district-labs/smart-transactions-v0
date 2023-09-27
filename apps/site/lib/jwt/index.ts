import { env } from "@/env.mjs"
import { SignJWT, jwtVerify, type JWTPayload } from "jose"

const alg = "HS256"
export const roles = ["ENGINE", "CACHE", "ADMIN"]

interface JwtPayload extends JWTPayload {
  id: string
  url: string
  roles: string[]
}

export async function verifyJwt(jwt: string) {
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET)

    const { payload } = await jwtVerify(jwt, secret, {
      algorithms: [alg],
    })

    return payload as JwtPayload
  } catch (e) {
    console.log(e)
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signJwt(payload: any) {
  const secret = new TextEncoder().encode(env.JWT_SECRET)
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:intentify:issuer")
    .sign(secret)

  return jwt
}
