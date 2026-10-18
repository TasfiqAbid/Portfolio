# Galib Tasfiq Abid - Portfolio

Personal portfolio built with Next.js 16, React 19, TypeScript, Three.js / React Three Fiber, GSAP, Lenis and Tailwind CSS v4.

The current version includes an interactive gold 3D hero, animated intro and section transitions, a project poster wall with fullscreen previews, and an awards gallery with certificate and event photos. Inter, Playfair Display, Pacifico and Geist Mono are self-hosted through `next/font/local`.

## Run locally

Use Node.js 20.9 or newer and npm. Install the exact dependencies from the committed lockfile:

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables or API keys are required. In Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

## Production checks

```bash
npm run lint
npm run build
npm run start
```

The production build also checks TypeScript. Use the production server when reviewing animation performance; development mode includes compilation and debugging overhead.

The normal build directory is `.next`. For local profiling, `NEXT_DIST_DIR` can select a separate directory such as `.next-perf`; use the same value for both build and start. Keep build directories dedicated to generated output.

## Content and assets

- `src/app/`: page, layout, global styles and local font files.
- `src/components/`: sections, transitions, 3D scene and viewers.
- `src/lib/projects.ts`: project and award content, image paths and links.
- `public/certificates/`: active certificate and award photos.
- `public/work/`: active local project artwork.
- `public/environments/city.hdr`: local lighting used by the gold 3D object.
- `design/`: provenance and design notes for generated artwork.
- `PERFORMANCE.md`: current animation implementation and verification notes.

Some archive project images still use remote Unsplash URLs and require internet access. Local assets, fonts and the HDR environment must be committed with the source. Keep `package-lock.json` committed for reproducible installs.

## Git hygiene

`.gitignore` excludes dependencies, build output, TypeScript caches, environment files, credentials, logs, browser traces, test reports and local assistant settings. `.env.example` can be committed if configuration is introduced later; it must contain placeholders only.

Unused image variants and starter illustrations are kept locally under `.local-archive/`, outside `public/` and excluded from Git. They are not required to build or run the website. Performance captures stay in the ignored `.perf-audit/` directory. Do not add these folders with `git add -f`.

## Author

**Galib Tasfiq Abid** - Designer & Developer

- [Email](mailto:abidtasfiq6@gmail.com)
- [GitHub](https://github.com/TasfiqAbid)
- [LinkedIn](https://www.linkedin.com/in/tasfiq-abid)
- [Behance](https://www.behance.net/tasfiq_abid)

All rights reserved, 2026 Galib Tasfiq Abid.
