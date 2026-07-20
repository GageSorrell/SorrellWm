/**
 * @file      Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Command, Options } from "@sorrell/effect/unstable/cli";
import type { TOptionsBase } from "./Command.Internal.Types.js";

export type FFileText =
    | ""
    | Array<readonly [ Path: string, Content: string ]>;

export type FBaseConfig =
    {
        Files: Args.Args<FFileText>;
        Project: Options.Options<string>;
    };

export type FBaseOptions = TOptionsBase<FBaseConfig>;

export type TConfig<InnerConfigType extends Command.Command.Config> =
    FBaseConfig &
    InnerConfigType;

export type TOptions<InnerConfigType extends Command.Command.Config> =
    FBaseOptions &
    TOptionsBase<InnerConfigType>;
