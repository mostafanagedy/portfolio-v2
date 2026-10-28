"use client";

import React from "react";
import { Code2, Server, Database, Cloud, Wrench } from "lucide-react";
import { BrandIcons } from "./TechIcons";
import "./Skills.css";

interface SkillCategory {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  skills: {
    name: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      { name: "React", Icon: BrandIcons.React },
      { name: "Angular", Icon: BrandIcons.Angular },
      { name: "TypeScript", Icon: BrandIcons.TypeScript },
      { name: "JavaScript", Icon: BrandIcons.JavaScript },
      { name: "HTML5", Icon: BrandIcons.HTML5 },
      { name: "CSS3", Icon: BrandIcons.CSS3 },
      { name: "Tailwind", Icon: BrandIcons.Tailwind },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", Icon: BrandIcons.Nodejs },
      { name: "Express", Icon: BrandIcons.Express },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    skills: [
      { name: "MongoDB", Icon: BrandIcons.MongoDB },
      { name: "SQL", Icon: BrandIcons.SQL },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    skills: [
      { name: "AWS", Icon: BrandIcons.AWS },
      { name: "Docker", Icon: BrandIcons.Docker },
      { name: "Git", Icon: BrandIcons.Git },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: [
      { name: "VS Code", Icon: BrandIcons.VSCode },
      { name: "GitHub", Icon: BrandIcons.GitHub },
      { name: "Figma", Icon: BrandIcons.Figma },
      { name: "Postman", Icon: BrandIcons.Postman },
      { name: "Linux", Icon: BrandIcons.Linux },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section skills-section" aria-label="Tech Stack and Skills">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">
            <span className="icon-accent">
              <Code2 size={22} />
            </span>
            Tech Stack &amp; Skills
          </h2>
          <p className="section__subtitle">Technologies and tools I work with</p>
        </div>

        <div className="skills-categories-grid">
          {skillCategories.map(({ title, icon: IconComponent, skills }) => (
            <div key={title} className="skills-category-card">
              <div className="skills-category-header">
                <div className="skills-category-icon" aria-hidden="true">
                  <IconComponent size={18} />
                </div>
                <h3 className="skills-category-title">{title}</h3>
                <span className="skills-category-count">{skills.length}</span>
              </div>

              <div className="skills-category-items">
                {skills.map(({ name, Icon }) => (
                  <div key={name} className="skill-badge" title={name}>
                    <div className="skill-badge__icon" aria-hidden="true">
                      <Icon size={24} />
                    </div>
                    <span className="skill-badge__label">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
