/**
 *
 *
 * @module @sorrell/effect-ink/Component/Text
 * @internal
 *
 * @file      RenderText.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import type { TextState } from "./Text.Types.ts";

export const RenderText = (State: TextState): React.ReactNode =>
{
    return <Ink.Text { ...State } />;
};
