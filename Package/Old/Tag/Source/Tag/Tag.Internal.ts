/**
 * @file      Tag.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Tag } from "./Tag.Types.ts";
import type { TagDecl } from "./Tag.Internal.Types.ts";
/* eslint-enable @typescript-eslint/no-unused-vars */

export/**
       * The `unique symbol` that brands the {@link TagDecl} type (and therefore the {@link Tag} as well).
       */
const TagTag: unique symbol = Symbol("__Tag");
