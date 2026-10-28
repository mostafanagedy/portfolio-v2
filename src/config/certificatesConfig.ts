import { CertificateCategory } from "../types/certificate";

/**
 * Individual certificate configuration overrides.
 * Keyed by stable repository filename or slug.
 */
export interface CertificateConfigOverride {
  /**
   * Whether visitors are permitted to download this certificate.
   * If false, the Download button is omitted and direct download via the UI is disabled.
   */
  allowDownload?: boolean;

  /**
   * Whether to feature this certificate in the Featured Certificates top section.
   */
  featured?: boolean;

  /**
   * Custom display title override if desired.
   */
  displayTitle?: string;

  /**
   * Explicit issuer override.
   */
  issuer?: string;

  /**
   * Verified issue date (e.g. "2026-02", "Feb 2026", "2024").
   */
  issueDate?: string;

  /**
   * Category override.
   */
  category?: CertificateCategory;

  /**
   * Genuine external verification link (only when real official verification page exists).
   * Note: Do NOT use ordinary GitHub blob links as verification URLs.
   */
  verificationUrl?: string;
}

export interface CertificatesConfig {
  /**
   * Default download policy for newly discovered certificates in the repository.
   * Defaults to true (downloadable).
   */
  defaultAllowDownload: boolean;

  /**
   * Primary intended repository URL provided by the user.
   */
  intendedRepoUrl: string;

  /**
   * Fallback repository URL if the intended repository is unavailable (e.g. username typo).
   */
  fallbackRepoUrl: string;

  /**
   * Certificate-specific overrides keyed by filename (or slug).
   */
  overrides: Record<string, CertificateConfigOverride>;
}

export const certificatesConfig: CertificatesConfig = {
  defaultAllowDownload: true,
  intendedRepoUrl: "https://github.com/mostafanagedy/my_Certificates",
  fallbackRepoUrl: "https://github.com/mostafanagedy/my_Certificates",

  overrides: {
    // -------------------------------------------------------------
    // Featured Certificates (Displayed in Top Spotlight Section: Exactly 3 items)
    // -------------------------------------------------------------
    "Coursera 0OT599ROI9WB.pdf": {
      displayTitle: "Coursera Verified Specialization Certificate (0OT599ROI9WB)",
      featured: true,
      allowDownload: true,
      issuer: "Coursera",
      category: "Coursera",
      verificationUrl: "https://www.coursera.org/verify/0OT599ROI9WB",
      issueDate: "2026",
    },
    "CertificateOfCompletion_JavaScript Essential Training.pdf": {
      displayTitle: "JavaScript Essential Training",
      featured: true,
      allowDownload: true,
      issuer: "LinkedIn Learning",
      category: "LinkedIn Learning",
      issueDate: "Feb 2026",
    },
    "CertificateOfCompletion_Agile Software Development.pdf": {
      displayTitle: "Agile Software Development",
      featured: true,
      allowDownload: true,
      issuer: "LinkedIn Learning",
      category: "LinkedIn Learning",
      issueDate: "Feb 2026",
    },
    "End-to-End Software Development Workshop.pdf": {
      displayTitle: "End-to-End Software Development Workshop",
      featured: false,
      allowDownload: true,
      issuer: "Professional Workshop",
      category: "Workshops & Training",
      issueDate: "2024",
    },

    // -------------------------------------------------------------
    // Controlled Downloads (Example: Restricted Download Certificates)
    // Here allowDownload is set to false to demonstrate controlled UI permissions
    // -------------------------------------------------------------
    "CertificateOfCompletion_Personal Branding Strategies for People Who Hate the Spotlight with Goldie Chan.pdf": {
      allowDownload: false,
      issuer: "LinkedIn Learning",
      category: "LinkedIn Learning",
    },
    "CertificateOfCompletion_Communication within Teams 2021.pdf": {
      allowDownload: false,
      issuer: "LinkedIn Learning",
      category: "LinkedIn Learning",
    },
    "Coursera SG1KDJJN4JLU.pdf": {
      allowDownload: false,
      verificationUrl: "https://www.coursera.org/verify/SG1KDJJN4JLU",
      issuer: "Coursera",
      category: "Coursera",
    },

    // -------------------------------------------------------------
    // Additional Genuine Coursera Verification URLs
    // -------------------------------------------------------------
    "Coursera AES78H2QT46A.pdf": {
      verificationUrl: "https://www.coursera.org/verify/AES78H2QT46A",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera EMP3VL4QSEIE.pdf": {
      verificationUrl: "https://www.coursera.org/verify/EMP3VL4QSEIE",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera FRDMNT5QB896.pdf": {
      verificationUrl: "https://www.coursera.org/verify/FRDMNT5QB896",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera G7L4WL2I20DZ.pdf": {
      verificationUrl: "https://www.coursera.org/verify/G7L4WL2I20DZ",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera GQNZSX1DWHSL.pdf": {
      verificationUrl: "https://www.coursera.org/verify/GQNZSX1DWHSL",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera NR8SY72NX4V9.pdf": {
      verificationUrl: "https://www.coursera.org/verify/NR8SY72NX4V9",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera Q8XS94ONPAGY.pdf": {
      verificationUrl: "https://www.coursera.org/verify/Q8XS94ONPAGY",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera UNDWNN0M0NU7.pdf": {
      verificationUrl: "https://www.coursera.org/verify/UNDWNN0M0NU7",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera ZWATD25QO1RP.pdf": {
      verificationUrl: "https://www.coursera.org/verify/ZWATD25QO1RP",
      allowDownload: true,
      issuer: "Coursera",
    },
  },
};
