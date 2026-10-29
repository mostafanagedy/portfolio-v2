import { Metadata } from "next";
import FeaturedProjects from "../../components/FeaturedProjects";

export const metadata: Metadata = {
  title: "Projects & Live Demos | Mostafa Nagedy (مشاريع مصطفى نجدي)",
  description:
    "استكشف مشاريع الويب والتطبيقات العملية المنفذة بواسطة مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / نجدي)، بما في ذلك متجر Amazon E-commerce والتطبيقات المتكاملة بالـ MERN Stack.",
  keywords: [
    "مشاريع مصطفى نجدي",
    "مشاريع مصطفي نجدي",
    "مشاريع نجدي",
    "Mostafa Nagedy Projects",
    "Mostafa Nagdy Portfolio",
    "Mostafa Najdy",
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "MERN Stack Projects",
    "React Projects Egypt",
  ],
  alternates: {
    canonical: "https://mostafanagedy.vercel.app/projects",
  },
  openGraph: {
    title: "Projects & Portfolio | Mostafa Nagedy (مصطفى نجدي)",
    description:
      "تصفح أحدث مشاريع وتطبيقات الويب التفاعلية للمهندس مصطفى نجدي مع روابط المعاينة الحية والأكواد البرمجية على GitHub.",
    url: "https://mostafanagedy.vercel.app/projects",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: ["/images/mostafa-nagdy.webp"],
  },
};

export default function ProjectsPage() {
  return (
    <div className="view-container projects-view">
      <FeaturedProjects />
    </div>
  );
}
