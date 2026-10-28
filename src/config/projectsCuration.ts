/**
 * Portfolio Project Curation Configuration
 *
 * This configuration allows you to customize the presentation of your GitHub repositories
 * without hardcoding repositories into frontend components or running a database.
 *
 * VISIBILITY POLICY:
 * - By default, ANY newly discovered public repository on github.com/mostafanagedy is VISIBLE.
 * - To hide a repository, set `visible: false`.
 * - To feature a repository on the "Featured Showcase" tab, set `featured: true` and specify a `displayOrder`.
 *
 * PRESENTATION OVERRIDES:
 * - `customTitle`: User-friendly title displayed instead of the raw repo name.
 * - `customDescription`: Polished description if the GitHub description is empty or informal.
 * - `customScreenshot`: Path to a high-resolution screenshot (e.g. in /images/...) or remote URL.
 * - `customTags`: Specific technology badges to highlight.
 * - `customDemoUrl`: Custom live demo / deployment link override.
 * - `categories`: Categories for filtering in the Featured Showcase (e.g. "Frontend", "Full Stack", "E-commerce").
 */

export interface ProjectCurationRule {
  /** Whether this project is featured in the showcase tab */
  featured?: boolean;
  /** Whether this repository is visible in public lists. Defaults to true. */
  visible?: boolean;
  /** Sort order for featured projects (lower numbers appear first) */
  displayOrder?: number;
  /** Custom display title override */
  customTitle?: string;
  /** Custom description override */
  customDescription?: string;
  /** Custom screenshot image path (e.g. /images/project-amazon.png) */
  customScreenshot?: string;
  /** Custom technology tags to display */
  customTags?: string[];
  /** Custom live demo / deployment URL */
  customDemoUrl?: string;
  /** Friendly URL slug override (e.g. "amazon-ecommerce") */
  customSlug?: string;
  /** Explicit Vercel Project Name or ID for deployment status mapping */
  vercelProject?: string;
  /** Portfolio showcase categories */
  categories?: ("Frontend" | "Full Stack" | "E-commerce" | "Web App")[];
}

export const PROJECTS_CURATION: Record<string, ProjectCurationRule> = {
  // Amazon E-commerce Platform
  "AmazonEcommerce-main": {
    featured: true,
    visible: true,
    displayOrder: 1,
    customTitle: "Amazon E-commerce",
    customSlug: "amazon-ecommerce",
    customDescription:
      "Full-featured e-commerce platform with dynamic product catalog, interactive cart management, and responsive checkout interface.",
    customScreenshot: "/images/project-amazon.png",
    customTags: ["React", "Node.js", "MongoDB", "Express", "REST API", "Tailwind CSS"],
    customDemoUrl: "https://amazon-ecommerce-main.vercel.app",
    vercelProject: "amazon-ecommerce-main",
    categories: ["Full Stack", "E-commerce"],
  },

  // Developer Portfolio Website
  "portfolio-v2": {
    featured: true,
    visible: true,
    displayOrder: 2,
    customTitle: "Portfolio Website",
    customSlug: "portfolio-website",
    customDescription:
      "Personal portfolio & interactive showcase featuring glassmorphic UI, smooth micro-interactions, theme switching, and responsive design.",
    customScreenshot: "/images/project-portfolio.png",
    customTags: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    customDemoUrl: "https://mostafanagedy.vercel.app",
    vercelProject: "portfolio-v2",
    categories: ["Frontend"],
  },

  // E-commerce Storefront
  "E-COMMERCE-f": {
    featured: true,
    visible: true,
    displayOrder: 3,
    customTitle: "E-commerce Store",
    customSlug: "e-commerce-store",
    customDescription:
      "Modern online storefront featuring item filtering, state-managed shopping bag, and streamlined checkout experience.",
    customScreenshot: "/images/project-store.png",
    customTags: ["React", "Redux", "Stripe", "REST API", "Tailwind CSS"],
    customDemoUrl: "https://e-commerce-f-red.vercel.app",
    vercelProject: "e-commerce-f",
    categories: ["Frontend", "E-commerce"],
  },

  // Bunyan Real Estate Platform
  bunyan: {
    featured: true,
    visible: true,
    displayOrder: 4,
    customTitle: "Bunyan Platform",
    customSlug: "bunyan",
    customDescription:
      "Real estate and architectural showcase platform with interactive project galleries and modern design.",
    customTags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    customDemoUrl: "https://bunyan-eight.vercel.app",
    vercelProject: "bunyan",
    categories: ["Frontend", "Web App"],
  },

  // Careers App (Figma Design to Code)
  "Careers-App-Figma": {
    featured: false,
    visible: true,
    displayOrder: 5,
    customTitle: "Careers App",
    customSlug: "careers-app-figma",
    customDescription:
      "Pixel-perfect implementation of job careers board from Figma design with job search and application workflows.",
    customTags: ["React", "JavaScript", "CSS3", "Responsive Design"],
    customDemoUrl: "https://careers-app-figma.vercel.app",
    vercelProject: "careers-app-figma",
    categories: ["Frontend"],
  },

  // Example of a hidden repository rule:
  // "some-private-or-draft-repo": {
  //   visible: false,
  // },
};

/**
 * Retrieves the curation rule for a repository name (case-insensitive)
 */
export function getProjectCuration(repoName: string): ProjectCurationRule | null {
  if (!repoName) return null;

  // Direct match
  if (PROJECTS_CURATION[repoName]) {
    return PROJECTS_CURATION[repoName];
  }

  // Case-insensitive match
  const lowerName = repoName.toLowerCase();
  for (const [key, rule] of Object.entries(PROJECTS_CURATION)) {
    if (key.toLowerCase() === lowerName) {
      return rule;
    }
  }

  return null;
}

/**
 * Determines if a repository is visible according to the curation policy.
 * Default policy: Any repo is visible unless explicitly set to `visible: false`.
 */
export function isRepoVisible(repoName: string): boolean {
  const curation = getProjectCuration(repoName);
  if (!curation) return true; // Default: visible
  return curation.visible !== false;
}
