import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StatsResponse {
  views: number;
  formattedViews: string;
  followers: number;
  formattedFollowers: string;
  publicRepos: number;
  formattedRepos: string;
}

// In-memory cache to respect GitHub unauthenticated rate limits (60 requests/hr)
let cachedStats: { data: StatsResponse; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export async function GET() {
  const now = Date.now();
  if (cachedStats && now - cachedStats.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedStats.data);
  }

  let views = 255;
  let followers = 15;
  let publicRepos = 32;

  // 1. Fetch live Profile Views counter from Komarev GitHub profile views service
  try {
    const viewsRes = await fetch("https://komarev.com/ghpvc/?username=mostafanagedy", {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioStats/1.0)",
      },
    });

    if (viewsRes.ok) {
      const svgText = await viewsRes.text();
      // Matches the number inside the rightmost text element in Komarev's SVG
      const matches = [...svgText.matchAll(/<text[^>]*>([0-9,]+)<\/text>/g)];
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1][1];
        const parsed = parseInt(lastMatch.replace(/,/g, ""), 10);
        if (!isNaN(parsed) && parsed > 0) {
          views = parsed;
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch live view count:", err);
  }

  // 2. Fetch live GitHub stats (followers and repositories)
  try {
    const ghRes = await fetch("https://api.github.com/users/mostafanagedy", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
      next: { revalidate: 300 },
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
    console.error("Failed to fetch GitHub stats:", err);
  }

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
    views,
    formattedViews: formatNumber(views),
    followers,
    formattedFollowers: formatNumber(followers),
    publicRepos,
    formattedRepos: formatNumber(publicRepos),
  };

  cachedStats = { data: result, timestamp: now };

  return NextResponse.json(result);
}
