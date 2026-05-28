/**
 * @file      List.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import type { Requirements } from "@sorrell/utilities/effect";

export type EListProviders =
    Effect.Effect<
        void,
        never,
        Requirements.FsPath
    >;
