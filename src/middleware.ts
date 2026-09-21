import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Gate "edge" bon marché : vérifie la signature/expiration du cookie de session.
// Le contrôle AUTORITAIRE (session DB valide + rôle admin) est refait côté
// serveur dans requireAdmin() et dans chaque route /api/admin.
const SESSION_COOKIE = "admin_session";

function secret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-change-me",
  );
}

// Routes publiques de l'admin (login/setup + endpoints d'auth et de bootstrap).
const PUBLIC_PATHS = ["/admin/login", "/admin/setup"];
const PUBLIC_API_PREFIXES = ["/api/admin/auth", "/api/admin/setup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;
  if (token) {
    try {
      await jwtVerify(token, secret());
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
