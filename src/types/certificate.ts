export type CertificateCategory =
  | "All"
  | "LinkedIn Learning"
  | "Coursera"
  | "Workshops & Training"
  | "Other";

export interface CertificateItem {
  id: string;
  slug: string;
  filename: string;
  path: string;
  title: string;
  issuer: string;
  category: CertificateCategory;
  credentialId?: string;
  verifyUrl?: string; // Genuine verification URL only
  sizeBytes: number;
  format: "pdf" | "image" | "document";
  rawUrl: string; // Direct GitHub raw URL
  githubUrl: string; // GitHub blob URL
  documentUrl: string; // Safe local proxy URL for live inline viewing & controlled delivery
  tags: string[];
  sha: string;
  allowDownload: boolean; // Controlled download permission
  featured?: boolean; // Whether displayed in Featured section
  issueDate?: string; // Verified or documented issue date if available
}

export interface CertificatesResponse {
  certificates: CertificateItem[];
  featuredCertificates: CertificateItem[];
  total: number;
  categories: string[];
  issuers: string[];
  cachedAt: string;
  sourceRepo: string;
  requestedRepo: string;
  repoNote?: string;
  isStale?: boolean;
}
