/**
 * @file      Config.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Options } from "@effect/cli";

export type FConfigBase =
    Record<
        string,
        | Args.Args<unknown>
        | Options.Options<unknown>
    >;
