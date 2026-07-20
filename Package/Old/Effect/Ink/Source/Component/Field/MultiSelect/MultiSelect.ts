/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/MultiSelect
 *
 * @file      MultiSelect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { MultiSelectProps } from "./MultiSelect.Types.ts";
import type { ReactNode } from "react";
import { RenderMultiSelect } from "./RenderMultiSelect.tsx";
import { UseMultiSelectState } from "./UseMultiSelectState.ts";

export const MultiSelect = <A>(Props: MultiSelectProps<A>): ReactNode =>
    RenderMultiSelect(UseMultiSelectState(Props));
