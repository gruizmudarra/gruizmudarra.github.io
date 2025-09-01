# gruizmudarra.github.io - Technical Overview

This document provides a technical overview of the "gruizmudarra.github.io" project, intended for development and maintenance purposes.

This project is a static website built with the [Astro](https://astro.build/) framework.

*   **Core Technology**: It uses Astro, a modern web framework for building fast, content-focused websites. The code is written in **TypeScript**.

*   **Styling**: The project is styled with [Tailwind CSS](https://tailwindcss.com/), a utility-first CSS framework.

*   **Content**:
    *   The site features a blog with posts written in **Markdown** and **MDX**.
    *   It uses Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) to manage and validate the blog content. The frontmatter of each post is validated against a schema, ensuring that each post has a title, description, and optional fields like publication date, hero image, and a "pinned" status.

*   **Key Features & Integrations**:
    *   `@astrojs/mdx`: Allows for the use of MDX, enabling components within Markdown.
    *   `@astrojs/sitemap`: Automatically generates a `sitemap.xml` file for better SEO.
    *   `@astrojs/rss`: Creates an RSS feed for the blog.
    *   `astro-icon`: A component for easily adding icons to the site.
    *   `sharp`: An image processing library, likely used by Astro to optimize images.

*   **Development & Deployment**:
    *   The `package.json` file includes scripts for development (`dev`), building (`build`), and previewing the site.
    *   A GitHub Actions workflow (`.github/workflows/astro.yml`) is set up to automate the build and deployment process to GitHub Pages when the "main" branch is updated.

In summary, this is an Astro project that leverages its content collection features for a personal blog/portfolio, uses modern tooling like TypeScript and Tailwind CSS, and has an automated deployment pipeline.

## Implementation standard.

- DO NOT over engineer things. Start with the simplest implementation.
- Always keep the performance and as a first priority.
- Ask for any clarification rather just guessing things if you are not clear about anything.
