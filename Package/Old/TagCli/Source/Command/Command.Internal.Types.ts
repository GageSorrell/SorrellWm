/**
 * @file      Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Command, Options } from "@sorrell/effect/unstable/cli";

export type TOptionsBase<InnerConfigType extends Command.Command.Config> =
    {
        [ Key in keyof InnerConfigType ]: InnerConfigType[Key] extends Args.Args<infer Type>
            ? Type
            : InnerConfigType[Key] extends Options.Options<infer Type>
                ? Type
                : never;
    };
