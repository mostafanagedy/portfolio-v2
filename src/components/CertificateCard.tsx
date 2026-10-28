"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  Download,
  ExternalLink,
  FileText,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { BrandIcons } from "./TechIcons";
import "./CertificateCard.css";

interface CertificateCardProps {
  certificate: CertificateItem;
  onView: (cert: CertificateItem) => void;
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CertificateCard({ certificate, onView }: CertificateCardProps) {
  const { title, issuer, category, credentialId, sizeBytes, format, rawUrl, githubUrl, slug, tags } = certificate;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article className="cert-card" aria-label={`Certificate: ${title}`}>
      {/* Top Preview Canvas (Document Style Glass Canvas) */}
      <div className="cert-card__preview" onClick={() => onView(certificate)}>
        <div className="cert-card__preview-bg" aria-hidden="true">
          <div className="cert-card__preview-lines" />
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
          <button
            type="button"
            className="btn cert-btn cert-btn--view"
            onClick={() => onView(certificate)}
            aria-label={`View ${title}`}
          >
            <Award size={14} />
            <span>View</span>
          </button>

          <a
            href={rawUrl}
            download={certificate.filename}
            className="btn cert-btn cert-btn--download"
            onClick={handleDownload}
            aria-label={`Download ${title}`}
            title="Download PDF"
          >
            <Download size={14} />
            <span>Download</span>
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-btn-icon"
            aria-label={`View original file for ${title} on GitHub`}
            title="View Original on GitHub"
            onClick={handleDownload}
          >
            <BrandIcons.GitHub size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
