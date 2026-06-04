/**
 * @file      Validate.Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { Choices } from "./Validate.Command.Internal.js";
import type { Effect as EffectModule } from "effect";
export declare namespace Internal {
    namespace Validator {
        /** The type of a validator {@link Effect.Effect | effect}. */
        type Effect = EffectModule.Effect<boolean, never, never>;
        /** The possible choices for the `"validator"` argument. */
        type Choice = (typeof Choices)[number];
    }
}
//# sourceMappingURL=Validate.Command.Internal.Types.d.ts.map