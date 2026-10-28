"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  FileText,
  Loader2,
  Move,
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
  const [mounted, setMounted] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [highResUrl, setHighResUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load high-resolution preview when certificate changes
  useEffect(() => {
    if (!certificate) return;

    setZoomLevel(100);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
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

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 25, 250));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 25, 75));
  }, []);

  const handleResetView = useCallback(() => {
    setZoomLevel(100);
    setPan({ x: 0, y: 0 });
  }, []);

  // Pan / Drag Handling (Mouse)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Left mouse button only
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + deltaX,
        y: panStartRef.current.y + deltaY,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Window listeners so panning stays active even if mouse drifts outside container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch Handling for Mobile/Tablet Panning
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Optional Mouse Wheel Zoom with Ctrl/Meta key
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoomLevel((prev) => Math.min(prev + 15, 250));
      } else {
        setZoomLevel((prev) => Math.max(prev - 15, 60));
      }
    }
  };

  if (!certificate || !mounted) return null;

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

  const isTransformed = zoomLevel !== 100 || pan.x !== 0 || pan.y !== 0;

  return createPortal(
    <div
      className="cert-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cert-title"
    >
      {/* Accessible Backdrop Click Overlay & Unified Modal Dialog */}
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

        {/* 1. Modal Header (Title, Badges, Zoom Controls, Close Button) */}
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

            <h2 id="modal-cert-title" className="cert-modal-title" title={title}>
              {title}
            </h2>
          </div>

          <div className="cert-modal-header__tools">
            {/* Zoom & Pan Controls Group */}
            <div className="cert-modal-zoom-group" role="group" aria-label="Zoom and Pan controls">
              <button
                type="button"
                className="cert-modal-tool-btn"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                title="Zoom Out (-)"
                aria-label="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>

              <button
                type="button"
                className="cert-modal-zoom-val"
                onClick={handleResetView}
                title="Click to reset zoom and center"
                aria-label="Reset zoom and center"
              >
                {zoomLevel}%
              </button>

              <button
                type="button"
                className="cert-modal-tool-btn"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 250}
                title="Zoom In (+)"
                aria-label="Zoom In"
              >
                <ZoomIn size={15} />
              </button>

              {/* Reset View Button (active when zoomed or panned) */}
              {isTransformed && (
                <button
                  type="button"
                  className="cert-modal-tool-btn cert-modal-tool-btn--reset"
                  onClick={handleResetView}
                  title="Reset Zoom & Center View"
                  aria-label="Reset view"
                >
                  <RotateCcw size={13} />
                </button>
              )}
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

        {/* 2. Modal Body / Interactive Viewer Box */}
        <div
          ref={viewerRef}
          className={`cert-modal-body ${
            isDragging ? "cert-modal-body--dragging" : ""
          } ${zoomLevel > 100 ? "cert-modal-body--zoomed" : ""}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {loading ? (
            <div className="cert-modal-loading">
              <Loader2 size={36} className="cert-modal-spinner" />
              <span className="cert-modal-loading-text">Loading certificate preview...</span>
            </div>
          ) : !renderError && highResUrl ? (
            <div
              className="cert-modal-viewport"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              <img
                src={highResUrl}
                alt={`Certificate document for ${title}`}
                className="cert-modal-doc"
                draggable={false}
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

          {/* Interactive Drag Hint (Visible when zoomed in) */}
          {zoomLevel > 100 && (
            <div className="cert-modal-pan-hint" aria-hidden="true">
              <Move size={12} />
              <span>Click &amp; drag to pan</span>
            </div>
          )}
        </div>

        {/* 3. Integrated Modal Footer Toolbar */}
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
    </div>,
    document.body
  );
}
