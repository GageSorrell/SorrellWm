/**
 * The module that renders the `react` component for the
 * {@link \@sorrell/effect-ink/Prompt/Text | text prompt}.
 *
 * @module @sorrell/effect-ink/Prompt/Text/TextRender
 * @internal
 */

/**
 * @file      TextRender.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import type { State } from "./TextState.ts";
import { Text } from "ink";

export const RenderTextComponent = ({

}: State): ReactNode =>
{
    return (
        <Text></Text>
    );
};
