/**
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type AnnotationHandler, InnerLine } from "@sorrell/codehike/code";
import type { CSSProperties, ReactNode } from "react";
import { CodeAnimation } from "@sorrell/code-animation";
import { interpolateColors, useCurrentFrame } from "remotion";
import Content from "./Content.md";

export function ReactiveEventIntro(): ReactNode
{
    const style: CSSProperties =
        {
            alignItems: "center",
            display: "flex",
            height: "100%",
            maxWidth: 1920,
            padding: 64
        };

    return (
        <CodeAnimation
            Name="ReactiveEventIntro"
            { ...{ Content, style } }
        />
    );
}
