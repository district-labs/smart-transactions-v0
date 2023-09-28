import { verifyJwt } from "@/lib/jwt";
import { ironOptions } from "@/lib/session";
import { getIronSession } from "iron-session/edge";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Constants
const ROLES = {
	ENGINE: "ENGINE",
	ADMIN: "ADMIN",
	CACHE: "CACHE",
};
const ENDPOINTS = {
	ENGINE: ["/api/engine", "/api/execute"],
	EVENTS: ["/api/events"],
};

const JWT_PROTECTED_ROUTES = [
	"/api/engine",
	"/api/events",
	"/api/execute",
]

const USER_SESSION_PROTECTED_ROUTES = [
"/api/admin",
"/api/intent-batch",
"/api/intent-batch/execution",
"/api/strategy",
"/api/token"
]

// Helper function to generate unauthorized response
function unauthorizedResponse(
	message = "You are not authorized to access this resource",
) {
	return new NextResponse(JSON.stringify({ error: message }), { status: 401 });
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const isJwtProtectedRoute = JWT_PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

	if (isJwtProtectedRoute) {
		return await handleJwtProtection(request);
	}

	const isUserSessionProtectedRoute = USER_SESSION_PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

	
	if (isUserSessionProtectedRoute) {
		return await handleUserSessionProtection(request);
	}

}

async function handleUserSessionProtection(request: NextRequest) {
	  const res = new Response()
  const session = await getIronSession(request, res, ironOptions)
	if(!session?.user?.address){
		return unauthorizedResponse("No user session")
	}

	return NextResponse.next();
}


async function handleJwtProtection(request: NextRequest){
		const pathname = request.nextUrl.pathname;

  const headersInstance = headers();
	const authorization = headersInstance.get("authorization");

	if (!authorization) {
		return unauthorizedResponse("No authorization header");
	}

	const payload = await verifyJwt(authorization);
	if (!payload || !payload.roles) {
		return unauthorizedResponse("Invalid token");
	}

	// Check authorization for ENGINE and ADMIN roles
	if (ENDPOINTS.ENGINE.some((endpoint) => pathname.startsWith(endpoint))) {
		if (
			payload.roles.includes(ROLES.ENGINE) ||
			payload.roles.includes(ROLES.ADMIN)
		) {
			return NextResponse.next();
		}
		return unauthorizedResponse();
	}

	// Check authorization for CACHE and ADMIN roles
	if (ENDPOINTS.EVENTS.some((endpoint) => pathname.startsWith(endpoint))) {
		if (
			payload.roles.includes(ROLES.CACHE) ||
			payload.roles.includes(ROLES.ADMIN)
		) {
			return NextResponse.next();
		}
		return unauthorizedResponse();
	}
}

