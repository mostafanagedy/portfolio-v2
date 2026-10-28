"use client";

import React from "react";
import {
  Download,
  BookOpen,
  Calendar,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { BrandIcons } from "./TechIcons";
import CertificateThumbnail from "./CertificateThumbnail";
import "./CertificateCard.css";

interface CertificateCardProps {
  certificate: CertificateItem;
  viewMode?: "grid" | "list";
  onView: (cert: CertificateItem) => void;
}

export default function CertificateCard({
  certificate,
  viewMode = "grid",
  onView,
}: CertificateCardProps) {
  const {
    title,
    issuer,
    category,
    verifyUrl,
    format,
    githubUrl,
    tags,
    allowDownload,
    issueDate,
    featured,
  } = certificate;

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Compact List View Mode
  if (viewMode === "list") {
    return (
      <article className="cert-card cert-card--list" aria-label={`Certificate: ${title}`}>
        {/* Real Thumbnail Box */}
        <div
          className="cert-card__list-thumb-wrapper"
          onClick={() => onView(certificate)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onView(certificate)}
          title={`Click to preview ${title}`}
        >
          <CertificateThumbnail
            certificate={certificate}
            priority={featured}
            className="cert-thumb--list"
          />
        </div>

        {/* Content Column */}
        <div className="cert-card__list-content">
          <div className="cert-card__meta-top">
            <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
              {issuer}
            </span>
            <span className="cert-cat-tag">{category}</span>
            {issueDate && (
              <span className="cert-date-tag">
                <Calendar size={11} />
                <span>{issueDate}</span>
              </span>
            )}
          </div>

          <h3 className="cert-card__list-title">
            <button
              type="button"
              className="cert-card__title-btn"
              onClick={() => onView(certificate)}
              title={title}
            >
              {title}
            </button>
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="cert-card__list-actions">
          {/* Verify Button (Only when genuine verification URL exists) */}
          {verifyUrl && (
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-btn cert-btn--verify"
              title="Verify credential on official registry"
              onClick={handleDownloadClick}
            >
              <ShieldCheck size={13} />
              <span>Verify</span>
            </a>
          )}

          {/* View Action (Primary Orange) */}
          <button
            type="button"
            className="btn cert-btn cert-btn--view"
            onClick={() => onView(certificate)}
            aria-label={`View ${title}`}
          >
            <BookOpen size={13} />
            <span>View</span>
          </button>

          {/* Download Action (Only when allowed) */}
          {allowDownload && (
            <a
              href={`/api/certificates/document?file=${encodeURIComponent(certificate.filename)}&download=1`}
              download={certificate.filename}
              className="btn cert-btn cert-btn--download"
              onClick={handleDownloadClick}
              aria-label={`Download ${title}`}
              title="Download PDF"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
          )}

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-btn-icon"
            aria-label={`View file for ${title} on GitHub`}
            title="View Original on GitHub"
            onClick={handleDownloadClick}
          >
            <BrandIcons.GitHub size={14} />
          </a>
        </div>
      </article>
    );
  }

  // Grid Card View (Default)
  return (
    <article className="cert-card" aria-label={`Certificate: ${title}`}>
      {/* 1. Actual Certificate Thumbnail */}
      <div
        className="cert-card__preview"
        onClick={() => onView(certificate)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onView(certificate)}
      >
        <CertificateThumbnail
          certificate={certificate}
          priority={featured}
        />

        {/* Format Badge */}
        <div className="cert-card__badge-row">
          <span className="cert-badge cert-badge--format">
            <FileText size={11} />
            <span>{format.toUpperCase()}</span>
          </span>
        </div>

        {/* Hover Overlay with "View Certificate" Action */}
        <div className="cert-card__hover-overlay">
          <button
            type="button"
            className="cert-card__hover-btn"
            onClick={(e) => {
              e.stopPropagation();
              onView(certificate);
            }}
            aria-label={`View ${title}`}
          >
            <BookOpen size={15} />
            <span>View Certificate</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="cert-card__body">
        {/* 2. Certificate Title */}
        <h3 className="cert-card__title">
          <button
            type="button"
            className="cert-card__title-btn"
            onClick={() => onView(certificate)}
            title={title}
          >
            {title}
          </button>
        </h3>

        {/* 3. Issuing Organization & 4. Relevant Category */}
        <div className="cert-card__meta-top">
          <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
            {issuer}
          </span>

          <span className="cert-cat-tag">
            {category}
          </span>

          {issueDate && (
            <span className="cert-date-tag">
              <Calendar size={11} />
              <span>{issueDate}</span>
            </span>
          )}
        </div>

        {/* Topic Tags (subtle, clean) */}
        {tags && tags.length > 0 && (
          <div className="cert-card__tags" aria-label="Topics">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="cert-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 5. Available Actions: Primary View row (w-full) + Secondary sub-actions row */}
        <div className="cert-card__actions">
          {/* Primary View Action (Full Row / w-full) */}
          <button
            type="button"
            className="btn cert-btn cert-btn--view cert-btn--full"
            onClick={() => onView(certificate)}
            aria-label={`View ${title}`}
          >
            <BookOpen size={14} />
            <span>View Certificate</span>
          </button>

          {/* Secondary Actions (Compact sub-row) */}
          <div className="cert-card__sub-actions">
            {/* Verify Action (Only when genuine verification URL exists) */}
            {verifyUrl && (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn cert-btn cert-btn--sub cert-btn--verify"
                title="Verify credential on official registry"
                onClick={handleDownloadClick}
              >
                <ShieldCheck size={13} />
                <span>Verify</span>
              </a>
            )}

            {/* Download Action (Only when allowed) */}
            {allowDownload && (
              <a
                href={`/api/certificates/document?file=${encodeURIComponent(certificate.filename)}&download=1`}
                download={certificate.filename}
                className="btn cert-btn cert-btn--sub cert-btn--download"
                onClick={handleDownloadClick}
                aria-label={`Download ${title}`}
                title="Download original certificate document"
              >
                <Download size={13} />
                <span>Download</span>
              </a>
            )}

            {/* Secondary GitHub Source Link */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-btn-icon cert-btn-icon--sub"
              aria-label={`View file for ${title} on GitHub`}
              title="View Original on GitHub"
              onClick={handleDownloadClick}
            >
              <BrandIcons.GitHub size={15} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
