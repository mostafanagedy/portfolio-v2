import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Download,
  ExternalLink,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { getCertificateBySlug } from "../../../lib/certificatesService";
import { BrandIcons } from "../../../components/TechIcons";
import "../certificates.css";
import "./certificate-detail.css";

interface CertificatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);

  if (!cert) {
    return {
      title: "Certificate Not Found | Mostafa Nagdy",
      description: "The requested certificate could not be located.",
    };
  }

  return {
    title: `${cert.title} | Certificates | Mostafa Nagdy`,
    description: `View verified certificate for ${cert.title} issued by ${cert.issuer}.`,
  };
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);

  if (!cert) {
    notFound();
  }

  const { title, issuer, category, credentialId, verifyUrl, sizeBytes, format, githubUrl, filename } = cert;

  const sizeFormatted = sizeBytes > 0
    ? sizeBytes < 1024 * 1024
      ? `${(sizeBytes / 1024).toFixed(0)} KB`
      : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : "";

  return (
    <div className="view-container cert-detail-view">
      <div className="container cert-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="certs-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="certs-breadcrumb__link">
            Home
          </Link>
          <span className="certs-breadcrumb__sep">/</span>
          <Link href="/certificates" className="certs-breadcrumb__link">
            Certificates
          </Link>
          <span className="certs-breadcrumb__sep">/</span>
          <span className="certs-breadcrumb__current" aria-current="page">
            {title}
          </span>
        </nav>

        {/* Back Link */}
        <div className="cert-detail-back-row">
          <Link href="/certificates" className="cert-detail-back-btn">
            <ArrowLeft size={16} />
            <span>Back to All Certificates</span>
          </Link>
        </div>

        {/* Detail Card Header */}
        <header className="cert-detail-header">
          <div className="cert-detail-header__badges">
            <span className={`cert-issuer-tag cert-issuer-tag--${category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
              {issuer}
            </span>
            <span className="cert-badge cert-badge--format">
              <FileText size={12} />
              <span>{format.toUpperCase()}</span>
            </span>
            {sizeFormatted && <span className="cert-badge cert-badge--size">{sizeFormatted}</span>}
          </div>

          <h1 className="cert-detail-title">{title}</h1>

          <div className="cert-detail-meta-strip">
            <div className="cert-detail-meta-item">
              <Layers size={15} />
              <span>Category: <strong>{category}</strong></span>
            </div>
            {credentialId && (
              <div className="cert-detail-meta-item">
                <CheckCircle2 size={15} className="text-accent" />
                <span>Credential ID: <strong>{credentialId}</strong></span>
              </div>
            )}
            <div className="cert-detail-meta-item">
              <FileText size={15} />
              <span>Filename: <strong>{filename}</strong></span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="cert-detail-cta-row">
            {cert.allowDownload && (
              <a
                href={`/api/certificates/document?file=${encodeURIComponent(filename)}&download=1`}
                download={filename}
                className="btn btn--primary cert-detail-cta-btn"
              >
                <Download size={16} />
                <span>Download Certificate</span>
              </a>
            )}

            {verifyUrl && (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn cert-detail-btn-secondary"
                title="Verify on official Coursera directory"
              >
                <CheckCircle2 size={16} />
                <span>Verify Credential</span>
              </a>
            )}

            <a
              href={cert.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-detail-btn-secondary"
              title="Open full document in new tab"
            >
              <ExternalLink size={15} />
              <span>Open Document</span>
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn cert-detail-btn-secondary"
              title="View on GitHub repository"
            >
              <BrandIcons.GitHub size={16} />
              <span>View on GitHub</span>
            </a>
          </div>
        </header>

        {/* Document Viewer Frame */}
        <section className="cert-detail-viewer-card" aria-label="Certificate Document Preview">
          <div className="cert-detail-viewer-bar">
            <div className="cert-detail-viewer-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="cert-detail-viewer-title">{filename}</span>
            <a
              href={cert.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-detail-viewer-ext"
              title="Open raw document in new tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="cert-detail-frame-wrap">
            {format === "pdf" ? (
              <iframe
                src={`${cert.documentUrl}#toolbar=0&navpanes=0`}
                title={`${title} PDF Preview`}
                className="cert-detail-iframe"
              />
            ) : (
              <div className="cert-detail-img-wrap">
                <img src={cert.documentUrl} alt={title} className="cert-detail-img" />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
