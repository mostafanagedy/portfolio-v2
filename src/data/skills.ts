export interface Skill {
  name: string;
  icon: string;
  color?: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    icon: "monitor",
    skills: [
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Angular", icon: "angular", color: "#DD0031" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "HTML5", icon: "html5", color: "#E34F26" },
      { name: "CSS3", icon: "css3", color: "#1572B6" },
      { name: "Tailwind CSS", icon: "tailwind", color: "#06B6D4" },
      { name: "Bootstrap", icon: "bootstrap", color: "#7952B3" },
    ],
  },
  {
    category: "Backend",
    icon: "server",
    skills: [
      { name: "Node.js", icon: "nodejs", color: "#339933" },
      { name: "Express.js", icon: "express", color: "#FFFFFF" },
      { name: "REST APIs", icon: "api", color: "#FFA116" },
      { name: "Authentication", icon: "auth", color: "#FFA116" },
    ],
  },
  {
    category: "Databases",
    icon: "database",
    skills: [
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "SQL", icon: "sql", color: "#4479A1" },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: "cloud",
    skills: [
      { name: "AWS", icon: "aws", color: "#FF9900" },
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#FFFFFF" },
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "Linux", icon: "linux", color: "#FCC624" },
    ],
  },
  {
    category: "Tools & Others",
    icon: "tools",
    skills: [
      { name: "VS Code", icon: "vscode", color: "#007ACC" },
      { name: "Figma", icon: "figma", color: "#F24E1E" },
      { name: "Postman", icon: "postman", color: "#FF6C37" },
    ],
  },
];

export const learningSkills: string[] = ["AWS", "Docker", "Angular", "System Design"];
