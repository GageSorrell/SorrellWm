/**
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type AnnotationHandler, InnerLine } from "codehike/code";
import type { CSSProperties, ReactNode } from "react";
import { CodePresentation, type FHandlers, type PBlock } from "@sorrell/code-hike";
import { interpolateColors, useCurrentFrame } from "remotion";
import Content from "./Content.md";

const Mark: AnnotationHandler =
    {
        Block: ({ children, annotation }: PBlock): ReactNode =>
        {
            const Delay: number = +(annotation.query || 0);
            const Frame: number = useCurrentFrame();
            const Background: string = interpolateColors(
                Frame,
                [ Delay, Delay + 10 ],
                [ "#0000", "#F2CC6044" ]
            );

            return <div style={ { background: Background } }>{children}</div>;
        },
        /* eslint-disable-next-line @typescript-eslint/typedef */
        Line: (Props) => (
            <InnerLine
                merge={ Props }
                style={ { padding: "0 4px" } }
            />
        ),
        name: "mark"
    };

const Handlers: FHandlers = [ Mark ] as const;

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
        <CodePresentation
            Name="ReactiveEventIntro"
            { ...{ Content, Handlers, style } }
        />
    );
}
