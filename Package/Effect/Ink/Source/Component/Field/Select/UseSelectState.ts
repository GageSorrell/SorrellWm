/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Select/UseSelectState
 * @internal
 *
 * @file      UseSelectState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { SelectProps, SelectState } from "./Select.Types.ts";

export const UseSelectState = <A>(_Props: SelectProps<A>): SelectState =>
{
    return { } as const;
};
