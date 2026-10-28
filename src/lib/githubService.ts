import {
  GitHubRepo,
  CuratedGitHubRepo,
  ProjectDetails,
  ProjectReadme,
  ProjectScreenshot,
  AdjacentProjectInfo,
  ProjectNavigationData,
} from "../types/github";
import { projects, Project } from "../data/projects";
import { getProjectCuration, isRepoVisible, PROJECTS_CURATION } from "../config/projectsCuration";
import { getCachedRepos } from "./cacheManager";

const GITHUB_USERNAME = "mostafanagedy";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// In-memory cache for project details
const projectDetailsCache = new Map<string, { data: ProjectDetails; timestamp: number }>();

/**
 * Clears single project details cache (called by webhook or manual refresh)
 */
export function clearProjectDetailsCache(repoNameOrSlug?: string): void {
  if (repoNameOrSlug) {
    const key = repoNameOrSlug.toLowerCase().trim();
    projectDetailsCache.delete(key);
  } else {
    projectDetailsCache.clear();
  }
}

// Slug Aliases Map for friendly URLs
const SLUG_ALIASES: Record<string, string> = {
  "amazon-ecommerce": "AmazonEcommerce-main",
  "amazonecommerce-main": "AmazonEcommerce-main",
  "amazonecommerce": "AmazonEcommerce-main",
  "portfolio-website": "portfolio-v2",
  "portfolio-v2": "portfolio-v2",
  "portfolio": "portoflio",
  "portoflio": "portoflio",
  "e-commerce-store": "E-COMMERCE-f",
  "e-commerce-f": "E-COMMERCE-f",
};

/**
 * Converts a repository name to a clean, stable URL slug
 */
export function repoNameToSlug(name: string): string {
  // 1. Check curation rule first
  const curation = getProjectCuration(name);
  if (curation?.customSlug) {
    return curation.customSlug;
  }

  // 2. Check curated projects
  const curated = projects.find(
    (p) => p.repoName?.toLowerCase() === name.toLowerCase()
  );
  if (curated) {
    return curated.slug;
  }

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolves a URL slug to a target GitHub repository name
 */
export function resolveSlugToRepoName(slug: string): string {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Direct alias match
  if (SLUG_ALIASES[normalizedSlug]) {
    return SLUG_ALIASES[normalizedSlug];
  }

  // 2. Curated projects match
  const curated = projects.find(
    (p) => p.slug.toLowerCase() === normalizedSlug || p.repoName?.toLowerCase() === normalizedSlug
  );
  if (curated?.repoName) {
    return curated.repoName;
  }

  return slug;
}

/**
 * Gets authentication headers for GitHub API
 */
function getGitHubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MostafaNagdy-Portfolio/2.0",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetches a single repository from GitHub REST API
 */
export async function fetchRepoByName(repoName: string): Promise<GitHubRepo | null> {
  const headers = getGitHubHeaders();

  try {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return await findRepoCaseInsensitive(repoName);
      }
      return null;
    }

    const data = await response.json();
    return sanitizeRepo(data);
  } catch (err) {
    console.error(`Failed to fetch repo ${repoName}:`, err);
    return null;
  }
}

/**
 * Fallback to find repository case-insensitively from user's repos
 */
async function findRepoCaseInsensitive(repoNameOrSlug: string): Promise<GitHubRepo | null> {
  const headers = getGitHubHeaders();
  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) return null;
    const repos = (await response.json()) as GitHubRepo[];
    if (!Array.isArray(repos)) return null;

    const lowerTarget = repoNameOrSlug.toLowerCase();
    const match = repos.find(
      (r) =>
        r.name.toLowerCase() === lowerTarget ||
        repoNameToSlug(r.name) === lowerTarget
    );

    return match ? sanitizeRepo(match) : null;
  } catch {
    return null;
  }
}

function sanitizeRepo(repo: any): GitHubRepo {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description || null,
    html_url: repo.html_url,
    homepage: repo.homepage && repo.homepage.trim() !== "" ? repo.homepage.trim() : null,
    stargazers_count: repo.stargazers_count ?? 0,
    forks_count: repo.forks_count ?? 0,
    language: repo.language || null,
    updated_at: repo.updated_at,
    created_at: repo.created_at,
    pushed_at: repo.pushed_at,
    archived: repo.archived ?? false,
    fork: repo.fork ?? false,
    topics: repo.topics || [],
    open_issues_count: repo.open_issues_count ?? 0,
    default_branch: repo.default_branch || "main",
    size: repo.size ?? 0,
    watchers_count: repo.watchers_count ?? repo.stargazers_count ?? 0,
    visibility: repo.visibility || "public",
    owner: repo.owner
      ? {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
          html_url: repo.owner.html_url,
        }
      : {
          login: GITHUB_USERNAME,
          avatar_url: "https://github.com/mostafanagedy.png",
          html_url: `https://github.com/${GITHUB_USERNAME}`,
        },
  };
}

