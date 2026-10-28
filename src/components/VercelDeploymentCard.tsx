"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  RotateCw,
  GitCommit,
  GitBranch,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useVercelDeployment } from "../hooks/useVercelDeployment";
import "./VercelDeploymentCard.css";

interface VercelDeploymentCardProps {
  repoName: string;
  slug?: string;
  homepageUrl?: string | null;
}

// Vercel Triangle Icon Component
function VercelIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 75 65"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M37.5 0L75 65H0L37.5 0Z" />
    </svg>
  );
}

export default function VercelDeploymentCard({
  repoName,
  slug,
  homepageUrl,
}: VercelDeploymentCardProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const {
    data,
    deployment,
    isConfigured,
    hasDeployment,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useVercelDeployment({ repoName, slug, homepageUrl });

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <section className="vd-card vd-card--loading" aria-busy="true" aria-label="Loading Vercel Deployment status">
        <div className="vd-header">
          <div className="vd-header__left">
            <span className="vd-vercel-logo">
              <VercelIcon size={14} />
            </span>
            <div className="vd-skeleton-pill vd-skeleton-pill--title" />
          </div>
          <div className="vd-skeleton-pill vd-skeleton-pill--btn" />
        </div>
        <div className="vd-body">
          <div className="vd-skeleton-line vd-skeleton-line--w70" />
          <div className="vd-skeleton-line vd-skeleton-line--w40" />
        </div>
      </section>
    );
  }

  // 2. Unconfigured State (Optional feature not yet connected with VERCEL_TOKEN)
  if (!isConfigured) {
    const liveSiteUrl = data?.detectedDomain || homepageUrl;
    const isVercelDomain = liveSiteUrl && liveSiteUrl.includes("vercel.app");

    return (
      <section className="vd-card vd-card--unconfigured" aria-label="Vercel Deployment Integration">
        <div className="vd-header">
          <div className="vd-header__left">
            <span className="vd-vercel-logo">
              <VercelIcon size={14} />
            </span>
            <h3 className="vd-title">Vercel Deployment</h3>
            <span className="vd-badge vd-badge--optional" title="Optional server-side feature">
              <Sparkles size={11} aria-hidden="true" />
              <span>Optional</span>
            </span>
          </div>

          <button
            type="button"
            className="vd-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand Vercel deployment card" : "Collapse Vercel deployment card"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="vd-unconfigured-body">
            <p className="vd-unconfigured-desc">
              Integration ready. Configure <code>VERCEL_TOKEN</code> in your environment variables to stream real-time build states, commit hashes, and logs.
            </p>

            {isVercelDomain && liveSiteUrl && (
              <div className="vd-detected-box">
                <div className="vd-detected-info">
                  <span className="vd-detected-label">Detected Domain:</span>
                  <a
                    href={liveSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vd-detected-url"
                    title={`Open ${liveSiteUrl}`}
                  >
                    <span>{liveSiteUrl.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
                <a
                  href={liveSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary vd-btn-visit"
                >
                  <span>Visit Live App</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  // 3. Error State (Network or Authorization failure)
  if (error || data?.source === "error") {
    return (
      <section className="vd-card vd-card--error" role="alert" aria-label="Vercel Deployment Error">
        <div className="vd-header">
          <div className="vd-header__left">
            <span className="vd-vercel-logo">
              <VercelIcon size={14} />
            </span>
            <h3 className="vd-title">Vercel Deployment</h3>
          </div>
          <div className="vd-header__actions">
            <button
              type="button"
              className="vd-refresh-btn"
              onClick={refresh}
              disabled={isRefreshing}
              aria-label="Retry retrieving Vercel deployment status"
            >
              <RotateCw size={12} className={isRefreshing ? "spin-animation" : ""} />
              <span>Retry</span>
            </button>
            <button
              type="button"
              className="vd-collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand card" : "Collapse card"}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <div className="vd-error-body">
            <AlertCircle size={18} className="vd-error-icon" aria-hidden="true" />
            <p className="vd-error-text">{error || data?.error || "Unable to retrieve deployment status."}</p>
          </div>
        )}
      </section>
    );
  }

  // 4. No Deployment Found State
  if (!hasDeployment || !deployment) {
    return (
      <section className="vd-card vd-card--empty" aria-label="Vercel Deployment Status">
        <div className="vd-header">
          <div className="vd-header__left">
            <span className="vd-vercel-logo">
              <VercelIcon size={14} />
            </span>
            <h3 className="vd-title">Vercel Deployment</h3>
          </div>
          <div className="vd-header__actions">
            <button
              type="button"
              className="vd-refresh-btn"
              onClick={refresh}
              disabled={isRefreshing}
              aria-label="Refresh Vercel deployment status"
            >
              <RotateCw size={12} className={isRefreshing ? "spin-animation" : ""} />
              <span>Check</span>
            </button>
            <button
              type="button"
              className="vd-collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand card" : "Collapse card"}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <div className="vd-empty-body">
            <HelpCircle size={18} className="vd-empty-icon" aria-hidden="true" />
            <p className="vd-empty-text">
              {data?.statusMessage || `No Vercel deployments currently associated with '${repoName}'.`}
            </p>
          </div>
        )}
      </section>
    );
  }

  // 5. Active Deployment State (Real verified data)
  const isReady = deployment.state === "READY";
  const isBuilding = deployment.state === "BUILDING" || deployment.state === "INITIALIZING" || deployment.state === "QUEUED";
  const isFailed = deployment.state === "ERROR";
  const isCanceled = deployment.state === "CANCELED";

  const statusClass = isReady
    ? "vd-status--ready"
    : isBuilding
    ? "vd-status--building"
    : isFailed
    ? "vd-status--error"
    : isCanceled
    ? "vd-status--canceled"
    : "vd-status--unknown";

  return (
    <section className="vd-card" aria-label="Live Vercel Deployment Dashboard">
      {/* Card Header */}
      <div className="vd-header">
        <div className="vd-header__left">
          <span className="vd-vercel-logo">
            <VercelIcon size={14} />
          </span>
          <h3 className="vd-title">Vercel Deployment</h3>
          <span className={`vd-status-badge ${statusClass}`}>
            {isReady && <CheckCircle2 size={11} aria-hidden="true" />}
            {isBuilding && <Clock size={11} className="spin-animation" aria-hidden="true" />}
            {isFailed && <XCircle size={11} aria-hidden="true" />}
            {isCanceled && <AlertCircle size={11} aria-hidden="true" />}
            <span>{deployment.state}</span>
          </span>
        </div>

        <div className="vd-header__actions">
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className={`vd-refresh-btn ${isRefreshing ? "vd-refresh-btn--loading" : ""}`}
            title="Refresh deployment state from Vercel REST API"
            aria-label="Refresh Vercel deployment status"
          >
            <RotateCw size={12} className={isRefreshing ? "spin-animation" : ""} />
            <span>{isRefreshing ? "Checking..." : "Refresh"}</span>
          </button>
          <button
            type="button"
            className="vd-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand card" : "Collapse card"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Deployment Main Body */}
      {!isCollapsed && (
        <div className="vd-body">
          {/* URL & Action Row */}
          <div className="vd-url-row">
            <div className="vd-url-box">
              <span className="vd-target-tag" title="Deployment target environment">
                {deployment.target === "production" ? "Production" : "Preview"}
              </span>
              <a
                href={deployment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="vd-domain-link"
                title={`Open ${deployment.url}`}
              >
                <span>{deployment.url.replace(/^https?:\/\//, "")}</span>
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>

            <a
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary vd-btn-visit"
              aria-label="Visit active deployment"
            >
              <span>Visit Deployment</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>

          {/* Deployment Meta Grid */}
          <div className="vd-meta-grid">
            <div className="vd-meta-item">
              <Calendar size={12} className="vd-meta-icon" aria-hidden="true" />
              <span className="vd-meta-label">Deployed:</span>
              <span className="vd-meta-val">{deployment.formattedDate}</span>
            </div>

            {deployment.commit?.branch && (
              <div className="vd-meta-item">
                <GitBranch size={12} className="vd-meta-icon" aria-hidden="true" />
                <span className="vd-meta-label">Branch:</span>
                <code className="vd-meta-code">{deployment.commit.branch}</code>
              </div>
            )}

            {deployment.commit?.shortSha && (
              <div className="vd-meta-item">
                <GitCommit size={12} className="vd-meta-icon" aria-hidden="true" />
                <span className="vd-meta-label">Commit:</span>
                <code className="vd-meta-code">#{deployment.commit.shortSha}</code>
              </div>
            )}
          </div>

          {/* Commit Message if available */}
          {deployment.commit?.message && (
            <div className="vd-commit-row">
              <span className="vd-commit-label">Latest Commit:</span>
              <span className="vd-commit-msg">"{deployment.commit.message}"</span>
              {deployment.commit.author && (
                <span className="vd-commit-author">by {deployment.commit.author}</span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
