import { env } from "@/env.mjs";
import { roles, signJwt, verifyJwt } from "@/lib/jwt";
import { ironOptions } from "@/lib/session";
import { getIronSession } from "iron-session";

const admins = env.APP_ADMINS?.split(",") || []

export async function GET(req: Request): Promise<Response> {
    // Only app admins can access this endpoint
    const res = new Response();
	const session = await getIronSession(req, res, ironOptions);

    if(!session?.user?.address || !admins.includes(session.user.address)) {
        return new Response(JSON.stringify({
            error: "Unauthorized",
        }), { status: 401 });
    }

    // Extract role from URL
    const url = new URL(req.url);
    const role = url.searchParams.get("role");

    // Validate role
    if (!role || !roles?.includes(role)) {
        return new Response(JSON.stringify({
            error: "Invalid or missing 'role' parameter",
        }), { status: 422 });
    }

    // Create payload and sign it
    const payload = {
        id: "engine-runner",
        url: "https://engine.llama.fi",
        roles: [role],
    };
    const jwt = await signJwt(payload);

    // Verify JWT
    const verifiedPayload = await verifyJwt(jwt);

    // Return response
    return new Response(JSON.stringify({
        jwt,
        verifiedPayload,
    }, null, 2));
}
