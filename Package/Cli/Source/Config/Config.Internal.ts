/**
 * @file      Config.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Schema } from "effect";

/* eslint-disable-next-line @typescript-eslint/typedef */
export const ConfigSchema = Schema.Struct({
    Index: Schema.Struct({
        Extension: Schema.optional(
            Schema.Union(
                Schema.Literal("js"),
                Schema.Literal("ts"),
                Schema.Literal("None")
            )
        ),
        Header: Schema.optional(
            Schema.Union(
                Schema.String,
                Schema.Array(Schema.String)
            )
        )
    })
});
