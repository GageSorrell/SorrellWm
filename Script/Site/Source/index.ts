#!/usr/bin/env node
/**
 * Command-line entry point for generating and publishing documentation sites.
 *
 * @module @sorrell/site
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { join, relative, resolve } from "node:path";
import { Console, Effect, FileSystem, Option, pipe } from "effect";
import { Command, Flag, Param, Prompt } from "effect/unstable/cli";
import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { DecodeWebsiteDefinition, type WebsiteDefinition } from "@sorrell/site-core/Schema";
import { GenerateWebsite } from "./Generator.js";
import { MakeCloudPublishingAdapter, ReadDeploymentFiles } from "./Cloud.js";
import { PublishWebsite } from "./Publish.js";
import { RunCommand } from "./Process.js";

export const SiteCliTypeId = Symbol.for("@sorrell/site/Cli");
export type SiteCliTypeId = typeof SiteCliTypeId;

const RepositoryRoot = resolve(import.meta.dirname, "../../..");
const RequiredText = (Name: string, Message: string) => pipe(Flag.string(Name), Flag.withFallbackPrompt(Prompt.text({ message: Message })));
const ThemeFlag = pipe(Flag.choice("theme", [ "Effect", "Fluent" ]), Flag.withFallbackPrompt(Prompt.select({
    choices: [ { title: "Effect", value: "Effect" as const }, { title: "Fluent UI", value: "Fluent" as const } ],
    message: "Choose a site theme"
})));

const CommonCreateFlags = {
    destination: Flag.optional(Flag.string("destination")),
    dryRun: Flag.boolean("dry-run"),
    packageName: RequiredText("package", "Package name (for example @sorrell/example-docs)"),
    project: Flag.optional(Flag.string("vercel-project")),
    subdomain: RequiredText("subdomain", "Subdomain below sorrell.sh"),
    theme: ThemeFlag,
    title: RequiredText("title", "Website title")
};

const DocusaurusCommand = pipe(Command.make("docusaurus", CommonCreateFlags, (Input) =>
    CreateWebsite({
        Kind: "Docusaurus",
        Landing: DefaultLanding(Input.title, Input.packageName),
        Locales: [ "en-US", "es-US" ],
        OutputDirectory: "build",
        PackageName: Input.packageName,
        Subdomain: Input.subdomain,
        Theme: Input.theme,
        Title: Input.title,
        VercelProjectName: Option.getOrElse(Input.project, () => `${ Input.subdomain }-docs`),
        Versioning: true
    }, Input.destination, Input.dryRun)
), Command.withDescription("Create a localized, versioned Docusaurus website."));

const StorybookCommand = pipe(Command.make("storybook", {
    ...CommonCreateFlags,
    landing: Flag.boolean("landing"),
    source: RequiredText("source", "Source workspace containing components"),
    stories: Flag.optional(Flag.string("stories"))
}, (Input) => CreateWebsite({
    Kind: "Storybook",
    Landing: DefaultLanding(Input.title, Input.packageName),
    LandingEnabled: Input.landing,
    OutputDirectory: "build",
    PackageName: Input.packageName,
    SourceWorkspace: Input.source,
    Stories: Option.match(Input.stories, { onNone: () => [ `../../../${ Input.source }/Source/**/*.stories.@(ts|tsx)` ], onSome: (Value) => Value.split(",").map((Item) => Item.trim()) }),
    Subdomain: Input.subdomain,
    Theme: Input.theme,
    Title: Input.title,
    VercelProjectName: Option.getOrElse(Input.project, () => `${ Input.subdomain }-storybook`)
}, Input.destination, Input.dryRun)), Command.withDescription("Create a React/Vite Storybook website."));

const CreateCommand = pipe(Command.make("create", {}, () => Console.log("Choose docusaurus or storybook.")), Command.withSubcommands([ DocusaurusCommand, StorybookCommand ]),
    Command.withDescription("Create a website workspace under Website/."));

const PublishCommand = pipe(Command.make("publish", {
    dryRun: Flag.boolean("dry-run"),
    replaceDns: Flag.boolean("replace-dns"),
    workspace: Param.path(Param.argumentKind, "website-workspace", { mustExist: true, pathType: "directory" })
}, (Input) => PublishWorkspace(Input.workspace, Input.dryRun, Input.replaceDns)), Command.withDescription("Build and publish a website to its configured sorrell.sh subdomain."));

const RootCommand = pipe(Command.make("sorrell-site", {}, () => Console.log("Choose create or publish.")), Command.withSubcommands([ CreateCommand, PublishCommand ]),
    Command.withDescription("Create and publish independent Sorrell documentation websites."));

const CreateWebsite = (
    Definition: WebsiteDefinition,
    DestinationOption: Option.Option<string>,
    DryRun: boolean
): Effect.Effect<void, Error, FileSystem.FileSystem> =>
    Effect.gen(function*()
    {
        const Destination = Option.getOrElse(DestinationOption, () => `Website/${ PascalName(Definition.Title) }`);
        const Result = yield* GenerateWebsite({ Definition, Destination, DryRun, RepositoryRoot });
        yield* Console.log(DryRun ? "Planned filesystem changes:" : `Created ${ relative(RepositoryRoot, Result.Destination) }.`);
        if (DryRun) for (const Operation of Result.Operations) yield* Console.log(`  ${ relative(RepositoryRoot, Operation.Path) }`);
    });

const PublishWorkspace = (
    WorkspaceInput: string,
    DryRun: boolean,
    ReplaceDns: boolean
): Effect.Effect<void, Error, FileSystem.FileSystem | import("effect/unstable/process").ChildProcessSpawner.ChildProcessSpawner> =>
    Effect.gen(function*()
    {
        const FileSystemService = yield* FileSystem.FileSystem;
        const Workspace = resolve(RepositoryRoot, WorkspaceInput);
        const ManifestPath = join(Workspace, "website.config.json");
        const Manifest = DecodeWebsiteDefinition(JSON.parse(yield* FileSystemService.readFileString(ManifestPath)));
        const Domain = `${ Manifest.Subdomain }.sorrell.sh`;
        if (DryRun)
        {
            yield* Console.log(`Would build ${ WorkspaceInput }, deploy project ${ Manifest.VercelProjectName }, and reconcile ${ Domain }.`);
            return;
        }
        const Token = process.env.VERCEL_TOKEN;
        if (Token === undefined || Token.length === 0) return yield* Effect.fail(new Error("VERCEL_TOKEN is required."));
        const Adapter = yield* Effect.tryPromise({ catch: (Cause) => new Error("Could not initialize cloud clients.", { cause: Cause }), try: () => MakeCloudPublishingAdapter(Token, process.env.VERCEL_TEAM_ID, process.env.SORRELL_ROUTE53_ZONE_ID) });
        const Npm = process.platform === "win32" ? "npm.cmd" : "npm";
        yield* RunCommand(Npm, [ "run", "build" ], Workspace);
        const BuildPath = resolve(Workspace, Manifest.OutputDirectory ?? "build");
        if (!(yield* FileSystemService.exists(BuildPath))) return yield* Effect.fail(new Error(`Build output was not found at ${ BuildPath }.`));
        const Files = yield* Effect.tryPromise({ catch: (Cause) => new Error("Could not hash the static build.", { cause: Cause }), try: () => ReadDeploymentFiles(BuildPath) });
        const Result = yield* Effect.tryPromise({ catch: (Cause) => Cause instanceof Error ? Cause : new Error(String(Cause)), try: () => PublishWebsite({ Adapter, Definition: Manifest, Files, ReplaceDns, RetryWorkspace: WorkspaceInput }) });
        yield* Console.log(`Published ${ Result.ProductionUrl }`);
        yield* Console.log(`Immutable deployment: ${ Result.DeploymentUrl }`);
    });

const DefaultLanding = (Title: string, PackageName: string) => ({
    Actions: [ { Href: "/docs", Label: "Read the documentation" } ],
    Description: `Documentation and examples for ${ Title }.`,
    Features: [ { Description: "Learn the core concepts and API.", Points: [ "Typed examples", "Searchable documentation" ], Title: "Documentation" } ],
    InstallationPackage: PackageName,
    Links: []
});

const PascalName = (Value: string): string => Value.split(/[^a-zA-Z0-9]+/u).filter(Boolean).map((Part) => `${ Part.at(0)?.toUpperCase() ?? "" }${ Part.slice(1) }`).join("") || "Website";

const Program = pipe(Command.run(RootCommand, { version: "1.0.0" }), Effect.provide(NodeServices.layer));
NodeRuntime.runMain(Program);
