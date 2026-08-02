# Website Configuration

Every generated workspace contains a secret-free `website.config.json`. `@sorrell/site-core/Schema` defines and decodes the file as a discriminated union selected by `Kind`.

Use PascalCase property names exactly as shown. Unknown JSON should be decoded with `DecodeWebsiteDefinition` before it reaches application or publishing logic.

## Common Fields

| Field | Type | Required | Default or constraint |
| --- | --- | --- | --- |
| `Kind` | `"Docusaurus" \| "Storybook"` | Yes | Selects the framework-specific schema. |
| `Title` | string | Yes | Must not be empty. |
| `PackageName` | string | Yes | Must match `@sorrell/[a-z0-9][a-z0-9-]*`. |
| `OutputDirectory` | string | No | Defaults to `build`. Generated scripts also target `build/`. |
| `Subdomain` | string | Yes | One lowercase Route 53 label; no dots or leading/trailing hyphens. |
| `VercelProjectName` | string | Yes | Dedicated project name; must not be empty. |
| `Theme` | `"Effect" \| "Fluent"` | Yes | Selects the matching framework theme package. |
| `Landing` | object | Yes | Landing content copied into React source during generation. |

`OutputDirectory` should remain `build` unless the workspace build scripts and Vite or Docusaurus output are changed at the same time. Publication fails if the configured directory does not exist after the build.

## Landing Content

```json
{
    "Description": "Reference and examples for the Window API.",
    "InstallationPackage": "@sorrell/windows",
    "Actions": [
        { "Href": "/docs", "Label": "Read the documentation" }
    ],
    "Features": [
        {
            "Title": "Typed APIs",
            "Description": "Use validated Windows primitives.",
            "Points": ["TypeScript declarations", "Effect services"]
        }
    ],
    "Links": [
        { "Href": "https://github.com/GageSorrell/SorrellWm", "Label": "Source" }
    ]
}
```

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `Description` | nonempty string | Yes | None. |
| `InstallationPackage` | nonempty string | No | Omitted installation panel. |
| `Actions` | action array | No | `[]`. |
| `Features` | feature array | No | `[]`. |
| `Links` | action array | No | `[]`. |

Each action contains nonempty `Href` and `Label` strings. Each feature contains `Title` and `Description`, plus an optional `Points` string array.

The manifest is not a live CMS. The generator serializes landing data into `src/pages/index.tsx` or `src/main.tsx`; edit that React file to update an existing site's content, icons, links, or custom sections. Keep manifest identity and publication fields synchronized separately.

## Docusaurus Definition

```json
{
    "Kind": "Docusaurus",
    "Title": "Window API",
    "PackageName": "@sorrell/window-api-docs",
    "OutputDirectory": "build",
    "Subdomain": "window-api",
    "VercelProjectName": "window-api-docs",
    "Theme": "Effect",
    "Landing": {
        "Description": "Window API documentation.",
        "Actions": [],
        "Features": [],
        "Links": []
    },
    "DefaultLocale": "en-US",
    "Locales": ["en-US", "es-US"],
    "Versioning": true
}
```

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `DefaultLocale` | nonempty string | No | `en-US`. |
| `Locales` | string array | No | `en-US`, `es-US`. |
| `Versioning` | boolean | No | `true`. |

The shared Docusaurus factory uses `DefaultLocale` and `Locales` directly. Generated sites include version-management scripts and navigation; keep `Versioning` true for the standard platform behavior.

## Storybook Definition

```json
{
    "Kind": "Storybook",
    "Title": "Sorrell UI",
    "PackageName": "@sorrell/ui-storybook",
    "OutputDirectory": "build",
    "Subdomain": "ui",
    "VercelProjectName": "ui-storybook",
    "Theme": "Fluent",
    "Landing": {
        "Description": "Components and usage examples.",
        "Actions": [],
        "Features": [],
        "Links": []
    },
    "LandingEnabled": true,
    "SourceWorkspace": "Package/SorrellUi",
    "Stories": [
        "../../../Package/SorrellUi/Source/**/*.stories.tsx"
    ]
}
```

| Field | Type | Required | Default or meaning |
| --- | --- | --- | --- |
| `LandingEnabled` | boolean | No | Defaults to `false`. Determines the generated build layout. |
| `SourceWorkspace` | nonempty string | Yes | Records the component workspace selected at creation. |
| `Stories` | string array | Yes | Passed directly to Storybook's `stories` setting. |

`SourceWorkspace` is descriptive after generation; Storybook loads the paths in `Stories`. If the source workspace moves, update the globs.

## Decoding in TypeScript

```ts
import { readFile } from "node:fs/promises";
import { DecodeWebsiteDefinition } from "@sorrell/site-core/Schema";

const definition = DecodeWebsiteDefinition(
    JSON.parse(await readFile("website.config.json", "utf8"))
);
```

Decoding applies defaults and throws a schema parse error when a value is missing or malformed. Never add Vercel tokens, AWS keys, or other credentials to this file.
