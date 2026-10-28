import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  invalidateReposCache,
  isDuplicateWebhook,
  recordWebhookDelivery,
} from "../../../../lib/cacheManager";
import { clearProjectDetailsCache } from "../../../../lib/githubService";

export const dynamic = "force-dynamic";

/**
 * Validates GitHub Webhook HMAC-SHA256 signature
 */
function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const expectedSignature = "sha256=" + hmac.update(rawBody).digest("hex");

    const sourceBuffer = Buffer.from(signatureHeader);
    const targetBuffer = Buffer.from(expectedSignature);

    if (sourceBuffer.length !== targetBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sourceBuffer, targetBuffer);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  // 1. Ensure webhook secret is configured on the server
  if (!secret) {
    return NextResponse.json(
      {
        error: "GitHub Webhook is disabled: GITHUB_WEBHOOK_SECRET is not configured on the server.",
      },
      { status: 503 }
    );
  }

  // 2. Read headers and raw body for verification
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event") || "unknown";
  const deliveryId = request.headers.get("x-github-delivery") || "";

  const rawBody = await request.text();

  // 3. Verify signature
  if (!verifySignature(rawBody, signature, secret)) {
    console.warn(`[GitHub Webhook] Unauthorized attempt: Invalid signature for event '${event}'`);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  // 4. Duplicate event prevention
  if (deliveryId && isDuplicateWebhook(deliveryId)) {
    return NextResponse.json({
      status: "ignored",
      reason: "duplicate_event",
      deliveryId,
    });
  }

  if (deliveryId) {
    recordWebhookDelivery(deliveryId);
  }

  // 5. Parse JSON payload
  let payload: any = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  // Handle GitHub Ping event
  if (event === "ping") {
    return NextResponse.json({
      status: "success",
      message: "Webhook successfully verified.",
      zen: payload.zen,
    });
  }

  // 6. Synchronize cache on relevant repository changes
  const action = payload.action || "push";
  const repoName = payload.repository?.name;

  console.log(`[GitHub Webhook] Received event: ${event} (${action}) for repo: ${repoName || "all"}`);

  // Invalidate both repository list cache and single project cache
  invalidateReposCache(`Webhook event: ${event}/${action}`);
  if (repoName) {
    clearProjectDetailsCache(repoName);
  } else {
    clearProjectDetailsCache();
  }

  return NextResponse.json({
    success: true,
    event,
    action,
    repo: repoName || null,
    synchronized: true,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  const isConfigured = Boolean(process.env.GITHUB_WEBHOOK_SECRET);
  return NextResponse.json({
    service: "GitHub Repository Webhook Synchronization",
    configured: isConfigured,
    status: isConfigured ? "active" : "unconfigured (polling/cache-expiration active)",
  });
}
