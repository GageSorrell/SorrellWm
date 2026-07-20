/**
 * Utilities for {@link \@sorrell/effect-ink/Prompt}.
 *
 * @module @sorrell/effect-ink/Internal/Prompt
 * @internal
 */

/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Prompt from "../Prompt.ts";
import { Effectable } from "effect";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeInspectSymbol } from "effect/Inspectable";
import { Unify } from "effect";
/* eslint-enable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/typedef */

export const Prototype =
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        ...Effectable.Prototype<Prompt.Prompt<any>>({
            evaluate()
            {
                return Prompt.Run(this);
            },
            label: "InkPrompt"
        }),
        [ Prompt.TypeId ]:
        {
            _A: (_: never) => _,
            _E: (_: never) => _,
            _R: (_: never) => _
        }
    };
