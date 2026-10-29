import { Metadata } from "next";
import Contact from "../../components/Contact";

export const metadata: Metadata = {
  title: "Contact & Hire | Mostafa Nagedy (تواصل مع مصطفى نجدي)",
  description:
    "تواصل مع المهندس مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / نجدي) للعمل الحر، بناء وتطوير مواقع الويب المتكاملة، وتطبيقات MERN Stack وحلول البرمجة.",
  keywords: [
    "تواصل مع مصطفى نجدي",
    "تواصل مع مصطفي نجدي",
    "توظيف مصطفى نجدي",
    "Contact Mostafa Nagedy",
    "Hire Mostafa Nagdy",
    "Mostafa Najdy Contact",
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "Hire Full Stack Developer Egypt",
  ],
  alternates: {
    canonical: "https://mostafanagedy.vercel.app/contact",
  },
  openGraph: {
    title: "Contact Mostafa Nagedy | مصطفى نجدي — Full Stack Developer",
    description:
      "تواصل مباشرة مع المهندس مصطفى نجدي لمناقشة فرص العمل، المشاريع البرمجية، وتطوير مواقع الويب.",
    url: "https://mostafanagedy.vercel.app/contact",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: ["/images/mostafa-nagdy.webp"],
  },
};

export default function ContactPage() {
  return (
    <div className="view-container contact-view">
      <Contact />
    </div>
  );
}
