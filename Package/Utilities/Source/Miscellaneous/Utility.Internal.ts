/**
 * @file      Utility.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { IsRuntimeModeProduction } from "../Dependency/Dependency.ts";

export/**
       * The `unique symbol` used to define the {@link NoOptionsType | NoOptions} type.
       */
const NoOptions: unique symbol = Symbol("NoOptions");

export/**
       * The default value of the `TruthyValues` argument of {@link IsRuntimeModeProduction}.
       */
const DefaultTruthyValues: ReadonlyArray<string> =
    [
        "true",
        "1",
        "yes",
        "y",
        "on"
    ] as const;
