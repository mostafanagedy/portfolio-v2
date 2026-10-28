"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CertificateItem, CertificateCategory, CertificatesResponse } from "../types/certificate";

export type CertificateSortOption = "name-asc" | "name-desc" | "date-desc" | "size-desc";
export type CertificateViewMode = "grid" | "list";

const INITIAL_PAGE_SIZE = 9;

export function useCertificates() {
  const [data, setData] = useState<CertificatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>("All");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("All Issuers");
  const [sortBy, setSortBy] = useState<CertificateSortOption>("name-asc");
  const [viewMode, setViewMode] = useState<CertificateViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);

  const loadCertificates = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const url = forceRefresh ? "/api/certificates?refresh=true" : "/api/certificates";
      const res = await fetch(url, {
        cache: forceRefresh ? "no-store" : "default",
      });

      if (!res.ok) {
        throw new Error(`Failed to load certificates (HTTP ${res.status})`);
      }

      const json: CertificatesResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error("[useCertificates] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to load certificates.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates(false);
  }, [loadCertificates]);

  // Reset visibleCount when search or filters change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [searchQuery, selectedCategory, selectedIssuer, sortBy]);

  const filteredCertificates = useMemo(() => {
    if (!data?.certificates) return [];

    let list = [...data.certificates];

    // Filter by Category
    if (selectedCategory !== "All") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Filter by Issuer
    if (selectedIssuer !== "All Issuers") {
      list = list.filter((item) => item.issuer === selectedIssuer);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.issuer.toLowerCase().includes(q) ||
          item.filename.toLowerCase().includes(q) ||
          (item.credentialId && item.credentialId.toLowerCase().includes(q)) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "name-desc") {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === "date-desc") {
        const dateA = a.issueDate ? new Date(a.issueDate).getTime() || 0 : 0;
        const dateB = b.issueDate ? new Date(b.issueDate).getTime() || 0 : 0;
        return dateB - dateA;
      }
      if (sortBy === "size-desc") {
        return b.sizeBytes - a.sizeBytes;
      }
      return 0;
    });

    return list;
  }, [data, selectedCategory, selectedIssuer, searchQuery, sortBy]);

  const paginatedCertificates = useMemo(() => {
    return filteredCertificates.slice(0, visibleCount);
  }, [filteredCertificates, visibleCount]);

  const hasMore = visibleCount < filteredCertificates.length;
  const remainingCount = Math.max(0, filteredCertificates.length - visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + INITIAL_PAGE_SIZE);
  };

  const showAll = () => {
    setVisibleCount(filteredCertificates.length);
  };

  return {
    certificates: paginatedCertificates,
    allFilteredCertificates: filteredCertificates,
    featuredCertificates: data?.featuredCertificates || [],
    allCertificates: data?.certificates || [],
    totalCount: data?.total || 0,
    categories: data?.categories || ["All", "LinkedIn Learning", "Coursera", "Workshops & Training"],
    issuers: data?.issuers || ["All Issuers"],
    loading,
    refreshing,
    error,
    cachedAt: data?.cachedAt,
    sourceRepo: data?.sourceRepo || "https://github.com/mostafanagedy/my_Certificates",
    requestedRepo: data?.requestedRepo || "https://github.com/mostafanagedy/my_Certificates",
    repoNote: data?.repoNote,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedIssuer,
    setSelectedIssuer,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    hasMore,
    remainingCount,
    showAll,
    loadMore,
    refresh: () => loadCertificates(true),
    retry: () => loadCertificates(false),
  };
}
