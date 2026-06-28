/**
 *
 *
 * @module @sorrell/effect-ink/Component/Text/Text
 * @internal
 *
 * @file      Text.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import { RenderText } from "./RenderText.tsx";
import type { TextProps } from "./Text.Types.ts";
import { UseTextState } from "./UseTextState.ts";
import { flow } from "effect";

export const Text: React.FC<TextProps> = flow(UseTextState, RenderText);
