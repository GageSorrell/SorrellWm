/**
 *
 *
 * @module @sorrell/wm/Main/Development/DevFlags
 *
 * @file      DevFlags.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Config, Effect, pipe } from "effect";

export/**
       * Feature flags to assist with development.
       *
       * @since 0.1.0
       */
const DevFeatures = Effect.gen(function* ()
{
    const Defaults =
        {
            StaticOverlay: false,
            TileOnStart: false
        } as const;
    return yield* pipe(
        Config.all({
            StaticOverlay: Config.boolean("STATIC_OVERLAY"),
            TileOnStart: Config.boolean("TILE_ON_START")
        }),
        Config.withDefault(Defaults),
        Config.nested("WM_DEV"),
        Effect.catch(() => Effect.succeed(Defaults))
    );
});
