# Storybook Websites

Generated component sites use Storybook 10.x with React and Vite. `@sorrell/site-core/Storybook` supplies the framework, story globs, shared addons, and the selected visual preset.

## Shared Configuration

The generated `.storybook/main.ts` reads the website definition and delegates to the factory:

```ts
import { DefineStorybookConfig } from "@sorrell/site-core/Storybook";
import Definition from "../website.config.json" with { type: "json" };

export default DefineStorybookConfig(Definition);
```

The resulting configuration uses `@storybook/react-vite` and adds:

- `@storybook/addon-a11y`;
- `@storybook/addon-docs`; and
- `@sorrell/storybook-theme-fluent` or `@sorrell/storybook-theme-effect`.

The preset entry point loads both manager theming and preview annotations. Do not add its internal manager or preview modules separately.

## Story Discovery

The `Stories` manifest array passes directly to Storybook. The CLI default is relative to `.storybook/main.ts`:

```json
{
    "SourceWorkspace": "Package/SorrellUi",
    "Stories": [
        "../../../Package/SorrellUi/Source/**/*.stories.@(ts|tsx)"
    ]
}
```

Use comma-separated `--stories` values during generation to configure multiple roots:

```powershell
--stories "../../../Package/One/Source/**/*.stories.tsx,../../../Package/Two/Source/**/*.stories.tsx"
```

After generation, edit `Stories` in `website.config.json` when files move. `SourceWorkspace` records the chosen source workspace but does not independently discover stories.

## Development and Build Scripts

| Script | Purpose |
| --- | --- |
| `npm run storybook` | Start the Storybook development server on port 6006. |
| `npm run build` | Build the configured static layout. |
| `npm run typecheck` | Check `.storybook/` and generated landing source. |
| `npm run publish` | Publish with `sorrell-site publish .`. |

Run a generated site from the root with:

```powershell
npm run storybook -w @sorrell/ui-storybook
npm run build -w @sorrell/ui-storybook
```

## Standard Layout

When `LandingEnabled` is false, `npm run build` executes:

```text
storybook build -o build
```

The static Storybook manager, docs, and previews are served at `/`. This is the simplest form and does not create Vite landing source.

## Landing-Page Layout

When `LandingEnabled` is true, `npm run build` executes two builds:

```text
vite build
storybook build -o build/storybook
```

Vite writes the landing page to `build/`, then Storybook writes beneath it without clearing the parent output. The published routes are:

```text
/             product landing page
/storybook/   Storybook manager and documentation
```

The generator creates `index.html`, `vite.config.ts`, `src/main.tsx`, and CSS module declarations. `src/main.tsx` renders `DocsLanding` directly with React's `createRoot` and imports `@sorrell/ui/style.css`.

The generated default landing action is copied from the common starter content. For a Storybook landing, edit `src/main.tsx` so its primary action points to `/storybook/` and tailor the content to the component library.

## Preview Themes

Both Storybook presets add a Theme toolbar with `light` and `dark` choices and decorate every preview. They also provide common parameters:

- accessibility checks marked as `todo` rather than failing the build automatically;
- named light and dark backgrounds;
- expanded controls;
- open docs source panels; and
- 1440×900 desktop and 390×844 mobile viewports.

The Fluent preset defaults previews to light and wraps stories in a Fluent UI `FluentProvider`. The Effect preset defaults to dark and wraps stories in a theme-classed container. Manager appearance is configured independently of the preview selection; see [Landing pages and themes](./LandingAndThemes.md).

## Extending Storybook Configuration

Amend the shared result when a site needs additional addons or static directories:

```ts
import { DefineStorybookConfig } from "@sorrell/site-core/Storybook";
import Definition from "../website.config.json" with { type: "json" };

const config = DefineStorybookConfig(Definition);

export default {
    ...config,
    addons: [
        ...(config.addons ?? []),
        "@storybook/addon-links"
    ],
    staticDirs: ["../public"]
};
```

Retain the selected Sorrell theme in `addons`; removing it disables both the manager entry and preview annotations.
