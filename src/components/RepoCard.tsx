"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Star, GitFork, Calendar, GitBranch, ArrowRight, Sparkles } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { CuratedGitHubRepo, GitHubRepo } from "../types/github";
import { repoNameToSlug } from "../lib/githubService";

interface RepoCardProps {
  repo: CuratedGitHubRepo | GitHubRepo;
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

function formatRepoDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate.split("T")[0] || isoDate;
  }
}

export default function RepoCard({ repo }: RepoCardProps) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#FFA116" : "#6E7681";
  const formattedDate = formatRepoDate(repo.updated_at);
  const curated = repo as Partial<CuratedGitHubRepo>;
  const slug = curated.slug || repoNameToSlug(repo.name);
  const displayName = curated.displayName || repo.name;
  const description = curated.displayDescription || repo.description;
  const isFeatured = Boolean(curated.featured);
  const demoUrl = curated.displayDemoUrl || repo.homepage;

  return (
    <article className="fp-card fp-repo-card" data-repo-id={repo.id}>
      <div className="fp-repo-card__body">
        {/* Top Header: Repo Title + Language & Featured Badges */}
        <div className="fp-repo-card__header">
          <div className="fp-repo-card__title-box">
            <span className="fp-repo-card__type-icon" aria-hidden="true">
              {repo.fork ? <GitFork size={15} /> : <GitBranch size={15} />}
            </span>
            <h3 className="fp-repo-card__title">
              <Link
                href={`/projects/${slug}`}
                className="fp-repo-card__title-link"
                title={`View ${displayName} details, README and specs`}
              >
                <span>{displayName}</span>
              </Link>
            </h3>
          </div>

          <div className="fp-repo-card__badges">
            {isFeatured && (
              <span className="fp-repo-card__featured-badge" title="Curated Featured Project">
                <Sparkles size={11} aria-hidden="true" />
                <span>Featured</span>
              </span>
            )}

            {repo.language && (
              <span className="fp-repo-card__lang-badge" title={`Primary language: ${repo.language}`}>
                <span
                  className="fp-repo-card__lang-dot"
                  style={{ backgroundColor: langColor }}
                  aria-hidden="true"
                />
                <span className="fp-repo-card__lang-text">{repo.language}</span>
              </span>
            )}
          </div>
        </div>

        {/* Description: True GitHub description or clean fallback without fabricating */}
        <p className="fp-repo-card__desc">
          {description ? (
            description
          ) : (
            <span className="fp-repo-card__desc--muted">No description provided for this repository.</span>
          )}
        </p>

        {/* Topics / Tags if present */}
        {((curated.displayTags && curated.displayTags.length > 0) || (repo.topics && repo.topics.length > 0)) && (
          <div className="fp-repo-card__topics" aria-label="Repository topics">
            {(curated.displayTags || repo.topics || []).slice(0, 4).map((topic) => (
              <span key={topic} className="fp-repo-card__topic-tag">
                #{topic}
              </span>
            ))}
          </div>
        )}

        {/* Metadata stats row: Stars, Forks, Last Updated */}
        <div className="fp-repo-card__stats">
          <span className="fp-repo-card__stat-item" title={`${repo.stargazers_count} stargazers`}>
            <Star size={13} className="fp-repo-card__stat-icon" aria-hidden="true" />
            <span>{repo.stargazers_count}</span>
          </span>

          <span className="fp-repo-card__stat-item" title={`${repo.forks_count} forks`}>
            <GitFork size={13} className="fp-repo-card__stat-icon" aria-hidden="true" />
            <span>{repo.forks_count}</span>
          </span>

          <span className="fp-repo-card__stat-item fp-repo-card__stat-date" title={`Last updated: ${formattedDate}`}>
            <Calendar size={13} className="fp-repo-card__stat-icon" aria-hidden="true" />
            <span>Updated {formattedDate}</span>
          </span>
        </div>
      </div>

      {/* Action Footer: Details + Live Demo (if homepage exists) + GitHub Source Code */}
      <div className="fp-card__actions fp-repo-card__actions">
        <Link
          href={`/projects/${slug}`}
          className="fp-card__details-btn"
          aria-label={`View details and README for ${displayName}`}
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
            aria-label={`Open Live Demo for ${displayName}`}
          >
            <span>Live Demo</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="fp-card__repo-btn"
          aria-label={`View ${repo.name} on GitHub`}
          title="Open repository on GitHub"
        >
          <GitHubIcon size={14} />
          <span>Code</span>
        </a>
      </div>
    </article>
  );
}
