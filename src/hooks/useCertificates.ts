"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CertificateItem, CertificateCategory, CertificatesResponse } from "../types/certificate";

export type CertificateSortOption = "name-asc" | "name-desc" | "size-desc";

export function useCertificates() {
  const [data, setData] = useState<CertificatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>("All");
  const [sortBy, setSortBy] = useState<CertificateSortOption>("name-asc");

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

  const filteredCertificates = useMemo(() => {
    if (!data?.certificates) return [];

    let list = [...data.certificates];

    // Filter by Category
    if (selectedCategory !== "All") {
      list = list.filter((item) => item.category === selectedCategory);
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
      if (sortBy === "size-desc") {
        return b.sizeBytes - a.sizeBytes;
      }
      return 0;
    });

    return list;
  }, [data, selectedCategory, searchQuery, sortBy]);

  return {
    certificates: filteredCertificates,
    allCertificates: data?.certificates || [],
    totalCount: data?.total || 0,
    categories: data?.categories || ["All", "LinkedIn Learning", "Coursera", "Workshops & Training"],
    loading,
    refreshing,
    error,
    cachedAt: data?.cachedAt,
    sourceRepo: data?.sourceRepo || "https://github.com/mostafanagedy/my_Certificates",
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    refresh: () => loadCertificates(true),
    retry: () => loadCertificates(false),
  };
}
