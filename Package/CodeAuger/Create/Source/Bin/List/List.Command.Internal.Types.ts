/**
 * @file      List.Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import type { Requirements } from "@sorrell/utilities/effect";

export type EGetDependencyNames =
    Effect.Effect<
        ReadonlyArray<string>,
        never,
        Requirements.FsPath
    >;
