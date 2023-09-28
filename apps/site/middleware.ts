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
];

const USER_SESSION_PROTECTED_ROUTES = [
	"/api/admin",
	"/api/intent-batch",
	"/api/intent-batch/execution",
	"/api/strategy",
	"/api/token",
];

// Helper function to generate unauthorized response
function unauthorizedResponse(
	message = "You are not authorized to access this resource",
) {
	return new NextResponse(JSON.stringify({ error: message }), { status: 401 });
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (JWT_PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
		return await handleJwtProtection(request, pathname);
	}

	if (USER_SESSION_PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
		return await handleUserSessionProtection(request);
	}

	// Continue to the next middleware or request handler
	return NextResponse.next();
}

async function handleUserSessionProtection(request: NextRequest) {
	const res = new Response();
	const session = await getIronSession(request, res, ironOptions);
	if (!session?.user?.address) {
		return unauthorizedResponse("No user session");
	}

	return NextResponse.next();
}

async function handleJwtProtection(request: NextRequest, pathname: string) {
	const headersInstance = headers();
	const authorization = headersInstance.get("authorization");

	if (!authorization) {
		return unauthorizedResponse("No authorization header");
	}

	const payload = await verifyJwt(authorization);
	if (!payload || !payload.roles) {
		return unauthorizedResponse("Invalid token");
	}

	// Authorization checks
	if (isAuthorized(pathname, payload.roles, ENDPOINTS.ENGINE, [ROLES.ENGINE, ROLES.ADMIN])) {
		return NextResponse.next();
	}

	if (isAuthorized(pathname, payload.roles, ENDPOINTS.EVENTS, [ROLES.CACHE, ROLES.ADMIN])) {
		return NextResponse.next();
	}

	return unauthorizedResponse();
}

function isAuthorized(pathname: string, roles: string[], endpoints: string[], requiredRoles: string[]): boolean {
	return endpoints.some(endpoint => pathname.startsWith(endpoint)) && 
		roles.some(role => requiredRoles.includes(role));
}
