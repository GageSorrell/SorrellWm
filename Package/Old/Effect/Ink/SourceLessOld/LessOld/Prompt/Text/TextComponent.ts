/**
 * The `react` component for the
 * {@link \@sorrell/effect-ink/Prompt/Text | text prompt}.
 *
 * @module @sorrell/effect-ink/Prompt/Text/TextComponent
 * @internal
 */

/**
 * @file      TextComponent.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type State, UseTextState } from "./TextState.ts";
import type { FC } from "react";
import { MakeComponent } from "../../React.ts";
import { RenderTextComponent } from "./TextRender.tsx";

export const TextComponent: FC<State> = MakeComponent(UseTextState, RenderTextComponent);
