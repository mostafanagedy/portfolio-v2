import { Project } from "../data/projects";
import { ProjectCurationRule } from "../config/projectsCuration";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at?: string;
  archived: boolean;
  fork: boolean;
  topics?: string[];
  open_issues_count?: number;
  default_branch?: string;
  size?: number;
  watchers_count?: number;
  visibility?: string;
  owner?: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface CuratedGitHubRepo extends GitHubRepo {
  displayName: string;
  displayDescription: string;
  displayScreenshot: string | null;
  displayTags: string[];
  displayDemoUrl: string | null;
  slug: string;
  featured: boolean;
  displayOrder: number;
  categories: string[];
  curation?: ProjectCurationRule | null;
}

export type RepoSortOption = "updated" | "stars" | "alphabetical" | "forks";

export interface GitHubReposResponse {
  repos: CuratedGitHubRepo[];
  featuredRepos: CuratedGitHubRepo[];
  totalCount: number;
  cachedAt?: string;
  cacheExpiresAt?: string;
  cacheTtlSeconds?: number;
  rateLimitRemaining?: number;
  isRateLimited?: boolean;
  error?: string;
}

export interface ProjectScreenshot {
  url: string;
  source: "curated" | "repo" | "fallback";
  alt: string;
}

export interface ProjectReadme {
  content: string | null;
  rawUrl: string | null;
  htmlUrl: string;
}

export interface ProjectDetails {
  repo: CuratedGitHubRepo | GitHubRepo;
  slug: string;
  readme: ProjectReadme | null;
  technologies: string[];
  screenshot: ProjectScreenshot | null;
  mobileScreenshot?: ProjectScreenshot | null;
  curatedProject?: Project;
}

export interface AdjacentProjectInfo {
  slug: string;
  title: string;
  language?: string | null;
  description?: string | null;
  stargazers_count?: number;
  screenshotUrl?: string | null;
  demoUrl?: string | null;
}

export interface ProjectNavigationData {
  prev: AdjacentProjectInfo | null;
  next: AdjacentProjectInfo | null;
  related: AdjacentProjectInfo[];
}
