/**
 * Logged statements from {@link TaskState | Tasks} that can be displayed by {@link Log.Handle | Logs}.
 *
 * @module @sorrell/effect-ink/Task/Output
 */

/**
 * @file      Output.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type * as Log from "./Log.ts";
import * as Utility from "./Internal/Utility.ts";
import { Data, DateTime } from "effect";
import type { ReactNode } from "react";

export const TypeId: string = "@sorrell/effect-ink/Task/Output";

export interface Output extends Utility.Handled<Handle>
{
    readonly _tag: "Output";

    readonly Content: ReactNode;
    readonly Timestamp: DateTime.DateTime;
}

export const IsOutputHandle: Utility.HandleGuard<Handle> = Utility.MakeHandleGuard(TypeId);

export type Handle = Utility.Handle<"Output">;
export const Handle: Utility.HandleConstructor<Handle> = Utility.MakeHandleConstructor(TypeId);

// export type Style = Data.TaggedEnum<{
//     PerTask: object;
//     Pooled: object;
// }>;

// /* eslint-disable-next-line @typescript-eslint/typedef */
// export const Style = Data.taggedEnum<Style>();

export const Output = (Content: ReactNode, TimestampOverride?: DateTime.DateTime | Date): Output =>
{
    return {
        _tag: "Output",

        Content,
        Timestamp: DateTime.isDateTime(TimestampOverride)
            ? TimestampOverride
            : TimestampOverride !== undefined
                ? DateTime.fromDateUnsafe(TimestampOverride)
                : DateTime.fromDateUnsafe(new Date())
    };
};

export type Display = Data.TaggedEnum<{
        Hidden: { };

    Visible:
    {
        readonly IfEmpty: boolean;
    };
}>;

/* eslint-disable-next-line @typescript-eslint/typedef */
export const Display = Data.taggedEnum<Display>();
