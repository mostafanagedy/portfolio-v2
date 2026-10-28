"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import NajdiLogo from "./NajdiLogo";
import { BrandIcons } from "./TechIcons";
import { socialLinks, freelancePlatforms, followUsOn } from "../data/socialLinks";
import "./Navbar.css";

interface NavbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export const navRoutes = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`} role="banner">
      <div className="container navbar__inner">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="navbar__brand"
          aria-label="Mostafa Nagdy — Return to Home"
          onClick={() => setMenuOpen(false)}
        >
          <NajdiLogo width={40} height={40} className="najdi-logo__icon" />
          <span className="navbar__name">Mostafa Nagdy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__links">
            {navRoutes.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`navbar__link${active ? " navbar__link--active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions: Theme Toggle & Mobile Menu */}
        <div className="navbar__actions">
          <button
            type="button"
            className={`navbar__theme-toggle${
              theme === "dark" ? " navbar__theme-toggle--dark" : " navbar__theme-toggle--light"
            }`}
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            suppressHydrationWarning
          >
            {/* Sun slot — LEFT (active in dark mode) */}
            <span className="navbar__theme-icon navbar__theme-icon--sun" aria-hidden="true">
              <Sun size={12} strokeWidth={2.5} />
            </span>
            {/* Moon slot — RIGHT (active in light mode) */}
            <span className="navbar__theme-icon navbar__theme-icon--moon" aria-hidden="true">
              <Moon size={12} strokeWidth={2.5} />
            </span>
            {/* Sliding glowing thumb */}
            <span className="navbar__theme-thumb" aria-hidden="true">
              {theme === "dark"
                ? <Moon size={12} strokeWidth={2.5} />
                : <Sun size={12} strokeWidth={2.5} />
              }
            </span>
          </button>

          <button
            type="button"
            className="navbar__menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphic Hub) */}
      {menuOpen && (
        <div className="navbar__mobile-overlay" onClick={() => setMenuOpen(false)}>
          <nav
            className="navbar__mobile-menu"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            {/* Nav Route Links */}
            <ul className="navbar__mobile-links">
              {navRoutes.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`navbar__mobile-link${
                        active ? " navbar__mobile-link--active" : ""
                      }`}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Quick Social Media Bar */}
            <div className="navbar__mobile-social-section">
              <span className="navbar__mobile-section-label">Follow Us On</span>
              <div className="navbar__mobile-social-grid">
                {followUsOn.map((item) => {
                  const Icon = BrandIcons[item.iconKey];
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`navbar__mobile-social-btn navbar__mobile-social-btn--${item.name.toLowerCase()}`}
                      title={item.name}
                      aria-label={item.name}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__mobile-social-btn navbar__mobile-social-btn--whatsapp"
                  title="WhatsApp (@Nagedy)"
                  aria-label="WhatsApp"
                >
                  <BrandIcons.WhatsApp size={16} />
                </a>
              </div>
            </div>

            {/* Quick Freelance Platforms Bar */}
            <div className="navbar__mobile-platforms-section">
              <span className="navbar__mobile-section-label">Hire via Platforms</span>
              <div className="navbar__mobile-platforms-grid">
                {freelancePlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navbar__mobile-platform-tag"
                  >
                    <span>{platform.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
