import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import MainLayout from "../layouts/MainLayout";
import "../index.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFA116",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Mostafa Nagedy | مصطفى نجدي - Full Stack & MERN Developer",
    template: "%s | Mostafa Nagedy (مصطفى نجدي)",
  },
  description:
    "الموقع الرسمي للمهندس مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy / Mostafa Najdy / نجدي) - مهندس برمجيات ومطور ويب متكامل (Full Stack & MERN Stack Developer). تصفح المشاريع والشهادات وتواصل مباشرة.",
  keywords: [
    "مصطفى نجدي",
    "مصطفي نجدي",
    "نجدي",
    "المهندس مصطفى نجدي",
    "المهندس مصطفي نجدي",
    "Mostafa Nagedy",
    "Mostafa Nagdy",
    "Mostafa Najdy",
    "Nagedy",
    "Nagdy",
    "Najdy",
    "mostafanagedy",
    "mostafanagdy",
    "mostafanajdy",
    "mostafanagedy najdy",
    "موقع مصطفى نجدي",
    "موقع مصطفي نجدي",
    "MERN Stack Developer",
    "Frontend Specialist",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Angular Developer",
    "مطور واجهات أمامية",
    "مطور ويب متكامل",
    "مطور MERN Stack مصطفى نجدي",
    "Full Stack Developer Egypt",
    "Web Development Portfolio",
  ],
  authors: [{ name: "Mostafa Nagedy (مصطفى نجدي)", url: "https://mostafanagedy.vercel.app" }],
  creator: "Mostafa Nagedy",
  metadataBase: new URL("https://mostafanagedy.vercel.app"),
  alternates: {
    canonical: "https://mostafanagedy.vercel.app",
  },
  openGraph: {
    title: "Mostafa Nagedy | مصطفى نجدي - Full Stack Developer",
    description:
      "الموقع الرسمي للمهندس مصطفى نجدي (Mostafa Nagedy / Mostafa Nagdy) - مطور MERN Stack وواجهات أمامية. بناء تطبيقات ويب عصرية وسريعة بأحدث التقنيات.",
    url: "https://mostafanagedy.vercel.app",
    siteName: "Mostafa Nagedy Portfolio | معرض أعمال مصطفى نجدي",
    images: [
      {
        url: "/images/mostafa-nagdy.webp",
        width: 1200,
        height: 630,
        alt: "Mostafa Nagedy (مصطفى نجدي) — Full Stack & MERN Stack Developer",
      },
    ],
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mostafa Nagedy | مصطفى نجدي - Full Stack Developer",
    description:
      "الموقع الرسمي للمهندس مصطفى نجدي (Mostafa Nagedy) - مطور MERN Stack وواجهات أمامية متقدمة.",
    images: ["/images/mostafa-nagdy.webp"],
    creator: "@mostafanagedy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/mostafa-logo.png" },
    ],
    apple: "/images/mostafa-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mostafanagedy.vercel.app/#person",
        name: "Mostafa Nagedy",
        alternateName: [
          "مصطفى نجدي",
          "مصطفي نجدي",
          "نجدي",
          "المهندس مصطفى نجدي",
          "المهندس مصطفي نجدي",
          "Mostafa Nagdy",
          "Mostafa Najdy",
          "Nagedy",
          "Nagdy",
          "Najdy",
          "mostafanagedy",
          "mostafanagdy",
          "mostafanajdy",
          "mostafanagedy najdy"
        ],
        givenName: "Mostafa",
        familyName: "Nagedy",
        url: "https://mostafanagedy.vercel.app",
        image: "https://mostafanagedy.vercel.app/images/mostafa-nagdy.webp",
        jobTitle: "MERN Stack Developer & Full Stack Developer",
        disambiguatingDescription:
          "Official personal portfolio and website of Mostafa Nagedy (مصطفى نجدي / مصطفي نجدي), also known as Mostafa Nagdy, Mostafa Najdy, Nagedy, or Nagdy. Egyptian Software Engineer and Full Stack / MERN Stack Developer.",
        description:
          "Mostafa Nagedy (مصطفى نجدي / مصطفي نجدي) is a Full Stack & MERN Stack Developer and Frontend Specialist building modern, high-performance web applications with React, Next.js, Node.js, and MongoDB.",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Sohag University",
        },
        knowsAbout: [
          "MERN Stack",
          "Full Stack Development",
          "Frontend Development",
          "React.js",
          "Next.js",
          "Angular",
          "Node.js",
          "Express.js",
          "MongoDB",
          "JavaScript",
          "TypeScript",
          "AWS",
          "RESTful APIs",
          "Web Applications"
        ],
        sameAs: [
          "https://github.com/mostafanagedy",
          "https://dev.to/mostafanagedy",
          "https://www.linkedin.com/in/mostafa-nagdey/",
          "https://www.upwork.com/freelancers/~0188d9678f43c03685",
          "https://www.freelancer.com/u/Nagedy",
          "https://mostaql.com/u/mostafanajdy",
          "https://nafezly.com/u/mostafa_nagedy",
          "https://kafiil.com/u/mostafa_Nagedy",
          "https://khamsat.com/user/mostafa_nagedy",
          "https://x.com/mostafanagedy",
          "https://www.youtube.com/@mostafanagedy",
          "https://www.instagram.com/mostafanagedy/",
          "https://www.facebook.com/mostafanagedyy/",
          "https://www.tiktok.com/@mostafanagedy1?lang=en"
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://mostafanagedy.vercel.app/#website",
        url: "https://mostafanagedy.vercel.app",
        name: "Mostafa Nagedy Portfolio | موقع مصطفى نجدي",
        alternateName: [
          "Mostafa Nagedy",
          "Mostafa Nagdy",
          "Mostafa Najdy",
          "مصطفى نجدي",
          "مصطفي نجدي",
          "نجدي",
          "Nagedy",
          "Nagdy",
          "Najdy",
          "mostafanagedy"
        ],
        description: "Official portfolio website of Mostafa Nagedy (مصطفى نجدي / مصطفي نجدي)",
        publisher: {
          "@id": "https://mostafanagedy.vercel.app/#person",
        },
      },
      {
        "@type": "ProfilePage",
        "@id": "https://mostafanagedy.vercel.app/#profilepage",
        url: "https://mostafanagedy.vercel.app",
        name: "Mostafa Nagedy | مصطفى نجدي - Full Stack Developer",
        isPartOf: {
          "@id": "https://mostafanagedy.vercel.app/#website",
        },
        mainEntity: {
          "@id": "https://mostafanagedy.vercel.app/#person",
        },
      },
    ],
  };

  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("mn_theme");var t=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          id="structured-data"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
