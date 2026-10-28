import { Metadata } from "next";
import About from "../../components/About";

export const metadata: Metadata = {
  title: "About Me | Mostafa Nagdy — MERN Stack Developer",
  description:
    "Learn more about Mostafa Nagdy, his background, education at Sohag University, frontend expertise, and career journey.",
};

export default function AboutPage() {
  return (
    <div className="view-container about-view">
      <About />
    </div>
  );
}
