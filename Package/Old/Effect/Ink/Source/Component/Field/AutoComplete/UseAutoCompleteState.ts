/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/AutoComplete/UseAutoCompleteState
 * @internal
 *
 * @file      UseAutoCompleteState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { AutoCompleteProps, AutoCompleteState } from "./AutoComplete.Types.ts";

export const UseAutoCompleteState = <A>(_Props: AutoCompleteProps<A>): AutoCompleteState =>
{
    return { } as const;
};
