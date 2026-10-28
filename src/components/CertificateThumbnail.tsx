"use client";

import React, { useEffect, useState, useRef } from "react";
import { FileText, Loader2, Award } from "lucide-react";
import { CertificateItem } from "../types/certificate";
import { renderPdfFirstPage } from "../lib/pdfThumbnail";
import "./CertificateThumbnail.css";

interface CertificateThumbnailProps {
  certificate: CertificateItem;
  priority?: boolean;
  className?: string;
}

// Module-level in-memory cache to store generated thumbnail data URLs
const thumbnailCache = new Map<string, string>();

export default function CertificateThumbnail({
  certificate,
  priority = false,
  className = "",
}: CertificateThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(priority);
  const [dataUrl, setDataUrl] = useState<string | null>(() => {
    return thumbnailCache.get(certificate.filename) || null;
  });
  const [loading, setLoading] = useState<boolean>(!dataUrl);
  const [error, setError] = useState<boolean>(false);

  // Lazy-load via IntersectionObserver
  useEffect(() => {
    if (priority || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "250px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, inView]);

  // Load / render thumbnail when in view
  useEffect(() => {
    if (!inView) return;

    // Check cache first
    const cached = thumbnailCache.get(certificate.filename);
    if (cached) {
      setDataUrl(cached);
      setLoading(false);
      return;
    }

    // For raster images (png, jpg, jpeg), use documentUrl directly
    if (certificate.format !== "pdf") {
      setDataUrl(certificate.documentUrl);
      setLoading(false);
      thumbnailCache.set(certificate.filename, certificate.documentUrl);
      return;
    }

    // For PDFs, render the first page with safety timer
    let isCancelled = false;
    setLoading(true);
    setError(false);

    // Hard fallback timeout to guarantee cards never hang indefinitely
    const safetyTimer = setTimeout(() => {
      if (!isCancelled && !dataUrl) {
        setError(true);
        setLoading(false);
      }
    }, 4500);

    renderPdfFirstPage(certificate.documentUrl, 420)
      .then((url) => {
        clearTimeout(safetyTimer);
        if (!isCancelled) {
          setDataUrl(url);
          setLoading(false);
          thumbnailCache.set(certificate.filename, url);
        }
      })
      .catch((err) => {
        clearTimeout(safetyTimer);
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [inView, certificate.filename, certificate.documentUrl, certificate.format, dataUrl]);

  return (
    <div
      ref={containerRef}
      className={`cert-thumb-container ${className} ${loading ? "cert-thumb--loading" : ""} ${
        error ? "cert-thumb--error" : ""
      }`}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="cert-thumb-skeleton" aria-label="Loading certificate preview">
          <div className="cert-thumb-skeleton-spinner">
            <Loader2 size={24} className="cert-thumb-spinner-icon" />
            <span className="cert-thumb-loading-text">Rendering preview...</span>
          </div>
        </div>
      )}

      {/* Rendered Genuine Thumbnail */}
      {!loading && !error && dataUrl && (
        <img
          src={dataUrl}
          alt={`Preview of ${certificate.title}`}
          className="cert-thumb-img"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      {/* Fallback state with sleek stylized document badge */}
      {error && !loading && (
        <div className="cert-thumb-fallback" aria-label="Certificate document preview">
          <div className="cert-thumb-fallback-emblem">
            <Award size={26} className="cert-thumb-fallback-icon" />
          </div>
          <span className="cert-thumb-fallback-issuer">{certificate.issuer}</span>
          <span className="cert-thumb-fallback-title">{certificate.title}</span>
          <span className="cert-thumb-fallback-sub">
            <FileText size={11} /> {certificate.format.toUpperCase()} Document
          </span>
        </div>
      )}
    </div>
  );
}
