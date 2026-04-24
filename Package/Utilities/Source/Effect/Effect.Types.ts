/**
 * @file      Effect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";

export type Any = Effect.Effect<any, any, any>;

export type Factory<ArgumentVectorType, EffectType extends Any> =
    [ ArgumentVectorType ] extends [ never ]
        ? {
            (): EffectType;
        }
        : {
            (): EffectType;
        };

// export type Factory<ArgumentVectorType, > =
