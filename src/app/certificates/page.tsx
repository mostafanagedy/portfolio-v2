"use client";

import React, { useState, useMemo } from "react";
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
  LayoutGrid,
  List,
  Filter,
  ShieldCheck,
  ChevronDown,
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
    allFilteredCertificates,
    featuredCertificates,
    allCertificates,
    totalCount,
    categories,
    issuers,
    loading,
    refreshing,
    error,
    sourceRepo,
    requestedRepo,
    repoNote,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedIssuer,
    setSelectedIssuer,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    hasMore,
    remainingCount,
    loadMore,
    refresh,
    retry,
  } = useCertificates();

  const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allCertificates.length };
    allCertificates.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [allCertificates]);

  // Modal navigation index
  const activeModalIndex = useMemo(() => {
    if (!activeModalCert) return -1;
    return allFilteredCertificates.findIndex((c) => c.slug === activeModalCert.slug);
  }, [activeModalCert, allFilteredCertificates]);

  const handleModalPrev = () => {
    if (activeModalIndex > 0) {
      setActiveModalCert(allFilteredCertificates[activeModalIndex - 1]);
    }
  };

  const handleModalNext = () => {
    if (activeModalIndex < allFilteredCertificates.length - 1) {
      setActiveModalCert(allFilteredCertificates[activeModalIndex + 1]);
    }
  };

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

        {/* Informative Repository Status Note (if intended vs fallback was resolved) */}
        {repoNote && (
          <div className="certs-repo-note" role="note">
            <ShieldCheck size={16} className="certs-repo-note__icon" />
            <div className="certs-repo-note__text">
              <span>{repoNote}</span>
            </div>
          </div>
        )}

        {/* Featured Certificates Spotlight Section (Requirement 7) */}
        {!searchQuery && selectedCategory === "All" && selectedIssuer === "All Issuers" && featuredCertificates.length > 0 && (
          <section className="certs-featured-section" aria-label="Featured Certificates">
            <div className="certs-featured-header">
              <span className="certs-featured-badge">
                <Sparkles size={14} />
                <span>FEATURED CREDENTIALS</span>
              </span>
              <h2 className="certs-featured-title">Key Specializations &amp; Core Highlights</h2>
            </div>

            <div className="certs-featured-grid">
              {featuredCertificates.map((cert) => (
                <CertificateCard
                  key={`featured-${cert.slug}`}
                  certificate={cert}
                  viewMode="grid"
                  onView={(c) => setActiveModalCert(c)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Toolbar: Search, Filters, View Modes, and Sorting */}
        <section className="certs-toolbar" aria-label="Search and filter certificates">
          {/* Top Row: Search + Issuer Filter + Sort + View Mode Toggles */}
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

            {/* Issuer Filter Dropdown */}
            <div className="certs-filter-select-box">
              <Filter size={14} className="certs-sort-icon" aria-hidden="true" />
              <select
                value={selectedIssuer}
                onChange={(e) => setSelectedIssuer(e.target.value)}
                className="certs-sort-select"
                aria-label="Filter by issuing organization"
              >
                {issuers.map((iss) => (
                  <option key={iss} value={iss}>
                    {iss}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
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

            {/* View Mode Toggle (Grid vs List) */}
            <div className="certs-viewmode-group" role="group" aria-label="View layout switcher">
              <button
                type="button"
                className={`certs-viewmode-btn ${viewMode === "grid" ? "certs-viewmode-btn--active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
                aria-label="Grid layout view"
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`certs-viewmode-btn ${viewMode === "list" ? "certs-viewmode-btn--active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
                aria-label="Compact list view"
                aria-pressed={viewMode === "list"}
              >
                <List size={15} />
              </button>
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

        {/* Certificates Grid/List Content Area */}
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
          ) : allFilteredCertificates.length === 0 ? (
            /* Empty State */
            <div className="certs-state-card" role="status">
              <div className="certs-state-icon">
                <FileText size={40} />
              </div>
              <h2 className="certs-state-title">No Certificates Found</h2>
              <p className="certs-state-desc">
                {searchQuery
                  ? `No certificates match your search query "${searchQuery}" in the selected filters.`
                  : `No certificates match the selected category (${selectedCategory}) or issuer (${selectedIssuer}).`}
              </p>
              {(searchQuery || selectedCategory !== "All" || selectedIssuer !== "All Issuers") && (
                <button
                  type="button"
                  className="btn btn--primary certs-reset-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedIssuer("All Issuers");
                  }}
                >
                  <span>Clear Search &amp; Filters</span>
                </button>
              )}
            </div>
          ) : (
            /* Certificates Cards Display */
            <>
              <div className="certs-results-bar">
                <span>
                  Showing <strong>{certificates.length}</strong> of{" "}
                  <strong>{allFilteredCertificates.length}</strong> certificates
                  {allFilteredCertificates.length < totalCount && (
                    <> (filtered from {totalCount} total)</>
                  )}
                </span>

                <div className="certs-active-badges">
                  {selectedCategory !== "All" && (
                    <span className="certs-active-filter-badge">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedIssuer !== "All Issuers" && (
                    <span className="certs-active-filter-badge">
                      Issuer: {selectedIssuer}
                    </span>
                  )}
                </div>
              </div>

              <div className={viewMode === "grid" ? "certs-grid" : "certs-list"}>
                {certificates.map((cert) => (
                  <CertificateCard
                    key={cert.slug}
                    certificate={cert}
                    viewMode={viewMode}
                    onView={(c) => setActiveModalCert(c)}
                  />
                ))}
              </div>

              {/* Load More Pagination (Requirement 8) */}
              {hasMore && (
                <div className="certs-loadmore-container">
                  <button
                    type="button"
                    className="btn certs-loadmore-btn"
                    onClick={loadMore}
                    aria-label={`Load more certificates, ${remainingCount} remaining`}
                  >
                    <span>Load More Certificates</span>
                    <span className="certs-loadmore-count">+{remainingCount} remaining</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Live Certificate Modal Viewer (Requirement 4) */}
        <CertificateModal
          certificate={activeModalCert}
          onClose={() => setActiveModalCert(null)}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
          hasPrev={activeModalIndex > 0}
          hasNext={activeModalIndex < allFilteredCertificates.length - 1}
        />
      </div>
    </div>
  );
}
