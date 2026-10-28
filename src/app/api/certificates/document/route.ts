import { NextRequest, NextResponse } from "next/server";
import { certificatesConfig } from "../../../../config/certificatesConfig";
import { resolveRepositorySource } from "../../../../lib/certificatesService";

// In-memory cache for document buffers (max 50 documents, 1-hour TTL)
const documentBufferCache = new Map<string, { buffer: ArrayBuffer; contentType: string; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get("file");
    const download = searchParams.get("download") === "1";

    if (!file) {
      return NextResponse.json({ error: "Filename parameter 'file' is required." }, { status: 400 });
    }

    // Sanitize filename to prevent directory traversal
    const safeFilename = file.replace(/^(\.\.(\/|\\|$))+/, "").trim();
    const configOverride = certificatesConfig.overrides[safeFilename];

    // If download action requested, enforce allowDownload permissions
    if (download) {
      const isAllowed = configOverride?.allowDownload ?? certificatesConfig.defaultAllowDownload;
      if (!isAllowed) {
        return NextResponse.json(
          {
            error: "Download is restricted for this certificate.",
            message: "This certificate is configured for live inspection only. Direct downloading is disabled by the portfolio owner.",
          },
          { status: 403 }
        );
      }
    }

    // Resolve repository source (handles intended vs fallback repo)
    const { owner, repo, defaultBranch } = await resolveRepositorySource();
    const rawGithubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${encodeURIComponent(safeFilename)}`;

    // Check buffer cache
    const cacheKey = `${owner}/${repo}/${safeFilename}`;
    let buffer: ArrayBuffer;
    let contentType = "application/pdf";

    const cached = documentBufferCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      buffer = cached.buffer;
      contentType = cached.contentType;
    } else {
      const headers: Record<string, string> = {
        "User-Agent": "MostafaNagdy-Portfolio/1.0",
      };
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const res = await fetch(rawGithubUrl, { headers, cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json(
          { error: `Certificate document not found in GitHub repository (HTTP ${res.status}).` },
          { status: 404 }
        );
      }

      buffer = await res.arrayBuffer();

      const lower = safeFilename.toLowerCase();
      if (lower.endsWith(".png")) contentType = "image/png";
      else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
      else contentType = "application/pdf";

      // Cache document buffer
      if (documentBufferCache.size > 50) {
        const firstKey = documentBufferCache.keys().next().value;
        if (firstKey) documentBufferCache.delete(firstKey);
      }
      documentBufferCache.set(cacheKey, { buffer, contentType, timestamp: Date.now() });
    }

    const disposition = download ? "attachment" : "inline";
    const encodedDownloadFilename = encodeURIComponent(safeFilename);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${disposition}; filename="${encodedDownloadFilename}"`,
        "X-Frame-Options": "SAMEORIGIN",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[API /api/certificates/document] Error streaming document:", error);
    return NextResponse.json(
      { error: "Internal server error streaming certificate document." },
      { status: 500 }
    );
  }
}
