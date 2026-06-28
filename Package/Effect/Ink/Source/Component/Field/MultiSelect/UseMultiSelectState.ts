/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/MultiSelect/UseMultiSelectState
 * @internal
 *
 * @file      UseMultiSelectState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { MultiSelectProps, MultiSelectState } from "./MultiSelect.Types.ts";

export const UseMultiSelectState = <A>(_Props: MultiSelectProps<A>): MultiSelectState =>
{
    return { } as const;
};
