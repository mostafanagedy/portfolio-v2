"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { BrandIcons } from "./TechIcons";
import { renderPdfFirstPage } from "../lib/pdfThumbnail";
import "./CertificateModal.css";

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function CertificateModal({
  certificate,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: CertificateModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highResUrl, setHighResUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<boolean>(false);

  // Load high-resolution preview when certificate changes
  useEffect(() => {
    if (!certificate) return;

    setZoomLevel(100);
    setRenderError(false);

    if (certificate.format !== "pdf") {
      setHighResUrl(certificate.documentUrl);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    // Render high-res first page (1600px width for crystal-clear readability)
    renderPdfFirstPage(certificate.documentUrl, 1600)
      .then((url) => {
        if (!isCancelled) {
          setHighResUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("[CertificateModal] High-res render error, fallback to documentUrl:", err);
        if (!isCancelled) {
          setRenderError(true);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [certificate]);

  // Keyboard navigation: Escape to close, Left/Right arrows to cycle
  useEffect(() => {
    if (!certificate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && hasNext && onNext) {
        onNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [certificate, onClose, onPrev, onNext, hasPrev, hasNext]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 25, 75));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(100);
  }, []);

  if (!certificate) return null;

  const {
    title,
    issuer,
    category,
    credentialId,
    verifyUrl,
    sizeBytes,
    format,
    documentUrl,
    githubUrl,
    filename,
    tags,
    allowDownload,
    issueDate,
  } = certificate;

  const sizeFormatted =
    sizeBytes > 0
      ? sizeBytes < 1024 * 1024
        ? `${(sizeBytes / 1024).toFixed(0)} KB`
        : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : "";

  return (
    <div
      className="cert-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cert-title"
    >
      {/* Accessible Backdrop Click Overlay */}
      <div
        className="cert-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Navigation Arrows on Left and Right */}
        {hasPrev && onPrev && (
          <button
            type="button"
            className="cert-modal-nav-arrow cert-modal-nav-arrow--prev"
            onClick={onPrev}
            aria-label="Previous certificate"
            title="Previous certificate (Left arrow)"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {hasNext && onNext && (
          <button
            type="button"
            className="cert-modal-nav-arrow cert-modal-nav-arrow--next"
            onClick={onNext}
            aria-label="Next certificate"
            title="Next certificate (Right arrow)"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Modal Header */}
        <header className="cert-modal-header">
          <div className="cert-modal-header__info">
            <div className="cert-modal-badge-row">
              <span
                className={`cert-issuer-tag cert-issuer-tag--${category
                  .toLowerCase()
                  .replace(/[^a-z]/g, "-")}`}
              >
                {issuer}
              </span>
              {issueDate && (
                <span className="cert-date-tag">
                  <Calendar size={11} />
                  <span>{issueDate}</span>
                </span>
              )}
              <span className="cert-badge cert-badge--format">
                <FileText size={11} />
                <span>{format.toUpperCase()}</span>
              </span>
              {sizeFormatted && (
                <span className="cert-badge cert-badge--size">{sizeFormatted}</span>
              )}
            </div>

            <h2 id="modal-cert-title" className="cert-modal-title">
              {title}
            </h2>
          </div>

          <div className="cert-modal-header__tools">
            {/* Zoom Controls */}
            <div className="cert-modal-zoom-group" role="group" aria-label="Zoom controls">
              <button
                type="button"
                className="cert-modal-tool-btn"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <button
                type="button"
                className="cert-modal-zoom-val"
                onClick={handleZoomReset}
                title="Reset Zoom to 100%"
                aria-label="Reset zoom to 100%"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                className="cert-modal-tool-btn"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Explicit, Accessible Close Button */}
            <button
              type="button"
              className="cert-modal-close"
              onClick={onClose}
              aria-label="Close certificate viewer"
              title="Close viewer (Escape)"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Modal Body / Viewer: Flex-1, Min-H-0, Overflow-Hidden */}
        <div
          className={`cert-modal-body ${
            zoomLevel > 100 ? "cert-modal-body--zoomed" : ""
          }`}
        >
          {loading ? (
            <div className="cert-modal-loading">
              <Loader2 size={36} className="cert-modal-spinner" />
              <span className="cert-modal-loading-text">Loading certificate...</span>
            </div>
          ) : !renderError && highResUrl ? (
            <div
              className="cert-modal-viewport"
              style={{
                transform: zoomLevel > 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: "center center",
              }}
            >
              <img
                src={highResUrl}
                alt={`Certificate document for ${title}`}
                className="cert-modal-doc"
              />
            </div>
          ) : (
            /* Fallback inline frame if high-res render is unavailable */
            <div className="cert-modal-pdf-container">
              <iframe
                src={`${documentUrl}#zoom=${zoomLevel}&toolbar=0&navpanes=0`}
                title={`${title} Preview`}
                className="cert-modal-pdf-frame"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Toolbar */}
        <footer className="cert-modal-footer">
          <div className="cert-modal-tags">
            {credentialId && (
              <span className="cert-cred-tag">
                <ShieldCheck size={13} />
                <span>ID: {credentialId}</span>
              </span>
            )}
            {tags?.slice(0, 3).map((t) => (
              <span key={t} className="cert-tag">
                {t}
              </span>
            ))}
          </div>

          <div className="cert-modal-actions">
            {/* Open Original Document */}
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-modal-btn cert-modal-btn--secondary"
              title="Open full original file in separate browser tab"
            >
              <ExternalLink size={14} />
              <span>Open Original</span>
            </a>

            {/* Verify Credential Button (ONLY when genuine verification URL exists) */}
            {verifyUrl && (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn cert-modal-btn cert-modal-btn--verify"
                title="Verify certificate on official issuing registry"
              >
                <ShieldCheck size={14} />
                <span>Verify Credential</span>
              </a>
            )}

            {/* Download Certificate Button (ONLY when allowDownload is true) */}
            {allowDownload && (
              <a
                href={`/api/certificates/document?file=${encodeURIComponent(filename)}&download=1`}
                download={filename}
                className="btn btn--primary cert-modal-btn"
                title="Download original certificate document"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>
            )}

            {/* GitHub Source Link */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-modal-btn cert-modal-btn--github"
              title="Inspect commit & file on GitHub"
            >
              <BrandIcons.GitHub size={15} />
              <span>GitHub File</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
