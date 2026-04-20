# Uncorked Duo — Claude Code Config

## Project overview
Single-page website for Uncorked Duo — twin sisters (wine education, tastings, travel).
All code lives in a single file: **`index.html`** (HTML + CSS + JS, no build step, no framework).

## File structure
```
uncorked-duo/
├── index.html      — HTML shell only (no inline styles or scripts)
├── css/
│   └── main.css    — all styles (mobile-first, single file)
└── js/
    └── main.js     — all JavaScript (no framework, vanilla only)
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

## Contact
`uncorkedduowine@gmail.com`

## Conventions
- Do not split into multiple files — keep everything in `index.html`
- No external JS libraries
- Prefer editing existing rules over adding new classes
- Test changes on mobile viewport first
