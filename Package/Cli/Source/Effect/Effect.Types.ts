/**
 * @file      Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TRequirements, TRequirementsArgument } from "../Options/Options.Types.js";
import { Command } from "@effect/cli";

export type CommandFn<A, R extends TRequirements> =
    {
        (Argument: TRequirementsArgument<R>): PromiseLike<A>;
    };

export type CliCommand<NameType extends string, RequirementsType extends TRequirements> = Command.Command<NameType, never, never, TRequirementsArgument<RequirementsType>>;
