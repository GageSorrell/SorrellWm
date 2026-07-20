/**
 *
 *
 * @module @sorrell/effect-ink/Component/Primitive/Button
 *
 * @file      Button.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";

export interface ButtonProps
{
    readonly OnMouseDown
}

export const Button = (Props: ButtonProps): React.ReactNode =>
{
    return <Ink.Box></Ink.Box>;
};
