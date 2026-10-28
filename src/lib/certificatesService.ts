import { CertificateItem, CertificatesResponse, CertificateCategory } from "../types/certificate";
import { certificatesConfig } from "../config/certificatesConfig";
import {
  getCachedCertificates,
  setCachedCertificates,
  invalidateCertificatesCache,
} from "./cacheManager";

const GITHUB_API_BASE = "https://api.github.com";

interface GitTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GitTreeResponse {
  sha: string;
  url: string;
  tree: GitTreeItem[];
  truncated: boolean;
}

export interface ResolvedRepoSource {
  owner: string;
  repo: string;
  defaultBranch: string;
  sourceUrl: string;
  intendedUrl: string;
  repoNote?: string;
}

let cachedResolvedSource: ResolvedRepoSource | null = null;

/**
 * Resolves repository owner & repository name according to Requirement 2:
 * Attempts the user's intended repository first (mostafanagy/my_Certificates),
 * verifies availability, and safely falls back to mostafanagedy/my_Certificates if unavailable.
 */
export async function resolveRepositorySource(): Promise<ResolvedRepoSource> {
  if (cachedResolvedSource) return cachedResolvedSource;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MostafaNagdy-Portfolio/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Parse intended repo URL
  const intendedMatch = certificatesConfig.intendedRepoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  const fallbackMatch = certificatesConfig.fallbackRepoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

  const intendedOwner = intendedMatch ? intendedMatch[1] : "mostafanagy";
  const intendedRepo = intendedMatch ? intendedMatch[2] : "my_Certificates";

  const fallbackOwner = fallbackMatch ? fallbackMatch[1] : "mostafanagedy";
  const fallbackRepo = fallbackMatch ? fallbackMatch[2] : "my_Certificates";

  // Check intended repository
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${intendedOwner}/${intendedRepo}`, {
      headers,
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      cachedResolvedSource = {
        owner: intendedOwner,
        repo: intendedRepo,
        defaultBranch: data.default_branch || "main",
        sourceUrl: `https://github.com/${intendedOwner}/${intendedRepo}`,
        intendedUrl: certificatesConfig.intendedRepoUrl,
      };
      return cachedResolvedSource;
    }
  } catch (error) {
    console.warn("[CertificatesService] Failed checking intended repo:", error);
  }

  // Intended returned 404 or failed — fall back to verified repository
  let defaultBranch = "main";
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${fallbackOwner}/${fallbackRepo}`, {
      headers,
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      defaultBranch = data.default_branch || "main";
    }
  } catch (err) {
    console.warn("[CertificatesService] Fallback repo metadata fetch warning:", err);
  }

  cachedResolvedSource = {
    owner: fallbackOwner,
    repo: fallbackRepo,
    defaultBranch,
    sourceUrl: `https://github.com/${fallbackOwner}/${fallbackRepo}`,
    intendedUrl: certificatesConfig.intendedRepoUrl,
    repoNote: `The specified target repository (${certificatesConfig.intendedRepoUrl}) is unavailable or private; automatically serving verified certificate data from ${fallbackOwner}/${fallbackRepo}.`,
  };

  return cachedResolvedSource;
}

/**
 * Extracts relevant technology and skill tags from certificate title and issuer
 */
function extractCertificateTags(title: string, issuer: string): string[] {
  const tags = new Set<string>();
  const lower = title.toLowerCase();

  if (issuer === "LinkedIn Learning") {
    tags.add("LinkedIn Learning");
  } else if (issuer === "Coursera") {
    tags.add("Coursera");
    tags.add("Verified Credential");
  }

  if (lower.includes("javascript") || lower.includes("esnext")) tags.add("JavaScript");
  if (lower.includes("html") || lower.includes("building the web")) tags.add("HTML5");
  if (lower.includes("css") || lower.includes("flexbox") || lower.includes("grid")) tags.add("CSS3");
  if (lower.includes("c++") || lower.includes("c essential") || lower.includes("programming with c")) tags.add("C / C++");
  if (lower.includes("python") || lower.includes("entra id")) tags.add("Python");
  if (lower.includes("agile")) tags.add("Agile");
  if (lower.includes("sdlc") || lower.includes("software development life cycle")) tags.add("SDLC");
  if (lower.includes("version control") || lower.includes("git")) tags.add("Git");
  if (lower.includes("responsive") || lower.includes("bootstrap")) tags.add("Responsive Web");
  if (lower.includes("communication") || lower.includes("critical thinking") || lower.includes("branding")) {
    tags.add("Professional Skills");
  }
  if (lower.includes("workshop") || lower.includes("end-to-end")) {
    tags.add("Software Engineering");
    tags.add("Full Stack");
  }

  return Array.from(tags);
}

