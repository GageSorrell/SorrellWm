/**
 *
 *
 * @module @sorrell/site/Generator
 *
 * @file      Generator.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { Data, Effect, FileSystem } from "effect";
import type { DocusaurusWebsiteDefinition, StorybookWebsiteDefinition, WebsiteDefinition } from "@sorrell/site-core/Schema";

export const GeneratorTypeId = Symbol.for("@sorrell/site/Generator");
export type GeneratorTypeId = typeof GeneratorTypeId;

/** One planned filesystem mutation. */
export interface FileOperation
{
    readonly Content: string;
    readonly Path: string;
}

/** Inputs shared by both generators. */
export interface GenerateOptions
{
    readonly Definition: WebsiteDefinition;
    readonly Destination: string;
    readonly DryRun?: boolean;
    readonly RepositoryRoot: string;
}

/** The result of planning or applying a generated website. */
export interface GenerateResult
{
    readonly Destination: string;
    readonly DryRun: boolean;
    readonly Operations: ReadonlyArray<FileOperation>;
}

/** A safe generator validation failure. */
export class GeneratorError extends Data.TaggedError("GeneratorError")<{ readonly Message: string }> { }

/** Validate that a generated path remains under the repository's Website directory. @category Validation @since 1.0.0 */
export const ValidateOutputPath = (RepositoryRoot: string, Destination: string): string =>
{
    const WebsiteRoot = resolve(RepositoryRoot, "Website");
    const Resolved = resolve(RepositoryRoot, Destination);
    const Relative = relative(WebsiteRoot, Resolved);
    if (Relative === "" || Relative.startsWith(`..${ sep }`) || Relative === ".." || isAbsolute(Relative))
    {
        throw new GeneratorError({ Message: "Generated websites must be direct children of Website/." });
    }
    if (Relative.includes(sep))
    {
        throw new GeneratorError({ Message: "Generated websites must be direct children of Website/." });
    }
    return Resolved;
};

/** Plan all files for a generated website without touching the filesystem. @category Generator @since 1.0.0 */
export const PlanWebsite = (Options: GenerateOptions): GenerateResult =>
{
    const Destination = ValidateOutputPath(Options.RepositoryRoot, Options.Destination);
    const Files = Options.Definition.Kind === "Docusaurus" ?
        DocusaurusFiles(Options.Definition) : StorybookFiles(Options.Definition);
    const ContextMapPath = join(Options.RepositoryRoot, "CONTEXT-MAP.md");
    return {
        Destination,
        DryRun: Options.DryRun ?? false,
        Operations: [
            ...Object.entries(Files).map(([ Path, Content ]) => ({ Content, Path: join(Destination, Path) })),
            { Content: "", Path: ContextMapPath }
        ]
    };
};

/** Generate a website, or return its dry-run operation list. @category Generator @since 1.0.0 */
export const GenerateWebsite = (Options: GenerateOptions): Effect.Effect<GenerateResult, Error, FileSystem.FileSystem> =>
    Effect.gen(function*()
    {
        const FileSystemService = yield* FileSystem.FileSystem;
        const Result = PlanWebsite(Options);
        const Exists = yield* FileSystemService.exists(Result.Destination);
        if (Exists)
        {
            const Entries = yield* FileSystemService.readDirectory(Result.Destination);
            if (Entries.length > 0)
            {
                return yield* Effect.fail(new GeneratorError({ Message: `${ Result.Destination } is not empty.` }));
            }
        }
        if (Result.DryRun)
        {
            return Result;
        }
        for (const Operation of Result.Operations.slice(0, -1))
        {
            yield* FileSystemService.makeDirectory(resolve(Operation.Path, ".."), { recursive: true });
            yield* FileSystemService.writeFileString(Operation.Path, Operation.Content);
        }
        yield* UpdateContextMap(FileSystemService, Options.RepositoryRoot, Result.Destination);
        return Result;
    });

const Json = (Value: unknown): string => `${ JSON.stringify(Value, undefined, 4) }\n`;
const ThemePackage = (Theme: "Effect" | "Fluent", Framework: "docusaurus" | "storybook"): string =>
    `@sorrell/${ Framework }-theme-${ Theme.toLowerCase() }`;

const SharedDependencies = (Definition: WebsiteDefinition): Record<string, string> => ({
    "@sorrell/docs-landing": "1.0.0",
    "@sorrell/site-core": "1.0.0",
    [ThemePackage(Definition.Theme, Definition.Kind === "Docusaurus" ? "docusaurus" : "storybook")]: "1.0.0",
    "@sorrell/ui": "1.0.0",
    react: "19.2.7",
    "react-dom": "19.2.7"
});