/**
 * Fetches repository README.md safely from GitHub API
 */
export async function fetchRepoReadme(
  repoName: string,
  defaultBranch: string = "main"
): Promise<ProjectReadme | null> {
  const headers = getGitHubHeaders();

  try {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`;
    const response = await fetch(url, {
      headers: {
        ...headers,
        Accept: "application/vnd.github.v3.raw",
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return null;
    }

    const content = await response.text();
    if (!content || content.trim() === "") {
      return null;
    }

    return {
      content,
      rawUrl: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${defaultBranch}/README.md`,
      htmlUrl: `https://github.com/${GITHUB_USERNAME}/${repoName}/blob/${defaultBranch}/README.md`,
    };
  } catch (err) {
    console.warn(`Could not retrieve README for ${repoName}:`, err);
    return null;
  }
}

/**
 * Inspects package.json, topics, language, and curation metadata to detect verified technologies
 */
export async function detectTechnologies(
  repo: GitHubRepo,
  curatedProject?: Project
): Promise<string[]> {
  const techSet = new Set<string>();

  // 1. Detected Primary Language from GitHub
  if (repo.language) {
    techSet.add(repo.language);
  }

  // 2. Curation Override Tags
  const curation = getProjectCuration(repo.name);
  if (curation?.customTags && curation.customTags.length > 0) {
    curation.customTags.forEach((tag) => techSet.add(tag));
  }

  // 3. Curated Project Metadata Tags (if available)
  if (curatedProject?.tags) {
    curatedProject.tags.forEach((tag) => techSet.add(tag));
  }

  // 4. GitHub Repository Topics
  if (repo.topics && repo.topics.length > 0) {
    repo.topics.forEach((t) => {
      const formatted = formatTopicName(t);
      if (formatted) techSet.add(formatted);
    });
  }

  // 5. Inspect package.json for JavaScript/TypeScript repositories
  const isWebRepo =
    repo.language === "JavaScript" ||
    repo.language === "TypeScript" ||
    repo.language === "HTML" ||
    repo.topics?.includes("react") ||
    repo.topics?.includes("nextjs");

  if (isWebRepo) {
    try {
      const branch = repo.default_branch || "main";
      const pkgUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/package.json`;
      const pkgRes = await fetch(pkgUrl, {
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      });

      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        const allDeps = {
          ...(pkgData.dependencies || {}),
          ...(pkgData.devDependencies || {}),
        };

        extractVerifiedDependencies(allDeps).forEach((d) => techSet.add(d));
      }
    } catch {
      // Continue
    }
  }

  return Array.from(techSet);
}

function extractVerifiedDependencies(deps: Record<string, string>): string[] {
  const result: string[] = [];
  const DEP_MAP: Record<string, string> = {
    react: "React",
    "react-dom": "React",
    next: "Next.js",
    vue: "Vue.js",
    "@angular/core": "Angular",
    tailwindcss: "Tailwind CSS",
    redux: "Redux",
    "@reduxjs/toolkit": "Redux Toolkit",
    express: "Express.js",
    mongodb: "MongoDB",
    mongoose: "Mongoose",
    stripe: "Stripe",
    "@stripe/stripe-js": "Stripe",
    firebase: "Firebase",
    "framer-motion": "Framer Motion",
    axios: "Axios",
    typescript: "TypeScript",
    sass: "Sass",
    bootstrap: "Bootstrap",
    vite: "Vite",
    prisma: "Prisma",
    graphql: "GraphQL",
  };

  for (const [depKey, displayName] of Object.entries(DEP_MAP)) {
    if (deps[depKey] && !result.includes(displayName)) {
      result.push(displayName);
    }
  }

  return result;
}

function formatTopicName(topic: string): string {
  const map: Record<string, string> = {
    react: "React",
    nextjs: "Next.js",
    typescript: "TypeScript",
    javascript: "JavaScript",
    nodejs: "Node.js",
    tailwindcss: "Tailwind CSS",
    mongodb: "MongoDB",
    express: "Express",
    ecommerce: "E-Commerce",
    portfolio: "Portfolio",
    frontend: "Frontend",
    fullstack: "Full Stack",
    redux: "Redux",
  };
  return map[topic.toLowerCase()] || topic.charAt(0).toUpperCase() + topic.slice(1);
}

/**
 * Resolves project screenshot following prompt priority:
 * 1. Project-specific screenshot configured in portfolio metadata / curation
 * 2. Suitable screenshot from the repository (e.g. screenshot.png)
 * 3. Appropriate project image already present in portfolio assets
 * Fallback: null (displays clean code terminal/dashboard preview)
 */
export async function resolveProjectScreenshot(
  repo: GitHubRepo,
  curatedProject?: Project
): Promise<ProjectScreenshot | null> {
  // 1a. Curation rule screenshot override
  const curation = getProjectCuration(repo.name);
  if (curation?.customScreenshot) {
    return {
      url: curation.customScreenshot,
      source: "curated",
      alt: `${curation.customTitle || repo.name} verified preview screenshot`,
    };
  }

  // 1b. Portfolio metadata screenshot
  if (curatedProject?.image) {
    return {
      url: curatedProject.image,
      source: "curated",
      alt: `${curatedProject.title} verified preview screenshot`,
    };
  }

  const matchedCurated = projects.find(
    (p) =>
      p.repoName?.toLowerCase() === repo.name.toLowerCase() ||
      repo.name.toLowerCase().includes(p.slug.toLowerCase())
  );
  if (matchedCurated?.image) {
    return {
      url: matchedCurated.image,
      source: "curated",
      alt: `${matchedCurated.title} screenshot`,
    };
  }

  // 2. Check repository screenshot file
  try {
    const branch = repo.default_branch || "main";
    const candidates = [
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/screenshot.png`,
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/preview.png`,
    ];

    for (const imgUrl of candidates) {
      const res = await fetch(imgUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok && res.headers.get("content-type")?.startsWith("image/")) {
        return {
          url: imgUrl,
          source: "repo",
          alt: `${repo.name} repository screenshot`,
        };
      }
    }
  } catch {
    // Continue
  }

  // 3. Fallback: null
  return null;
}

/**
 * Checks for optional mobile preview screenshot in repository
 */
export async function resolveProjectMobileScreenshot(
  repo: GitHubRepo
): Promise<ProjectScreenshot | null> {
  try {
    const branch = repo.default_branch || "main";
    const candidates = [
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/mobile-preview.png`,
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/mobile.png`,
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/screenshot-mobile.png`,
    ];

    for (const imgUrl of candidates) {
      const res = await fetch(imgUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok && res.headers.get("content-type")?.startsWith("image/")) {
        return {
          url: imgUrl,
          source: "repo",
          alt: `${repo.name} mobile preview screenshot`,
        };
      }
    }
  } catch {
    // Continue
  }
  return null;
}

