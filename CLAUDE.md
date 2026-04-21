# Uncorked Duo — Claude Code Config

## Project overview
Single-page website for Uncorked Duo — twin sisters (wine education, tastings, travel).
- **Instagram:** @uncorked_duo (Behold widget, feed-id: `1SGcZXKl9aKl0dfyGjHJ`)
- **Contact email (current):** uncorkedduowine@gmail.com — will move to custom domain address once live

## File structure
```
uncorked-duo/
├── index.html          — HTML shell only (no inline styles or scripts)
├── css/
│   └── main.css        — all styles (mobile-first, single file)
├── js/
│   └── main.js         — all JavaScript (no framework, vanilla only)
└── tests/
    └── test.js         — 66-test Node.js suite, run with: node tests/test.js
```

## Tech stack
- Vanilla HTML, CSS, JS — no bundler, no npm, no dependencies
- Google Fonts: Cormorant Garamond (headings) + Jost (body)
- Deployed as static HTML

## Design approach
- **Mobile-first CSS**: base styles target mobile, desktop overrides use `@media (min-width: 820px)`
- Bottom-sheet modals on mobile (`align-items: flex-end`, `border-radius: 16px 16px 0 0`, `transform: translateY(100%)`)
- Centred dialog modals on desktop (`align-items: center`, `border-radius: 0`, `max-width: 560px`)

## CSS custom properties (design tokens)
```
--cream, --charcoal, --taupe, --taupe-lt, --blush, --warm-dark, --body-text
```

## Key architectural patterns
- **Modals**: `.modal-overlay` > `.modal` > `.modal-header` (close button, non-scrolling) + `.modal-scroll` (content, `overflow-y: auto`)
- **Carousels**: `scroll-snap-type: x mandatory` on container; `flex: 0 0 100%` on items; grid parent needs `min-width: 0` to prevent overflow
- **Fade-in animations**: `.fi` class + IntersectionObserver; delay variants `.d2`, `.d3`
- **Nav**: scroll-triggered background; hamburger on mobile; logo-click closes mobile menu

## Conventions
- No external JS libraries
- Prefer editing existing rules over adding new classes
- Test changes with `node tests/test.js` before committing
- Test on mobile viewport first

## Planned infrastructure (not yet implemented)
- **Hosting:** Azure Static Web Apps (free tier)
- **Domain:** Custom domain TBC — DNS will point to Azure
- **Email:** Zoho Mail on the custom domain
  - MX records for Zoho added to DNS (Azure DNS or registrar)
  - Verify domain in Zoho admin
  - Update mailto links in site from Gmail to new domain address
  - Note: user has an existing Azure subscription in a **different tenant** — DNS zones cannot be moved directly between tenants
- **CMS:** Not yet implemented — Sanity (email/password, free tier) is the favoured option
  - Will require a build step: `content.json` + `index.template.html` → `node build.js` → `index.html`
