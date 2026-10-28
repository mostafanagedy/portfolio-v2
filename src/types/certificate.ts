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
  verifyUrl?: string;
  sizeBytes: number;
  format: "pdf" | "image" | "document";
  rawUrl: string;
  githubUrl: string;
  tags: string[];
  sha: string;
}

export interface CertificatesResponse {
  certificates: CertificateItem[];
  total: number;
  categories: string[];
  cachedAt: string;
  sourceRepo: string;
  isStale?: boolean;
}
