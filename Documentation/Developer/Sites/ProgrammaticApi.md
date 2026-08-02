# Programmatic API

Most users should use `sorrell-site`, but the platform exposes lower-level interfaces for custom generators, configuration composition, and deterministic publishing tests.

## Entry Points

| Import | Contents |
| --- | --- |
| `@sorrell/site-core/Schema` | Website schemas, definition types, and `DecodeWebsiteDefinition`. |
| `@sorrell/site-core/Docusaurus` | `CreateDocusaurusConfig`, `DefineDocusaurusConfig`, and `DocusaurusTheme`. |
| `@sorrell/site-core/Storybook` | `CreateStorybookConfig`, `DefineStorybookConfig`, and `StorybookTheme`. |
| `@sorrell/site-core/Twoslash` | The shared `TwoslashRehypePlugin` tuple. |
| `@sorrell/site/Generator` | Safe planning and Effect-based filesystem generation. |
| `@sorrell/site/Publish` | Cloud-independent static publication workflow and adapter types. |

The `@sorrell/site` root module is the CLI entry point and runs the program. Use the explicit subpath exports when importing library behavior.

## Schema API

The schema module exports:

- `LandingActionSchema`;
- `LandingFeatureSchema`;
- `LandingContentSchema`;
- `DocusaurusWebsiteSchema`;
- `StorybookWebsiteSchema`;
- `WebsiteDefinitionSchema`;
- their corresponding `...Definition` TypeScript types; and
- `DecodeWebsiteDefinition`.

`DecodeWebsiteDefinition` is a synchronous Effect Schema decoder for unknown input. It applies decoding defaults for locale, versioning, output, Storybook landing state, and optional landing arrays.

```ts
import { DecodeWebsiteDefinition } from "@sorrell/site-core/Schema";

const definition = DecodeWebsiteDefinition(input);

if (definition.Kind === "Docusaurus") {
    console.log(definition.Locales);
}
```

Use the decoder at JSON and other untrusted boundaries. The generated config modules receive JSON typed by TypeScript, while the publishing CLI explicitly decodes it before acting.

## Docusaurus Factories

`CreateDocusaurusConfig` accepts a definition and an explicit package adapter:

```ts
import { CreateDocusaurusConfig } from "@sorrell/site-core/Docusaurus";

const config = CreateDocusaurusConfig(definition, {
    PackageName: "@sorrell/docusaurus-theme-fluent"
});
```

`DefineDocusaurusConfig(definition)` derives the theme package from `definition.Theme`. Use it for generated sites. Use the lower-level factory when testing a theme or supplying another plugin that conforms to:

```ts
interface DocusaurusTheme {
    readonly PackageName: string;
}
```

The Fluent and Effect Docusaurus packages export ready-made `FluentDocusaurusTheme` and `EffectDocusaurusTheme` adapters.

## Storybook Factories

`CreateStorybookConfig` follows the same shape:

```ts
import { CreateStorybookConfig } from "@sorrell/site-core/Storybook";

const config = CreateStorybookConfig(definition, {
    PackageName: "@sorrell/storybook-theme-effect"
});
```

`DefineStorybookConfig(definition)` derives the matching package. A custom adapter implements:

```ts
interface StorybookTheme {
    readonly PackageName: string;
}
```

The package name must resolve as a valid Storybook addon/preset.

## Twoslash Configuration

`TwoslashRehypePlugin` is a readonly Rehype tuple containing `@shikijs/rehype` and shared options:

```ts
import { TwoslashRehypePlugin } from "@sorrell/site-core/Twoslash";
```

It selects `github-light` and `github-dark` and installs `transformerTwoslash({ explicitTrigger: true })`. `CreateDocusaurusConfig` places it in `beforeDefaultRehypePlugins` for documentation MDX.

## Generator API

`PlanWebsite` is a pure operation that validates the destination and returns file operations without reading or writing the filesystem:

```ts
import { PlanWebsite } from "@sorrell/site/Generator";

const plan = PlanWebsite({
    Definition: definition,
    Destination: "Website/WindowAPI",
    DryRun: true,
    RepositoryRoot: "E:/SorrellWm"
});

for (const operation of plan.Operations) {
    console.log(operation.Path);
}
```

The generator module exposes:

| Export | Purpose |
| --- | --- |
| `ValidateOutputPath` | Resolves a destination and requires a direct child of `Website/`. |
| `PlanWebsite` | Produces a `GenerateResult` and `FileOperation` list. |
| `GenerateWebsite` | Effect requiring `FileSystem.FileSystem`; refuses nonempty destinations, writes files, and updates `CONTEXT-MAP.md`. |
| `GeneratorError` | Tagged error with a human-readable `Message`. |
| `GenerateOptions`, `GenerateResult`, `FileOperation` | Public input/result models. |

A plan includes an operation for `CONTEXT-MAP.md`; its empty `Content` is a marker because the applied generator performs an idempotent table update rather than replacing the file with that value.

Provide an Effect platform filesystem layer when running `GenerateWebsite`. The CLI uses `@effect/platform-node`'s `NodeServices.layer`.

## Publishing API

`PublishWebsite` is cloud- and filesystem-independent. Callers supply already-read `DeploymentFile` values and a `PublishingAdapter`:

```ts
import { PublishWebsite } from "@sorrell/site/Publish";

const result = await PublishWebsite({
    Adapter: publishingAdapter,
    Definition: definition,
    Files: deploymentFiles,
    RetryWorkspace: "Website/WindowAPI"
});
```

The adapter boundary is:

```ts
interface PublishingAdapter {
    readonly EnsureProject: (name: string) => Promise<string>;
    readonly Deploy: (
        projectId: string,
        projectName: string,
        files: ReadonlyArray<DeploymentFile>
    ) => Promise<{ readonly DeploymentUrl: string }>;
    readonly AttachDomain: (
        projectId: string,
        domain: string
    ) => Promise<DomainRequirements>;
    readonly ApplyDns: (
        records: ReadonlyArray<RequiredDnsRecord>,
        replace: boolean
    ) => Promise<void>;
    readonly WaitForDns: () => Promise<void>;
    readonly VerifyDomain: (
        projectId: string,
        domain: string
    ) => Promise<boolean>;
}
```

`RequiredDnsRecord` supports `CNAME` and `TXT`. `DeploymentFile` contains normalized `Path`, SHA-1 `Sha1`, and byte `Content`.

The default verification retry is 60 attempts separated by ten seconds. Tests can inject `Retry: { Attempts, Delay }` to avoid real waits. A successful result contains `ProductionUrl` and `DeploymentUrl`.

After `Deploy` succeeds, any later error is wrapped as `DnsPublicationError`. Inspect its `DeploymentUrl`, `Message`, and `RetryCommand` instead of treating the deployment as lost.

The concrete Vercel/Route 53 adapter and filesystem hashing helper are internal to the CLI package rather than exported subpaths. This keeps SDK details behind the tested adapter contract.
