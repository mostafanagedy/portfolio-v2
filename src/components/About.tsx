import Link from "next/link";
import { ArrowUpRight, Code, GraduationCap, MapPin, Briefcase } from "lucide-react";
import "./About.css";

const cards = [
  {
    icon: Code,
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
    label: "STATUS",
    title: "Open to Opportunities",
    subtitle: "Freelance / Full-time",
  },
];

export default function About() {
  return (
    <section id="about" className="section about-section" aria-label="About Mostafa Nagdy">
      <div className="container about-container">
        <div className="about__layout">
          {/* Left Column: Bio & Info Grid */}
          <div className="about__left">
            <div className="about__header">
              <span className="about__eyebrow">01 / ABOUT ME</span>
              <h1 className="about__title">
                More Than Just <span className="text-accent">Code.</span>
                <span className="about__title-name">
                  I'm <span className="text-accent">Mostafa Nagdy</span>
                </span>
              </h1>
            </div>

            <p className="about__desc">
              I'm a developer passionate about building modern web experiences, solving problems,
              and continuously improving my technical skills. My work focuses on creating responsive
              interfaces, maintainable applications, and intuitive user experiences while expanding
              my knowledge of full-stack development and cloud technologies.
            </p>

            <div className="about__cta-row">
              <Link href="/projects" className="btn btn--primary about__cta-btn">
                <span>Explore My Work</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>

            {/* 4 Cards (2x2 Grid) */}
            <div className="about__cards-grid">
              {cards.map(({ icon: Icon, label, title, subtitle }) => (
                <div key={label} className="about__card">
                  <div className="about__card-icon-box" aria-hidden="true">
                    <Icon size={20} className="about__card-icon" />
                  </div>
                  <div className="about__card-content">
                    <span className="about__card-label">{label}</span>
                    <h3 className="about__card-title">{title}</h3>
                    <p className="about__card-subtitle">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quote & Signature */}
            <div className="about__footer-row">
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

          {/* Right Column: Hero Portrait */}
          <div className="about__right">
            <div className="about__portrait-container">
              {/* Light Mode Handwritten Badge */}
              <div className="about__badge-learning" aria-hidden="true">
                <span>Always</span>
                <span className="about__badge-sub">Learning</span>
              </div>

              <div className="about__portrait-frame">
                <img
                  src="/images/profile-standing-dark.jpg"
                  alt="Mostafa Nagdy — MERN Stack Developer (Dark Mode)"
                  className="about__portrait-img about__portrait-img--dark"
                  loading="lazy"
                  width="440"
                  height="520"
                />
                <img
                  src="/images/profile-standing-light.jpg"
                  alt="Mostafa Nagdy — MERN Stack Developer (Light Mode)"
                  className="about__portrait-img about__portrait-img--light"
                  loading="lazy"
                  width="440"
                  height="520"
                />
                <div className="about__portrait-border-glow" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
