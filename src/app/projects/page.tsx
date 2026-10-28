import { Metadata } from "next";
import FeaturedProjects from "../../components/FeaturedProjects";

export const metadata: Metadata = {
  title: "Projects & Live Demos | Mostafa Nagdy",
  description:
    "Explore web development projects by Mostafa Nagdy, including Amazon E-commerce clone, Portfolio Website, and E-commerce Store.",
};

export default function ProjectsPage() {
  return (
    <div className="view-container projects-view">
      <FeaturedProjects />
    </div>
  );
}
