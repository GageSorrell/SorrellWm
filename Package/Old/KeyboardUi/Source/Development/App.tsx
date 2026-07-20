/**
 * @file      App.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-console */

import { ExampleButton } from "../Component/ExampleButton";
import type { ReactElement } from "react";

export function DevelopmentApp(): ReactElement
{
    const onClick = (): void =>
    {
        console.log("Clicked.");
    };
    return (
        <main style={ { padding: 24 } }>
            <h1>SorrellWm Components</h1>

            <ExampleButton
                Label="Example Button"
                { ...{ onClick } }
            />
        </main>
    );
}
