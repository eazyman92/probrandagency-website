# ProBrand website

## Local development

Run `npm run dev` from this folder and open http://127.0.0.1:4173. No package installation is required. The Node.js server builds pages at startup and exposes only approved preview routes on localhost.

Run `npm run build` after editing content or templates. Refresh the browser for CSS and JavaScript changes. Run `npm run check` for syntax verification.

## Source organization

- `src/build.mjs`: shared layout, ten page definitions, service content, and HTML generation.
- `src/styles.css` and `src/enhancements.css`: responsive layout and visual styling.
- `src/app.js`: menu, scroll reveals, reduced-motion behavior and inquiry email preparation.
- `src/server.mjs`: local preview server and explicit resource routes.
- `public/`: generated HTML; edit source instead of generated pages.
- `content/company/company-copy-draft.json`: company text used by the build; still subject to owner review.
- `design/sketch/`: preserved first sketch.

## Pages

Home, About, Services overview, three individual service pages, Books, the first book detail page, Consultations, and Contact.

## Working behavior

Navigation and service links connect separate pages. Mobile menu supports Escape and closes on navigation. Service FAQs expand using native HTML details. Scroll animations use IntersectionObserver and respect reduced motion; content is visible without JavaScript. The contact form uses native required/email validation, prepares a mailto draft and provides a copyable text fallback. It does not submit an inquiry to a server, guarantee email delivery, or store personal data. No actual test email was sent.

## Before public release

Review company copy, public contact details, service scope, images and palette. Supply a clean cover and purchase link. Confirm consultation terms, scheduling and payment providers, hosting, and production data-handling requirements. Published courses will be added when supplied. No course offerings, fees or delivery promises are invented.

This is a private local development preview. It intentionally carries noindex headers and metadata. Original founder and book images remain unmodified and are explicitly routed for local review; they have not been copied into public. The public folder alone is not a complete deployable package: styles, scripts and approved optimized image exports must be included in the eventual production build. Full device, accessibility, performance and provider integration checks are still needed before launch.

## Verification 20 October 2026

JavaScript syntax checks and 10-page build passed. All 156 internal page links resolve to generated routes. Browser checks confirmed mobile navigation, service page rendering and contact field requirements; the contact page had no horizontal overflow at a 506px viewport. Full cross-browser/device coverage, external email handoff and reduced-motion preference switching have not been exhaustively tested.
