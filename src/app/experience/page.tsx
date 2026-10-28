import { Metadata } from "next";
import Experience from "../../components/Experience";

export const metadata: Metadata = {
  title: "Experience & Learning | Mostafa Nagdy",
  description:
    "Professional journey, freelance client delivery, self-directed learning in React/AWS, and academic background of Mostafa Nagdy.",
};

export default function ExperiencePage() {
  return (
    <div className="view-container experience-view">
      <Experience />
    </div>
  );
}
