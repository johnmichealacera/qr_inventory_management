import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { ROLES } from "@/lib/constants";

const { auth } = NextAuth(authConfig);

const REQUESTER_PATHS = ["/dashboard", "/consumables", "/my-requests", "/purchase-request"];

const GSO_OFFICER_PATHS = [
  "/dashboard",
  "/consumables",
  "/consumable-requests",
  "/purchase-request",
];

function isRequesterRole(role?: string | null) {
  return role === ROLES.FACULTY || role === ROLES.STAFF;
}

function isGsoOfficerRole(role?: string | null) {
  return role === ROLES.GSO_OFFICER;
}

function pathAllowed(paths: string[], pathname: string) {
  return paths.some((base) => pathname === base || pathname.startsWith(`${base}/`));
}

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isLoginPage = pathname === "/login";
  const isPublicRoute = pathname === "/" || isLoginPage || pathname === "/demo-flow.html";
  const isAuthApi = pathname.startsWith("/api/auth");

  if (isAuthApi) return NextResponse.next();

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthenticated && isRequesterRole(role) && !pathAllowed(REQUESTER_PATHS, pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isAuthenticated && isGsoOfficerRole(role) && !pathAllowed(GSO_OFFICER_PATHS, pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
