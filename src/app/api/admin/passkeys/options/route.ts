import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { startRegistration } from "@/lib/auth/webauthn";
import { isSameOrigin } from "@/lib/auth/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "origin invalide" }, { status: 403 });
  }
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const options = await startRegistration({ id: user.id, email: user.email });
  return NextResponse.json(options);
}
