/**
 * Native logging integration for native bridge.
 *
 * @module @sorrell/log/Native/NativeBridge
 *
 * @file      NativeBridge.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Category from "../Category.js";
import type { CategoryInput } from "../Category.js";
import type { UnsafePublisher } from "../Logger.js";
import type { ProcessMetadata } from "../LogRecord.js";
import {
    Validate
} from "./NativeValidation.js";
import type { NativeValidationOptions } from "./NativeRecord.js";
import type { Thunk } from "@sorrell/effect/Function";

/** Native callback composition and validation configuration. */
export interface NativeCallbackOptions extends NativeValidationOptions
{
    readonly DefaultCategory?: CategoryInput;
    readonly Process?: ProcessMetadata;
}

/** Construct the callback passed to a native addon's Bridge.Create operation. */
export function CreateCallback(
    Runtime: UnsafePublisher,
    Options: NativeCallbackOptions = { }
): (Input: unknown) => void
{
    const DefaultCategory = Category.Make(Options.DefaultCategory ?? "Native");

    return (Input: unknown): void =>
    {
        const Record = Validate(Input, Options);
        if (Record === undefined)
        {
            return;
        }

        const RecordCategory = Category.Make(Record.Category);
        const CategoryValue = Category.IsWithin(RecordCategory, DefaultCategory)
            ? RecordCategory
            : Category.Child(DefaultCategory, RecordCategory);

        Runtime.PublishUnsafe({
            Annotations: Record.Fields,
            Category: CategoryValue,
            Level: Record.Level,
            Message: [ Record.Message ],
            Process: {
                ...Options.Process,
                ProcessType: Options.Process?.ProcessType ?? "NativeWorker",
                ...(Record.ThreadIdentifier === undefined
                    ? { }
                    : { ThreadIdentifier: Record.ThreadIdentifier })
            },
            Source: "Native"
        });
    };
}

/** Minimal native addon bridge lifecycle surface. */
export interface ReleasableBridge
{
    readonly Release?: Thunk;
    readonly Close?: Thunk;
}

/** Release an add-on bridge using its idempotent final lifecycle operation. */
export function Release(Bridge: ReleasableBridge): void
{
    if (Bridge.Close !== undefined)
    {
        Bridge.Close();
    }
    else
    {
        Bridge.Release?.();
    }
}
