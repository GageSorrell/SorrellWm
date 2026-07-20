/**
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CodeAnimation } from "../CodeAnimation/index.js";
import Content from "./Content.Old.md";
import type { ReactNode } from "react";
import { registerRoot } from "remotion";

/* eslint-disable-next-line jsdoc/require-jsdoc */
function TestAnimation(): ReactNode
{
    return (
        <>
            <CodeAnimation
                Name="TestAnimation"
                { ...{ Content } }
            />
        </>
    );
}

registerRoot(TestAnimation);
