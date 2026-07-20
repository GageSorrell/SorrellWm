/**
 *
 *
 * @module @sorrell/effect-ink/Component/Text
 * @internal
 *
 * @file      UseTextState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TextProps, TextState } from "./Text.Types.ts";
import { ApplyCursor } from "../../Utility.ts";

export const UseTextState = (Props: TextProps): TextState =>
{
    const children: string =
        {
            Hidden: " ",
            Password: ApplyCursor(
                "*".repeat(Props.State.value.length),
                Props.State.cursor,
                Props.IsSubmitted,
                Props.IsValidating
            ),
            Text: ApplyCursor(
                Props.State.value,
                Props.State.cursor,
                Props.IsSubmitted,
                Props.IsValidating
            )
        }[Props.Options.type];

    const inverse: boolean = Props.Options.type === "Hidden";

    return { children, inverse } as const;
};
