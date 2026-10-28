"use client";

import React, { useEffect, useState } from "react";
import { Eye, Users, Target } from "lucide-react";
import "./StatsPanel.css";

interface StatsData {
  views: number;
  formattedViews: string;
  githubViews: number;
  siteViews: number;
  followers: number;
  formattedFollowers: string;
  publicRepos: number;
  formattedRepos: string;
}

export default function StatsPanel() {
  const [stats, setStats] = useState<StatsData>({
    views: 402,
    formattedViews: "402+",
    githubViews: 254,
    siteViews: 148,
    followers: 15,
    formattedFollowers: "15+",
    publicRepos: 32,
    formattedRepos: "32+",
  });
  const [displayViews, setDisplayViews] = useState<number>(0);
  const [displayFollowers, setDisplayFollowers] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveStats() {
      try {
        // Track unique visit per browser session
        const hasTracked = typeof window !== "undefined" && sessionStorage.getItem("mn_site_tracked");
        const url = hasTracked ? "/api/stats" : "/api/stats?track=1";
        if (typeof window !== "undefined") {
          sessionStorage.setItem("mn_site_tracked", "1");
        }

        const res = await fetch(url);
        if (!res.ok) return;
        const data: StatsData = await res.json();
        if (isMounted) {
          setStats(data);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load real stats:", err);
        if (isMounted) setIsLoaded(true);
      }
    }

    fetchLiveStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth Count-Up Animation when live data is fetched
  useEffect(() => {
    if (!isLoaded) return;

    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const targetViews = stats.views;
    const targetFollowers = stats.followers;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayViews(Math.round(targetViews * eased));
      setDisplayFollowers(Math.round(targetFollowers * eased));

      if (currentStep >= steps) {
        setDisplayViews(targetViews);
        setDisplayFollowers(targetFollowers);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isLoaded, stats.views, stats.followers]);

  const viewCountString = isLoaded ? `${displayViews}+` : stats.formattedViews;
  const followersCountString = isLoaded ? `${displayFollowers}+` : stats.formattedFollowers;

  return (
    <div className="stats-panel" aria-label="Professional stats and availability">
      <div className="stats-panel__card">
        {/* Stats list */}
        <div className="stats-panel__items">
          {/* Total Views (Combined GitHub Views + Website Views) */}
          <div
            className="stats-panel__item"
            title={`Total Views: ${stats.views} (GitHub: ${stats.githubViews} + Website: ${stats.siteViews})`}
          >
            <div className="stats-panel__icon-box">
              <Eye size={18} className="stats-panel__icon" />
            </div>
            <div className="stats-panel__text">
              <div className="stats-panel__label-row">
                <span className="stats-panel__label">Total Views</span>
                <span className="stats-live-badge">
                  <span className="stats-live-dot" />
                  Live
                </span>
              </div>
              <span className="stats-panel__val">{viewCountString}</span>
              <span className="stats-panel__subtext">GitHub &amp; Website</span>
            </div>
          </div>

          {/* GitHub Followers (Real Live Count) */}
          <a
            href="https://github.com/mostafanagedy"
            target="_blank"
            rel="noopener noreferrer"
            className="stats-panel__item stats-panel__item--link"
            title="Follow Mostafa on GitHub"
          >
            <div className="stats-panel__icon-box">
              <Users size={18} className="stats-panel__icon" />
            </div>
            <div className="stats-panel__text">
              <span className="stats-panel__label">Followers</span>
              <span className="stats-panel__val">{followersCountString}</span>
              <span className="stats-panel__subtext">GitHub Community</span>
            </div>
          </a>

          {/* Focus */}
          <div className="stats-panel__item" title="Primary Technical Focus">
            <div className="stats-panel__icon-box">
              <Target size={18} className="stats-panel__icon" />
            </div>
            <div className="stats-panel__text">
              <span className="stats-panel__label">Focus</span>
              <span className="stats-panel__val">Clean Code &amp; Scalability</span>
              <span className="stats-panel__subtext">Full Stack Architecture</span>
            </div>
          </div>
        </div>

        {/* Right side: Slanted script text in warm gold */}
        <div className="stats-panel__opportunity">
          <span className="stats-panel__script">Open to Opportunities</span>
        </div>
      </div>
    </div>
  );
}
