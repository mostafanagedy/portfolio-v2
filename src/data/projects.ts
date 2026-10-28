export interface Project {
  id: number;
  title: string;
  slug: string;
  repoName?: string;
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
    slug: "amazon-ecommerce",
    repoName: "AmazonEcommerce-main",
    description: "Full-featured e-commerce platform with dynamic product catalog, interactive cart management, and responsive checkout interface.",
    url: "https://amazon-ecommerce-main.vercel.app",
    github: "https://github.com/mostafanagedy/AmazonEcommerce-main",
    image: "/images/project-amazon.png",
    categories: ["Full Stack", "E-commerce"],
    tags: ["React", "Node.js", "MongoDB", "Express", "REST API"],
    featured: true,
  },
  {
    id: 2,
    title: "Portfolio Website",
    slug: "portfolio-website",
    repoName: "portfolio-v2",
    description: "Personal portfolio & interactive showcase featuring glassmorphic UI, smooth micro-interactions, theme switching, and responsive design.",
    url: "https://mostafanagedy.vercel.app",
    github: "https://github.com/mostafanagedy/portfolio-v2",
    image: "/images/project-portfolio.png",
    categories: ["Frontend"],
    tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    featured: true,
  },
  {
    id: 3,
    title: "E-commerce Store",
    slug: "e-commerce-store",
    repoName: "E-COMMERCE-f",
    description: "Modern online storefront featuring item filtering, state-managed shopping bag, and streamlined checkout experience.",
    url: "https://e-commerce-f-red.vercel.app",
    github: "https://github.com/mostafanagedy/E-COMMERCE-f",
    image: "/images/project-store.png",
    categories: ["Frontend", "E-commerce"],
    tags: ["React", "Redux", "Stripe", "REST API"],
    featured: true,
  },
];
