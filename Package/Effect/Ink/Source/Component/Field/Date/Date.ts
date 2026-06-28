/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Date
 *
 * @file      Date.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { DateProps } from "./Date.Types.ts";
import type { FC } from "react";
import { RenderDate } from "./RenderDate.tsx";
import { UseDateState } from "./UseDateState.ts";
import { flow } from "effect";

export const Date: FC<DateProps> = flow(UseDateState, RenderDate);
