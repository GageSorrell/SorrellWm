/**
 * Tests type behavior for `@sorrell/log`.
 *
 * @module @sorrell/log/Test/Type.test
 *
 * @file      Type.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import { expectTypeOf, it } from "vitest";
import type * as Category from "../Source/Category.js";
import * as Loggable from "../Source/Loggable.js";
import type { DirectLogger } from "../Source/Logger.js";
import type { LogRuntime } from "../Source/Effect/LogRuntime.js";
import { useLogger } from "../Source/React/useLogger.js";

it("exposes stable public type boundaries", () =>
{
    expectTypeOf<Category.Category>().not.toEqualTypeOf<string>();
    expectTypeOf<Loggable.Loggable>().toHaveProperty(Loggable.TypeId);
    expectTypeOf(useLogger).returns.toEqualTypeOf<DirectLogger>();
    expectTypeOf<Effect.Effect<void, never, LogRuntime>>()
        .not.toEqualTypeOf<Effect.Effect<void>>();
});
