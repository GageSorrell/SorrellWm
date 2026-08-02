<span style="font-size: 12px;">Documentation for SorrellWm.<br />(c) 2024&mdash;2026 Gage Sorrell.  Provided under the [MIT License](../License.md).</span>

# CLI and Website Generation

`@sorrell/site` exposes the `sorrell-site` executable. Run it from the repository root so it can resolve `Website/`, `CONTEXT-MAP.md`, and local workspaces correctly.

```powershell
npx --no-install sorrell-site <command>
```

`npx --no-install` guarantees that npm uses the installed workspace binary instead of downloading a similarly named package. The compiled `@sorrell/site` workspace must exist first; see the [quick start](./ReadMe.md#quick-start).

## Interactive and Automated Use

Creation options that are not supplied on the command line use Effect CLI prompts. Supplying all required options makes the same command suitable for scripts.

The shared creation options are:

| Option | Required | Meaning |
| --- | --- | --- |
| `--title <text>` | Yes | Human-readable site and navigation title. Also determines the default destination name. |
| `--package <name>` | Yes | Independent npm package name, such as `@sorrell/example-docs`. |
| `--subdomain <label>` | Yes | The single label below `sorrell.sh`; do not supply a full hostname. |
| `--theme Effect\|Fluent` | Yes | Framework-appropriate theme family. |
| `--destination <path>` | No | Direct child of `Website/`. Defaults to `Website/<PascalTitle>`. |
| `--vercel-project <name>` | No | Dedicated Vercel project. Defaults to `<subdomain>-docs` or `<subdomain>-storybook`. |
| `--dry-run` | No | Lists planned file and context-map operations without writing them. |

Package names must match `@sorrell/<lowercase-name>`. Subdomains may contain lowercase ASCII letters, digits, and interior hyphens. A label cannot start or end with a hyphen.

## Create a Docusaurus Site

```powershell
npx --no-install sorrell-site create docusaurus `
    --title "Window API" `
    --package "@sorrell/window-api-docs" `
    --subdomain "window-api" `
    --theme Effect
```

The command creates a localized, versioned Docusaurus 3.10.x workspace. Its default destination is `Website/WindowAPI` and its default Vercel project is `window-api-docs`.

## Create a Storybook Site

Storybook creation adds two options:

| Option | Required | Meaning |
| --- | --- | --- |
| `--source <workspace>` | Yes | Source workspace containing the components, for example `Package/SorrellUi`. |
| `--stories <globs>` | No | Comma-separated Storybook globs. The default is `../../../<source>/Source/**/*.stories.@(ts\|tsx)`. |
| `--landing` | No | Adds a Vite landing page at `/` and moves Storybook to `/storybook/`. |

```powershell
npx --no-install sorrell-site create storybook `
    --title "Sorrell UI" `
    --package "@sorrell/ui-storybook" `
    --subdomain "ui" `
    --theme Fluent `
    --source "Package/SorrellUi" `
    --stories "../../../Package/SorrellUi/Source/**/*.stories.tsx" `
    --landing
```

Without `--landing`, the static Storybook is built directly into `build/` and is served at `/`.

## Destination Safety

The generator resolves the destination before writing and accepts only one directory level below the repository's `Website/` directory. These destinations are rejected:

```text
Website/
Website/Group/NestedSite
Package/SomeSite
../OutsideRepository
```

An existing empty destination is allowed. An existing nonempty destination is rejected, including during a dry run, so generation never overwrites authored files. `CONTEXT-MAP.md` is updated idempotently only after the site files are written.

## Files Generated for Docusaurus

```text
Website/<Name>/
├── docs/intro.mdx
├── i18n/es-US/docusaurus-plugin-content-docs/current/intro.mdx
├── src/pages/index.tsx
├── src/theme/MDXComponents.tsx
├── docusaurus.config.mjs
├── package.json
├── sidebars.ts
├── tsconfig.json
└── website.config.json
```

The generated configuration imports `DefineDocusaurusConfig` from `@sorrell/site-core/Docusaurus`. The initial MDX page demonstrates an explicitly marked Twoslash fence, and the landing page uses `@sorrell/docs-landing` inside Docusaurus's `Layout`.

## Files Generated for Storybook

Every Storybook workspace contains:

```text
Website/<Name>/
├── .storybook/main.ts
├── package.json
├── tsconfig.json
└── website.config.json
```

With `--landing`, it additionally contains:

```text
├── index.html
├── src/main.tsx
├── src/style.d.ts
└── vite.config.ts
```

`.storybook/main.ts` delegates framework and preset configuration to `@sorrell/site-core/Storybook`.

## After Creation

Run `npm install` at the repository root so npm adds the new `Website/*` workspace to the lockfile. Then type-check and build by package name:

```powershell
npm install
npm run typecheck -w @sorrell/window-api-docs
npm run build -w @sorrell/window-api-docs
```

The generator adds a routing-table row to `CONTEXT-MAP.md`; it does not create `CONTEXT.md`. Domain documentation is created separately according to the repository's domain-documentation process.

## Publish Commands

```powershell
npx --no-install sorrell-site publish Website/WindowAPI --dry-run
npx --no-install sorrell-site publish Website/WindowAPI
npx --no-install sorrell-site publish Website/WindowAPI --replace-dns
```

`--dry-run` validates and describes the target deployment but does not build, contact Vercel, or mutate Route 53. `--replace-dns` is intentionally separate because it authorizes deletion of conflicting records at the required record names. See [Publishing](./Publishing.md).
