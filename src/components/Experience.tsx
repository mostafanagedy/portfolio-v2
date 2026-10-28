import { Briefcase, Code, Layers, GraduationCap } from "lucide-react";
import "./Experience.css";

const timeline = [
  {
    icon: Code,
    period: "2022 – Present",
    title: "MERN Stack Developer",
    org: "Freelance & Personal Projects",
    type: "work",
    details: [
      "Built full-stack web applications using React, Node.js, Express, and MongoDB",
      "Developed responsive, accessible UIs with modern CSS and component libraries",
      "Integrated RESTful APIs and implemented authentication flows",
      "Deployed applications to Vercel and explored AWS infrastructure",
    ],
  },
  {
    icon: Layers,
    period: "2023 – Present",
    title: "Frontend Specialist",
    org: "Freelance Platforms (Nafezly, Mostaql, Upwork)",
    type: "work",
    details: [
      "Delivered client projects with React and Angular",
      "Worked on e-commerce UIs, landing pages, and portfolio sites",
      "Focused on clean code, performance, and pixel-perfect implementation",
    ],
  },
  {
    icon: Briefcase,
    period: "2023 – Present",
    title: "Learning React Advanced Patterns & AWS",
    org: "Self-Directed Learning",
    type: "learning",
    details: [
      "Deep-diving into React architecture, context, and performance optimization",
      "Exploring Angular framework for enterprise-grade frontend applications",
      "Studying AWS fundamentals — EC2, S3, CloudFront, and Lambda",
      "Practicing system design principles and scalable application architecture",
    ],
  },
  {
    icon: GraduationCap,
    period: "2019 – 2023",
    title: "Bachelor's Degree",
    org: "Sohag University, Egypt",
    type: "education",
    details: [
      "Graduated 2023",
      "Built a solid foundation in computer science fundamentals",
      "Developed strong problem-solving skills applied to web development",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">
            <span className="icon-accent">
              <Briefcase size={22} />
            </span>
            Experience &amp; Learning
          </h2>
          <p className="section__subtitle">My journey as a developer</p>
        </div>

        <div className="timeline">
          {timeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`timeline__item timeline__item--${item.type}`}
              >
                <div className="timeline__icon-col">
                  <div className="timeline__icon">
                    <Icon size={18} />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="timeline__connector" aria-hidden="true" />
                  )}
                </div>

                <div className="timeline__card">
                  <div className="timeline__card-header">
                    <div>
                      <h3 className="timeline__title">{item.title}</h3>
                      <p className="timeline__org">{item.org}</p>
                    </div>
                    <span className="timeline__period">{item.period}</span>
                  </div>

                  <ul className="timeline__details">
                    {item.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>

                  {item.type === "learning" && (
                    <span className="badge timeline__learning-badge">Currently Active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
