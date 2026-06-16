/**
 * The object that receives and owns {@link TaskOutput | TaskOutputs}.
 *
 * @module @sorrell/effect-ink/Task/Log
 */

import type * as Internal from "./Internal/Output.js";
import * as Utility from "./Internal/Utility.js";
import type { Effect, Stream } from "effect";
import { MakeTagged, type Untagged } from "../Utility.ts";

/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

const TypeId: string = "@sorrell/effect-ink/Task/Log";

export type Handle = Utility.Handle<"Log">;

export const Handle: Utility.HandleConstructor<Handle> = Utility.MakeHandleConstructor<Handle>(TypeId);

export const IsLogHandle: Utility.HandleGuard<Handle> = Utility.MakeHandleGuard(TypeId);

export interface Log extends Utility.Handled<Handle>
{
    readonly _tag: "Log";

    readonly Write: (Emission: Internal.OutputImpl) => Effect.Effect<void>;
    readonly GetRecent: Effect.Effect<ReadonlyArray<Internal.OutputImpl>>;
    readonly Stream: Stream.Stream<Internal.OutputImpl>;
}

export const Log: {
    (In: Untagged<Log>): Log;
} = MakeTagged("Log");
