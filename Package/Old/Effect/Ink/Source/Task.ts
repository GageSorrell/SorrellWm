/**
 * Describe work done in response to user input.
 *
 * @module @sorrell/effect-ink/Task
 *
 * @file      Task.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Context from "effect/Context";
import * as Internal from "./Internal/index.ts";

export const TypeIdKey: "~sorrell/effect-ink/Task" = "~sorrell/effect-ink/Task" as const;
export type TypeIdKey = typeof TypeIdKey;

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export type Handle = Internal.Handle.Handle<TypeIdKey>;

export interface Reference extends Internal.Handle.Factory<Handle> { }

export const Reference: Context.Reference<Reference> = Context.Reference<Reference>(
    TypeIdKey,
    {
        defaultValue: () =>
        {
            const Factory: Internal.Handle.Factory<Handle> =
                Internal.Handle.Reference.defaultValue().GetFactory(TypeIdKey);

            return Factory;
        }
    }
);
