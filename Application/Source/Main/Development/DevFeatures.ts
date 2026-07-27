/**
 * DevFeatures customize application state during development.  Most "features"
 * are specified as `boolean` flags.
 *
 * @module @sorrell/wm/Main/Development/DevFeatures
 *
 * @file      DevFeatures.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Config, Effect, pipe } from "effect";

const Defaults =
    {
        StaticOverlay: false,
        TileOnStart: false
    } as const;

export/**
       * Feature flags to assist with development.
       *
       * @category Development
       * @since 0.1.0
       */
const DevFeatures = pipe(
    Config.all({
        StaticOverlay: Config.boolean("STATIC_OVERLAY"),
        TileOnStart: Config.boolean("TILE_ON_START")
    }),
    Config.withDefault(Defaults),
    Config.nested("WM_DEV"),
    Effect.catch(() => Effect.succeed(Defaults))
);
