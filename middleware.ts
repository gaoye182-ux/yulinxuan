import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicAdminPaths = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin") || publicAdminPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  });

  if (!token || (typeof token.adminSessionExpiresAt === "number" && token.adminSessionExpiresAt <= Math.floor(Date.now() / 1000))) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    loginUrl.searchParams.set("error", "SessionRequired");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
