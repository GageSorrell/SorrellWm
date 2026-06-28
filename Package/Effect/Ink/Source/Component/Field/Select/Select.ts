/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Select
 *
 * @file      Select.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import { RenderSelect } from "./RenderSelect.tsx";
import type { SelectProps } from "./Select.Types.ts";
import { UseSelectState } from "./UseSelectState.ts";

export const Select = <A>(Props: SelectProps<A>): ReactNode => RenderSelect(UseSelectState(Props));
