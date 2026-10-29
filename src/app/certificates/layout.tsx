import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates & Credentials | Mostafa Nagedy (شهادات مصطفى نجدي)",
  description:
    "استكشف الشهادات والاعتمادات المهنية الموثقة للمهندس مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / نجدي) من منصات Coursera وLinkedIn Learning في تطوير الويب والواجهات الأمامية وMERN Stack.",
  keywords: [
    "شهادات مصطفى نجدي",
    "شهادات مصطفي نجدي",
    "شهادات نجدي",
    "Mostafa Nagedy Certificates",
    "Mostafa Nagdy Credentials",
    "Mostafa Najdy Certificates",
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "Mostafa Nagedy",
    "Mostafa Nagdy",
    "Coursera Certificates",
    "LinkedIn Learning Badges",
    "MERN Stack Certification",
    "Frontend Developer Credentials",
  ],
  alternates: {
    canonical: "https://mostafanagedy.vercel.app/certificates",
  },
  openGraph: {
    title: "Certificates & Verified Credentials | Mostafa Nagedy (مصطفى نجدي)",
    description:
      "تصفح جميع الشهادات المهنية المعتمدة للمهندس مصطفى نجدي (Mostafa Nagedy) في مجالات البرمجة وتطوير تطبيقات الويب مع إمكانية التحقق والتنزيل المباشر.",
    url: "https://mostafanagedy.vercel.app/certificates",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: [
      {
        url: "/images/mostafa-nagdy.webp",
        width: 1200,
        height: 630,
        alt: "Mostafa Nagedy (مصطفى نجدي) — Verified Certificates & Credentials",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificates & Verified Credentials | Mostafa Nagedy (مصطفى نجدي)",
    description:
      "استعراض الشهادات المهنية المعتمدة للمهندس مصطفى نجدي مع روابط التحقق الرسمية.",
    images: ["/images/mostafa-nagdy.webp"],
  },
};

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
