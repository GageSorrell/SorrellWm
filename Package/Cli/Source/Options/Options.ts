/**
 * @file      Options.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Options as ArrayOptions, TArray } from "@sorrell/utilities/array";
import { Options } from "@effect/cli";
import type { FGlobalConfig } from "./Options.Types.js";

/**
 * @module Options
 * Options shared by multiple commands.
 */

export/**
       * If specified and `true`, then nothing will be output to the terminal.
       */
const Silent: Options.Options<boolean> = Options.boolean("silent").pipe(Options.withAlias("s"));

/* eslint-disable @typescript-eslint/no-explicit-any */

export/**
       * An array containing all global options.
       */
const GlobalOptionsArray: TArray<Options.Options<any>, ArrayOptions.Readonly> =
    [
        Silent
    ] as const;

export const GlobalOptions: FGlobalConfig = { Silent };

/* eslint-enable @typescript-eslint/no-explicit-any */
