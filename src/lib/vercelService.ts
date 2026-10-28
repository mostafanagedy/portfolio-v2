import { VercelDeploymentInfo, VercelDeploymentResponse, VercelDeploymentState } from "../types/vercel";
import { getProjectCuration } from "../config/projectsCuration";

const VERCEL_API_BASE = "https://api.vercel.com";
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes server-side cache

interface CacheEntry {
  data: VercelDeploymentResponse;
  timestamp: number;
}

const vercelCache = new Map<string, CacheEntry>();

/**
 * Checks server-side Vercel configuration
 */
export function getVercelConfig() {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  return {
    isConfigured: Boolean(token && token.trim() !== ""),
    token: token?.trim() || null,
    teamId: teamId?.trim() || null,
  };
}

/**
 * Resolves Vercel project candidate names for a GitHub repository
 */
export function resolveVercelProjectName(
  repoName: string,
  slug?: string,
  homepageUrl?: string | null
): { primaryName: string; fallbackNames: string[]; detectedDomain: string | null } {
  const curation = getProjectCuration(repoName);
  let detectedDomain: string | null = null;

  // Extract subdomain if homepage is on vercel.app (e.g. https://amazon-ecommerce-main.vercel.app -> amazon-ecommerce-main)
  if (homepageUrl) {
    const match = homepageUrl.match(/https?:\/\/([^.]+)\.vercel\.app/i);
    if (match && match[1]) {
      detectedDomain = match[1].toLowerCase();
    }
  }

  // Priority 1: Explicit vercelProject in curation config
  if (curation?.vercelProject) {
    return {
      primaryName: curation.vercelProject,
      fallbackNames: [detectedDomain, repoName.toLowerCase(), slug].filter(Boolean) as string[],
      detectedDomain,
    };
  }

  // Priority 2: Detected subdomain from vercel.app homepage
  if (detectedDomain) {
    return {
      primaryName: detectedDomain,
      fallbackNames: [repoName.toLowerCase(), slug].filter(Boolean) as string[],
      detectedDomain,
    };
  }

  // Priority 3: Normalized repository name
  const normalizedRepo = repoName.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  return {
    primaryName: normalizedRepo,
    fallbackNames: [repoName, slug].filter(Boolean) as string[],
    detectedDomain,
  };
}

/**
 * Formats timestamps into a clean readable string
 */
