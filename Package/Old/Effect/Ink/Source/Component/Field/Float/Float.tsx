/**
 *
 *
 * @module @sorrell/effect-ink/Component/Float/Float
 * @internal
 *
 * @file      Float.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import type { FloatProps } from "./Float.Types.ts";
import { RenderFloat } from "./RenderFloat.tsx";
import { UseFloatState } from "./UseFloatState.ts";
import { flow } from "effect";

export const Float: React.FC<FloatProps> = flow(UseFloatState, RenderFloat);
