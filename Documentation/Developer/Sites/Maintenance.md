# Maintenance and Testing

The website platform is seven versioned workspaces plus the `Website/*` workspace pattern. Generated sites are intentionally absent from the initial platform; tests create disposable fixtures instead.

## Supported Toolchain

The platform currently targets:

| Concern | Version family |
| --- | --- |
| Node.js | 26.5.0 or newer, matching the repository toolchain |
| npm | 12.0.1 or newer |
| TypeScript | 6.0.2 |
| React | 19.2.x |
| Docusaurus | 3.10.x |
| Storybook | 10.5.x with React/Vite |
| Shiki and Twoslash | 4.4.x |
| Effect | 4.0.0 beta selected by the repository |

The root `package.json` contains an `@babel/traverse` override required by the selected Docusaurus/Babel dependency graph. Review that override when upgrading Docusaurus or Babel; remove it only after a clean install and both Docusaurus theme fixtures build without it.

## Workspace Responsibilities

Keep framework-independent behavior in `@sorrell/site-core` or `@sorrell/docs-landing`. Keep framework lifecycle hooks in the corresponding theme package. Keep filesystem, CLI, process, Vercel, and Route 53 concerns in `@sorrell/site`.

In particular:

- `SiteCore/Schema.ts` owns the persisted manifest vocabulary.
- `SiteCore/Docusaurus.ts` and `SiteCore/Storybook.ts` own shared framework conventions.
- `SiteCore/Twoslash.ts` owns code-rendering integration.
- `DocsLanding/Source/index.tsx` owns the reusable landing composition.
- Each Docusaurus theme owns its client CSS and `@theme/Root` wrapper.
- Each Storybook theme owns its manager entry, preview annotation, and preset hooks.
- `Script/Site/Generator.ts` owns templates and output safety.
- `Script/Site/Publish.ts` owns the cloud-independent publication state machine.
- `Script/Site/Cloud.ts` owns SDK-specific adapters and file hashing.
- `Script/Site/Process.ts` owns inherited child-process execution.

Avoid adding a direct dependency from shared packages back to `@sorrell/site`; that would invert the architecture and pull cloud/CLI dependencies into generated sites.

## Build and Static Checks

Run checks by package from the repository root:

```powershell
npm run typecheck -w @sorrell/site-core
npm run lint -w @sorrell/site-core
npm run test -w @sorrell/site-core
npm run build -w @sorrell/site-core

npm run typecheck -w @sorrell/site
npm run lint -w @sorrell/site
npm run test -w @sorrell/site
npm run build -w @sorrell/site
```

The landing and theme packages expose `typecheck`, `lint`, and `build`:

```powershell
$packages = @(
    "@sorrell/docs-landing",
    "@sorrell/docusaurus-theme-fluent",
    "@sorrell/docusaurus-theme-effect",
    "@sorrell/storybook-theme-fluent",
    "@sorrell/storybook-theme-effect"
)

foreach ($package in $packages) {
    npm run typecheck -w $package
    npm run lint -w $package
    npm run build -w $package
}
```

Build `@sorrell/site-core`, landing, and theme dependencies before compiling disposable generated sites, because local workspace exports point at `Distribution/`.

## Existing Automated Tests

`Package/SiteCore/Test/Core.test.ts` covers schema defaults and framework configuration, including locale and theme selection.

`Script/Site/Test/Generator.test.ts` covers generator behavior such as planned output and destination safety. `Script/Site/Test/Publish.test.ts` exercises the cloud-independent adapter contract without real cloud mutations.

Automated tests must never use production AWS or Vercel credentials. Use an injected `PublishingAdapter`, zero-delay retry, and temporary repositories.

## Fixture Matrix

Changes to templates, framework versions, themes, or rendering integration should be validated with disposable sites covering:

| Fixture | Required checks |
| --- | --- |
| Fluent Docusaurus | Type-check; build `en-US` and `es-US`; verify landing, docs, MDX React, Twoslash, current and version routes; inspect light/dark pages. |
| Effect Docusaurus | Same route and build checks; inspect zinc/grid/glow styling and external font fallback. |
| Fluent Storybook without landing | Type-check and build manager directly at `/`; inspect manager and preview in both modes. |
| Fluent Storybook with landing | Build landing at `/` and manager at `/storybook/`; inspect both outputs. |
| Effect Storybook without landing | Type-check/build and inspect dark-default manager and both preview modes. |
| Effect Storybook with landing | Build both route roots and inspect landing plus manager/preview. |

Fixture repositories and generated context-map rows must be removed after validation. Never commit a generated example site merely to test the generator.

## Visual Validation

Theme changes require browser inspection in addition to successful compilation. At minimum inspect:

- landing headings, feature cards, installation panel, and final action;
- navigation translucency and readable foreground/background contrast;
- documentation prose, code fences, and Twoslash hover markup;
- version and locale navigation;
- Storybook manager navigation and docs panels;
- component previews with light and dark toolbar choices; and
- desktop and mobile viewport selections.

Shared `@sorrell/ui` classes may encode Effect-oriented colors. The Fluent Docusaurus theme deliberately overrides landing colors in both modes; recheck those overrides whenever `@sorrell/ui` landing primitives change.

## Generator Changes

When adding a manifest field:

1. Add it to the appropriate Effect Schema and exported definition type.
2. Decide whether it is required or has a decoding default.
3. Add the equivalent CLI option or prompt when users must select it.
4. Use it in the framework factory or generated source.
5. Update golden/fixture expectations and malformed-input tests.
6. Update [Website configuration](./Configuration.md) and the relevant framework guide.

When changing generated files, test both `PlanWebsite` and `GenerateWebsite`. Confirm that dry-run output is complete, the destination remains bounded, a nonempty destination is untouched, and `CONTEXT-MAP.md` receives exactly one row.

## Publishing Changes

Keep cloud orchestration testable through `PublishingAdapter`. Add fake-adapter coverage for:

- initial publication;
- repeat publication with matching state;
- already-verified domains;
- DNS conflicts without replacement;
- explicit replacement;
- verification timeout;
- deployment success followed by DNS failure; and
- publication dry run.

Do not weaken conflict detection, persist credentials, or delete a successful deployment as an automatic rollback. A partial failure must continue to expose an immutable deployment URL and safe retry command.

## Dependency Upgrades

Docusaurus, Storybook, Shiki, and Twoslash integrate at build-tool boundaries where minor releases can change plugin contracts. Upgrade one family at a time, update exact generator versions and package peer ranges together, reinstall from the root, and run the full fixture matrix.

For Storybook presets, confirm that `managerEntries` and `previewAnnotations` return only the entries introduced by the preset. For Docusaurus, confirm that the ESM `docusaurus.config.mjs` can load workspace packages and that localized/versioned output routes still build.

## Scope Boundaries

Do not add a root site, a `docs.sorrell.sh` default, apex-domain support, wildcard DNS management, or generated CI workflows without a separate design decision. Each site must continue to choose and own its package name, subdomain, and Vercel project.
