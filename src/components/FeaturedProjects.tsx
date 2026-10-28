"use client";

import React, { useState, useMemo } from "react";
import { Folder, ExternalLink, ArrowRight, Layers } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { projects, Project } from "../data/projects";
import "./FeaturedProjects.css";

type CategoryFilter = "All" | "Frontend" | "Full Stack" | "E-commerce";

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "All", label: "All Projects" },
  { id: "Frontend", label: "Frontend" },
  { id: "Full Stack", label: "Full Stack" },
  { id: "E-commerce", label: "E-commerce" },
];

export default function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.categories.includes(activeCategory));
  }, [activeCategory]);

  const getCategoryCount = (cat: CategoryFilter) => {
    if (cat === "All") return projects.length;
    return projects.filter((p) => p.categories.includes(cat)).length;
  };

  return (
    <div className="fp-page-wrapper">
      <div className="container fp-container">
        <section id="projects" className="fp-section" aria-label="Featured projects">
          {/* Section Header */}
          <div className="section__header fp-header">
            <div className="fp-header__left">
              <span className="fp-eyebrow">PORTFOLIO</span>
              <h1 className="section__title fp-title">
                <span className="icon-accent" aria-hidden="true">
                  <Folder size={24} />
                </span>
                Featured <span className="text-accent">Projects</span>
              </h1>
              <div className="fp-title-bar" aria-hidden="true" />
              <p className="section__subtitle fp-subtitle">
                A showcase of modern web applications, e-commerce platforms, and interactive digital experiences.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="fp-filters" role="tablist" aria-label="Filter projects by category">
              {CATEGORIES.map(({ id, label }) => {
                const isActive = activeCategory === id;
                const count = getCategoryCount(id);
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="projects-grid"
                    className={`fp-filter-btn ${isActive ? "fp-filter-btn--active" : ""}`}
                    onClick={() => setActiveCategory(id)}
                  >
                    <span>{label}</span>
                    <span className="fp-filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div id="projects-grid" className="fp-grid" role="region" aria-label="Projects list">
              {filteredProjects.map((p) => (
                <article key={p.id} className="fp-card">
                  {/* Screenshot Preview with consistent 16:9 ratio */}
                  <div className="fp-card__thumb-box">
                    <img
                      src={p.image}
                      alt={`${p.title} preview screenshot`}
                      className="fp-card__thumb-img"
                      loading="lazy"
                      width="640"
                      height="360"
                    />
                    <div className="fp-card__thumb-overlay" />
                    
                    {/* Primary category badge */}
                    <span className="fp-card__badge">
                      {p.categories[0]}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="fp-card__content">
                    <div className="fp-card__title-row">
                      <h2 className="fp-card__title">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fp-card__link"
                        >
                          <span>{p.title}</span>
                          <ExternalLink size={15} className="fp-card__ext-icon" aria-hidden="true" />
                        </a>
                      </h2>
                    </div>

                    <p className="fp-card__desc">{p.description}</p>

                    {/* Technology Badges */}
                    <div className="fp-card__tags" aria-label="Technologies used">
                      {p.tags.map((tag) => (
                        <span key={tag} className="fp-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons: Live Demo + GitHub Source */}
                    <div className="fp-card__actions">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fp-card__demo-btn"
                        aria-label={`Open Live Demo for ${p.title}`}
                      >
                        <span>Live Demo</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>

                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fp-card__repo-btn"
                          aria-label={`View Source Code for ${p.title} on GitHub`}
                          title="View on GitHub"
                        >
                          <GitHubIcon size={15} />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="fp-empty-state" role="status">
              <div className="fp-empty-state__icon">
                <Layers size={36} />
              </div>
              <h3 className="fp-empty-state__title">No projects found in this category</h3>
              <p className="fp-empty-state__desc">
                Currently no projects match "{activeCategory}". Feel free to explore other categories or view all projects.
              </p>
              <button
                type="button"
                className="btn btn--primary fp-empty-state__reset"
                onClick={() => setActiveCategory("All")}
              >
                <span>View All Projects</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
