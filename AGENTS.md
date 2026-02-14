# AGENTS.md

Documentation for LLM agents working on this project.

## Project Overview

Personal portfolio and blog for Germán Ruiz, a Mechatronics Engineer specializing in robotics, computer vision, and IoT. The site is written entirely in **Spanish** (`lang="es"`).

- **Framework**: Astro v5 (static site generation, no SSR)
- **Styling**: Tailwind CSS v4 via Vite plugin
- **Language**: TypeScript (strict mode)
- **Deployment**: GitHub Pages via GitHub Actions (push to `main`)

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build locally
```

## Project Structure

```
.
├── .github/workflows/astro.yml   # CI/CD: build + deploy to GitHub Pages
├── public/                       # Static assets served as-is (favicon.svg)
├── src/
│   ├── assets/                   # Images (optimized at build time by Sharp)
│   ├── components/
│   │   ├── BaseHead.astro        # <head> meta: SEO, Open Graph, Twitter Cards
│   │   ├── Header.astro          # Nav bar with links: Inicio, Blog
│   │   ├── Footer.astro          # Copyright + SocialLinks
│   │   ├── FormattedDate.astro   # Date formatting (Spanish locale "es-es")
│   │   ├── SocialLinks.astro     # Mastodon, LinkedIn, GitHub icons
│   │   └── PostsCarousel.astro   # Auto-playing carousel for pinned posts
│   ├── content/
│   │   └── blog/                 # Blog posts (.md and .mdx)
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Root layout: fonts, global styles, header/footer
│   │   └── BlogPost.astro        # Layout for individual blog posts
│   ├── pages/
│   │   ├── index.astro           # Homepage (bio + pinned posts carousel)
│   │   ├── blog/
│   │   │   ├── index.astro       # Blog listing (pinned first, then by date)
│   │   │   └── [...slug].astro   # Dynamic route for individual posts
│   │   └── rss.xml.js            # RSS feed
│   ├── consts.ts                 # SITE_TITLE ("grmn-labs"), SITE_DESCRIPTION
│   └── content.config.ts         # Content collection schema definition
├── astro.config.mjs              # Astro config: integrations, Vite plugins
├── tsconfig.json                 # Extends astro/tsconfigs/strict
└── package.json
```

## Content System

The project uses Astro's **Content Collections** with the Content Layer API (glob loader). There is a single collection: `blog`.

### Blog Post Schema (`src/content.config.ts`)

| Field         | Type              | Required | Notes                                    |
| ------------- | ----------------- | -------- | ---------------------------------------- |
| `title`       | `string`          | Yes      |                                          |
| `description` | `string`          | Yes      |                                          |
| `pubDate`     | `date` (coerced)  | No       | Accepts date strings like `"Sep 01 2020"`|
| `updatedDate` | `date` (coerced)  | No       |                                          |
| `heroImage`   | `image()`         | No       | Relative path to `src/assets/`           |
| `pinned`      | `boolean`         | No       | If `true`, appears in homepage carousel  |

### Adding a New Blog Post

Create a `.md` or `.mdx` file in `src/content/blog/` with this frontmatter:

```markdown
---
title: 'Título del post'
description: 'Descripción breve del post'
pubDate: 'Feb 14 2026'
heroImage: '../../assets/my-image.jpg'
pinned: false
---

Contenido del post aquí...
```

Place any hero images in `src/assets/` (not `public/`) so Astro can optimize them.

## Styling

### Tailwind CSS v4

Tailwind v4 is configured as a **Vite plugin** in `astro.config.mjs`. There is **no `tailwind.config.*` file** — do not create one. The CSS import is in `BaseLayout.astro`:

```css
@import "tailwindcss";
```

### CSS Custom Properties (`:root` in `BaseLayout.astro`)

| Variable             | Value                  | Usage                    |
| -------------------- | ---------------------- | ------------------------ |
| `--accent`           | `#2337ff`              | Links, primary blue      |
| `--accent-secondary` | `#ff7d00`              | Active nav underline     |
| `--black`            | `#0a0908`              | Heading text color       |
| `--white`            | `#f2f4f3`              | Light backgrounds        |

### Typography

- **Body**: `Roboto Mono` (variable, monospace) via `@fontsource-variable/roboto-mono`
- **Headings / bold**: `Space Mono` (monospace) via `@fontsource/space-mono`

### Icons

Uses `astro-icon` with the `@iconify-json/mdi` icon set (Material Design Icons). Usage:

```astro
<Icon name="mdi:github" />
```

## Routing

| Path              | File                            | Description          |
| ----------------- | ------------------------------- | -------------------- |
| `/`               | `src/pages/index.astro`         | Homepage             |
| `/blog`           | `src/pages/blog/index.astro`    | Blog listing         |
| `/blog/<slug>`    | `src/pages/blog/[...slug].astro`| Individual post      |
| `/rss.xml`        | `src/pages/rss.xml.js`          | RSS feed             |

## Integrations

Configured in `astro.config.mjs`:

- **`@astrojs/mdx`** — MDX support for blog posts
- **`@astrojs/sitemap`** — automatic sitemap.xml generation
- **`astro-icon`** — SVG icon rendering
- **`@tailwindcss/vite`** — Tailwind CSS v4 via Vite plugin
- **`sharp`** — image optimization at build time

## Deployment

GitHub Actions workflow at `.github/workflows/astro.yml`:

- **Trigger**: push to `main` or manual dispatch
- **Node version**: 20
- **Steps**: checkout, `npm ci`, `astro build`, deploy to GitHub Pages
- **Site URL**: injected from GitHub Pages settings at build time

## Development Guidelines

1. **TypeScript strict mode** — the project extends `astro/tsconfigs/strict` with `strictNullChecks: true`
2. **Write content in Spanish** — all UI text and blog posts are in Spanish
3. **Images go in `src/assets/`** — never `public/`, so they get optimized by Sharp
4. **Use Tailwind utilities first** — resort to scoped `<style>` only when needed
5. **Global styles only in `BaseLayout.astro`** — do not add `<style is:global>` elsewhere
6. **No `tailwind.config.*`** — Tailwind v4 uses CSS-based configuration
7. **Validate with `npm run build`** — the build must succeed before any work is considered done
8. **Responsive breakpoint** — the main breakpoint is at `720px` (mobile-first)
9. **`PostsCarousel.astro` is complex** — it has auto-play, touch/swipe, keyboard navigation, and accessibility features. Edit with care
