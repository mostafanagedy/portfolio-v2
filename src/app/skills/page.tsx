import { Metadata } from "next";
import Skills from "../../components/Skills";

export const metadata: Metadata = {
  title: "Tech Stack & Skills | Mostafa Nagedy (مهارات مصطفى نجدي)",
  description:
    "تعرف على المهارات التقنية والتقنيات البرمجية التي يتقنها مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / نجدي) في React وNext.js وNode.js وMongoDB وTypeScript وحلول الحوسبة السحابية.",
  keywords: [
    "مهارات مصطفى نجدي",
    "مهارات مصطفي نجدي",
    "تقنيات مصطفى نجدي",
    "Mostafa Nagedy Skills",
    "Mostafa Nagdy Tech Stack",
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "MERN Stack Skills",
    "React Next.js Developer",
  ],
  alternates: {
    canonical: "https://mostafanagedy.vercel.app/skills",
  },
  openGraph: {
    title: "Technical Skills | Mostafa Nagedy (مصطفى نجدي)",
    description:
      "قائمة المهارات والتقنيات البرمجية للمهندس مصطفى نجدي في تطوير الواجهات الأمامية والأنظمة الخلفية وقواعد البيانات.",
    url: "https://mostafanagedy.vercel.app/skills",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: ["/images/mostafa-nagdy.webp"],
  },
};

export default function SkillsPage() {
  return (
    <div className="view-container skills-view">
      <Skills />
    </div>
  );
}