/**
 * Main coordinator function to get full project details for dynamic route
 */
export async function getProjectDetails(slugOrName: string): Promise<ProjectDetails | null> {
  const cacheKey = slugOrName.toLowerCase().trim();
  const now = Date.now();

  const cached = projectDetailsCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const resolvedRepoName = resolveSlugToRepoName(slugOrName);

  // Visibility Check: If configured as visible: false, treat as not found
  if (!isRepoVisible(resolvedRepoName)) {
    return null;
  }

  const repo = await fetchRepoByName(resolvedRepoName);

  if (!repo || !isRepoVisible(repo.name)) {
    return null;
  }

  const curation = getProjectCuration(repo.name);

  // Find corresponding curated project if any
  const curatedProject = projects.find(
    (p) =>
      p.repoName?.toLowerCase() === repo.name.toLowerCase() ||
      p.slug.toLowerCase() === slugOrName.toLowerCase() ||
      repoNameToSlug(repo.name) === p.slug.toLowerCase()
  );

  const [readme, technologies, screenshot, mobileScreenshot] = await Promise.all([
    fetchRepoReadme(repo.name, repo.default_branch),
    detectTechnologies(repo, curatedProject),
    resolveProjectScreenshot(repo, curatedProject),
    resolveProjectMobileScreenshot(repo),
  ]);

  const slug = curation?.customSlug || repoNameToSlug(repo.name);
  const displayName = curation?.customTitle || curatedProject?.title || repo.name;
  const displayDescription =
    curation?.customDescription ||
    curatedProject?.description ||
    repo.description ||
    "No description provided for this repository.";

  const displayDemoUrl =
    curation?.customDemoUrl ||
    (repo.homepage && repo.homepage.trim() !== "" ? repo.homepage.trim() : null);

  const curatedRepo: CuratedGitHubRepo = {
    ...repo,
    homepage: displayDemoUrl,
    displayName,
    displayDescription,
    displayScreenshot: screenshot?.url || null,
    displayTags: technologies,
    displayDemoUrl,
    slug,
    featured: Boolean(curation?.featured),
    displayOrder: curation?.displayOrder ?? 999,
    categories: curation?.categories || ["Web App"],
    curation,
  };

  const details: ProjectDetails = {
    repo: curatedRepo,
    slug,
    readme,
    technologies,
    screenshot,
    mobileScreenshot,
    curatedProject,
  };

  // Cache result
  projectDetailsCache.set(cacheKey, { data: details, timestamp: now });
  projectDetailsCache.set(slug.toLowerCase(), { data: details, timestamp: now });

  return details;
}

