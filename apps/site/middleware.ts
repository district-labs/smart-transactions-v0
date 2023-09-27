import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { verifyJwt } from "@/lib/jwt";

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

// Helper function to generate unauthorized response
function unauthorizedResponse(
	message = "You are not authorized to access this resource",
) {
	return new NextResponse(JSON.stringify({ error: message }), { status: 401 });
}

export async function middleware(request: NextRequest) {
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

export const config = {
	matcher: ["/api/engine/:path*", "/api/events/:path*", "/api/execute/:path*"],
};
