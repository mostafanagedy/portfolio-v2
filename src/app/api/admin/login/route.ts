import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 2048) return NextResponse.json({ error: "Request too large." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const password = body && typeof body === "object" ? (body as Record<string, unknown>).password : null;
  if (typeof password !== "string" || password.length < 1 || password.length > 256) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  try {
    if (!verifyAdminPassword(password)) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
  }
}