/**
 * Generates a clean URL-friendly slug from certificate filename
 */
function generateCertificateSlug(filename: string, index: number): string {
  const cleanName = filename
    .replace(/\.pdf$/i, "")
    .replace(/\.png$/i, "")
    .replace(/\.jpe?g$/i, "")
    .replace(/^CertificateOfCompletion_/i, "")
    .trim();

  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `certificate-${index + 1}`;
}

/**
 * Parses raw git tree blob into a structured CertificateItem
 */
function parseCertificateItem(
  item: GitTreeItem,
  index: number,
  owner: string,
  repo: string,
  defaultBranch: string
): CertificateItem | null {
  const filename = item.path;
  const lower = filename.toLowerCase();

  // Filter out non-certificate files
  if (
    !lower.endsWith(".pdf") &&
    !lower.endsWith(".png") &&
    !lower.endsWith(".jpg") &&
    !lower.endsWith(".jpeg")
  ) {
    return null;
  }

  // Filter out README, ini, txt, zip files
  if (
    lower.startsWith("readme") ||
    lower.endsWith(".ini") ||
    lower.endsWith(".txt") ||
    lower.endsWith(".zip")
  ) {
    return null;
  }

  let issuer = "Certification";
  let category: CertificateCategory = "Other";
  let title = filename.replace(/\.(pdf|png|jpe?g)$/i, "");
  let credentialId: string | undefined;
  let verifyUrl: string | undefined;

  if (filename.startsWith("CertificateOfCompletion_")) {
    issuer = "LinkedIn Learning";
    category = "LinkedIn Learning";
    title = filename
      .replace(/^CertificateOfCompletion_/i, "")
      .replace(/\s*\(\d+\)\.pdf$/i, "")
      .replace(/\.pdf$/i, "")
      .trim();
  } else if (filename.startsWith("Coursera")) {
    issuer = "Coursera";
    category = "Coursera";
    const match = filename.match(/Coursera\s+([A-Z0-9]+)/i);
    if (match && match[1]) {
      credentialId = match[1];
      verifyUrl = `https://www.coursera.org/verify/${credentialId}`;
      title = `Coursera Verified Certificate (${credentialId})`;
    } else {
      title = filename.replace(/\.pdf$/i, "").trim();
    }
  } else if (filename.toLowerCase().includes("workshop")) {
    issuer = "Professional Workshop";
    category = "Workshops & Training";
    title = filename.replace(/\.pdf$/i, "").trim();
  }

  // Apply configuration overrides if defined for this file
  const override =
    certificatesConfig.overrides[filename] ||
    certificatesConfig.overrides[item.path] ||
    certificatesConfig.overrides[generateCertificateSlug(filename, index)];

  if (override?.displayTitle) title = override.displayTitle;
  if (override?.issuer) issuer = override.issuer;
  if (override?.category) category = override.category;
  if (override?.verificationUrl) verifyUrl = override.verificationUrl;

  const allowDownload = override?.allowDownload ?? certificatesConfig.defaultAllowDownload;
  const featured = Boolean(override?.featured);
  const issueDate = override?.issueDate;

  const format: "pdf" | "image" | "document" = lower.endsWith(".pdf")
    ? "pdf"
    : lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")
    ? "image"
    : "document";

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${encodeURIComponent(filename)}`;
  const githubUrl = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${encodeURIComponent(filename)}`;
  const documentUrl = `/api/certificates/document?file=${encodeURIComponent(filename)}`;
  const baseSlug = generateCertificateSlug(filename, index);

  return {
    id: item.sha,
    slug: baseSlug,
    filename,
    path: item.path,
    title,
    issuer,
    category,
    credentialId,
    verifyUrl,
    sizeBytes: item.size || 0,
    format,
    rawUrl,
    githubUrl,
    documentUrl,
    tags: extractCertificateTags(title, issuer),
    sha: item.sha,
    allowDownload,
    featured,
    issueDate,
  };
}

