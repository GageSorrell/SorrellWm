/**
 * @file      ExampleButton.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ButtonHTMLAttributes, ReactElement } from "react";

export interface ExampleButtonProperties extends
    ButtonHTMLAttributes<HTMLButtonElement>
{
    Label: string;
}

export function ExampleButton(Properties: ExampleButtonProperties): ReactElement
{
    const { Label, ...ButtonProperties } = Properties;

    return (
        <button { ...ButtonProperties }>
            { Label }
        </button>
    );
}
