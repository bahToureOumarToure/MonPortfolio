import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "origin invalide" }, { status: 403 });
  }
  await destroySession();
  return NextResponse.json({ ok: true });
}
