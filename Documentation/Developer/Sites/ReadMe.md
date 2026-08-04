<span style="font-size: 12px;">Documentation for SorrellWm.<br />(c) 2026 Gage Sorrell. Provided under the [MIT License](../../../License.md).</span>

# Documentation and Storybook Website Platform

The website platform creates, styles, and publishes independent Docusaurus and Storybook workspaces. It does not contain a root SorrellWm documentation site, reserve `docs.sorrell.sh`, or create a website until `sorrell-site create` is run.

Every generated site:

- is a private npm workspace directly below `Website/`;
- owns its package name, `<subdomain>.sorrell.sh` domain, and Vercel project;
- writes static output to `build/`;
- uses either the Fluent or Effect-inspired visual system; and
- can be built locally before publication.

Docusaurus sites add React MDX, opt-in Twoslash, versioned documentation, `en-US` and `es-US` localization, and a landing page at `/`. Storybook sites use React and Vite, and can either place Storybook at `/` or combine a landing page at `/` with Storybook at `/storybook/`.

## Packages

| Workspace | Package | Responsibility |
| --- | --- | --- |
| `Script/Site` | `@sorrell/site` | The `sorrell-site` generator and publisher CLI. |
| `Package/SiteCore` | `@sorrell/site-core` | Manifest schemas, framework configuration factories, and Shiki/Twoslash integration. |
| `Package/DocsLanding` | `@sorrell/docs-landing` | The typed landing-page React component built from `@sorrell/ui`. |
| `Package/DocusaurusThemeFluent` | `@sorrell/docusaurus-theme-fluent` | Fluent UI v9 Docusaurus plugin and root provider. |
| `Package/DocusaurusThemeEffect` | `@sorrell/docusaurus-theme-effect` | Effect-inspired Docusaurus plugin and styles. |
| `Package/StorybookThemeFluent` | `@sorrell/storybook-theme-fluent` | Fluent Storybook manager and preview preset. |
| `Package/StorybookThemeEffect` | `@sorrell/storybook-theme-effect` | Effect-inspired Storybook manager and preview preset. |

The dependency direction is intentionally one-way:

```text
generated website
├── @sorrell/site-core
├── @sorrell/docs-landing ──► @sorrell/ui
└── one framework-specific theme

@sorrell/site
├── @sorrell/site-core
├── @vercel/sdk
└── @aws-sdk/client-route-53
```

`EffectWebsite` and `Package/Old` remain historical and design references. The platform does not depend on or modify them.

## Quick Start

Install dependencies and build the platform packages before using their local package exports:

```powershell
npm install
npm run build -w @sorrell/site-core
npm run build -w @sorrell/docs-landing
npm run build -w @sorrell/docusaurus-theme-fluent
npm run build -w @sorrell/docusaurus-theme-effect
npm run build -w @sorrell/storybook-theme-fluent
npm run build -w @sorrell/storybook-theme-effect
npm run build -w @sorrell/site
```

Preview a generated Docusaurus workspace without writing anything:

```powershell
npx --no-install sorrell-site create docusaurus `
    --title "Example API" `
    --package "@sorrell/example-docs" `
    --subdomain "example-api" `
    --theme Fluent `
    --dry-run
```

Remove `--dry-run` to create `Website/ExampleAPI`. Omit a required option to let the CLI prompt for it.

## Guide Map

- [CLI and generation](./Cli.md) describes every command, option, generated file, and safety rule.
- [Website configuration](./Configuration.md) defines `website.config.json` and its defaults.
- [Docusaurus sites](./Docusaurus.md) covers MDX, Twoslash, localization, versioning, routes, and scripts.
- [Storybook sites](./Storybook.md) covers story discovery, presets, landing-page routing, and builds.
- [Landing pages and themes](./LandingAndThemes.md) documents the React landing API and all four themes.
- [Publishing](./Publishing.md) covers credentials, Vercel deployment, Route 53 reconciliation, and recovery.
- [Programmatic API](./ProgrammaticApi.md) documents schemas, factories, generator primitives, and publishing adapters.
- [Maintenance and testing](./Maintenance.md) explains package development and the validation strategy.

## Core Conventions

- Generated destinations must be direct children of `Website/`.
- `website.config.json` is secret-free. Credentials are supplied only through environment variables and the standard AWS credential chain.
- A generated site is ordinary source code after creation. Customize and commit it like any other workspace.
- Landing content is copied into generated React source during creation. Changing the manifest later does not rewrite that page; edit the generated page when its layout or content needs to change.
- Publication is local and CI-ready, but the generator does not create GitHub Actions workflows.
- Apex domains, wildcard records, and shared website projects are outside this platform.
