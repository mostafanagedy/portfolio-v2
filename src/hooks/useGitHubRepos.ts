"use client";

import { useState, useEffect, useCallback } from "react";
import { CuratedGitHubRepo, GitHubReposResponse } from "../types/github";

const CLIENT_CACHE_KEY = "mn_github_repos_v3";

export function useGitHubRepos() {
  const [repos, setRepos] = useState<CuratedGitHubRepo[]>([]);
  const [featuredRepos, setFeaturedRepos] = useState<CuratedGitHubRepo[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [cacheExpiresAt, setCacheExpiresAt] = useState<string | null>(null);

  const fetchRepos = useCallback(async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      // Check client sessionStorage first for instantaneous UI rendering
      if (typeof window !== "undefined") {
        try {
          const cached = sessionStorage.getItem(CLIENT_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached) as GitHubReposResponse;
            if (Array.isArray(parsed.repos) && parsed.repos.length > 0) {
              setRepos(parsed.repos);
              setFeaturedRepos(parsed.featuredRepos || []);
              setTotalCount(parsed.totalCount || parsed.repos.length);
              setLastUpdated(parsed.cachedAt || null);
              setCacheExpiresAt(parsed.cacheExpiresAt || null);
              setIsLoading(false);
            }
          }
        } catch {
          // sessionStorage read error ignored
        }
      }
    }

    try {
      setError(null);
      const url = isManualRefresh ? "/api/github/repos?refresh=1" : "/api/github/repos";
      const response = await fetch(url);

      const data: GitHubReposResponse = await response.json();

      if (!response.ok && (!data.repos || data.repos.length === 0)) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      setRepos(data.repos || []);
      setFeaturedRepos(data.featuredRepos || []);
      setTotalCount(data.totalCount || data.repos?.length || 0);
      setLastUpdated(data.cachedAt || new Date().toISOString());
      setCacheExpiresAt(data.cacheExpiresAt || null);
      setIsRateLimited(Boolean(data.isRateLimited));

      if (data.error && data.repos?.length) {
        console.warn("GitHub API notice:", data.error);
      }

      // Save to client cache
      if (typeof window !== "undefined" && data.repos?.length > 0) {
        try {
          sessionStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(data));
        } catch {
          // sessionStorage quota exceeded or disabled
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch GitHub repos:", err);
      // Only show error UI if we don't have any cached repos displayed
      setRepos((prev) => {
        if (prev.length === 0) {
          setError(
            err?.message ||
              "Failed to load GitHub repositories. Please check your connection and try again."
          );
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos(false);
  }, [fetchRepos]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    fetchRepos(true);
  }, [fetchRepos]);

  const handleRefresh = useCallback(() => {
    fetchRepos(true);
  }, [fetchRepos]);

  return {
    repos,
    featuredRepos,
    totalCount,
    isLoading,
    isRefreshing,
    error,
    isRateLimited,
    lastUpdated,
    cacheExpiresAt,
    refresh: handleRefresh,
    retry: handleRetry,
  };
}
