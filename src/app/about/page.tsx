import { Metadata } from "next";
import About from "../../components/About";

export const metadata: Metadata = {
  title: "About Me | Mostafa Nagedy (مصطفى نجدي) — MERN Stack Developer",
  description:
    "تعرف على المهندس مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / نجدي) - مهندس برمجيات ومطور MERN Stack وخريج جامعة سوهاج وخبرته في تطوير تطبيقات الويب والواجهات الأمامية.",
  keywords: [
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "Mostafa Nagedy",
    "Mostafa Nagdy",
    "Mostafa Najdy",
    "عن مصطفى نجدي",
    "من هو مصطفى نجدي",
    "About Mostafa Nagedy",
    "MERN Stack Developer Egypt",
  ],
  alternates: {
    canonical: "https://mostafanagedy.vercel.app/about",
  },
  openGraph: {
    title: "About Mostafa Nagedy | مصطفى نجدي — Full Stack Developer",
    description:
      "السيرة الذاتية والمسيرة المهنية للمهندس مصطفى نجدي وخلفيته الأكاديمية والتقنية في بناء تطبيقات الويب الحديثة.",
    url: "https://mostafanagedy.vercel.app/about",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: ["/images/mostafa-nagdy.webp"],
  },
};

export default function AboutPage() {
  return (
    <div className="view-container about-view">
      <About />
    </div>
  );
}
