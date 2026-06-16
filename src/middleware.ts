import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = request.cookies.get("admin_session")?.value === "authenticated";
  const isUser = !!request.cookies.get("user_session")?.value;

  // Admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/admin/login" && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname === "/admin") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/admin/login", request.url)
    );
  }

  // User account routes
  if (pathname.startsWith("/account")) {
    if (!isUser) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
