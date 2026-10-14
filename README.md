# Galib Tasfiq Abid — Designer & Developer Portfolio

An interactive, high-performance personal portfolio website built with **Next.js 16 (App Router & Turbopack)**, **Three.js**, **GSAP**, and **Tailwind CSS**. It showcases creative direction, visual storytelling, UI/UX design, brand identity, and frontend engineering.

---

## 🌟 Main Features

* **Interactive 3D Visuals**: Floating metallic Torus Knot powered by Three.js and React Three Fiber, dynamically reacting to mouse coordinates and scroll velocity.
* **Perceptual OKLAB Background Blending**: Smooth, mathematically interpolated color transitions between dark and light themes across sections.
* **Interactive 3D Filmstrip Carousel**: Smooth momentum-based work slider with drag, wheel-snap, and click-to-preview functionality.
* **Kinetic Micro-Interactions**: Modern text roll-up hover animations, magnetic indicators, and refined typography.
* **Glassmorphic Navigation**: Sticky responsive navigation bar with active section intersection observer.
* **Credentials & Awards Showcase**: Structured honors list with built-in modal lightbox and fallback SVG placeholders.
* **Security & Performance Hardened**: Content Security Policy (CSP), strict HTTP security headers, tabnabbing protection, and zero runtime vulnerabilities in production dependencies.
* **Fluid Smooth Scrolling**: Integrated Lenis smooth scroll engine synchronized with GSAP ScrollTrigger.

---

## 🛠️ Main Technologies

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) |
| **Core Libraries** | [React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) v4, Vanilla CSS Design System |
| **3D & Canvas** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Animation** | [GSAP](https://gsap.com/) 3, ScrollTrigger Plugin |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) |
| **Typography** | Inter, Playfair Display, Pacifico, Geist Mono via `next/font/google` |

---

## 📁 Project Structure

```text
portfolio/
├── public/                 # Static assets (SVGs, project imagery)
├── src/
│   ├── app/
│   │   ├── globals.css     # Design tokens, keyframes, scrollbar rules
│   │   ├── layout.tsx      # Root layout, Google Fonts, smooth scroll wrapper
│   │   └── page.tsx        # Single-page section assembly
│   ├── components/
│   │   ├── About.tsx       # Bio, statistics, skills marquee
│   │   ├── Awards.tsx      # Honors & awards with modal lightbox
│   │   ├── BackgroundTransition.tsx # OKLAB color transitions
│   │   ├── Contact.tsx     # Contact section, interactive footer, back-to-top
│   │   ├── Hero.tsx        # Scroll-pinned hero section with 3D canvas
│   │   ├── Hero3DObject.tsx # Three.js canvas & procedural scene
│   │   ├── Navigation.tsx  # Floating glassmorphic header
│   │   ├── Preloader.tsx   # Initial branding loading sequence
│   │   ├── Services.tsx    # Creative service offerings
│   │   ├── SmoothScroll.tsx # Lenis & GSAP ScrollTrigger sync
│   │   ├── Work.tsx        # Work section container
│   │   └── WorkCarousel.tsx # 3D interactive filmstrip carousel
│   └── lib/
│       ├── constants.ts    # Design system color hex codes
│       └── projects.ts     # Data models for works, awards, and services
├── .gitignore              # Configured ignore patterns
├── eslint.config.mjs       # ESLint 9 configuration
├── next.config.ts          # Security headers, remote image patterns, CSP
├── package.json            # Scripts and dependencies
├── postcss.config.mjs      # PostCSS configuration for Tailwind
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) `>= 20.x` (LTS recommended)
* `npm` `>= 10.x`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TasfiqAbid/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Production Build & Quality Commands

* **Compile TypeScript without emitting:**
  ```bash
  npx tsc --noEmit
  ```

* **Run ESLint:**
  ```bash
  npm run lint
  ```

* **Create an optimized production build:**
  ```bash
  npm run build
  ```

* **Run the production server locally:**
  ```bash
  npm run start
  ```

* **Audit dependencies for security advisories:**
  ```bash
  npm audit --omit=dev
  ```

---

## 📸 Screenshots & Previews

To take screenshots for documentation or repository social preview cards:
1. Run `npm run build && npm run start`.
2. Open [http://localhost:3000](http://localhost:3000) in full-screen desktop mode (1920x1080).
3. Capture key sections: Hero entrance, Work carousel, and Contact section.
4. Store screenshots under `public/screenshots/` (optional) and reference them here.

---

## 🌐 Deployment Information

This project is optimized for deployment on modern edge hosting platforms:

### Deploying on Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js**.
4. Build command: `npm run build` (auto-detected).
5. Output directory: `.next` (auto-detected).
6. Click **Deploy**.

Security headers, edge caching, and image optimization are automatically configured via `next.config.ts`.

---

## 👤 Author Information

**Galib Tasfiq Abid**<br />
*Designer & Developer*

* **Email**: [abidtasfiq6@gmail.com](mailto:abidtasfiq6@gmail.com)
* **GitHub**: [@TasfiqAbid](https://github.com/TasfiqAbid)
* **LinkedIn**: [tasfiq-abid](https://www.linkedin.com/in/tasfiq-abid)
* **Behance**: [tasfiq_abid](https://www.behance.net/tasfiq_abid)
* **Instagram**: [@tasfiq_abid](https://www.instagram.com/tasfiq_abid)
* **Facebook**: [tasfiqabid](https://www.facebook.com/tasfiqabid/)

---

## 📄 License

Private personal portfolio repository. All rights reserved &copy; 2026 Galib Tasfiq Abid.
