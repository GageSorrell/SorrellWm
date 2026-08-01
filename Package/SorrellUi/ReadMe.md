# @sorrell/ui

React components for marketing and landing-page UI, ported from the [Effect website](https://effect.website)'s landing-page design language — a dark, grid/glow, monospace-accented aesthetic. Every component takes its content (copy, links, logos, images) as props; no Effect-specific content or third-party brand assets ship with this package.

Styled with Tailwind CSS v4. No font files are bundled — components fall back to system fonts unless you set `--sorrell-ui-font-sans` / `--sorrell-ui-font-mono` (e.g. after installing `Inter` and `JetBrains Mono` yourself, matching the source site).

## Installation

```sh
npm install @sorrell/ui
```

Import the compiled stylesheet once, anywhere before you render a component:

```ts
import "@sorrell/ui/style.css";
```

## Example

```tsx
import { CallToAction, Hero, InstallCommandPanel } from "@sorrell/ui";

const LandingPage = () => (
    <>
        <Hero badgeHref="/changelog" badgeLabel="v2.0 — Now available" heading="Ship faster, break less">
            <InstallCommandPanel packageName="my-package" />
        </Hero>
        <CallToAction heading="Ready to get started?" primaryAction={ { href: "/docs", label: "Read the docs" } } />
    </>
);
```

## Components

### Primitives

- `Button` — variant/size button built on Base UI's `Button` primitive.
- `Link` — unified link component (inline/nav/footer/subtle/icon variants).
- `GridBackground` — decorative grid backdrop.
- `SectionDivider` — hairline section divider.

### Sections

- `Hero` — eyebrow badge, heading, subheading, an action slot, and a social-proof logo row.
- `CallToAction` — closing CTA band with an action slot and up to two link actions.
- `FeatureGrid` — a grid of problem→solution feature cards, with an optional side chart slot.
- `CaseStudyList` — an alternating media+text list of case studies.
- `Faq` — a two-column FAQ section with a zero-JS `<details>`-based accordion.

### Blocks

- `QuoteMarquee` (+ `UseQuoteMarquee` hook) — an infinite, auto-scrolling, drag-enabled carousel of quotes.
- `ComparisonChart` — a small SVG line/area chart that draws itself in on scroll.
- `InstallCommandPanel` — a package-manager-aware install command panel with copy-to-clipboard.
- `VideoCard` — a video with a poster/play-button overlay.
