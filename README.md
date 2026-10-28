<div align="center">

  <img src="public/images/mostafa-logo.png" alt="Mostafa Nagdy Logo" width="80" height="80" />

  # Mostafa Nagdy — Developer Portfolio v2

  <p align="center">
    <strong>A modern, high-performance personal developer portfolio built with Next.js 15, React 19, and TypeScript.</strong>
  </p>

  <p align="center">
    <a href="https://portoflio-lime.vercel.app"><strong>View Live Demo »</strong></a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/CSS3-Design_Tokens-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </p>

</div>

---

## 🌟 Overview

Welcome to the repository of **Mostafa Nagdy's** personal developer portfolio (Version 2). Designed from the ground up to deliver a clean, fast, and cinematic user experience, this portfolio showcases full-stack web applications, frontend UI/UX designs, technical competencies, and verified professional channels.

Built on **Next.js 15 App Router** with **React 19**, it achieves blazing-fast page load times, 100% static page generation (SSG), seamless client-side page transitions, and a custom-engineered dual-theme engine.

---

## 🚀 Key Features

### 🌗 1. True Dual-Theme System (Dark & Light Mode)
- **Engineered Color System**:
  - **Dark Mode**: Premium deep developer palette (`#080B0F` base, `#0D1117` sections, `#11161D` cards, `#FF9F0A` vibrant orange accent).
  - **Light Mode**: Clean, warm off-white palette (`#F5F7FA` base, `#FFFFFF` solid cards, `#172033` deep text, `#F59E0B` warm amber accent).
- **Anti-Flicker Execution**: Synchronous blocking script inside `<head>` prevents theme flash during page hydration.
- **Dynamic Photography Adaptation**: Switches between dark-studio photography and bright-office photography to match each theme naturally.
- **Persistence & Sync**: Remembers preference via `localStorage` with intelligent fallback to OS `prefers-color-scheme`.

### 👤 2. Redesigned "About Me" Hero
- **Two-Column Layout**: High-impact introduction, biography, and CTA on the left; full-body standing portrait on the right.
- **2×2 Quick-Info Matrix**:
  - `MY STACK`: MERN Stack (MongoDB, Express, React, Node.js)
  - `EDUCATION`: Sohag University — Computer Science (2023)
  - `LOCATION`: Cairo, Egypt (Available Globally for Remote & Freelance)
  - `AVAILABILITY`: Open to Opportunities (Full-time & Freelance)
- **Slim Signature Footer**: Features the personal brand motto *“Turning ideas into real world applications”* and a handwritten signature.

### 💼 3. Featured Projects Showcase
- **16:9 Media Cards**: Clean aspect ratio with responsive badges, live demo links, and GitHub source links.
- **Interactive Filtering**: Filter projects by categories (*All*, *Frontend*, *Full Stack*, *E-commerce*) with zero page reloads.
- **Real Production Apps**: Highlights flagship projects like the Amazon E-commerce clone, custom web stores, and modern SaaS dashboards.

### 📬 4. Contact & Direct Hire Channels
- **Interactive Message Form**: Client-side validation with instant launch of pre-populated default mail client.
- **Direct Action Links**: One-click email copy with visual feedback, WhatsApp instant chat link.
- **Verified Social Hub**: Direct profiles to GitHub, LinkedIn, TikTok, Instagram, Facebook, X (Twitter), and YouTube.
- **Freelance Platform Badges**: Direct links to Nafezly, Mostaql, Kafiil, Khamsat, Freelancer, and Upwork profiles.

### 🔍 5. Technical SEO & Rich Structured Data
- **Dynamic Sitemap & Robots**: Fully automated `/sitemap.xml` and `/robots.txt`.
- **JSON-LD (Schema.org)**: Rich `Person` schema indexing university, profession, skills, and verified `sameAs` social links for Google Knowledge Graph.
- **Social Graph Sharing**: OpenGraph (OG) and Twitter Card metadata for rich link previews across WhatsApp, LinkedIn, and Discord.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Styling** | Vanilla CSS with Centralized CSS Custom Properties (Design Tokens) |
| **Icons** | [Lucide React](https://lucide.dev/) & Custom SVG Brand Icons |
| **Fonts** | Inter & Space Grotesk via `next/font/google` |
| **Deployment** | Vercel (Edge Network) |

---

## 📂 Project Architecture

```plaintext
portoflio-v2/
├── public/                     # Static assets & photography
│   ├── favicon.svg             # Vector site favicon
│   └── images/                 # Theme portraits, project covers & logos
│       ├── profile-standing-dark.jpg   # Dark mode portrait
│       ├── profile-standing-light.jpg  # Light mode portrait
│       ├── mostafa-nagdy.webp          # Official headshot
│       └── ...
├── src/
│   ├── app/                    # Next.js App Router (Pages & Metadata)
│   │   ├── layout.tsx          # Root Layout, anti-flicker script & SEO Schema
│   │   ├── page.tsx            # Home Page View
│   │   ├── about/              # About Me View (/about)
│   │   ├── skills/             # Skills Matrix View (/skills)
│   │   ├── projects/           # Featured Projects View (/projects)
│   │   ├── experience/         # Experience Timeline View (/experience)
│   │   ├── contact/            # Contact & Hire View (/contact)
│   │   ├── not-found.tsx       # Custom 404 View
│   │   ├── robots.ts           # Dynamic robots.txt
│   │   └── sitemap.ts          # Dynamic sitemap.xml
│   ├── components/             # Reusable UI components & modular CSS
│   │   ├── About.tsx           # Redesigned 2-column about section
│   │   ├── Contact.tsx         # Contact form & social channels
│   │   ├── FeaturedProjects.tsx# 16:9 cards & category filter engine
│   │   ├── Navbar.tsx          # Sticky navigation & dual-theme switch
│   │   ├── Footer.tsx          # Slim footer with motto
│   │   └── ...
│   ├── data/                   # Centralized data sources
│   │   ├── projects.ts         # Portfolio projects dataset
│   │   ├── skills.ts           # Categorized skill tree & proficiency
│   │   └── socialLinks.ts      # Social channels, handles & platforms
│   ├── layouts/
│   │   └── MainLayout.tsx      # Theme provider, ambient overlays & shell
│   └── index.css               # Global CSS design tokens (Dark & Light)
├── package.json
└── README.md
```

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js**: Version `18.17.0` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mostafanagedy/portfolio-v2.git
   cd portfolio-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**  
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run start
```

---

## 🌐 Connect with Me

- **Portfolio**: [mostafanagedy.vercel.app](https://mostafanagedy.vercel.app)
- **LinkedIn**: [/in/mostafa-nagdey](https://www.linkedin.com/in/mostafa-nagdey/)
- **GitHub**: [@mostafanagedy](https://github.com/mostafanagedy)
- **Email**: [mostafamagednagedy@gmail.com](mailto:mostafamagednagedy@gmail.com)
- **WhatsApp**: [+20 101 588 7140](https://wa.me/201015887140)
- **YouTube**: [@mostafanagedy](https://www.youtube.com/@mostafanagedy)
- **Instagram**: [@mostafanagedy](https://www.instagram.com/mostafanagedy/)
- **TikTok**: [@mostafanagedy1](https://www.tiktok.com/@mostafanagedy1?lang=en)
- **X (Twitter)**: [@nagedy010](https://x.com/nagedy010)
- **Facebook**: [mostafa.nagedy.2025](https://www.facebook.com/mostafa.nagedy.2025)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ by Mostafa Nagdy — Turning ideas into real world applications.</sub>
</div>
