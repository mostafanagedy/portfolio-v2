export type VercelDeploymentState =
  | "READY"
  | "BUILDING"
  | "ERROR"
  | "CANCELED"
  | "QUEUED"
  | "INITIALIZING";

export interface VercelCommitInfo {
  message?: string;
  sha?: string;
  shortSha?: string;
  branch?: string;
  author?: string;
  commitUrl?: string;
}

export interface VercelDeploymentInfo {
  id: string;
  name: string;
  url: string;
  state: VercelDeploymentState;
  target: "production" | "preview" | string;
  createdAt: number;
  formattedDate: string;
  creator?: {
    username?: string;
  };
  commit?: VercelCommitInfo;
  inspectorUrl?: string;
}

export interface VercelDeploymentResponse {
  isConfigured: boolean;
  hasDeployment: boolean;
  deployment?: VercelDeploymentInfo;
  projectName?: string;
  detectedDomain?: string;
  statusMessage?: string;
  error?: string;
  cachedAt?: string;
  source: "live" | "cache" | "unconfigured" | "not_found" | "error";
}
