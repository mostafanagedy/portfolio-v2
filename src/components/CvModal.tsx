"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { renderPdfFirstPage } from "../lib/pdfThumbnail";
import "./CvModal.css";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl?: string;
  filename?: string;
}

export default function CvModal({
  isOpen,
  onClose,
  cvUrl = "/Mostafa-Nagdy-CV.pdf",
  filename = "Mostafa-Nagdy-CV.pdf",
}: CvModalProps) {
  const [mounted, setMounted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render high-res CV preview
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoading(true);

    renderPdfFirstPage(cvUrl, 1500)
      .then((url) => {
        if (!cancelled) {
          setPreviewUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("[CvModal] PDF render fallback to iframe:", err);
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, cvUrl]);

  // Keyboard navigation: Escape to close
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="cv-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
    >
      <div
        className="cv-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <header className="cv-modal-header">
          <div className="cv-modal-header__info">
            <div className="cv-modal-badge-row">
              <span className="cv-badge cv-badge--verified">
                <CheckCircle size={12} />
                <span>Verified Resume</span>
              </span>
              <span className="cv-badge cv-badge--format">
                <FileText size={12} />
                <span>PDF Document</span>
              </span>
            </div>
            <h2 id="cv-modal-title" className="cv-modal-title">
              Mostafa Nagedy — Curriculum Vitae
            </h2>
          </div>

          <div className="cv-modal-header__actions">
            {/* Download Button */}
            <a
              href={cvUrl}
              download={filename}
              className="btn btn--primary cv-modal-btn cv-modal-btn--download"
              title="Download PDF version to your device"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            {/* Open Original in New Tab */}
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cv-modal-btn cv-modal-btn--secondary"
              title="Open full PDF in separate browser tab"
            >
              <ExternalLink size={14} />
              <span className="cv-modal-btn-label">Open Full</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              className="cv-modal-close"
              onClick={onClose}
              aria-label="Close CV preview"
              title="Close (Escape)"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Viewer Body */}
        <div className="cv-modal-body">
          {loading ? (
            <div className="cv-modal-loading">
              <Loader2 size={36} className="cv-modal-spinner" />
              <span>Loading Resume Preview...</span>
            </div>
          ) : previewUrl ? (
            <div className="cv-modal-doc-wrapper">
              <img
                src={previewUrl}
                alt="Mostafa Nagedy Curriculum Vitae Document"
                className="cv-modal-doc"
              />
            </div>
          ) : (
            <iframe
              src={`${cvUrl}#toolbar=0&navpanes=0`}
              title="Mostafa Nagdy Curriculum Vitae Preview"
              className="cv-modal-frame"
            />
          )}
        </div>

        {/* Footer */}
        <footer className="cv-modal-footer">
          <div className="cv-modal-footer__text">
            <span>MERN Stack &amp; Full Stack Developer • Cairo, Egypt • Open to Opportunities</span>
          </div>
          <div className="cv-modal-footer__actions">
            <a
              href="mailto:mostafamagednagedy@gmail.com"
              className="cv-modal-contact-link"
              title="Send direct email"
            >
              Contact Mostafa
            </a>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
