/**
 * @file      Module.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ValidExtensions } from "./Module";

export namespace Extension
{
    export type Any = typeof ValidExtensions.Any[number];

    export type Declaration = typeof ValidExtensions.Declaration[number];

    export type Source = typeof ValidExtensions.Source[number];
}

export type ExtensionPolicy =
    | "Require"
    | "Disallow"
    | ReadonlyArray<Extension.Any>;
