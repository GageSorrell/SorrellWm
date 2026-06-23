/**
 * @file      Struct.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Prompt from "./Prompt.ts";

/* eslint-enable @typescript-eslint/no-explicit-any */

export type Value<Fields extends Record<string, Prompt.Any>> =
    {
        readonly [ Key in keyof Fields ]: Prompt.Value<Fields[Key]>;
    };

export type Error<Fields extends Record<string, Prompt.Any>> =
    {
        readonly [Key in keyof Fields]: Prompt.Error<Fields[Key]>;
    }[keyof Fields];

export type Requirements<Fields extends Record<string, Prompt.Any>> =
    {
        readonly [ Key in keyof Fields ]: Prompt.Requirements<Fields[Key]>;
    }[ keyof Fields ];
