"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { BrandIcons } from "./TechIcons";
import "./Hero.css";

interface HeroProps {
  onViewProjects?: () => void;
  onContact?: () => void;
}

const techHighlights = [
  { name: "React", Icon: BrandIcons.React },
  { name: "Angular", Icon: BrandIcons.Angular },
  { name: "Node.js", Icon: BrandIcons.Nodejs },
  { name: "MongoDB", Icon: BrandIcons.MongoDB },
  { name: "AWS", Icon: BrandIcons.AWS },
];

export default function Hero({ onViewProjects, onContact }: HeroProps) {
  return (
    <section id="home" className="hero" aria-label="Hero section">
      <div className="hero__container">
        {/* Left Column (Text & Intro) */}
        <div className="hero__content">
          <p className="hero__greeting animate-fade-in-right" style={{ animationDelay: "0.1s" }}>
            <span aria-hidden="true">👋</span> Hello, I'm
          </p>

          <h1
            className="hero__name animate-fade-in-right"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="hero__name-primary">Mostafa</span>{" "}
            <span className="hero__name-accent">Nagdy</span>
          </h1>

          <p
            className="hero__title animate-fade-in-right"
            style={{ animationDelay: "0.3s" }}
          >
            MERN Stack | Front-End Developer
          </p>

          <p
            className="hero__specialization animate-fade-in-right"
            style={{ animationDelay: "0.35s" }}
          >
            React + Angular + AWS
          </p>

          <p
            className="hero__description animate-fade-in-right"
            style={{ animationDelay: "0.45s" }}
          >
            I build modern web applications with clean code, great user experiences,
            and scalable architecture. Always learning, always building.
          </p>

          {/* Desktop CTAs */}
          <div
            className="hero__ctas hero__ctas--desktop animate-fade-in-right"
            style={{ animationDelay: "0.55s" }}
          >
            <Link
              href="/projects"
              className="btn btn--primary hero__btn-primary"
              onClick={onViewProjects}
              aria-label="View My Projects page"
            >
              <span>View My Projects</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="btn btn--secondary hero__btn-secondary"
              onClick={onContact}
              aria-label="Navigate to Contact page"
            >
              <span>Let's Connect</span>
              <ExternalLink size={15} />
            </Link>
          </div>

          {/* Desktop Technology Highlights Row */}
          <div
            className="hero__tech hero__tech--desktop animate-fade-in-right"
            style={{ animationDelay: "0.65s" }}
            aria-label="Core technologies"
          >
            {techHighlights.map(({ name, Icon }) => (
              <div key={name} className="hero__tech-item">
                <div className="hero__tech-icon-box" aria-hidden="true">
                  <Icon size={26} />
                </div>
                <span className="hero__tech-label">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Media & Visual Section */}
        <div className="hero__portrait-wrap animate-fade-in-left" style={{ animationDelay: "0.3s" }}>
          {/* Desktop: Cinematic Workspace Studio Frame */}
          <div className="hero__workspace-frame hero__workspace-frame--desktop">
            <img
              src="/images/workspace-studio.webp"
              alt="Mostafa Nagdy in his cinematic developer workspace"
              className="hero__workspace-img"
              width="735"
              height="520"
              fetchPriority="high"
            />
            <div className="hero__workspace-lighting" aria-hidden="true" />
          </div>

          {/* Mobile Visual Container: Portrait + Centered CTAs Under Image */}
          <div className="hero__mobile-visual">
            <div className="hero__mobile-frame">
              <img
                src="/images/mostafa-nagdy.webp"
                alt="Mostafa Nagdy"
                className="hero__mobile-img"
                width="200"
                height="200"
              />
              <div className="hero__mobile-glow" aria-hidden="true" />
              <div className="hero__mobile-badge">
                <span className="hero__mobile-dot" />
                <span>Available</span>
              </div>
            </div>

            {/* Mobile CTAs: Centered Directly Beneath The Image */}
            <div className="hero__ctas hero__ctas--mobile" aria-label="Quick Actions">
              <Link
                href="/projects"
                className="btn btn--primary hero__btn-primary hero__btn-primary--mobile"
                onClick={onViewProjects}
                aria-label="View My Projects page"
              >
                <span>View My Projects</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="btn btn--secondary hero__btn-secondary hero__btn-secondary--mobile"
                onClick={onContact}
                aria-label="Navigate to Contact page"
              >
                <span>Let's Connect</span>
                <ExternalLink size={13} />
              </Link>
            </div>

            {/* Mobile Technology Highlights Row */}
            <div
              className="hero__tech hero__tech--mobile"
              aria-label="Core technologies"
            >
              {techHighlights.map(({ name, Icon }) => (
                <div key={name} className="hero__tech-item">
                  <div className="hero__tech-icon-box" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <span className="hero__tech-label">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
