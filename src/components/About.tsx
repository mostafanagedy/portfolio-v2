"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  MapPin,
  Briefcase,
  Award,
  Download,
  AlertCircle,
  Eye,
} from "lucide-react";
import CvModal from "./CvModal";
import "./About.css";

const cards = [
  {
    icon: Code2,
    label: "MY STACK",
    title: "MERN Stack",
    subtitle: "MongoDB, Express, React, Node.js",
  },
  {
    icon: GraduationCap,
    label: "EDUCATION",
    title: "Sohag University",
    subtitle: "Computer Science - 2023",
  },
  {
    icon: MapPin,
    label: "LOCATION",
    title: "Egypt",
    subtitle: "Cairo, Egypt",
  },
  {
    icon: Briefcase,
    label: "AVAILABILITY",
    title: "Open to Opportunities",
    subtitle: "Freelance & Full-time",
  },
];

export default function About() {
  const [cvNotice, setCvNotice] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  const handleCvClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const res = await fetch("/Mostafa-Nagdy-CV.pdf", { method: "HEAD" });
      if (!res.ok) {
        e.preventDefault();
        setCvNotice(true);
        setTimeout(() => setCvNotice(false), 5500);
      }
    } catch {
      // If network fails or HEAD isn't permitted, let default browser download proceed
    }
  };

  return (
    <section id="about" className="section about-section" aria-label="About Mostafa Nagdy">
      <div className="container about-container">
        {/* Two-Column Hero Layout */}
        <div className="about__layout">
          {/* Left Column: Introduction, Bio, CTA, and 2x2 Grid */}
          <div className="about__left">
            <div className="about__header">
              <span className="about__eyebrow">01 / ABOUT ME</span>
              <h1 className="about__title">
                More Than Just <span className="text-accent">Code.</span>
                <span className="about__title-name">
                  I'm <span className="text-accent">Mostafa Nagedy</span>
                  <span className="sr-only"> (مصطفى نجدي)</span>
                </span>
              </h1>
            </div>

            <p className="about__desc">
              I'm a developer passionate about building modern web experiences, solving problems,
              and continuously improving my technical skills. My work focuses on creating responsive
              interfaces, maintainable applications, and intuitive user experiences while expanding
              my knowledge of full-stack development and cloud technologies.
            </p>

            {/* 3 Call to Action Buttons */}
            <div className="about__cta-container">
              <div className="about__cta-row" role="group" aria-label="About actions">
                {/* Button 1: View My Work (Primary CTA) */}
                <Link
                  href="/projects"
                  className="btn about__cta-btn about__cta-btn--primary"
                  aria-label="View My Work and Portfolio Projects"
                >
                  <Code2 size={16} aria-hidden="true" />
                  <span>View My Work</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>

                {/* Button 2: View My Certificates (Secondary Glass CTA) */}
                <Link
                  href="/certificates"
                  className="btn about__cta-btn about__cta-btn--secondary"
                  aria-label="View My Verified Certificates and Achievements"
                >
                  <Award size={16} aria-hidden="true" />
                  <span>View My Certificates</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>

                {/* Button 3: Preview & Download CV */}
                <div className="about__cv-btn-cluster">
                  <button
                    type="button"
                    className="btn about__cta-btn about__cta-btn--secondary about__cta-btn--cv"
                    onClick={() => setIsCvModalOpen(true)}
                    aria-label="Preview Mostafa Nagdy CV online"
                    title="Preview CV online"
                  >
                    <Eye size={16} aria-hidden="true" />
                    <span>Preview CV</span>
                  </button>
                  <a
                    href="/Mostafa-Nagdy-CV.pdf"
                    download="Mostafa-Nagdy-CV.pdf"
                    className="about__cv-quick-download"
                    onClick={handleCvClick}
                    aria-label="Download Mostafa Nagdy CV (PDF)"
                    title="Download CV (PDF) directly"
                  >
                    <Download size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Informative notice if CV file has not been uploaded yet */}
              {cvNotice && (
                <div className="about__cv-notice" role="status" aria-live="polite">
                  <AlertCircle size={15} />
                  <span>
                    To enable instant download, place your real CV at:{" "}
                    <code>public/Mostafa-Nagdy-CV.pdf</code>
                  </span>
                </div>
              )}
            </div>

            {/* 4 Compact Information Cards (2x2 Grid) */}
            <div className="about__cards-grid">
              {cards.map(({ icon: Icon, label, title, subtitle }) => (
                <div key={label} className="about__card">
                  <div className="about__card-icon-box" aria-hidden="true">
                    <Icon size={18} className="about__card-icon" />
                  </div>
                  <div className="about__card-content">
                    <span className="about__card-label">{label}</span>
                    <h3 className="about__card-title">{title}</h3>
                    <p className="about__card-subtitle">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Large Full-Body Standing Portrait */}
          <div className="about__right">
            <div className="about__portrait-container">
              {/* Handwritten "Always Learning" Badge in Light Mode */}
              <div className="about__badge-learning" aria-hidden="true">
                <span>Always</span>
                <span className="about__badge-sub">Learning</span>
              </div>

              <div className="about__portrait-frame">
                <img
                  src="/images/profile-standing-dark.jpg"
                  alt="Mostafa Nagedy (مصطفى نجدي) — MERN Stack Developer"
                  className="about__portrait-img about__portrait-img--dark"
                  loading="eager"
                  width="440"
                  height="580"
                />
                <img
                  src="/images/profile-standing-light.jpg"
                  alt="Mostafa Nagedy (مصطفى نجدي) — Full Stack Developer"
                  className="about__portrait-img about__portrait-img--light"
                  loading="eager"
                  width="440"
                  height="580"
                />
                <div className="about__portrait-border-glow" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Slim Footer beneath the main section */}
        <div className="about__slim-footer">
          <div className="about__quote">
            <span className="about__quote-bar" aria-hidden="true" />
            <blockquote className="about__quote-text">
              “Turning ideas into real world applications.”
            </blockquote>
          </div>

          <div className="about__signature" aria-label="Handwritten signature: Mostafa Nagdy">
            <span className="about__signature-text">Mostafa Nagdy</span>
            <span className="about__signature-underline" aria-hidden="true" />
          </div>
        </div>
      </div>
      {/* Interactive CV Quick Preview Modal */}
      <CvModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />
    </section>
  );
}
