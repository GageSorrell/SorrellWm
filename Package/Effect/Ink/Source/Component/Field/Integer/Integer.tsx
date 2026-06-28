/**
 *
 *
 * @module @sorrell/effect-ink/Component/Integer/Integer
 * @internal
 *
 * @file      Integer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import type { IntegerProps } from "./Integer.Types.ts";
import { RenderInteger } from "./RenderInteger.tsx";
import { UseIntegerState } from "./UseIntegerState.ts";
import { flow } from "effect";

export const Integer: React.FC<IntegerProps> = flow(UseIntegerState, RenderInteger);
