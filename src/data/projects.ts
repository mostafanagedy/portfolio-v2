export interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
  github?: string;
  image: string;
  categories: string[];
  tags: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Amazon E-commerce",
    description: "Full-featured e-commerce platform with dynamic product catalog, interactive cart management, and responsive checkout interface.",
    url: "https://amazon-ecommerce-main.vercel.app",
    github: "https://github.com/mostafanagedy",
    image: "/images/project-amazon.png",
    categories: ["Full Stack", "E-commerce"],
    tags: ["React", "Node.js", "MongoDB", "Express", "REST API"],
    featured: true,
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Personal portfolio & interactive showcase featuring glassmorphic UI, smooth micro-interactions, theme switching, and responsive design.",
    url: "https://portoflio-lime.vercel.app",
    github: "https://github.com/mostafanagedy",
    image: "/images/project-portfolio.png",
    categories: ["Frontend"],
    tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    featured: true,
  },
  {
    id: 3,
    title: "E-commerce Store",
    description: "Modern online storefront featuring item filtering, state-managed shopping bag, and streamlined checkout experience.",
    url: "https://e-commerce-f-red.vercel.app",
    github: "https://github.com/mostafanagedy",
    image: "/images/project-store.png",
    categories: ["Frontend", "E-commerce"],
    tags: ["React", "Redux", "Stripe", "REST API"],
    featured: true,
  },
];
