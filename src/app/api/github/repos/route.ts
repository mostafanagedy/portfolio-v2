import { NextRequest, NextResponse } from "next/server";
import { CuratedGitHubRepo, GitHubRepo, GitHubReposResponse } from "../../../../types/github";
import { getProjectCuration, isRepoVisible } from "../../../../config/projectsCuration";
import { repoNameToSlug } from "../../../../lib/githubService";
import {
  getCachedRepos,
  setCachedRepos,
  invalidateReposCache,
  CACHE_TTL_SECONDS,
} from "../../../../lib/cacheManager";

export const dynamic = "force-dynamic";

const GITHUB_USERNAME = "mostafanagedy";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const forceRefresh =
    searchParams.get("refresh") === "1" || searchParams.get("refresh") === "true";

  // If force refresh requested, invalidate cache
  if (forceRefresh) {
    invalidateReposCache("Client manual refresh request");
  } else {
    // Check in-memory server cache
    const cached = getCachedRepos();
    if (cached && !cached.isStale) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_TTL_SECONDS * 2}`,
          "X-Cache-Status": "HIT",
        },
      });
    }
  }

  // Optional personal access token to boost rate limits to 5,000 req/hr
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MostafaNagdy-Portfolio/2.0",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    let allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100; // GitHub REST API max per_page
    let hasMore = true;
    let rateLimitRemaining: number | undefined;

    // Retrieve all pages of public repositories dynamically
    while (hasMore) {
      const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc`;

      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(8000),
      });

      const remainingHeader = response.headers.get("x-ratelimit-remaining");
      if (remainingHeader) {
        rateLimitRemaining = parseInt(remainingHeader, 10);
      }

      if (!response.ok) {
        // Handle Rate Limiting (403 or 429)
        if (response.status === 403 || response.status === 429) {
          const stale = getCachedRepos();
          if (stale?.data?.repos?.length) {
            return NextResponse.json(
              {
                ...stale.data,
                isRateLimited: true,
                error: "GitHub API rate limit reached. Displaying cached repository data.",
              },
              {
                status: 200,
                headers: { "X-Cache-Status": "STALE-RATE-LIMIT" },
              }
            );
          }

          return NextResponse.json(
            {
              repos: [],
              featuredRepos: [],
              totalCount: 0,
              isRateLimited: true,
              error: "GitHub API rate limit exceeded. Please try again shortly.",
            },
            { status: 429 }
          );
        }

        throw new Error(
          `GitHub API responded with HTTP status ${response.status}: ${response.statusText}`
        );
      }

      const pageRepos = (await response.json()) as GitHubRepo[];

      if (Array.isArray(pageRepos) && pageRepos.length > 0) {
        allRepos = allRepos.concat(pageRepos);

        if (pageRepos.length < perPage) {
          hasMore = false;
        } else {
          page++;
          if (page > 10) hasMore = false; // Safety cutoff
        }
      } else {
        hasMore = false;
      }
    }

    // Apply Visibility Policy & Presentation Overrides from projectsCuration
    const curatedRepos: CuratedGitHubRepo[] = allRepos
      .filter((repo) => isRepoVisible(repo.name))
      .map((repo) => {
        const curation = getProjectCuration(repo.name);
        const slug = curation?.customSlug || repoNameToSlug(repo.name);

        const displayName = curation?.customTitle || repo.name;
        const displayDescription =
          curation?.customDescription ||
          repo.description ||
          "No description provided for this repository.";

        const displayDemoUrl =
          curation?.customDemoUrl ||
          (repo.homepage && repo.homepage.trim() !== "" ? repo.homepage.trim() : null);

        const displayScreenshot = curation?.customScreenshot || null;

        const displayTags =
          curation?.customTags && curation.customTags.length > 0
            ? curation.customTags
            : repo.topics && repo.topics.length > 0
            ? repo.topics
            : repo.language
            ? [repo.language]
            : [];

        const featured = Boolean(curation?.featured);
        const displayOrder = curation?.displayOrder ?? 999;
        const categories = curation?.categories || ["Web App"];

        return {
          ...repo,
          homepage: displayDemoUrl,
          description: repo.description || null,
          displayName,
          displayDescription,
          displayScreenshot,
          displayTags,
          displayDemoUrl,
          slug,
          featured,
          displayOrder,
          categories,
          curation,
        };
      });

    // Compute Featured Repositories sorted by displayOrder
    const featuredRepos: CuratedGitHubRepo[] = curatedRepos
      .filter((r) => r.featured)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_SECONDS * 1000);

    const responsePayload: GitHubReposResponse = {
      repos: curatedRepos,
      featuredRepos,
      totalCount: curatedRepos.length,
      cachedAt: now.toISOString(),
      cacheExpiresAt: expiresAt.toISOString(),
      cacheTtlSeconds: CACHE_TTL_SECONDS,
      rateLimitRemaining,
      isRateLimited: false,
    };

    // Store in global cache
    setCachedRepos(responsePayload);

    return NextResponse.json(responsePayload, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_TTL_SECONDS * 2}`,
        "X-Cache-Status": "MISS",
      },
    });
  } catch (error: any) {
    console.error("Error synchronizing repositories from GitHub:", error);

    // Fallback to stale cache if available
    const stale = getCachedRepos();
    if (stale?.data?.repos?.length) {
      return NextResponse.json(
        {
          ...stale.data,
          error: "Failed to refresh from GitHub. Displaying cached repository data.",
        },
        {
          status: 200,
          headers: { "X-Cache-Status": "STALE-ERROR" },
        }
      );
    }

    return NextResponse.json(
      {
        repos: [],
        featuredRepos: [],
        totalCount: 0,
        error: error?.message || "Failed to retrieve repositories from GitHub.",
      },
      { status: 500 }
    );
  }
}
