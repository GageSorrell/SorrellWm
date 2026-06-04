/**
 * @file      Runtime.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Handler, Subcommand } from "../../Cli/index.js";
import type { Command } from "@sorrell/effect/unstable/cli";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Run } from "./Runtime.js";
import type { RunMain } from "@effect/platform/Runtime";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { runMain } from "@effect/platform-node/NodeRuntime";

export type Options = NonNullable<Parameters<RunMain>[1]>;

/* eslint-disable jsdoc/informative-docs */

/* eslint-disable @stylistic/max-len */

/**
 * The options passed to {@link Run}.
 *
 * @property {Command.Command<NameType, ErrorType, RequirementsType, Handler.Argument<ConfigType>>} RootCommand - The root command of your application.
 * @property {Options} RuntimeOptions - If specified, the options passed to {@link runMain}.
 * @property {Subcommand.SubcommandArray<SubcommandsErrorType, SubcommandsRequirementsType>} Subcommands - If specified, the subcommands to apply to the {@link RootCommand}.
 *
 * @template NameType - The name of the root command.
 * @template ConfigType - The config type of the root command.
 * @template ErrorType - The error type of the root command.
 * @template RequirementsType - The requirements type of the root command.
 * @template SubcommandsErrorType - The error type of the subcommands.
 * @template SubcommandsRequirementsType - The requirements type of the subcommands.
 */
export type RunOptions<
    NameType extends string,
    ConfigType extends Command.Command.Config,
    ErrorType,
    RequirementsType,
    SubcommandsErrorType,
    SubcommandsRequirementsType
> =
    Readonly<{
        RootCommand: Command.Command<
            NameType,
            RequirementsType,
            ErrorType,
            Handler.Argument<ConfigType>
        >;
        RuntimeOptions?: Options;
        Subcommands?: Subcommand.SubcommandArray<
            SubcommandsErrorType,
            SubcommandsRequirementsType
        >;
    }>;

/* eslint-enable @stylistic/max-len, jsdoc/informative-docs */
