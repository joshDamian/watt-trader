import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = ["/sign-in"];

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });

    let redirect: string | undefined;

    const isAuthenticationRoute = AUTH_ROUTES.includes(request.nextUrl.pathname);

    if (token && isAuthenticationRoute) {
        redirect = "/dashboard";
    }
    if (!token && !isAuthenticationRoute) {
        redirect = "/sign-in";
    }

    const response = redirect
        ? NextResponse.redirect(new URL(redirect, request.url))
        : NextResponse.next();
    return response;
}

export const config = { matcher: ["/dashboard/:path*", "/sign-in"] };