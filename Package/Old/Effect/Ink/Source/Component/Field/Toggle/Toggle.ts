/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Toggle
 *
 * @file      Toggle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FC } from "react";
import { RenderToggle } from "./RenderToggle.tsx";
import type { ToggleProps } from "./Toggle.Types.ts";
import { UseToggleState } from "./UseToggleState.ts";
import { flow } from "effect";

export const Toggle: FC<ToggleProps> = flow(UseToggleState, RenderToggle);
