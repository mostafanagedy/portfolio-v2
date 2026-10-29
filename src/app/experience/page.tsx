import { Metadata } from "next";
import Experience from "../../components/Experience";

export const metadata: Metadata = {
  title: "Experience & Career | Mostafa Nagedy (خبرات مصطفى نجدي)",
  description:
    "المسيرة المهنية والخبرات العملية للمهندس مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / نجدي) في العمل الحر وبناء حلول الويب والتطوير المستمر.",
  keywords: [
    "خبرات مصطفى نجدي",
    "خبرات مصطفي نجدي",
    "أعمال مصطفى نجدي",
    "Mostafa Nagedy Experience",
    "Mostafa Nagdy Career",
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "Freelance Full Stack Developer",
  ],
  alternates: {
    canonical: "https://mostafanagedy.vercel.app/experience",
  },
  openGraph: {
    title: "Experience & Journey | Mostafa Nagedy (مصطفى نجدي)",
    description:
      "استعراض خبرات العمل الحر والمشاريع والتطوير المهني للمهندس مصطفى نجدي في تطوير مواقع الويب وتطبيقات MERN.",
    url: "https://mostafanagedy.vercel.app/experience",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: ["/images/mostafa-nagdy.webp"],
  },
};

export default function ExperiencePage() {
  return (
    <div className="view-container experience-view">
      <Experience />
    </div>
  );
}
