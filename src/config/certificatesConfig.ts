import { CertificateCategory } from "../types/certificate";

/**
 * Verified mappings from official Coursera credential IDs to human-readable course titles.
 */
export const KNOWN_COURSERA_TITLES: Record<string, string> = {
  "0OT599ROI9WB": "Advanced Git and GitHub Practices",
  "AES78H2QT46A": "Advanced DevOps Tools and Practices",
  "EMP3VL4QSEIE": "Advanced React",
  "FRDMNT5QB896": "Version Control with Git",
  "G7L4WL2I20DZ": "React Basics",
  "GQNZSX1DWHSL": "Coding Interview Preparation",
  "NR8SY72NX4V9": "Principles of UX/UI Design",
  "Q8XS94ONPAGY": "Foundations of DevOps and Git",
  "SG1KDJJN4JLU": "Introduction to Front-End Development",
  "UNDWNN0M0NU7": "Build Automation and Continuous Integration",
  "ZWATD25QO1RP": "Delivering Quality Work with Agility",
};

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
      displayTitle: "Advanced Git and GitHub Practices",
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
      displayTitle: "Introduction to Front-End Development",
      allowDownload: false,
      verificationUrl: "https://www.coursera.org/verify/SG1KDJJN4JLU",
      issuer: "Coursera",
      category: "Coursera",
    },

    // -------------------------------------------------------------
    // Human-Readable Coursera Titles with Official Verification URLs
    // -------------------------------------------------------------
    "Coursera AES78H2QT46A.pdf": {
      displayTitle: "Advanced DevOps Tools and Practices",
      verificationUrl: "https://www.coursera.org/verify/AES78H2QT46A",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera EMP3VL4QSEIE.pdf": {
      displayTitle: "Advanced React",
      verificationUrl: "https://www.coursera.org/verify/EMP3VL4QSEIE",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera FRDMNT5QB896.pdf": {
      displayTitle: "Version Control with Git",
      verificationUrl: "https://www.coursera.org/verify/FRDMNT5QB896",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera G7L4WL2I20DZ.pdf": {
      displayTitle: "React Basics",
      verificationUrl: "https://www.coursera.org/verify/G7L4WL2I20DZ",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera GQNZSX1DWHSL.pdf": {
      displayTitle: "Coding Interview Preparation",
      verificationUrl: "https://www.coursera.org/verify/GQNZSX1DWHSL",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera NR8SY72NX4V9.pdf": {
      displayTitle: "Principles of UX/UI Design",
      verificationUrl: "https://www.coursera.org/verify/NR8SY72NX4V9",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera Q8XS94ONPAGY.pdf": {
      displayTitle: "Foundations of DevOps and Git",
      verificationUrl: "https://www.coursera.org/verify/Q8XS94ONPAGY",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera UNDWNN0M0NU7.pdf": {
      displayTitle: "Build Automation and Continuous Integration",
      verificationUrl: "https://www.coursera.org/verify/UNDWNN0M0NU7",
      allowDownload: true,
      issuer: "Coursera",
    },
    "Coursera ZWATD25QO1RP.pdf": {
      displayTitle: "Delivering Quality Work with Agility",
      verificationUrl: "https://www.coursera.org/verify/ZWATD25QO1RP",
      allowDownload: true,
      issuer: "Coursera",
    },
  },
};