/**
 * Fetches all eligible certificate files from GitHub repository with caching
 */
export async function fetchCertificatesFromGitHub(forceRefresh = false): Promise<CertificatesResponse> {
  // Check in-memory cache first if not forced
  if (!forceRefresh) {
    const cached = getCachedCertificates();
    if (cached && !cached.isStale) {
      return cached.data;
    }
  } else {
    invalidateCertificatesCache("User triggered manual refresh");
  }

  const { owner, repo, defaultBranch, sourceUrl, intendedUrl, repoNote } =
    await resolveRepositorySource();

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MostafaNagdy-Portfolio/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const treeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
  const res = await fetch(treeUrl, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const cached = getCachedCertificates();
    if (cached) {
      console.warn(`[CertificatesService] GitHub API returned ${res.status}. Serving stale cache.`);
      return {
        ...cached.data,
        isStale: true,
      };
    }
    throw new Error(`GitHub API error ${res.status}: Failed to fetch certificates tree.`);
  }

  const treeData: GitTreeResponse = await res.json();
  const rawItems = treeData.tree || [];

  // Parse certificates
  const certificates: CertificateItem[] = [];
  const slugCounts = new Map<string, number>();

  rawItems.forEach((item, index) => {
    if (item.type !== "blob") return;
    const parsed = parseCertificateItem(item, index, owner, repo, defaultBranch);
    if (!parsed) return;

    // Ensure slugs remain completely unique
    let finalSlug = parsed.slug;
    const count = slugCounts.get(finalSlug) || 0;
    if (count > 0) {
      finalSlug = `${parsed.slug}-${count + 1}`;
    }
    slugCounts.set(parsed.slug, count + 1);

    parsed.slug = finalSlug;
    certificates.push(parsed);
  });

  // Sort certificates alphabetically by title
  certificates.sort((a, b) => a.title.localeCompare(b.title));

  // Determine Featured Certificates (up to 3 for balanced 3-column layout)
  let featuredCertificates = certificates.filter((c) => c.featured);
  if (featuredCertificates.length === 0) {
    // Graceful fallback to prominent diverse certificates
    const courseraCert = certificates.find((c) => c.category === "Coursera");
    const jsCert = certificates.find((c) => c.title.toLowerCase().includes("javascript"));
    const agileCert = certificates.find((c) => c.title.toLowerCase().includes("agile"));
    featuredCertificates = [courseraCert, jsCert, agileCert].filter(Boolean) as CertificateItem[];
  }
  featuredCertificates = featuredCertificates.slice(0, 3);

  const categories = ["All", "LinkedIn Learning", "Coursera", "Workshops & Training"];

  // Unique Issuers
  const issuerSet = new Set<string>(["All Issuers"]);
  certificates.forEach((c) => issuerSet.add(c.issuer));
  const issuers = Array.from(issuerSet);

  const response: CertificatesResponse = {
    certificates,
    featuredCertificates,
    total: certificates.length,
    categories,
    issuers,
    cachedAt: new Date().toISOString(),
    sourceRepo: sourceUrl,
    requestedRepo: intendedUrl,
    repoNote,
    isStale: false,
  };

  setCachedCertificates(response);
  return response;
}

/**
 * Finds a specific certificate by slug
 */
export async function getCertificateBySlug(slug: string): Promise<CertificateItem | null> {
  const { certificates } = await fetchCertificatesFromGitHub(false);
  const normalized = slug.toLowerCase().trim();
  return certificates.find((c) => c.slug.toLowerCase() === normalized) || null;
}
