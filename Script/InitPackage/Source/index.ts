/**
 * Entry point for the package-initialization tool.
 *
 * @module @sorrell/wm-init-package
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    AuthorPrompt,
    DependenciesPrompt,
    DescriptionPrompt,
    DirectoryNamePrompt,
    HomepagePrompt,
    KeywordsPrompt,
    PackageNamePrompt,
    PrivatePrompt
} from "./Prompts.js";
import { Command, Prompt } from "effect/unstable/cli";
import { Console, Effect, pipe } from "effect";
import { ForceBoldTickInPrompts } from "./Figures.js";
import { CreatePackageManifest, ResolveAuthor } from "./PackageManifest.js";
import {
    CreateLicense,
    CreateReadMe,
    CreateSourceIndex,
    EslintConfigContent,
    GitIgnoreContent,
    NpmIgnoreContent,
    TsConfigContent
} from "./Templates.js";
import type { Answers, Author, DependencyChoice } from "./Types.js";
import { type GeneratedFile, RunCreationTasks, RunGitIdentityLookup } from "./Tasks.js";
import type { GitIdentity } from "./GitAuthor.js";
import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { ResolveDependencies } from "./Dependencies.js";
import { resolve } from "node:path";

const RepositoryRoot: string = resolve(import.meta.dirname, "../../..");

const RootCommand: Command.Command<
    "wm-init-package",
    Record<never, never>,
    Record<never, never>,
    Error,
    Command.Environment
> = pipe(Command.make(
    "wm-init-package",
    { },
    (): Effect.Effect<void, Error, Command.Environment> => RunInitPackage()
), Command.withDescription(
    "Interactively scaffold a new SorrellWm monorepo package."
));

const Program: Effect.Effect<void, Error> = pipe(
    Command.run(RootCommand, { version: "0.1.0" }),
    Effect.provide(NodeServices.layer)
);

ForceBoldTickInPrompts();

NodeRuntime.runMain(Program);

/**
 * Run the full interactive scaffolding flow: collect answers, then create
 * the new package's files and wire it into the workspace.
 *
 * @returns {Effect.Effect<void>} An effect that completes once scaffolding finishes.
 */
function RunInitPackage(): Effect.Effect<void, Error, Prompt.Environment>
{
    return Effect.gen(function*()
    {
        const DirectoryName: string = yield* Prompt.run(DirectoryNamePrompt(RepositoryRoot));
        const IsPrivate: boolean = yield* Prompt.run(PrivatePrompt);
        const PackageName: string = yield* Prompt.run(PackageNamePrompt);
        const Description: string = yield* Prompt.run(DescriptionPrompt);
        const Keywords: ReadonlyArray<string> = yield* Prompt.run(KeywordsPrompt);
        const Homepage: string = yield* Prompt.run(HomepagePrompt(DirectoryName));
        const GitIdentity: GitIdentity = yield* Effect.promise(
            (): Promise<GitIdentity> => RunGitIdentityLookup(RepositoryRoot)
        );
        const PromptedAuthor: Author | undefined = GitIdentity.Name === "Gage Sorrell"
            ? undefined
            : yield* Prompt.run(AuthorPrompt(GitIdentity));
        const Author: Author = ResolveAuthor(GitIdentity.Name, PromptedAuthor);
        const SelectedChoices: ReadonlyArray<DependencyChoice> = yield* Prompt.run(DependenciesPrompt);
        const Dependencies = yield* ResolveDependencies(RepositoryRoot, SelectedChoices);

        const Answers: Answers = {
            Author,
            Dependencies,
            Description,
            DirectoryName,
            Homepage,
            IsPrivate,
            Keywords,
            PackageName
        };
        const CurrentYear: number = new Date().getFullYear();
        const Manifest: Record<string, unknown> = CreatePackageManifest(Answers);
        const Files: Array<GeneratedFile> = [
            { Content: `${ JSON.stringify(Manifest, undefined, 4) }\n`, RelativePath: "package.json" },
            {
                Content: CreateSourceIndex(PackageName, Description, Author, CurrentYear),
                RelativePath: "Source/index.ts"
            },
            { Content: CreateLicense(Author.Name, CurrentYear), RelativePath: "License.md" },
            {
                Content: CreateReadMe(PackageName, Description, Author.Name, CurrentYear),
                RelativePath: "ReadMe.md"
            },
            { Content: GitIgnoreContent, RelativePath: ".gitignore" },
            { Content: TsConfigContent, RelativePath: "tsconfig.json" },
            { Content: EslintConfigContent, RelativePath: "eslint.config.js" },
            ...(IsPrivate ? [] : [ { Content: NpmIgnoreContent, RelativePath: ".npmignore" } ])
        ];

        yield* Effect.tryPromise({
            catch: (Cause: unknown): Error => Cause instanceof Error ? Cause : new Error(String(Cause)),
            try: (): Promise<void> => RunCreationTasks({ DirectoryName, Files, RepositoryRoot })
        });

        yield* Console.log(`\nCreated Package/${ DirectoryName } (${ PackageName }).`);
    });
}
