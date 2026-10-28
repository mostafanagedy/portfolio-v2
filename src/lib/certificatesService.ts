import { CertificateItem, CertificatesResponse, CertificateCategory } from "../types/certificate";
import {
  getCachedCertificates,
  setCachedCertificates,
  invalidateCertificatesCache,
} from "./cacheManager";

const GITHUB_USERNAME = "mostafanagedy";
const REPO_NAME = "my_Certificates";
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
function parseCertificateItem(item: GitTreeItem, index: number, defaultBranch: string): CertificateItem | null {
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

  const format: "pdf" | "image" | "document" = lower.endsWith(".pdf")
    ? "pdf"
    : lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")
    ? "image"
    : "document";

  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${defaultBranch}/${encodeURIComponent(filename)}`;
  const githubUrl = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/blob/${defaultBranch}/${encodeURIComponent(filename)}`;
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
    tags: extractCertificateTags(title, issuer),
    sha: item.sha,
  };
}

/**
 * Retrieves repository default branch dynamically
 */
async function getRepoDefaultBranch(): Promise<string> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "MostafaNagdy-Portfolio/1.0",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${REPO_NAME}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return data.default_branch || "main";
    }
  } catch (error) {
    console.warn("[CertificatesService] Failed to retrieve default branch, falling back to 'main':", error);
  }
  return "main";
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

  const defaultBranch = await getRepoDefaultBranch();

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MostafaNagdy-Portfolio/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const treeUrl = `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${REPO_NAME}/git/trees/${defaultBranch}?recursive=1`;
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
    const parsed = parseCertificateItem(item, index, defaultBranch);
    if (!parsed) return;

    // Ensure slugs remain completely unique even if filenames have similar bases
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

  const categories = ["All", "LinkedIn Learning", "Coursera", "Workshops & Training"];

  const response: CertificatesResponse = {
    certificates,
    total: certificates.length,
    categories,
    cachedAt: new Date().toISOString(),
    sourceRepo: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`,
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
