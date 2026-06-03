/**
 * This module extends {@link https://effect-ts.github.io/effect/cli/BuiltInOptions.ts.html | the original}
 * by modifying the `--completions` argument
 * to generate completions for PowerShell.
 *
 * @module @sorrell/effect-cli/BuiltInOptions
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace, jsdoc/require-jsdoc,
   jsdoc/require-param, jsdoc/require-description, jsdoc/require-returns */

/**
 * @file      BuiltInOptions.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as LogLevel from "effect/LogLevel";
import * as Option from "effect/Option";
import * as Options from "./Options.js";
import type { Command } from "./CommandDescriptor.js";
import type { HelpDoc } from "./HelpDoc.js";
import type { Usage } from "./Usage.js";

export * from "@effect/cli/BuiltInOptions";

export type BuiltInOptions =
    | SetLogLevel
    | ShowHelp
    | ShowCompletions
    | ShowWizard
    | ShowVersion;

export interface SetLogLevel
{
    readonly _tag: "SetLogLevel";
    readonly level: LogLevel.LogLevel;
}

export interface ShowHelp
{
    readonly _tag: "ShowHelp";
    readonly usage: Usage;
    readonly helpDoc: HelpDoc;
}

export interface ShowCompletions
{
    readonly _tag: "ShowCompletions";
    readonly shellType: BuiltInOptions.ShellType;
}

export interface ShowWizard
{
    readonly _tag: "ShowWizard";
    readonly command: Command<unknown>;
}

export interface ShowVersion
{
    readonly _tag: "ShowVersion";
}

export declare namespace BuiltInOptions
{
    export type ShellType =
        | "bash"
        | "fish"
        | "zsh"
        | "powershell"
        | "pwsh";
}

const setLogLevel = (
    Level: LogLevel.LogLevel
): BuiltInOptions => ({
    _tag: "SetLogLevel",
    level: Level
});

export const showCompletions = (
    ShellType: BuiltInOptions.ShellType
): BuiltInOptions => ({
    _tag: "ShowCompletions",
    shellType: ShellType
});

export const showHelp = (
    UsageValue: Usage,
    HelpDocument: HelpDoc
): BuiltInOptions => ({
    _tag: "ShowHelp",
    helpDoc: HelpDocument,
    usage: UsageValue
});

export const showWizard = (
    CommandValue: Command<unknown>
): BuiltInOptions => ({
    _tag: "ShowWizard",
    command: CommandValue
});

export const showVersion: BuiltInOptions = {
    _tag: "ShowVersion"
};

export const isShowCompletions = (
    Self: BuiltInOptions
): Self is ShowCompletions =>
    Self._tag === "ShowCompletions";

export const isShowHelp = (
    Self: BuiltInOptions
): Self is ShowHelp =>
    Self._tag === "ShowHelp";

export const isShowWizard = (
    Self: BuiltInOptions
): Self is ShowWizard =>
    Self._tag === "ShowWizard";

export const isShowVersion = (
    Self: BuiltInOptions
): Self is ShowVersion =>
    Self._tag === "ShowVersion";

const CompletionsOptions: Options.Options<Option.Option<BuiltInOptions.ShellType>> =
    Options.choiceWithValue(
        "completions",
        [
            [ "sh", "bash" ],
            [ "bash", "bash" ],
            [ "fish", "fish" ],
            [ "zsh", "zsh" ],
            [ "powershell", "powershell" ],
            [ "pwsh", "pwsh" ]
        ] as const
    ).pipe(
        Options.optional,
        Options.withDescription("Generate a completion script for a specific shell.")
    );

const LogLevelOptions: Options.Options<Option.Option<LogLevel.LogLevel>> =
    Options.choiceWithValue(
        "log-level",
        LogLevel.allLevels.map((Level: LogLevel.LogLevel) =>
            [ Level._tag.toLowerCase(), Level ] as const
        )
    ).pipe(
        Options.optional,
        Options.withDescription("Sets the minimum log level for a command.")
    );

const HelpOptions: Options.Options<boolean> =
    Options.boolean("help").pipe(
        Options.withAlias("h"),
        Options.withDescription("Show the help documentation for a command.")
    );

const VersionOptions: Options.Options<boolean> =
    Options.boolean("version").pipe(
        Options.withDescription("Show the version of the application.")
    );

const WizardOptions: Options.Options<boolean> =
    Options.boolean("wizard").pipe(
        Options.withDescription("Start wizard mode for a command.")
    );

/* eslint-disable @typescript-eslint/typedef */

const BuiltIns = Options.all({
    completions: CompletionsOptions,
    help: HelpOptions,
    logLevel: LogLevelOptions,
    version: VersionOptions,
    wizard: WizardOptions
});

/* eslint-enable @typescript-eslint/typedef */

export const builtInOptions = (
    CommandValue: Command<unknown>,
    UsageValue: Usage,
    HelpDocument: HelpDoc
): Options.Options<Option.Option<BuiltInOptions>> =>
    /* eslint-disable-next-line @typescript-eslint/typedef */
    Options.map(BuiltIns, (BuiltIn) =>
    {
        if (Option.isSome(BuiltIn.completions))
        {
            return Option.some(showCompletions(BuiltIn.completions.value));
        }

        if (Option.isSome(BuiltIn.logLevel))
        {
            return Option.some(setLogLevel(BuiltIn.logLevel.value));
        }

        if (BuiltIn.help)
        {
            return Option.some(showHelp(UsageValue, HelpDocument));
        }

        if (BuiltIn.wizard)
        {
            return Option.some(showWizard(CommandValue));
        }

        if (BuiltIn.version)
        {
            return Option.some(showVersion);
        }

        return Option.none();
    });
