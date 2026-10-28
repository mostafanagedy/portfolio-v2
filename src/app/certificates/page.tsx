"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  RotateCw,
  SlidersHorizontal,
  ExternalLink,
  AlertCircle,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useCertificates, CertificateSortOption } from "../../hooks/useCertificates";
import { CertificateItem, CertificateCategory } from "../../types/certificate";
import CertificateCard from "../../components/CertificateCard";
import CertificateModal from "../../components/CertificateModal";
import { BrandIcons } from "../../components/TechIcons";
import "./certificates.css";

export default function CertificatesPage() {
  const {
    certificates,
    allCertificates,
    totalCount,
    categories,
    loading,
    refreshing,
    error,
    sourceRepo,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    refresh,
    retry,
  } = useCertificates();

  const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null);

  // Calculate category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: allCertificates.length };
    allCertificates.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [allCertificates]);

  return (
    <div className="view-container certs-view">
      {/* Ambient background decoration */}
      <div className="certs-ambient-glow" aria-hidden="true" />

      <div className="container certs-container">
        {/* Breadcrumb Navigation */}
        <nav className="certs-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="certs-breadcrumb__link">
            Home
          </Link>
          <span className="certs-breadcrumb__sep">/</span>
          <Link href="/about" className="certs-breadcrumb__link">
            About
          </Link>
          <span className="certs-breadcrumb__sep">/</span>
          <span className="certs-breadcrumb__current" aria-current="page">
            Certificates
          </span>
        </nav>

        {/* Page Header */}
        <header className="certs-header">
          <div className="certs-header__top-row">
            <span className="certs-eyebrow">
              <Award size={14} className="certs-eyebrow-icon" />
              <span>MY ACHIEVEMENTS</span>
            </span>

            <div className="certs-header__actions">
              <button
                type="button"
                className={`btn certs-action-btn ${refreshing ? "certs-action-btn--spin" : ""}`}
                onClick={() => refresh()}
                disabled={loading || refreshing}
                title="Refresh certificates from GitHub"
                aria-label="Refresh certificates"
              >
                <RotateCw size={14} />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </button>

              <a
                href={sourceRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn certs-action-btn certs-action-btn--github"
                title="View my_Certificates repository on GitHub"
              >
                <BrandIcons.GitHub size={15} />
                <span>GitHub Repo</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <h1 className="certs-title">
            Certificates &amp; <span className="text-accent">Achievements</span>
          </h1>

          <p className="certs-desc">
            A verified collection of professional certifications and course completions in software
            engineering, web development, algorithms, and technical skills earned through{" "}
            <strong>LinkedIn Learning</strong>, <strong>Coursera</strong>, and interactive workshops.
            Synchronized dynamically from my GitHub certificates repository.
          </p>

          {/* Key Metrics Strip */}
          <div className="certs-stats-strip">
            <div className="certs-stat-pill">
              <span className="certs-stat-pill__val">{totalCount}</span>
              <span className="certs-stat-pill__lbl">Total Certificates</span>
            </div>
            <div className="certs-stat-pill">
              <span className="certs-stat-pill__val">{categoryCounts["LinkedIn Learning"] || 0}</span>
              <span className="certs-stat-pill__lbl">LinkedIn Learning</span>
            </div>
            <div className="certs-stat-pill">
              <span className="certs-stat-pill__val">{categoryCounts["Coursera"] || 0}</span>
              <span className="certs-stat-pill__lbl">Coursera Verified</span>
            </div>
            <div className="certs-stat-pill">
              <span className="certs-stat-pill__val">{categoryCounts["Workshops & Training"] || 0}</span>
              <span className="certs-stat-pill__lbl">Workshops</span>
            </div>
          </div>
        </header>

        {/* Toolbar: Search, Filters, and Sorting */}
        <section className="certs-toolbar" aria-label="Search and filter certificates">
          {/* Top Toolbar Row: Search + Sort */}
          <div className="certs-toolbar__row">
            {/* Search Input */}
            <div className="certs-search-box">
              <Search size={16} className="certs-search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by title, technology, issuer, or credential ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="certs-search-input"
                aria-label="Search certificates"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="certs-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="certs-sort-box">
              <SlidersHorizontal size={14} className="certs-sort-icon" aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as CertificateSortOption)}
                className="certs-sort-select"
                aria-label="Sort certificates"
              >
                <option value="name-asc">Title: A to Z</option>
                <option value="name-desc">Title: Z to A</option>
                <option value="size-desc">Size: Largest First</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="certs-filter-pills" role="tablist" aria-label="Filter by category">
            {categories.map((cat) => {
              const count = categoryCounts[cat] ?? 0;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`certs-pill ${isActive ? "certs-pill--active" : ""}`}
                  onClick={() => setSelectedCategory(cat as CertificateCategory)}
                >
                  <span>{cat}</span>
                  <span className="certs-pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Certificates Grid Content Area */}
        <main className="certs-main-content">
          {loading && !refreshing ? (
            /* Loading Skeletons */
            <div className="certs-grid" aria-label="Loading certificates">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="cert-card-skeleton">
                  <div className="cert-skeleton-preview" />
                  <div className="cert-skeleton-body">
                    <div className="cert-skeleton-line cert-skeleton-line--short" />
                    <div className="cert-skeleton-line cert-skeleton-line--title" />
                    <div className="cert-skeleton-line cert-skeleton-line--tags" />
                    <div className="cert-skeleton-line cert-skeleton-line--actions" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="certs-state-card certs-state-card--error" role="alert">
              <div className="certs-state-icon certs-state-icon--error">
                <AlertCircle size={40} />
              </div>
              <h2 className="certs-state-title">Unable to Load Certificates</h2>
              <p className="certs-state-desc">
                {error}. Please check your connection or verify that GitHub API rate limits have not been exceeded.
              </p>
              <button type="button" className="btn btn--primary certs-retry-btn" onClick={retry}>
                <RotateCw size={15} />
                <span>Try Again</span>
              </button>
            </div>
          ) : certificates.length === 0 ? (
            /* Empty State */
            <div className="certs-state-card" role="status">
              <div className="certs-state-icon">
                <FileText size={40} />
              </div>
              <h2 className="certs-state-title">No Certificates Found</h2>
              <p className="certs-state-desc">
                {searchQuery
                  ? `No certificates match your search query "${searchQuery}" in the ${selectedCategory} category.`
                  : `No certificates currently exist in the "${selectedCategory}" category.`}
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <button
                  type="button"
                  className="btn btn--primary certs-reset-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  <span>Clear Search &amp; Filters</span>
                </button>
              )}
            </div>
          ) : (
            /* Certificates Cards Grid */
            <>
              <div className="certs-results-bar">
                <span>
                  Showing <strong>{certificates.length}</strong> of <strong>{totalCount}</strong>{" "}
                  certificates
                </span>
                {selectedCategory !== "All" && (
                  <span className="certs-active-filter-badge">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>

              <div className="certs-grid">
                {certificates.map((cert) => (
                  <CertificateCard
                    key={cert.slug}
                    certificate={cert}
                    onView={(c) => setActiveModalCert(c)}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Modal Certificate Viewer */}
        <CertificateModal
          certificate={activeModalCert}
          onClose={() => setActiveModalCert(null)}
        />
      </div>
    </div>
  );
}
