import { Metadata } from "next";
import Contact from "../../components/Contact";

export const metadata: Metadata = {
  title: "Contact & Hire | Mostafa Nagdy",
  description:
    "Get in touch with Mostafa Nagdy for freelance opportunities, full-stack web development projects, or remote developer positions.",
};

export default function ContactPage() {
  return (
    <div className="view-container contact-view">
      <Contact />
    </div>
  );
}
