"use client";

import React from "react";

export default function RepoCardSkeleton() {
  return (
    <div className="fp-card fp-repo-card fp-skeleton-card" aria-hidden="true">
      <div className="fp-repo-card__body">
        <div className="fp-repo-card__header">
          <div className="fp-skeleton-line fp-skeleton-line--title" />
          <div className="fp-skeleton-line fp-skeleton-line--badge" />
        </div>

        <div className="fp-skeleton-desc">
          <div className="fp-skeleton-line fp-skeleton-line--text" />
          <div className="fp-skeleton-line fp-skeleton-line--text-short" />
        </div>

        <div className="fp-skeleton-stats">
          <div className="fp-skeleton-line fp-skeleton-line--stat" />
          <div className="fp-skeleton-line fp-skeleton-line--stat" />
          <div className="fp-skeleton-line fp-skeleton-line--date" />
        </div>
      </div>

      <div className="fp-card__actions fp-repo-card__actions">
        <div className="fp-skeleton-btn" />
        <div className="fp-skeleton-btn" />
      </div>
    </div>
  );
}
