/**
 * @file      Validate.Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type { Choices } from "./Validate.Command.Internal.js";
import type { Effect as EffectModule } from "effect";

export namespace Internal
{
    export namespace Validator
    {
        /** The type of a validator {@link Effect.Effect | effect}. */
        export type Effect =
            EffectModule.Effect<
                boolean,
                never,
                never
            >;

        /** The possible choices for the `"validator"` argument. */
        export type Choice = (typeof Choices)[number];
    }
}
