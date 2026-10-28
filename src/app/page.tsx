"use client";

import React from "react";
import Hero from "../components/Hero";
import StatsPanel from "../components/StatsPanel";
import ProfileSidebar from "../components/ProfileSidebar";
import "./page.css";

export default function HomePage() {
  return (
    <div className="home-view">
      {/* Cinematic Full-Screen Workspace Background with Dark Overlay */}
      <div className="home-ambient-bg" aria-hidden="true" />

      <div className="container home-container">
        {/* Top: Hero & Profile Sidebar Grid */}
        <section className="home-main-section" aria-label="Developer Introduction and Overview">
          <div className="hero-main-area">
            <Hero />
          </div>

          {/* Desktop & Mobile Quick-Access Sidebar */}
          <div className="hero-sidebar-area">
            <ProfileSidebar />
          </div>
        </section>

        {/* Bottom: Anchored Stats & Opportunities Panel */}
        <div className="home-stats-area">
          <StatsPanel />
        </div>
      </div>
    </div>
  );
}
