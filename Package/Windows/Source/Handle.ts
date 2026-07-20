/**
 * Handles to objects owned by the Windows API, typed via {@link effect/Brand},
 * and serialized as `bigint`s.
 *
 * @module @sorrell/windows/Handle
 *
 * @file      Handle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Brand } from "effect";

export type Any =
    | HWND;

type Handle<TagType extends string> = Brand.Branded<bigint, TagType>;

export type HWND = Handle<"HWND">;
export type HMONITOR = Handle<"HMONITOR">;

