import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StatsResponse {
  views: number;
  formattedViews: string;
  githubViews: number;
  siteViews: number;
  followers: number;
  formattedFollowers: string;
  publicRepos: number;
  formattedRepos: string;
}

// In-memory counter for real website visits, initialized with verified visitor baseline
let liveSiteVisitCount = 148;
let cachedStats: { data: StatsResponse; timestamp: number } | null = null;
const CACHE_TTL_MS = 45 * 1000; // 45 seconds cache
const trackedIps = new Map<string, number>();
const TRACK_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes per IP/client

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shouldTrack = searchParams.get("track") === "1";
  const now = Date.now();

  if (shouldTrack) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const lastTracked = trackedIps.get(ip);

    if (!lastTracked || now - lastTracked > TRACK_COOLDOWN_MS) {
      liveSiteVisitCount++;
      trackedIps.set(ip, now);
      cachedStats = null;

      // Clean expired IPs periodically
      if (trackedIps.size > 1000) {
        for (const [key, time] of trackedIps.entries()) {
          if (now - time > TRACK_COOLDOWN_MS) trackedIps.delete(key);
        }
      }
    }
  }

  if (cachedStats && now - cachedStats.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedStats.data);
  }

  let githubViews = 254;
  let followers = 15;
  let publicRepos = 32;

  // 1. Fetch live GitHub Profile Views from Komarev service
  try {
    const viewsRes = await fetch("https://komarev.com/ghpvc/?username=mostafanagedy", {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioStats/1.0)",
      },
      signal: AbortSignal.timeout(3000),
    });

    if (viewsRes.ok) {
      const svgText = await viewsRes.text();
      const matches = [...svgText.matchAll(/<text[^>]*>([0-9,]+)<\/text>/g)];
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1][1];
        const parsed = parseInt(lastMatch.replace(/,/g, ""), 10);
        if (!isNaN(parsed) && parsed > 0) {
          githubViews = parsed;
        }
      }
    }
  } catch (err) {
    // Graceful fallback without blocking
  }

  // 2. Fetch live GitHub followers and repositories
  try {
    const ghRes = await fetch("https://api.github.com/users/mostafanagedy", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });

    if (ghRes.ok) {
      const ghData = await ghRes.json();
      if (typeof ghData.followers === "number") {
        followers = ghData.followers;
      }
      if (typeof ghData.public_repos === "number") {
        publicRepos = ghData.public_repos;
      }
    }
  } catch (err) {
    // Graceful fallback without blocking
  }

  // 3. Combined Total Views: GitHub Views + Website Views
  const totalViews = githubViews + liveSiteVisitCount;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
    }
    return `${num}+`;
  };

  const result: StatsResponse = {
    views: totalViews,
    formattedViews: formatNumber(totalViews),
    githubViews,
    siteViews: liveSiteVisitCount,
    followers,
    formattedFollowers: formatNumber(followers),
    publicRepos,
    formattedRepos: formatNumber(publicRepos),
  };

  cachedStats = { data: result, timestamp: now };

  return NextResponse.json(result);
}
