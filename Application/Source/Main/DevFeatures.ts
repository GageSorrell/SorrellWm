/**
 *
 *
 * @module @sorrell/wm/Main/DevFlags
 *
 * @file      DevFlags.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Config, pipe } from "effect";

const Flag = (Name: string, Default: boolean = false): Config.Config<boolean> =>
    pipe(Config.boolean(Name), Config.withDefault(Default));

export/**
       * Feature flags to assist with development.
       *
       * @since 0.1.0
       */
const DevFeatures = pipe(
    Config.all({
        StaticOverlay: Flag("STATIC_OVERLAY")
    }),
    Config.nested("WM_DEV")
);
