"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  Download,
  ExternalLink,
  Award,
  FileText,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { BrandIcons } from "./TechIcons";
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
  const [iframeError, setIframeError] = useState(false);

  // Reset zoom & error when certificate changes
  useEffect(() => {
    setZoomLevel(100);
    setIframeError(false);
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
    rawUrl,
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
      <div className="cert-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Navigation Arrows on Left and Right of Modal */}
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
        <div className="cert-modal-header">
          <div className="cert-modal-header__info">
            <div className="cert-modal-badge-row">
              <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                {issuer}
              </span>
              {issueDate && (
                <span className="cert-date-tag">
                  <Calendar size={11} />
                  <span>{issueDate}</span>
                </span>
              )}
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
                aria-label="Reset zoom"
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

            {/* Close Button */}
            <button
              type="button"
              className="cert-modal-close"
              onClick={onClose}
              aria-label="Close certificate preview"
              title="Close viewer (Escape)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body / Live Viewer */}
        <div className="cert-modal-body">
          {format === "pdf" ? (
            <div className="cert-modal-pdf-container">
              {!iframeError ? (
                <div
                  className="cert-modal-zoom-wrapper"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center top" }}
                >
                  <iframe
                    src={`${documentUrl}#zoom=${zoomLevel}&toolbar=0&navpanes=0`}
                    title={`${title} Live PDF Preview`}
                    className="cert-modal-pdf-frame"
                    onError={() => setIframeError(true)}
                  />
                </div>
              ) : (
                <div className="cert-modal-fallback">
                  <div className="cert-modal-fallback-icon">
                    <Award size={48} />
                  </div>
                  <h3>Original Document</h3>
                  <p>
                    Verified certificate issued by <strong>{issuer}</strong>.
                    You can open the original document directly in a new browser tab.
                  </p>
                  <div className="cert-modal-fallback-actions">
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                    >
                      <ExternalLink size={16} />
                      <span>Open Document in New Tab</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="cert-modal-img-container">
              <img
                src={documentUrl}
                alt={title}
                className="cert-modal-img"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
              />
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
            {tags?.slice(0, 4).map((t) => (
              <span key={t} className="cert-tag">
                {t}
              </span>
            ))}
          </div>

          <div className="cert-modal-actions">
            {/* Open Original Option */}
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-modal-btn cert-modal-btn--secondary"
              title="Open full document in separate browser tab"
            >
              <ExternalLink size={15} />
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
                <ShieldCheck size={15} />
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
                <Download size={15} />
                <span>Download {format.toUpperCase()}</span>
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
              <BrandIcons.GitHub size={16} />
              <span>GitHub File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
