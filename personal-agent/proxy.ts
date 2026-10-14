import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PREFIXES = [
  "/login",
  "/api/auth/google",
  "/api/auth/login",
  "/api/auth/logout",
  "/icon",
  "/apple-icon",
  "/site.webmanifest",
  "/_next",
  "/favicon",
];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return false;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(p),
  );
}

export function proxy(request: NextRequest) {
  const routerHost = process.env.VERCEL_URL;
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.__VERCEL_DEV_RUNNING === "1" && routerHost && forwardedHost !== routerHost) {
    const target = request.nextUrl.clone();
    target.protocol = "http:";
    target.host = routerHost;
    return NextResponse.redirect(target);
  }

  const { pathname } = request.nextUrl;
  // Eve health and OAuth callbacks must stay reachable
  if (pathname.startsWith("/eve/") && pathname.endsWith("/health")) {
    return NextResponse.next();
  }
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get("pa_session")?.value;
  if (!session) {
    if (pathname.startsWith("/api/") || pathname.startsWith("/eve/")) {
      return NextResponse.json({ error: "authentication_required" }, { status: 401 });
    }
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
