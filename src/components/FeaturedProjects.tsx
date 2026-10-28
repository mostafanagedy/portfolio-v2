"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Folder,
  ExternalLink,
  ArrowRight,
  Layers,
  Search,
  RotateCw,
  AlertTriangle,
  X,
  ArrowUpDown,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { GitHubIcon } from "./Icons";
import { projects } from "../data/projects";
import { useGitHubRepos } from "../hooks/useGitHubRepos";
import { CuratedGitHubRepo, RepoSortOption } from "../types/github";
import RepoCard from "./RepoCard";
import RepoCardSkeleton from "./RepoCardSkeleton";
import "./FeaturedProjects.css";

type CategoryFilter = "All" | "Frontend" | "Full Stack" | "E-commerce" | "Web App";
type ViewMode = "repos" | "featured";

const FEATURED_CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "All", label: "All Featured" },
  { id: "Frontend", label: "Frontend" },
  { id: "Full Stack", label: "Full Stack" },
  { id: "E-commerce", label: "E-commerce" },
  { id: "Web App", label: "Web Apps" },
];

export default function FeaturedProjects() {
  const [viewMode, setViewMode] = useState<ViewMode>("repos");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  // GitHub Live State (with Curation Overrides & Auto Discovery)
  const {
    repos,
    featuredRepos,
    totalCount,
    isLoading,
    isRefreshing,
    error,
    isRateLimited,
    refresh,
    retry,
  } = useGitHubRepos();

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [sortBy, setSortBy] = useState<RepoSortOption>("updated");

  // Dynamic language list extracted from fetched repositories
  const availableLanguages = useMemo(() => {
    const langMap: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });

    const sortedLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    return [{ name: "All", count: repos.length }, ...sortedLangs];
  }, [repos]);

  // Filter & Sort GitHub Repositories
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // 1. Text Search Filter (name, displayName, description, language, tags, topics)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((repo) => {
        const nameMatch = repo.name.toLowerCase().includes(q);
        const displayMatch = repo.displayName?.toLowerCase().includes(q) ?? false;
        const descMatch =
          (repo.displayDescription || repo.description)?.toLowerCase().includes(q) ?? false;
        const langMatch = repo.language?.toLowerCase().includes(q) ?? false;
        const topicMatch = repo.topics?.some((t) => t.toLowerCase().includes(q)) ?? false;
        const tagMatch = repo.displayTags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        return nameMatch || displayMatch || descMatch || langMatch || topicMatch || tagMatch;
      });
    }

    // 2. Language Filter
    if (selectedLanguage !== "All") {
      result = result.filter((repo) => repo.language === selectedLanguage);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return (
            b.stargazers_count - a.stargazers_count ||
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "alphabetical":
          return (a.displayName || a.name).localeCompare(b.displayName || b.name, undefined, {
            sensitivity: "base",
          });
        case "forks":
          return (
            b.forks_count - a.forks_count ||
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "updated":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return result;
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  // Unified Featured Projects: uses dynamic featuredRepos from API/curation, or falls back to projects
  const displayFeaturedList = useMemo(() => {
    if (featuredRepos && featuredRepos.length > 0) {
      if (activeCategory === "All") return featuredRepos;
      return featuredRepos.filter((item) =>
        item.categories?.some((c) => c.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    // Fallback if API hasn't loaded yet
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.categories.includes(activeCategory as any));
  }, [featuredRepos, activeCategory]);

  const featuredTotalCount = featuredRepos.length > 0 ? featuredRepos.length : projects.length;

  const getFeaturedCategoryCount = (cat: CategoryFilter) => {
    if (featuredRepos && featuredRepos.length > 0) {
      if (cat === "All") return featuredRepos.length;
      return featuredRepos.filter((r) =>
        r.categories?.some((c) => c.toLowerCase() === cat.toLowerCase())
      ).length;
    }
    if (cat === "All") return projects.length;
    return projects.filter((p) => p.categories.includes(cat as any)).length;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("All");
  };

  return (
    <div className="fp-page-wrapper">
      <div className="container fp-container">
        <section id="projects" className="fp-section" aria-label="Projects and Repositories">
          {/* Section Header */}
          <div className="section__header fp-header">
            <div className="fp-header__left">
              <span className="fp-eyebrow">PORTFOLIO & CODE</span>
              <h1 className="section__title fp-title">
                <span className="icon-accent" aria-hidden="true">
                  <Folder size={24} />
                </span>
                Projects & <span className="text-accent">Repositories</span>
              </h1>
              <div className="fp-title-bar" aria-hidden="true" />
              <p className="section__subtitle fp-subtitle">
                Explore public repositories synchronized live with the GitHub API, along with curated production applications.
              </p>
            </div>

            {/* Top View Mode Switch: GitHub Repositories vs Featured Showcase */}
            <div className="fp-mode-switch" role="tablist" aria-label="Choose projects view mode">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "repos"}
                className={`fp-mode-btn ${viewMode === "repos" ? "fp-mode-btn--active" : ""}`}
                onClick={() => setViewMode("repos")}
              >
                <GitBranch size={15} aria-hidden="true" />
                <span>All Repositories</span>
                <span className="fp-mode-badge" title="Live repository count from GitHub">
                  {totalCount > 0 ? totalCount : 32}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "featured"}
                className={`fp-mode-btn ${viewMode === "featured" ? "fp-mode-btn--active" : ""}`}
                onClick={() => setViewMode("featured")}
              >
                <Sparkles size={14} aria-hidden="true" />
                <span>Featured Showcase</span>
                <span className="fp-mode-badge">{featuredTotalCount}</span>
              </button>
            </div>
          </div>

          {/* Rate Limit Warning Banner if applicable */}
          {isRateLimited && (
            <div className="fp-rate-banner" role="status">
              <AlertTriangle size={16} className="fp-rate-banner__icon" aria-hidden="true" />
              <span>GitHub API rate limit active. Showing latest cached repositories.</span>
            </div>
          )}

          {/* ========================================================
              VIEW 1: LIVE GITHUB REPOSITORIES
              ======================================================== */}
          {viewMode === "repos" && (
            <div className="fp-repos-view">
              {/* Controls Toolbar: Search, Sort, Refresh, Stats */}
              <div className="fp-toolbar">
                {/* Search Box */}
                <div className="fp-search-box">
                  <Search size={16} className="fp-search-icon" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by repo name, description, language, tags..."
                    className="fp-search-input"
                    aria-label="Search repositories"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="fp-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search query"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Right controls: Sort Dropdown & Refresh Button */}
                <div className="fp-toolbar__actions">
                  <div className="fp-sort-wrapper">
                    <ArrowUpDown size={14} className="fp-sort-icon" aria-hidden="true" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as RepoSortOption)}
                      className="fp-sort-select"
                      aria-label="Sort repositories"
                    >
                      <option value="updated">Recently Updated</option>
                      <option value="stars">Most Stars</option>
                      <option value="alphabetical">Alphabetical (A-Z)</option>
                      <option value="forks">Most Forks</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={refresh}
                    disabled={isRefreshing}
                    className={`fp-refresh-btn ${isRefreshing ? "fp-refresh-btn--loading" : ""}`}
                    aria-label="Refresh repository data from GitHub"
                    title="Refresh data from GitHub REST API"
                  >
                    <RotateCw
                      size={15}
                      className={`fp-refresh-icon ${isRefreshing ? "spin-animation" : ""}`}
                    />
                    <span className="fp-refresh-label">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Language Filters Row */}
              {availableLanguages.length > 1 && (
                <div
                  className="fp-lang-filters"
                  role="tablist"
                  aria-label="Filter repositories by language"
                >
                  {availableLanguages.map((lang) => {
                    const isActive = selectedLanguage === lang.name;
                    return (
                      <button
                        key={lang.name}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`fp-filter-btn ${isActive ? "fp-filter-btn--active" : ""}`}
                        onClick={() => setSelectedLanguage(lang.name)}
                      >
                        <span>{lang.name}</span>
                        <span className="fp-filter-count">{lang.count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Status & Results Counter */}
              <div className="fp-repos-meta">
                <span className="fp-repos-count">
                  Showing <strong>{filteredRepos.length}</strong> of{" "}
                  <strong>{totalCount > 0 ? totalCount : repos.length}</strong> public repositories
                </span>
                {isRefreshing && (
                  <span className="fp-refreshing-tag">
                    <span className="fp-pulse-dot" /> Updating from GitHub...
                  </span>
                )}
              </div>

              {/* Content Grid / Skeletons / Error / Empty States */}
              {isLoading && repos.length === 0 ? (
                /* Loading Skeletons */
                <div className="fp-grid" aria-busy="true" aria-label="Loading repositories">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <RepoCardSkeleton key={`skeleton-${idx}`} />
                  ))}
                </div>
              ) : error && repos.length === 0 ? (
                /* Error State with Retry Button */
                <div className="fp-error-state" role="alert">
                  <div className="fp-error-state__icon">
                    <AlertTriangle size={36} />
                  </div>
                  <h3 className="fp-error-state__title">Unable to Load GitHub Repositories</h3>
                  <p className="fp-error-state__desc">{error}</p>
                  <button
                    type="button"
                    className="btn btn--primary fp-error-state__retry"
                    onClick={retry}
                  >
                    <RotateCw size={16} />
                    <span>Retry Connection</span>
                  </button>
                </div>
              ) : filteredRepos.length > 0 ? (
                /* Repositories Cards Grid */
                <div
                  id="repos-grid"
                  className="fp-grid"
                  role="region"
                  aria-label="GitHub repositories list"
                >
                  {filteredRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              ) : (
                /* Empty Search / Filter State */
                <div className="fp-empty-state" role="status">
                  <div className="fp-empty-state__icon">
                    <Search size={36} />
                  </div>
                  <h3 className="fp-empty-state__title">No repositories found</h3>
                  <p className="fp-empty-state__desc">
                    No repositories match {searchQuery ? `"${searchQuery}"` : ""}
                    {searchQuery && selectedLanguage !== "All" ? " with language " : ""}
                    {selectedLanguage !== "All" ? `"${selectedLanguage}"` : ""}.
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary fp-empty-state__reset"
                    onClick={clearFilters}
                  >
                    <span>Clear Search & Filters</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 2: CURATED FEATURED PROJECTS SHOWCASE
              ======================================================== */}
          {viewMode === "featured" && (
            <div className="fp-featured-view">
              {/* Category Filter Pills */}
              <div className="fp-filters" role="tablist" aria-label="Filter projects by category">
                {FEATURED_CATEGORIES.map(({ id, label }) => {
                  const isActive = activeCategory === id;
                  const count = getFeaturedCategoryCount(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="featured-projects-grid"
                      className={`fp-filter-btn ${isActive ? "fp-filter-btn--active" : ""}`}
                      onClick={() => setActiveCategory(id)}
                    >
                      <span>{label}</span>
                      <span className="fp-filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Featured Cards Grid */}
              {displayFeaturedList.length > 0 ? (
                <div
                  id="featured-projects-grid"
                  className="fp-grid"
                  role="region"
                  aria-label="Featured projects list"
                >
                  {displayFeaturedList.map((item: any) => {
                    const title = item.displayName || item.title || item.name;
                    const desc = item.displayDescription || item.description;
                    const slug = item.slug;
                    const img = item.displayScreenshot || item.image || "/images/project-amazon.png";
                    const demoUrl = item.displayDemoUrl || item.url || item.homepage;
                    const githubUrl = item.html_url || item.github;
                    const tags = item.displayTags || item.tags || [];
                    const categoryBadge = item.categories?.[0] || "Featured";

                    return (
                      <article key={item.id} className="fp-card">
                        {/* Screenshot Preview with consistent 16:9 ratio */}
                        <div className="fp-card__thumb-box">
                          <Link href={`/projects/${slug}`}>
                            <img
                              src={img}
                              alt={`${title} preview screenshot`}
                              className="fp-card__thumb-img"
                              loading="lazy"
                              width="640"
                              height="360"
                            />
                            <div className="fp-card__thumb-overlay" />
                          </Link>

                          {/* Primary category badge */}
                          <span className="fp-card__badge">{categoryBadge}</span>
                        </div>

                        {/* Card Content */}
                        <div className="fp-card__content">
                          <div className="fp-card__title-row">
                            <h2 className="fp-card__title">
                              <Link
                                href={`/projects/${slug}`}
                                className="fp-card__link"
                                title={`View ${title} details, README and specs`}
                              >
                                <span>{title}</span>
                                <ArrowRight
                                  size={15}
                                  className="fp-card__ext-icon"
                                  aria-hidden="true"
                                />
                              </Link>
                            </h2>
                          </div>

                          <p className="fp-card__desc">{desc}</p>

                          {/* Technology Badges */}
                          {tags.length > 0 && (
                            <div className="fp-card__tags" aria-label="Technologies used">
                              {tags.slice(0, 5).map((tag: string) => (
                                <span key={tag} className="fp-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons: Details + Live Demo + GitHub Source */}
                          <div className="fp-card__actions">
                            <Link
                              href={`/projects/${slug}`}
                              className="fp-card__details-btn"
                              aria-label={`View details and README for ${title}`}
                              title="View README, architecture, and live specs"
                            >
                              <span>Details</span>
                              <ArrowRight size={13} aria-hidden="true" />
                            </Link>

                            {demoUrl && (
                              <a
                                href={demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fp-card__demo-btn"
                                aria-label={`Open Live Demo for ${title}`}
                              >
                                <span>Live Demo</span>
                                <ExternalLink size={13} aria-hidden="true" />
                              </a>
                            )}

                            {githubUrl && (
                              <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fp-card__repo-btn"
                                aria-label={`View Source Code for ${title} on GitHub`}
                                title="View on GitHub"
                              >
                                <GitHubIcon size={14} />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="fp-empty-state" role="status">
                  <div className="fp-empty-state__icon">
                    <Layers size={36} />
                  </div>
                  <h3 className="fp-empty-state__title">No projects found in this category</h3>
                  <p className="fp-empty-state__desc">
                    Currently no projects match "{activeCategory}". Feel free to explore other
                    categories or view all repositories.
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary fp-empty-state__reset"
                    onClick={() => setActiveCategory("All")}
                  >
                    <span>View All Featured</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
