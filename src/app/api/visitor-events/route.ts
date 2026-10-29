import { NextRequest, NextResponse } from "next/server";
import { getDatabase, ensureVisitorIndexes } from "@/lib/mongodb";
import { getDateRetentionExpiry, isTrackableEvent, normalizePath, normalizeReferrer } from "@/lib/visitor-tracking";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 4096;

export async function POST(request: NextRequest) {
  const consent = request.cookies.get("nagedy_analytics_consent")?.value;
  if (consent !== "accepted") return NextResponse.json({ ok: false, error: "CONSENT_REQUIRED" }, { status: 403 });

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (!isTrackableEvent(input.eventName)) return NextResponse.json({ ok: false }, { status: 400 });
  const path = normalizePath(input.path);
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

  const sessionId = typeof input.sessionId === "string" && /^[0-9a-f-]{36}$/i.test(input.sessionId)
    ? input.sessionId
    : null;
  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

  const userAgent = request.headers.get("user-agent") || "";
  const deviceType = /mobile|android|iphone/i.test(userAgent) ? "mobile" : /ipad|tablet/i.test(userAgent) ? "tablet" : "desktop";
  const referrer = normalizeReferrer(input.referrer);

  try {
    const db = await getDatabase();
    await ensureVisitorIndexes(db);
    await db.collection("visitor_events").insertOne({
      sessionId,
      eventName: input.eventName,
      path,
      referrerDomain: referrer,
      deviceType,
      createdAt: new Date(),
      expiresAt: getDateRetentionExpiry(30),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "TRACKING_NOT_CONFIGURED" }, { status: 503 });
    }
    console.error("Visitor event persistence failed.");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
