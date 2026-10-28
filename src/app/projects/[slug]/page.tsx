import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Clock,
  Eye,
  GitBranch,
  Shield,
  Layers,
  Terminal,
  FolderGit2,
  LayoutGrid,
} from "lucide-react";
import { GitHubIcon } from "../../../components/Icons";
import MarkdownViewer from "../../../components/MarkdownViewer";
import VercelDeploymentCard from "../../../components/VercelDeploymentCard";
import CloneCommand from "./CloneCommand";
import { getProjectDetails, getProjectNavigation } from "../../../lib/githubService";
import "./project-details.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  HTML: "#E34F26",
  CSS: "#563D7C",
  SCSS: "#C6538C",
  Python: "#3572A5",
  "C++": "#F34B7D",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Java: "#B07219",
  Shell: "#89E051",
  Vue: "#41B883",
};

function formatDate(isoString?: string): string {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString.split("T")[0] || isoString;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const details = await getProjectDetails(slug);

  if (!details) {
    return {
      title: "Project Not Found | Mostafa Nagdy",
      description: "The requested project or repository could not be found.",
    };
  }

  const title = details.curatedProject?.title || details.repo.name;
  const description =
    details.curatedProject?.description ||
    details.repo.description ||
    `Explore ${details.repo.name} repository by Mostafa Nagdy.`;

  return {
    title: `${title} | Projects | Mostafa Nagdy`,
    description,
    openGraph: {
      title: `${title} | Mostafa Nagdy`,
      description,
      type: "website",
    },
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const details = await getProjectDetails(slug);

  if (!details) {
    notFound();
  }

  const { repo, curatedProject, readme, technologies, screenshot } = details;
  const navData = await getProjectNavigation(slug, repo);

  const displayName = curatedProject?.title || repo.name;
  const description = curatedProject?.description || repo.description || "No description provided for this repository.";
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#FFA116" : "#6E7681";
  const liveDemoUrl = repo.homepage && repo.homepage.trim() !== "" ? repo.homepage.trim() : null;

  return (
    <div className="view-container pd-view">
      <div className="container pd-container">
        {/* Breadcrumb Navigation */}
        <nav className="pd-breadcrumbs" aria-label="Breadcrumb navigation">
          <Link href="/" className="pd-breadcrumb-link">
            Home
          </Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" aria-hidden="true" />
          <Link href="/projects" className="pd-breadcrumb-link">
            Projects
          </Link>
          <ChevronRight size={13} className="pd-breadcrumb-sep" aria-hidden="true" />
          <span className="pd-breadcrumb-current" aria-current="page">
            {displayName}
          </span>
        </nav>

        {/* Top Header Card */}
        <header className="pd-header-card">
          <div className="pd-header-top">
            <Link href="/projects" className="pd-back-btn" aria-label="Back to all projects">
              <ArrowLeft size={15} aria-hidden="true" />
              <span>Back to Projects</span>
            </Link>

            <div className="pd-header-badges">
              <span className="pd-badge pd-badge--visibility">
                <Shield size={12} aria-hidden="true" />
                <span>{repo.visibility || "Public"}</span>
              </span>
              {repo.fork && (
                <span className="pd-badge pd-badge--fork">
                  <GitFork size={12} aria-hidden="true" />
                  <span>Forked</span>
                </span>
              )}
            </div>
          </div>

          <div className="pd-header-main">
            <div className="pd-header-titles">
              <h1 className="pd-title">{displayName}</h1>
              {curatedProject?.title && curatedProject.title !== repo.name && (
                <div className="pd-repo-alias">
                  <FolderGit2 size={13} aria-hidden="true" />
                  <span>Repository: {repo.name}</span>
                </div>
              )}
              <p className="pd-desc">{description}</p>
            </div>

            {/* Action Buttons: Live Demo (Primary) + GitHub (Secondary Glass) */}
            <div className="pd-header-actions">
              {liveDemoUrl && (
                <a
                  href={liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary pd-action-btn pd-action-btn--demo"
                  aria-label={`Open Live Demo for ${displayName}`}
                >
                  <span>Live Demo</span>
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              )}

              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary pd-action-btn pd-action-btn--github"
                aria-label={`View ${repo.name} source code on GitHub`}
              >
                <GitHubIcon size={16} />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          {/* Owner info strip */}
          <div className="pd-owner-strip">
            <div className="pd-owner-info">
              <img
                src={repo.owner?.avatar_url || "https://github.com/mostafanagedy.png"}
                alt={`${repo.owner?.login || "mostafanagedy"} avatar`}
                className="pd-owner-avatar"
                width="24"
                height="24"
              />
              <span className="pd-owner-label">Owner:</span>
              <a
                href={repo.owner?.html_url || "https://github.com/mostafanagedy"}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-owner-name"
              >
                @{repo.owner?.login || "mostafanagedy"}
              </a>
            </div>

            <div className="pd-header-quick-stats">
              <span className="pd-quick-stat" title="GitHub Stars">
                <Star size={13} aria-hidden="true" />
                <span>{repo.stargazers_count} stars</span>
              </span>
              <span className="pd-stat-divider" aria-hidden="true">•</span>
              <span className="pd-quick-stat" title="Forks">
                <GitFork size={13} aria-hidden="true" />
                <span>{repo.forks_count} forks</span>
              </span>
              {repo.watchers_count !== undefined && repo.watchers_count > 0 && (
                <>
                  <span className="pd-stat-divider" aria-hidden="true">•</span>
                  <span className="pd-quick-stat" title="Watchers">
                    <Eye size={13} aria-hidden="true" />
                    <span>{repo.watchers_count} watchers</span>
                  </span>
                </>
              )}
              <span className="pd-stat-divider" aria-hidden="true">•</span>
              <span className="pd-quick-stat" title="Last Updated">
                <Clock size={13} aria-hidden="true" />
                <span>Updated {formatDate(repo.updated_at)}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Grid */}
        <div className="pd-dashboard-grid">
          {/* LEFT COLUMN: Preview Screenshot & README.md */}
          <div className="pd-main-col">
            {/* Project Preview Section */}
            <section className="pd-preview-card" aria-label="Project Preview">
              <div className="pd-preview-header">
                <div className="pd-preview-header-left">
                  <span className="pd-preview-badge">PROJECT PREVIEW</span>
                  {screenshot && (
                    <span className="pd-preview-source" title="Source of preview image">
                      {screenshot.source === "curated" ? "Verified Showcase" : "Repository Asset"}
                    </span>
                  )}
                </div>

                {liveDemoUrl && (
                  <a
                    href={liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-preview-live-link"
                    title={`Open live demo for ${displayName}`}
                  >
                    <span>Open Live Demo</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                )}
              </div>

              <div className="pd-preview-box">
                {screenshot ? (
                  <div className="pd-preview-img-wrapper">
                    <img
                      src={screenshot.url}
                      alt={screenshot.alt}
                      className="pd-preview-img"
                      loading="lazy"
                    />
                    <div className="pd-preview-overlay" />
                  </div>
                ) : (
                  /* Clean Fallback Terminal when no screenshot exists */
                  <div className="pd-preview-fallback">
                    <div className="pd-fallback-terminal">
                      <div className="pd-fallback-term-header">
                        <div className="pd-fallback-dots">
                          <span className="pd-dot pd-dot--red" />
                          <span className="pd-dot pd-dot--yellow" />
                          <span className="pd-dot pd-dot--green" />
                        </div>
                        <span className="pd-fallback-term-title">{repo.name} — bash</span>
                      </div>
                      <div className="pd-fallback-term-body">
                        <p className="pd-term-line">
                          <span className="text-accent">$</span> repository --info
                        </p>
                        <p className="pd-term-output">
                          Name: <strong>{repo.name}</strong>
                          <br />
                          Language: <span style={{ color: langColor }}>{repo.language || "Multi-language"}</span>
                          <br />
                          Branch: <code>{repo.default_branch || "main"}</code>
                          <br />
                          Stars: {repo.stargazers_count} | Forks: {repo.forks_count}
                          <br />
                          Status: Active on GitHub
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* README Documentation Section (with collapsible preview & code copy) */}
            <MarkdownViewer
              content={readme?.content || null}
              repoName={repo.name}
              defaultBranch={repo.default_branch}
              githubReadmeUrl={readme?.htmlUrl}
            />
          </div>

          {/* RIGHT COLUMN: Sidebar (Ordered according to Requirement 9) */}
          <aside className="pd-sidebar-col" aria-label="Project details and specifications">
            {/* 1. Repository Specifications Card */}
            <div className="pd-side-card">
              <h2 className="pd-side-title">
                <Layers size={16} className="text-accent" aria-hidden="true" />
                <span>Repository Specs</span>
              </h2>

              <dl className="pd-specs-list">
                {repo.language && (
                  <div className="pd-spec-row">
                    <dt className="pd-spec-label">Primary Language</dt>
                    <dd className="pd-spec-value">
                      <span
                        className="pd-lang-dot"
                        style={{ backgroundColor: langColor }}
                        aria-hidden="true"
                      />
                      <span>{repo.language}</span>
                    </dd>
                  </div>
                )}

                <div className="pd-spec-row">
                  <dt className="pd-spec-label">Stars</dt>
                  <dd className="pd-spec-value">
                    <Star size={13} className="text-accent" aria-hidden="true" />
                    <span>{repo.stargazers_count}</span>
                  </dd>
                </div>

                <div className="pd-spec-row">
                  <dt className="pd-spec-label">Forks</dt>
                  <dd className="pd-spec-value">
                    <GitFork size={13} className="text-accent" aria-hidden="true" />
                    <span>{repo.forks_count}</span>
                  </dd>
                </div>

                {repo.watchers_count !== undefined && (
                  <div className="pd-spec-row">
                    <dt className="pd-spec-label">Watchers</dt>
                    <dd className="pd-spec-value">
                      <Eye size={13} aria-hidden="true" />
                      <span>{repo.watchers_count}</span>
                    </dd>
                  </div>
                )}

                <div className="pd-spec-row">
                  <dt className="pd-spec-label">Default Branch</dt>
                  <dd className="pd-spec-value">
                    <GitBranch size={13} aria-hidden="true" />
                    <code>{repo.default_branch || "main"}</code>
                  </dd>
                </div>

                <div className="pd-spec-row">
                  <dt className="pd-spec-label">Created</dt>
                  <dd className="pd-spec-value">{formatDate(repo.created_at)}</dd>
                </div>

                <div className="pd-spec-row">
                  <dt className="pd-spec-label">Last Updated</dt>
                  <dd className="pd-spec-value">{formatDate(repo.updated_at)}</dd>
                </div>

                <div className="pd-spec-row">
                  <dt className="pd-spec-label">Visibility</dt>
                  <dd className="pd-spec-value">
                    <span className="pd-status-pill">{repo.visibility || "Public"}</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* 2. Verified Technologies & Topics Card */}
            {technologies.length > 0 && (
              <div className="pd-side-card">
                <h2 className="pd-side-title">
                  <Terminal size={16} className="text-accent" aria-hidden="true" />
                  <span>Technologies & Topics</span>
                </h2>
                <div className="pd-tech-tags" aria-label="Detected technologies and topics">
                  {technologies.map((tech) => (
                    <span key={tech} className="pd-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Vercel Deployment Card (Requirement 9: Position 3 in Sidebar) */}
            <VercelDeploymentCard
              repoName={repo.name}
              slug={slug}
              homepageUrl={repo.homepage}
            />

            {/* 4. Git Clone Command Box */}
            <div className="pd-side-card">
              <CloneCommand repoUrl={repo.html_url} />
            </div>

            {/* 5. Contact / Collaboration CTA Card */}
            <div className="pd-side-card pd-side-card--action">
              <p className="pd-side-note">
                Interested in this project or want to collaborate on similar web development work?
              </p>
              <div className="pd-side-buttons">
                <Link href="/contact" className="btn btn--primary pd-side-cta">
                  <span>Get in Touch</span>
                </Link>
                <Link href="/projects" className="btn btn--secondary pd-side-cta">
                  <span>Browse All Projects</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* BOTTOM SECTION: Project Navigation (Requirement 10) */}
        <section className="pd-bottom-nav" aria-label="Project Navigation">
          <div className="pd-nav-bar">
            {navData.prev ? (
              <Link
                href={`/projects/${navData.prev.slug}`}
                className="pd-nav-item pd-nav-item--prev"
                aria-label={`Previous project: ${navData.prev.title}`}
              >
                <div className="pd-nav-arrow-box">
                  <ArrowLeft size={16} aria-hidden="true" />
                </div>
                <div className="pd-nav-content">
                  <span className="pd-nav-direction">Previous Project</span>
                  <span className="pd-nav-project-title">{navData.prev.title}</span>
                </div>
              </Link>
            ) : (
              <div className="pd-nav-item pd-nav-item--disabled" />
            )}

            <Link
              href="/projects"
              className="pd-nav-center-btn"
              aria-label="Back to all projects directory"
              title="View all repositories"
            >
              <LayoutGrid size={15} aria-hidden="true" />
              <span>All Projects</span>
            </Link>

            {navData.next ? (
              <Link
                href={`/projects/${navData.next.slug}`}
                className="pd-nav-item pd-nav-item--next"
                aria-label={`Next project: ${navData.next.title}`}
              >
                <div className="pd-nav-content pd-nav-content--right">
                  <span className="pd-nav-direction">Next Project</span>
                  <span className="pd-nav-project-title">{navData.next.title}</span>
                </div>
                <div className="pd-nav-arrow-box">
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
              </Link>
            ) : (
              <div className="pd-nav-item pd-nav-item--disabled" />
            )}
          </div>

          {/* Related Projects Section */}
          {navData.related.length > 0 && (
            <div className="pd-related-section">
              <div className="pd-related-header">
                <h3 className="pd-related-title">Related Projects & Repositories</h3>
                <p className="pd-related-subtitle">
                  More work built with similar frameworks, languages, or architectures.
                </p>
              </div>

              <div className="pd-related-grid">
                {navData.related.map((rel) => {
                  const relLangColor = rel.language
                    ? LANGUAGE_COLORS[rel.language] || "#FFA116"
                    : "#6E7681";

                  return (
                    <Link
                      key={rel.slug}
                      href={`/projects/${rel.slug}`}
                      className="pd-related-card"
                    >
                      <div className="pd-related-card-top">
                        {rel.language && (
                          <span className="pd-related-lang">
                            <span
                              className="pd-lang-dot"
                              style={{ backgroundColor: relLangColor }}
                              aria-hidden="true"
                            />
                            <span>{rel.language}</span>
                          </span>
                        )}
                        {rel.stargazers_count !== undefined && rel.stargazers_count > 0 && (
                          <span className="pd-related-stars">
                            <Star size={11} className="text-accent" aria-hidden="true" />
                            <span>{rel.stargazers_count}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="pd-related-card-title">{rel.title}</h4>

                      {rel.description && (
                        <p className="pd-related-card-desc">{rel.description}</p>
                      )}

                      <div className="pd-related-card-footer">
                        <span className="pd-related-link-text">
                          <span>View Details</span>
                          <ArrowRight size={12} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
