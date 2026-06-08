/**
 * @file      Text.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Text as InkText, type TextProps } from "ink";
import type { ReactNode } from "react";

export function Text(Props: TextProps): ReactNode
{
    return <InkText { ...Props }/>;
}
