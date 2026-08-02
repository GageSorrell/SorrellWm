# Landing Pages and Themes

`@sorrell/docs-landing` and the four framework themes provide a consistent visual foundation without coupling a product site to the generator after creation.

## `DocsLanding`

Import the framework-neutral React component from `@sorrell/docs-landing`:

```tsx
import { DocsLanding } from "@sorrell/docs-landing";
import "@sorrell/ui/style.css";

export const Landing = () => (
    <DocsLanding
        productName="Window API"
        productTagline="Typed Windows integration"
        description="Build window-aware tools with explicit, validated APIs."
        installationPackage="@sorrell/windows"
        actions={[
            { href: "/docs", label: "Read the documentation" },
            { href: "/docs/api", label: "API reference" }
        ]}
        features={[
            {
                title: "Effect services",
                description: "Model native operations and lifetimes explicitly.",
                points: ["Typed errors", "Scoped resources"]
            }
        ]}
        links={[
            {
                href: "https://github.com/GageSorrell/SorrellWm",
                label: "Source"
            }
        ]}
    />
);
```

The component composes `Hero`, `InstallCommandPanel`, `FeatureGrid`, and `CallToAction` from `@sorrell/ui`.

## Props

| Prop | Type | Required | Behavior |
| --- | --- | --- | --- |
| `productName` | `ReactNode` | Yes | Primary heading and call-to-action product label. |
| `description` | `ReactNode` | Yes | Hero supporting content. |
| `productTagline` | string | No | Hero badge label. The first primary action URL becomes its badge link. |
| `installationPackage` | string | No | Renders an `InstallCommandPanel`. |
| `actions` | `LandingAction[]` | No | First action is primary; second action is the final secondary action. |
| `features` | `LandingFeature[]` | No | Renders the feature grid when nonempty. |
| `links` | `LandingAction[]` | No | The first link is the secondary fallback when no second action exists. |
| `customSections` | `ReactNode` | No | Inserted after features and before the final call to action. |

`LandingAction` contains lowercase `href` and `label`. `LandingFeature` contains `title`, `description`, optional `points`, and optional React `icon`. Without an icon, the template renders a decorative diamond. Without feature points, the description becomes the feature's single checklist entry.

When both actions and links are empty, the final call to action is omitted. When features are empty, the feature section is omitted.

Use `@sorrell/ui/style.css` once in the hosting application. The generated Docusaurus and Vite landing pages already import it.

## Custom Sections

`customSections` is the escape hatch for site-specific React content:

```tsx
<DocsLanding
    productName="Window API"
    description="Typed Windows integration."
    customSections={
        <section aria-labelledby="compatibility-heading">
            <h2 id="compatibility-heading">Compatibility</h2>
            <p>Windows 11 on x64 and ARM64.</p>
        </section>
    }
/>
```

Custom content should rely on semantic markup and the selected site's tokens. Keep reusable product-independent sections in `@sorrell/ui` or `@sorrell/docs-landing` rather than duplicating them across generated sites.

## Fluent Docusaurus Theme

`@sorrell/docusaurus-theme-fluent` is a proper Docusaurus theme plugin. It:

- registers package CSS as a client module;
- supplies a safe `@theme/Root` wrapper;
- observes Docusaurus's `data-theme` attribute;
- wraps the site in a Fluent UI v9 `FluentProvider` using `webLightTheme` or `webDarkTheme`;
- uses Segoe UI Variable/Segoe UI typography;
- maps Infima primary colors to Fluent blues;
- applies translucent navigation, rounded controls, and Fluent-like elevation; and
- corrects shared landing cards and text for both color modes.

The exported `FluentDocusaurusTheme` constant has the shape expected by `CreateDocusaurusConfig`:

```ts
import { CreateDocusaurusConfig } from "@sorrell/site-core/Docusaurus";
import { FluentDocusaurusTheme } from "@sorrell/docusaurus-theme-fluent";

const config = CreateDocusaurusConfig(definition, FluentDocusaurusTheme);
```

## Effect Docusaurus Theme

`@sorrell/docusaurus-theme-effect` is an Effect-inspired Docusaurus plugin. It:

- wraps the page in `.sorrell-effect-docs`;
- uses a zinc light/dark palette;
- applies an ambient grid treatment;
- uses translucent dark navigation and restrained code glow;
- uses Inter for prose and JetBrains Mono for code; and
- loads those two font families through Google Fonts in the theme CSS.

The external font import means production browsers need access to Google Fonts to receive those typefaces; the CSS fallbacks remain usable when it is unavailable.

Use its explicit adapter with the lower-level factory:

```ts
import { CreateDocusaurusConfig } from "@sorrell/site-core/Docusaurus";
import { EffectDocusaurusTheme } from "@sorrell/docusaurus-theme-effect";

const config = CreateDocusaurusConfig(definition, EffectDocusaurusTheme);
```

## Fluent Storybook Theme

Add `@sorrell/storybook-theme-fluent` to Storybook's `addons` array. Storybook resolves the package's preset, which contributes `managerEntries` and `previewAnnotations`.

The manager uses a light Fluent palette, Segoe typography, blue primary colors, and eight-pixel radii. Previews are wrapped in `FluentProvider`; the Theme toolbar switches between Fluent's `webLightTheme` and `webDarkTheme`.

The preview detects either the shared `theme` global or a dark selected background. This keeps Fluent components aligned with the preview canvas.

## Effect Storybook Theme

Add `@sorrell/storybook-theme-effect` to Storybook's `addons` array. Its manager defaults to a dark zinc palette with Inter and JetBrains Mono font stacks. The preview decorator adds either:

```text
sorrell-effect-preview sorrell-effect-preview--dark
sorrell-effect-preview sorrell-effect-preview--light
```

The Theme toolbar controls the modifier and defaults to dark. The package CSS supplies the corresponding preview treatment.

## Selecting a Theme

Generated sites derive the package name from `Theme` and `Kind`:

| `Kind` | `Theme` | Package |
| --- | --- | --- |
| `Docusaurus` | `Fluent` | `@sorrell/docusaurus-theme-fluent` |
| `Docusaurus` | `Effect` | `@sorrell/docusaurus-theme-effect` |
| `Storybook` | `Fluent` | `@sorrell/storybook-theme-fluent` |
| `Storybook` | `Effect` | `@sorrell/storybook-theme-effect` |

Changing a manifest's `Theme` after generation also requires changing installed dependencies in the generated `package.json`: remove the old theme package and add the new matching package. Then reinstall and rebuild from the monorepo root.