const DocusaurusFiles = (Definition: DocusaurusWebsiteDefinition): Record<string, string> => ({
    "package.json": Json({
        name: Definition.PackageName, private: true, version: "1.0.0",
        scripts: {
            build: "docusaurus build", "docs:version": "docusaurus docs:version", publish: "sorrell-site publish .",
            start: "docusaurus start --locale en-US", "start:es-US": "docusaurus start --locale es-US",
            "write-translations": "docusaurus write-translations --locale es-US", typecheck: "tsc --noEmit"
        },
        dependencies: { ...SharedDependencies(Definition), "@docusaurus/core": "3.10.2", "@docusaurus/preset-classic": "3.10.2", "@mdx-js/react": "3.1.1" },
        devDependencies: { "@docusaurus/module-type-aliases": "3.10.2", "@docusaurus/tsconfig": "3.10.2", "@docusaurus/types": "3.10.2", typescript: "6.0.2" }
    }),
    "website.config.json": Json(Definition),
    "docusaurus.config.mjs": `import { DefineDocusaurusConfig } from "@sorrell/site-core/Docusaurus";\nimport Definition from "./website.config.json" with { type: "json" };\nexport default DefineDocusaurusConfig(Definition);\n`,
    "sidebars.ts": `import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";\nexport default { docs: [ { type: "autogenerated", dirName: "." } ] } satisfies SidebarsConfig;\n`,
    "tsconfig.json": Json({ extends: "@docusaurus/tsconfig", compilerOptions: { allowImportingTsExtensions: true, ignoreDeprecations: "6.0" }, include: [ "src", "sidebars.ts" ] }),
    "docs/intro.mdx": `---\ntitle: Introduction\nslug: /\n---\n\n# ${ Definition.Title }\n\nWelcome to the documentation.\n\n\`\`\`ts twoslash\nconst title: string = "${ Definition.Title }"\ntitle\n\`\`\`\n`,
    "i18n/es-US/docusaurus-plugin-content-docs/current/intro.mdx": `---\ntitle: Introducción\nslug: /\n---\n\n# ${ Definition.Title }\n\nBienvenido a la documentación.\n`,
    "src/pages/index.tsx": LandingPage(Definition),
    "src/theme/MDXComponents.tsx": `import MDXComponents from "@theme-original/MDXComponents";\nimport { InstallCommandPanel } from "@sorrell/ui";\nexport default { ...MDXComponents, InstallCommandPanel };\n`
});

const StorybookFiles = (Definition: StorybookWebsiteDefinition): Record<string, string> =>
{
    const BuildScript = Definition.LandingEnabled ? "vite build && storybook build -o build/storybook" : "storybook build -o build";
    const Files: Record<string, string> = {
        "package.json": Json({
            name: Definition.PackageName, private: true, version: "1.0.0", type: "module",
            scripts: { build: BuildScript, publish: "sorrell-site publish .", storybook: "storybook dev -p 6006", typecheck: "tsc --noEmit" },
            dependencies: SharedDependencies(Definition),
            devDependencies: { "@storybook/addon-a11y": "10.5.5", "@storybook/addon-docs": "10.5.5", "@storybook/react-vite": "10.5.5", storybook: "10.5.5", typescript: "6.0.2", vite: "^7.1.5" }
        }),
        "website.config.json": Json(Definition),
        ".storybook/main.ts": `import { DefineStorybookConfig } from "@sorrell/site-core/Storybook";\nimport Definition from "../website.config.json" with { type: "json" };\nexport default DefineStorybookConfig(Definition);\n`,
        "tsconfig.json": Json({ compilerOptions: { jsx: "react-jsx", module: "NodeNext", moduleResolution: "NodeNext", noEmit: true, strict: true, target: "ES2023" }, include: [ ".storybook", "src" ] })
    };
    if (Definition.LandingEnabled)
    {
        Files["index.html"] = `<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n`;
        Files["src/style.d.ts"] = `declare module "*.css";\ndeclare module "@sorrell/ui/style.css";\n`;
        Files["vite.config.ts"] = `import { defineConfig } from "vite";\nexport default defineConfig({ build: { emptyOutDir: true, outDir: "build" } });\n`;
        Files["src/main.tsx"] = `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport { DocsLanding } from "@sorrell/docs-landing";\nimport "@sorrell/ui/style.css";\ncreateRoot(document.getElementById("root")!).render(<StrictMode><DocsLanding productName=${ JSON.stringify(Definition.Title) } description=${ JSON.stringify(Definition.Landing.Description) } installationPackage=${ JSON.stringify(Definition.Landing.InstallationPackage) } actions={${ Json((Definition.Landing.Actions ?? []).map(({ Href, Label }) => ({ href: Href, label: Label }))).trim() }} features={${ Json((Definition.Landing.Features ?? []).map(({ Description, Points, Title }) => ({ description: Description, points: Points, title: Title }))).trim() }} /></StrictMode>);\n`;
    }
    return Files;
};

const LandingPage = (Definition: WebsiteDefinition): string =>
    `import { DocsLanding } from "@sorrell/docs-landing";\nimport Layout from "@theme/Layout";\nimport "@sorrell/ui/style.css";\nexport default function Home() { return <Layout><DocsLanding productName=${ JSON.stringify(Definition.Title) } description=${ JSON.stringify(Definition.Landing.Description) } installationPackage=${ JSON.stringify(Definition.Landing.InstallationPackage) } actions={${ Json((Definition.Landing.Actions ?? []).map(({ Href, Label }) => ({ href: Href, label: Label }))).trim() }} features={${ Json((Definition.Landing.Features ?? []).map(({ Description, Points, Title }) => ({ description: Description, points: Points, title: Title }))).trim() }} /></Layout>; }\n`;

const UpdateContextMap = (FileSystemService: FileSystem.FileSystem, RepositoryRoot: string, Destination: string): Effect.Effect<void, Error> =>
    Effect.gen(function*()
    {
        const ContextMapPath = join(RepositoryRoot, "CONTEXT-MAP.md");
        const Existing = yield* FileSystemService.readFileString(ContextMapPath);
        const Workspace = `Website/${ basename(Destination) }`;
        if (Existing.includes(`| ${ Workspace } |`)) return;
        const Row = `| ${ Workspace } | [${ Workspace }/CONTEXT.md](./${ Workspace }/CONTEXT.md) |`;
        const Marker = "\nNone of these `CONTEXT.md` files exist yet";
        const Next = Existing.includes(Marker) ?
            Existing.replace(Marker, `\n${ Row }${ Marker }`) :
            `${ Existing.trimEnd() }\n${ Row }\n`;
        yield* FileSystemService.writeFileString(ContextMapPath, Next);
    });
