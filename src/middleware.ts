import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "./api";

const AUTH_INFO_COOKIE = "auth_info";

export function middleware(req: NextRequest) {
    const cookie = req.cookies.get(AUTH_INFO_COOKIE)?.value;

    if (!cookie) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const authInfo = JSON.parse(cookie) as LoginResponse;

    if (authInfo.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/management/:path*"],
};