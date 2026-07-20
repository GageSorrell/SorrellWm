/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Wizard
 * @internal
 *
 * @file      Wizard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Effectable from "effect/Effectable";
import * as Wizard from "../Wizard.ts";

const TypeId: string = "~sorrell/effect-ink/Wizard";

const Prototype: object =
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        ...Effectable.Prototype<Wizard.Wizard<any>>({
            evaluate()
            {
                return Wizard.Run(this);
            },
            label: "InkWizard"
        }),
        [ TypeId ]:
        {
            _A: (_: never) => _
        }
    };

export const MakePrototype = (Tag: string): object =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Prototype);
    Out._tag = Tag;
    return Out;
};
