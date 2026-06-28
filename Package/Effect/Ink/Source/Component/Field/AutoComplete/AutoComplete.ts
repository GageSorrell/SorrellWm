/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/AutoComplete
 *
 * @file      AutoComplete.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { AutoCompleteProps } from "./AutoComplete.Types.ts";
import type { ReactNode } from "react";
import { RenderAutoComplete } from "./RenderAutoComplete.tsx";
import { UseAutoCompleteState } from "./UseAutoCompleteState.ts";

export const AutoComplete = <A>(Props: AutoCompleteProps<A>): ReactNode =>
    RenderAutoComplete(UseAutoCompleteState(Props));
