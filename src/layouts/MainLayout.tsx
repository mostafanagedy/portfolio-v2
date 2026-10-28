"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isContact = pathname === "/contact";
  const isFixedViewport = isHome || isContact;
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Read existing theme from attribute (pre-set by anti-flicker script) or localStorage
    const savedTheme = localStorage.getItem("mn_theme") as "dark" | "light" | null;
    const currentAttr = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    
    let resolvedTheme: "dark" | "light" = "dark";
    if (savedTheme === "dark" || savedTheme === "light") {
      resolvedTheme = savedTheme;
    } else if (currentAttr === "dark" || currentAttr === "light") {
      resolvedTheme = currentAttr;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolvedTheme = prefersDark ? "dark" : "light";
    }

    setTheme(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;

    // Listen for OS theme changes if user hasn't explicitly saved a choice
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const userSaved = localStorage.getItem("mn_theme");
      if (!userSaved) {
        const sysTheme = e.matches ? "dark" : "light";
        setTheme(sysTheme);
        document.documentElement.setAttribute("data-theme", sysTheme);
        document.documentElement.style.colorScheme = sysTheme;
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  useEffect(() => {
    if (isFixedViewport) {
      document.documentElement.classList.add("no-scroll-fixed");
      document.body.classList.add("no-scroll-fixed");
      if (isHome) {
        document.documentElement.classList.add("no-scroll-home");
        document.body.classList.add("no-scroll-home");
      }
      if (isContact) {
        document.documentElement.classList.add("no-scroll-contact");
        document.body.classList.add("no-scroll-contact");
      }
    } else {
      document.documentElement.classList.remove("no-scroll-fixed", "no-scroll-home", "no-scroll-contact");
      document.body.classList.remove("no-scroll-fixed", "no-scroll-home", "no-scroll-contact");
    }
    return () => {
      document.documentElement.classList.remove("no-scroll-fixed", "no-scroll-home", "no-scroll-contact");
      document.body.classList.remove("no-scroll-fixed", "no-scroll-home", "no-scroll-contact");
    };
  }, [isFixedViewport, isHome, isContact]);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    try {
      localStorage.setItem("mn_theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.style.colorScheme = newTheme;
      
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute("content", newTheme === "dark" ? "#080B0F" : "#F5F7FA");
      }
    } catch (e) {}
  };

  return (
    <div className={`portfolio-app-shell ${isHome ? "portfolio-app-shell--home" : ""} ${isContact ? "portfolio-app-shell--contact" : ""}`}>
      {/* Global Cinematic Studio Workspace Ambient Background with Dark Overlay */}
      <div className="portfolio-ambient-bg" aria-hidden="true" />

      {/* Skip to Content for Accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Shared Persistent Navbar */}
      <Navbar theme={theme} onThemeToggle={handleThemeToggle} />

      {/* Dynamic Main View Outlet */}
      <main id="main-content" className="portfolio-main-outlet" role="main">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Shared Persistent Footer */}
      <Footer />
    </div>
  );
}
