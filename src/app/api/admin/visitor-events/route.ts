import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const db = await getDatabase();
    const events = db.collection("visitor_events");
    const [total, sessions, cvClicks, githubClicks, recent] = await Promise.all([
      events.countDocuments({}),
      events.distinct("sessionId"),
      events.countDocuments({ eventName: "cv_click" }),
      events.countDocuments({ eventName: "github_click" }),
      events.find({}, { projection: { _id: 0, sessionId: 1, eventName: 1, path: 1, referrerDomain: 1, deviceType: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(100).toArray(),
    ]);
    return NextResponse.json({
      stats: { totalEvents: total, uniqueSessions: sessions.length, cvClicks, githubClicks },
      events: recent.map((event) => ({
        ...event,
        sessionId: typeof event.sessionId === "string" ? event.sessionId.slice(0, 8) : "unknown",
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Configure MONGODB_URI to enable reports." }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not load visitor reports." }, { status: 503 });
  }
}
