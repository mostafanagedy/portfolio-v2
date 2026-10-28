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
  title: "Mostafa Nagdy | MERN Stack & Front-End Developer",
  description:
    "Explore Mostafa Nagdy's developer portfolio, featuring web development projects, React, Angular, Node.js, MongoDB, and cloud technology learning.",
  keywords: [
    "Mostafa Nagdy",
    "MERN Stack Developer",
    "Front-End Developer",
    "React Developer",
    "Angular Developer",
    "Node.js",
    "MongoDB",
    "AWS",
    "Full Stack Developer Egypt",
    "Web Development",
    "Clean Code",
  ],
  authors: [{ name: "Mostafa Nagdy", url: "https://github.com/mostafanagedy" }],
  creator: "Mostafa Nagdy",
  metadataBase: new URL("https://portoflio-lime.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mostafa Nagdy | MERN Stack & Front-End Developer",
    description:
      "I build modern web applications with clean code, great user experiences, and scalable architecture. React + Angular + AWS.",
    url: "https://portoflio-lime.vercel.app",
    siteName: "Mostafa Nagdy Portfolio",
    images: [
      {
        url: "/images/mostafa-nagdy.webp",
        width: 1200,
        height: 630,
        alt: "Mostafa Nagdy — MERN Stack & Front-End Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mostafa Nagdy | MERN Stack & Front-End Developer",
    description:
      "I build modern web applications with clean code, great user experiences, and scalable architecture.",
    images: ["/images/mostafa-nagdy.webp"],
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
    "@type": "Person",
    name: "Mostafa Nagdy",
    url: "https://portoflio-lime.vercel.app",
    image: "https://portoflio-lime.vercel.app/images/mostafa-nagdy.webp",
    jobTitle: "MERN Stack Developer & Front-End Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Sohag University",
    },
    knowsAbout: [
      "React",
      "Angular",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "TypeScript",
      "AWS",
      "Web Development",
    ],
    sameAs: [
      "https://github.com/mostafanagedy",
      "https://www.linkedin.com/in/mostafa-nagdey/",
      "https://nafezly.com/u/mostafa_nagedy",
      "https://mostaql.com/u/mostafanajdy",
    ],
  };

  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("mn_theme");var t=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){new MutationObserver(function(m){for(var i=0;i<m.length;i++){if(m[i].attributeName==="bis_skin_checked"){m[i].target.removeAttribute("bis_skin_checked");}}}).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:["bis_skin_checked"]});}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
