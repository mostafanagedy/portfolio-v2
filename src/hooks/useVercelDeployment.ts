"use client";

import { useState, useEffect, useCallback } from "react";
import { VercelDeploymentResponse } from "../types/vercel";

interface UseVercelDeploymentProps {
  repoName: string;
  slug?: string;
  homepageUrl?: string | null;
}

export function useVercelDeployment({
  repoName,
  slug,
  homepageUrl,
}: UseVercelDeploymentProps) {
  const [data, setData] = useState<VercelDeploymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeployment = useCallback(
    async (isManualRefresh: boolean = false) => {
      if (!repoName) return;

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const params = new URLSearchParams({ repo: repoName });
        if (slug) params.append("slug", slug);
        if (homepageUrl) params.append("homepage", homepageUrl);
        if (isManualRefresh) params.append("refresh", "1");

        const res = await fetch(`/api/vercel/deployment?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const json: VercelDeploymentResponse = await res.json();
        setData(json);
      } catch (err: any) {
        console.warn("Failed to retrieve Vercel deployment status:", err);
        setError(err?.message || "Unable to retrieve deployment status.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [repoName, slug, homepageUrl]
  );

  useEffect(() => {
    fetchDeployment(false);
  }, [fetchDeployment]);

  const handleRefresh = useCallback(() => {
    fetchDeployment(true);
  }, [fetchDeployment]);

  return {
    data,
    deployment: data?.deployment,
    isConfigured: Boolean(data?.isConfigured),
    hasDeployment: Boolean(data?.hasDeployment),
    isLoading,
    isRefreshing,
    error,
    refresh: handleRefresh,
  };
}
