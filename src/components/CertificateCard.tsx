"use client";

import React from "react";
import {
  Award,
  Download,
  ExternalLink,
  FileText,
  CheckCircle2,
  BookOpen,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { BrandIcons } from "./TechIcons";
import "./CertificateCard.css";

interface CertificateCardProps {
  certificate: CertificateItem;
  viewMode?: "grid" | "list";
  onView: (cert: CertificateItem) => void;
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    credentialId,
    verifyUrl,
    sizeBytes,
    format,
    documentUrl,
    rawUrl,
    githubUrl,
    tags,
    allowDownload,
    issueDate,
  } = certificate;

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isCoursera = category === "Coursera";
  const isLinkedIn = category === "LinkedIn Learning";

  // If in list view, render compact horizontal row
  if (viewMode === "list") {
    return (
      <article className="cert-card cert-card--list" aria-label={`Certificate: ${title}`}>
        {/* Compact Document Emblem */}
        <div className="cert-card__list-icon" onClick={() => onView(certificate)}>
          <Award size={22} className="cert-card__list-emblem-icon" />
        </div>

        {/* Content Column */}
        <div className="cert-card__list-content">
          <div className="cert-card__meta-top">
            <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
              {issuer}
            </span>
            {issueDate && (
              <span className="cert-date-tag">
                <Calendar size={11} />
                <span>{issueDate}</span>
              </span>
            )}
            {credentialId && (
              <span className="cert-cred-tag" title={`Credential ID: ${credentialId}`}>
                <CheckCircle2 size={11} />
                <span>ID: {credentialId}</span>
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

          <button
            type="button"
            className="btn cert-btn cert-btn--view"
            onClick={() => onView(certificate)}
            aria-label={`View ${title}`}
          >
            <BookOpen size={13} />
            <span>View</span>
          </button>

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
      {/* Top Preview Canvas (Authentic Document Style Preview) */}
      <div
        className={`cert-card__preview ${
          isCoursera ? "cert-card__preview--coursera" : isLinkedIn ? "cert-card__preview--linkedin" : ""
        }`}
        onClick={() => onView(certificate)}
      >
        <div className="cert-card__preview-bg" aria-hidden="true">
          {/* Subtle document header bar */}
          <div className="cert-doc-ribbon">
            <span className="cert-doc-ribbon-bar" />
            <span className="cert-doc-ribbon-text">{issuer.toUpperCase()}</span>
          </div>

          <div className="cert-card__preview-lines">
            <div className="cert-doc-sim-title">{title}</div>
            <div className="cert-doc-sim-owner">Issued to Mostafa Maged Nagedy</div>
          </div>

          <div className="cert-card__emblem-ring">
            <Award size={34} className="cert-card__emblem-icon" />
          </div>
        </div>

        {/* Floating Format & Issuer Badges */}
        <div className="cert-card__badge-row">
          <span className="cert-badge cert-badge--format">
            <FileText size={12} />
            <span>{format.toUpperCase()}</span>
          </span>

          {sizeBytes > 0 && (
            <span className="cert-badge cert-badge--size">{formatFileSize(sizeBytes)}</span>
          )}
        </div>

        {/* Hover Overlay with "Inspect Certificate" Action */}
        <div className="cert-card__hover-overlay">
          <button
            type="button"
            className="cert-card__hover-btn"
            onClick={() => onView(certificate)}
            aria-label={`Inspect ${title}`}
          >
            <BookOpen size={16} />
            <span>Inspect Certificate</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="cert-card__body">
        {/* Category & Issuer Row */}
        <div className="cert-card__meta-top">
          <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
            {issuer}
          </span>

          {issueDate && (
            <span className="cert-date-tag">
              <Calendar size={11} />
              <span>{issueDate}</span>
            </span>
          )}

          {credentialId && (
            <span className="cert-cred-tag" title={`Credential ID: ${credentialId}`}>
              <CheckCircle2 size={12} />
              <span>ID: {credentialId.slice(0, 8)}...</span>
            </span>
          )}
        </div>

        {/* Title */}
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

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="cert-card__tags" aria-label="Topics">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="cert-tag">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="cert-tag cert-tag--more">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions Row */}
        <div className="cert-card__actions">
          {/* Verify Button: Displayed ONLY when genuine verification URL exists (Requirement 6) */}
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

          {/* View Action */}
          <button
            type="button"
            className="btn cert-btn cert-btn--view"
            onClick={() => onView(certificate)}
            aria-label={`View ${title}`}
          >
            <Award size={14} />
            <span>View</span>
          </button>

          {/* Download Action: Displayed ONLY when allowDownload is true (Requirement 5) */}
          {allowDownload && (
            <a
              href={`/api/certificates/document?file=${encodeURIComponent(certificate.filename)}&download=1`}
              download={certificate.filename}
              className="btn cert-btn cert-btn--download"
              onClick={handleDownloadClick}
              aria-label={`Download ${title}`}
              title="Download PDF"
            >
              <Download size={14} />
              <span>Download</span>
            </a>
          )}

          {/* Secondary GitHub Source Link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-btn-icon"
            aria-label={`View file for ${title} on GitHub`}
            title="View Original on GitHub"
            onClick={handleDownloadClick}
          >
            <BrandIcons.GitHub size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
