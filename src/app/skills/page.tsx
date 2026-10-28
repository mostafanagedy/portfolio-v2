import { Metadata } from "next";
import Skills from "../../components/Skills";

export const metadata: Metadata = {
  title: "Tech Stack & Skills | Mostafa Nagdy",
  description:
    "Comprehensive overview of Mostafa Nagdy's technical skills across Frontend, Backend, Databases, Cloud & DevOps, and Developer Tools.",
};

export default function SkillsPage() {
  return (
    <div className="view-container skills-view">
      <Skills />
    </div>
  );
}