/**
 * Retrieves adjacent projects (previous and next) and related projects
 * based on category, technology tags, and programming language.
 */
export async function getProjectNavigation(
  currentSlug: string,
  currentRepo: GitHubRepo
): Promise<ProjectNavigationData> {
  const normSlug = currentSlug.toLowerCase().trim();

  // 1. Gather all available repositories (from server cache or local fallback)
  let reposList: CuratedGitHubRepo[] = [];
  const cached = getCachedRepos();
  if (cached?.data?.repos?.length) {
    reposList = cached.data.repos;
  } else {
    // Fallback based on curated list & static projects
    reposList = projects.map((p) => {
      const curation = getProjectCuration(p.repoName || p.slug);
      return {
        id: p.id,
        name: p.repoName || p.slug,
        full_name: `${GITHUB_USERNAME}/${p.repoName || p.slug}`,
        description: p.description,
        html_url: p.github || `https://github.com/${GITHUB_USERNAME}/${p.repoName || p.slug}`,
        homepage: p.url,
        stargazers_count: 5,
        forks_count: 1,
        language: p.tags[0] || "TypeScript",
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        archived: false,
        fork: false,
        displayName: p.title,
        displayDescription: p.description,
        displayScreenshot: p.image,
        displayTags: p.tags,
        displayDemoUrl: p.url,
        slug: p.slug,
        featured: Boolean(p.featured),
        displayOrder: curation?.displayOrder ?? p.id,
        categories: p.categories,
        curation,
      };
    });
  }

  // Filter only visible repos
  const visibleRepos = reposList.filter((r) => isRepoVisible(r.name));

  // Find index of current repo
  const currentIndex = visibleRepos.findIndex(
    (r) =>
      r.slug.toLowerCase() === normSlug ||
      repoNameToSlug(r.name).toLowerCase() === normSlug ||
      r.name.toLowerCase() === normSlug
  );

  let prev: AdjacentProjectInfo | null = null;
  let next: AdjacentProjectInfo | null = null;

  if (visibleRepos.length > 1 && currentIndex !== -1) {
    const prevIdx = (currentIndex - 1 + visibleRepos.length) % visibleRepos.length;
    const nextIdx = (currentIndex + 1) % visibleRepos.length;

    const p = visibleRepos[prevIdx];
    const n = visibleRepos[nextIdx];

    prev = {
      slug: p.slug,
      title: p.displayName || p.name,
      language: p.language,
      description: p.displayDescription || p.description,
      stargazers_count: p.stargazers_count,
      screenshotUrl: p.displayScreenshot,
      demoUrl: p.displayDemoUrl || p.homepage,
    };

    next = {
      slug: n.slug,
      title: n.displayName || n.name,
      language: n.language,
      description: n.displayDescription || n.description,
      stargazers_count: n.stargazers_count,
      screenshotUrl: n.displayScreenshot,
      demoUrl: n.displayDemoUrl || n.homepage,
    };
  }

  // Related projects: matching language or category, excluding current project
  const currentLang = currentRepo.language?.toLowerCase();
  const currentTopics = (currentRepo.topics || []).map((t) => t.toLowerCase());

  const candidates = visibleRepos.filter(
    (r) =>
      r.slug.toLowerCase() !== normSlug &&
      r.name.toLowerCase() !== currentRepo.name.toLowerCase()
  );

  const scored = candidates.map((cand) => {
    let score = 0;
    if (cand.language && currentLang && cand.language.toLowerCase() === currentLang) {
      score += 3;
    }
    if (cand.topics?.length) {
      for (const t of cand.topics) {
        if (currentTopics.includes(t.toLowerCase())) {
          score += 2;
        }
      }
    }
    if (cand.featured) {
      score += 1;
    }
    return { cand, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const related: AdjacentProjectInfo[] = scored.slice(0, 3).map(({ cand }) => ({
    slug: cand.slug,
    title: cand.displayName || cand.name,
    language: cand.language,
    description: cand.displayDescription || cand.description,
    stargazers_count: cand.stargazers_count,
    screenshotUrl: cand.displayScreenshot,
    demoUrl: cand.displayDemoUrl || cand.homepage,
  }));

  return { prev, next, related };
}
