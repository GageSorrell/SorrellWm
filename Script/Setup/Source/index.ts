/**
 * Entry point for the setup tool.
 *
 * @module @sorrell/wm-monorepo-setup/Index
 *
 * @file      Index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    ClearLocalConfiguration,
    EnsureLocalConfiguration,
    type ILocalConfiguration,
    WriteLocalConfiguration
} from "./Configuration.js";
import { Command, Flag, Param, Prompt } from "effect/unstable/cli";
import { Console, Context, Effect, pipe } from "effect";
import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { join, resolve } from "node:path";
import type { ChildProcessSpawner } from "effect/unstable/process";
import { ConfigureExtension } from "./Extension.js";
import type { FileSystem } from "effect";

interface ISetupOptions
{
    readonly Force: boolean;
    readonly PostInstall: boolean;
    readonly Verbose: boolean;
}

interface IRootCommandInput
{
    readonly force: boolean;
    readonly postinstall: boolean;
}

interface IExtensionCommandInput
{
    readonly enabled: boolean;
}

class SSetupOptions extends Context.Service<SSetupOptions, ISetupOptions>()(
    "@sorrell/wm-monorepo-setup/SetupOptions"
) { }

const RepositoryRoot: string = resolve(import.meta.dirname, "../../..");
const LocalConfigurationPath: string = join(RepositoryRoot, "Configuration", "CodeExtension.json");
const VisualStudioCodePackage: string = join(
    RepositoryRoot,
    "Package",
    "SorrellWmCodeExtension",
    "SorrellWmCodeExtension.vsix"
);

const RootCommandBase: Command.Command<
    "wm-monorepo-setup",
    Record<never, never>,
    Record<never, never>,
    Error,
    Command.Environment | SSetupOptions
> = pipe(Command.make(
    "wm-monorepo-setup",
    { },
    (): Effect.Effect<
        void,
        Error,
        Command.Environment | SSetupOptions
    > => RunAllFeatures()
), Command.withDescription(
    "Configure optional local features for the SorrellWm monorepo."
));

const ExtensionCommand: Command.Command<
    "extension",
    IExtensionCommandInput,
    Record<never, never>,
    Error,
    ChildProcessSpawner.ChildProcessSpawner | FileSystem.FileSystem | SSetupOptions
> = pipe(Command.make(
    "extension",
    {
        enabled: pipe(Param.boolean(Param.argumentKind, "enabled"), Param.withDefault(true),
            Param.withDescription("Whether the VS Code extension should be enabled."))
    },
    ({ enabled }: IExtensionCommandInput): Effect.Effect<
        void,
        Error,
        ChildProcessSpawner.ChildProcessSpawner | FileSystem.FileSystem | SSetupOptions
    > =>
        RunSetupFeatures((Options: ISetupOptions): Effect.Effect<
            boolean,
            Error,
            ChildProcessSpawner.ChildProcessSpawner
        > =>
            pipe(ConfigureExtension(enabled, Options.Verbose, {
                RepositoryRoot,
                VisualStudioCodePackage
            }), Effect.as(true))
        )
), Command.withDescription(
    "Build and install, or uninstall, the SorrellWm VS Code extension."
));

const ClearCommand: Command.Command<
    "clear",
    Record<never, never>,
    Record<never, never>,
    Error,
    FileSystem.FileSystem | SSetupOptions
> = pipe(Command.make(
    "clear",
    { },
    (): Effect.Effect<void, Error, FileSystem.FileSystem | SSetupOptions> => ClearSetupState()
), Command.withDescription(
    "Delete Configuration/CodeExtension.json and reset local setup state."
));

const RootCommand: Command.Command<
    "wm-monorepo-setup",
    IRootCommandInput,
    IRootCommandInput,
    Error,
    Command.Environment
> = pipe(RootCommandBase, Command.withSharedFlags({
        force: pipe(Flag.boolean("force"), Flag.withDescription("Run setup even when it has already completed.")),
        postinstall: pipe(Flag.boolean("postinstall"), Flag.withDescription("Run in quiet npm postinstall mode."))
    }),
    Command.withSubcommands([ ExtensionCommand, ClearCommand ]),
    Command.provideEffect(
        SSetupOptions,
        (Input: IRootCommandInput): Effect.Effect<ISetupOptions> => Effect.succeed({
            Force: Input.force,
            PostInstall: Input.postinstall,
            Verbose: !Input.postinstall
        })
    ));

const Program: Effect.Effect<void, Error> = pipe(Effect.gen(
    function*()
    {
        yield* EnsureLocalConfiguration(LocalConfigurationPath);
        yield* Command.run(RootCommand, { version: "0.1.0" });
    }
), Effect.provide(NodeServices.layer));

NodeRuntime.runMain(Program);

/**
 * Run every registered setup feature in declaration order.
 *
 * @returns {Effect.Effect<void>} An effect that completes after all features.
 */
function RunAllFeatures(): Effect.Effect<
    void,
    Error,
    Command.Environment | SSetupOptions
>
{
    return RunSetupFeatures((Options: ISetupOptions) =>
        Effect.gen(function*()
        {
            if (Options.PostInstall)
            {
                if (process.stdin.isTTY !== true || process.stdout.isTTY !== true)
                {
                    return false;
                }

                const ShouldRun: boolean = yield* Prompt.run(Prompt.confirm({
                    initial: true,
                    message: "Run local SorrellWm monorepo setup now?"
                }));

                if (!ShouldRun)
                {
                    return false;
                }
            }

            yield* ConfigureExtension(true, Options.Verbose, {
                RepositoryRoot,
                VisualStudioCodePackage
            });

            return true;
        })
    );
}

/**
 * Apply the completed-run guard, execute features, and persist success.
 *
 * @param Features - The ordered feature operation to execute.
 * @returns {Effect.Effect<void>} An effect that completes after state is saved.
 */
function RunSetupFeatures<Requirements>(
    Features: (Options: ISetupOptions) => Effect.Effect<boolean, Error, Requirements>
): Effect.Effect<void, Error, FileSystem.FileSystem | Requirements | SSetupOptions>
{
    return Effect.gen(function*()
    {
        const Options: ISetupOptions = yield* SSetupOptions;
        const Configuration: ILocalConfiguration =
            yield* EnsureLocalConfiguration(LocalConfigurationPath);

        if (Configuration.HasRun && !Options.Force)
        {
            if (Options.Verbose)
            {
                yield* Console.log(
                    "Local setup has already completed. Use --force to run it again."
                );
            }

            return;
        }

        const DidComplete: boolean = yield* Features(Options);

        if (!DidComplete)
        {
            return;
        }

        yield* WriteLocalConfiguration(LocalConfigurationPath, { HasRun: true });
    });
}

/**
 * Delete local setup state regardless of the completed-run guard.
 *
 * @returns {Effect.Effect<void>} An effect that completes after state removal.
 */
function ClearSetupState(): Effect.Effect<
    void,
    Error,
    FileSystem.FileSystem | SSetupOptions
>
{
    return Effect.gen(function*()
    {
        const Options: ISetupOptions = yield* SSetupOptions;

        yield* ClearLocalConfiguration(LocalConfigurationPath);

        if (Options.Verbose)
        {
            yield* Console.log("Cleared Configuration/CodeExtension.json.");
        }
    });
}
