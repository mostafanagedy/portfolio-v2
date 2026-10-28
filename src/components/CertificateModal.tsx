"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Download,
  ExternalLink,
  Award,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { BrandIcons } from "./TechIcons";
import "./CertificateModal.css";

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export default function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    setIframeError(false);
  }, [certificate]);

  useEffect(() => {
    if (!certificate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const { title, issuer, category, credentialId, verifyUrl, sizeBytes, format, rawUrl, githubUrl, filename, tags } = certificate;

  const sizeFormatted = sizeBytes > 0
    ? sizeBytes < 1024 * 1024
      ? `${(sizeBytes / 1024).toFixed(0)} KB`
      : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : "";

  return (
    <div className="cert-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-cert-title">
      <div className="cert-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cert-modal-header">
          <div className="cert-modal-header__info">
            <div className="cert-modal-badge-row">
              <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                {issuer}
              </span>
              <span className="cert-badge cert-badge--format">
                <FileText size={12} />
                <span>{format.toUpperCase()}</span>
              </span>
              {sizeFormatted && <span className="cert-badge cert-badge--size">{sizeFormatted}</span>}
            </div>
            <h2 id="modal-cert-title" className="cert-modal-title">
              {title}
            </h2>
          </div>

          <button
            type="button"
            className="cert-modal-close"
            onClick={onClose}
            aria-label="Close certificate preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Preview Area */}
        <div className="cert-modal-body">
          {format === "pdf" ? (
            <div className="cert-modal-pdf-container">
              {!iframeError ? (
                <iframe
                  src={`${rawUrl}#toolbar=0&navpanes=0`}
                  title={`${title} PDF Preview`}
                  className="cert-modal-pdf-frame"
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="cert-modal-fallback">
                  <div className="cert-modal-fallback-icon">
                    <Award size={48} />
                  </div>
                  <h3>Certificate Document</h3>
                  <p>
                    This is an authentic certificate issued by <strong>{issuer}</strong>.
                    If your browser doesn't preview inline PDFs, you can view the full document directly.
                  </p>
                  <div className="cert-modal-fallback-actions">
                    <a
                      href={rawUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                    >
                      <ExternalLink size={16} />
                      <span>Open in Browser</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="cert-modal-img-container">
              <img src={rawUrl} alt={title} className="cert-modal-img" />
            </div>
          )}
        </div>

        {/* Modal Footer Toolbar */}
        <div className="cert-modal-footer">
          <div className="cert-modal-tags">
            {credentialId && (
              <span className="cert-cred-tag">
                <CheckCircle2 size={13} />
                <span>ID: {credentialId}</span>
              </span>
            )}
            {tags?.map((t) => (
              <span key={t} className="cert-tag">
                {t}
              </span>
            ))}
          </div>

          <div className="cert-modal-actions">
            {verifyUrl && (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn cert-modal-btn cert-modal-btn--verify"
                title="Verify certificate on Coursera official registry"
              >
                <CheckCircle2 size={15} />
                <span>Verify Credential</span>
              </a>
            )}

            <a
              href={rawUrl}
              download={filename}
              className="btn btn--primary cert-modal-btn"
            >
              <Download size={15} />
              <span>Download {format.toUpperCase()}</span>
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-modal-btn cert-modal-btn--github"
              title="Inspect raw commit & file on GitHub"
            >
              <BrandIcons.GitHub size={16} />
              <span>GitHub File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
