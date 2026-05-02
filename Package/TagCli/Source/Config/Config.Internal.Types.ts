/**
 * @file      Config.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import type { TagDecl } from "ts-tag/internal";

export type ETryParse = Effect.Effect<ReadonlyArray<TagDecl> | undefined, string>;
