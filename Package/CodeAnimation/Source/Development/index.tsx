/**
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CodePresentation } from "../CodePresentation/index.js";
import Content from "./Content.md";
import type { ReactNode } from "react";
import { registerRoot } from "remotion";

/* eslint-disable-next-line jsdoc/require-jsdoc */
function TestPresentation(): ReactNode
{
    return (
        <>
            <CodePresentation
                Name="TestPresentation"
                { ...{ Content } }
            />
        </>
    );
}

registerRoot(TestPresentation);