function formatDeploymentDate(timestamp: number): string {
  try {
    const d = new Date(timestamp);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

/**
 * Fetches latest deployment information from the official Vercel REST API
 */
export async function fetchVercelDeployment(
  repoName: string,
  slug?: string,
  homepageUrl?: string | null,
  forceRefresh: boolean = false
): Promise<VercelDeploymentResponse> {
  const cacheKey = `${repoName.toLowerCase()}_${slug || ""}`;
  const now = Date.now();

  // Return cached result if valid and not forcing a refresh
  if (!forceRefresh) {
    const cached = vercelCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return {
        ...cached.data,
        source: "cache",
      };
    }
  }

  const { isConfigured, token, teamId } = getVercelConfig();
  const { primaryName, fallbackNames, detectedDomain } = resolveVercelProjectName(
    repoName,
    slug,
    homepageUrl
  );

  // Fallback state when Vercel token is not configured (graceful optional integration)
  if (!isConfigured || !token) {
    const unconfiguredResponse: VercelDeploymentResponse = {
      isConfigured: false,
      hasDeployment: Boolean(detectedDomain),
      projectName: primaryName,
      detectedDomain: detectedDomain ? `https://${detectedDomain}.vercel.app` : undefined,
      statusMessage:
        "Vercel deployment integration is ready. Configure VERCEL_TOKEN in your environment variables to stream real-time deployment status, commit hashes, and build logs.",
      source: "unconfigured",
      cachedAt: new Date().toISOString(),
    };

    vercelCache.set(cacheKey, { data: unconfiguredResponse, timestamp: now });
    return unconfiguredResponse;
  }

  const teamParam = teamId ? `&teamId=${encodeURIComponent(teamId)}` : "";
  const candidates = [primaryName, ...fallbackNames.filter((n) => n !== primaryName)];

  try {
    let latestDeploymentRaw: any = null;
    let matchedProjectName = primaryName;

    for (const candidate of candidates) {
      if (!candidate) continue;

      // 1. Query Vercel v6 deployments by projectId / app name
      const url = `${VERCEL_API_BASE}/v6/deployments?projectId=${encodeURIComponent(
        candidate
      )}&limit=5${teamParam}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "User-Agent": "MostafaNagdy-Portfolio/2.0",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (res.status === 401 || res.status === 403) {
        return {
          isConfigured: true,
          hasDeployment: false,
          error: "Vercel authorization failed: Invalid token or insufficient permissions.",
          source: "error",
          cachedAt: new Date().toISOString(),
        };
      }

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.deployments) && data.deployments.length > 0) {
          latestDeploymentRaw = data.deployments[0];
          matchedProjectName = candidate;
          break;
        }
      }
    }

    if (!latestDeploymentRaw) {
      const notFoundResponse: VercelDeploymentResponse = {
        isConfigured: true,
        hasDeployment: false,
        projectName: primaryName,
        detectedDomain: detectedDomain ? `https://${detectedDomain}.vercel.app` : undefined,
        statusMessage: `No active Vercel deployments found for project '${primaryName}'.`,
        source: "not_found",
        cachedAt: new Date().toISOString(),
      };

      vercelCache.set(cacheKey, { data: notFoundResponse, timestamp: now });
      return notFoundResponse;
    }

    // Sanitize and format verified deployment response
    const deploymentState: VercelDeploymentState =
      latestDeploymentRaw.state?.toUpperCase() || "READY";

    const deploymentUrl = latestDeploymentRaw.url
      ? latestDeploymentRaw.url.startsWith("http")
        ? latestDeploymentRaw.url
        : `https://${latestDeploymentRaw.url}`
      : detectedDomain
      ? `https://${detectedDomain}.vercel.app`
      : "";

    const meta = latestDeploymentRaw.meta || {};
    const commitSha = meta.githubCommitSha || meta.commitSha || null;

    const deploymentInfo: VercelDeploymentInfo = {
      id: latestDeploymentRaw.uid || latestDeploymentRaw.id || "dpl_unknown",
      name: latestDeploymentRaw.name || matchedProjectName,
      url: deploymentUrl,
      state: deploymentState,
      target: latestDeploymentRaw.target || "production",
      createdAt: latestDeploymentRaw.created || Date.now(),
      formattedDate: formatDeploymentDate(latestDeploymentRaw.created || Date.now()),
      creator: {
        username: latestDeploymentRaw.creator?.username,
      },
      commit: commitSha
        ? {
            sha: commitSha,
            shortSha: commitSha.slice(0, 7),
            message: meta.githubCommitMessage || meta.commitMessage,
            branch: meta.githubCommitRef || meta.branch || "main",
            author: meta.githubCommitAuthorName || meta.commitAuthorName,
          }
        : undefined,
      inspectorUrl: latestDeploymentRaw.inspectorUrl || undefined,
    };

    const successResponse: VercelDeploymentResponse = {
      isConfigured: true,
      hasDeployment: true,
      deployment: deploymentInfo,
      projectName: matchedProjectName,
      detectedDomain: deploymentUrl,
      source: "live",
      cachedAt: new Date().toISOString(),
    };

    vercelCache.set(cacheKey, { data: successResponse, timestamp: now });
    return successResponse;
  } catch (err: any) {
    console.error(`Error querying Vercel API for ${repoName}:`, err);
    return {
      isConfigured: true,
      hasDeployment: false,
      error: err?.message || "Failed to query Vercel REST API.",
      source: "error",
      cachedAt: new Date().toISOString(),
    };
  }
}
