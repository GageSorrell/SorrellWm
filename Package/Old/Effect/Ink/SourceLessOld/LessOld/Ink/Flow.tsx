/**
 * The indicator components rendered to the side of prompt items, in the style
 * of {@link https://www.npmjs.com/package/@clack/prompts | \@clack/prompts}.
 *
 * @module @sorrell/effect-ink/Ink/Flow
 */

/**
 * @file      Flow.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box, type DOMElement, Text, type TextProps, useBoxMetrics } from "ink";
import { type ReactElement, type ReactNode, type RefObject, useMemo } from "react";
import { Array } from "effect";
import type { ForegroundColor } from "chalk";

type FlowBraceToken =
    {
        Character: string;
        Color: typeof ForegroundColor | undefined;
    };

type FlowBraceProps =
    {
        BoxReference: RefObject<DOMElement | null>;
        End: FlowBraceToken;
        Middle: FlowBraceToken;
        Start: FlowBraceToken;
    };

export function FlowBrace({ BoxReference, End, Middle, Start }: FlowBraceProps): ReactElement
{
    const {
        height: Height,
        hasMeasured: HasMeasured
    } = useBoxMetrics(BoxReference);

    const LineIndices: Array<number> = useMemo(
        () =>
        {
            if (!HasMeasured)
            {
                return [ ];
            }

            return Array.range(0, Height - 1);
        },
        [ Height, HasMeasured ]
    );

    const Line = (Index: number): ReactNode =>
    {
        const { Character, Color: color } = Index === 0
            ? Start
            : Index === LineIndices.length - 1
                ? End
                : Middle;

        const TextProps: TextProps =
            {
                ...((color !== undefined) ? { color } : { })
            };

        return (
            <Text
                { ...TextProps }
                key={ Index.toString() + Character }>
                { Character }{"  "}
            </Text>
        );
    };

    return (
        <Box
            aria-hidden
            flexDirection="column"
            flexShrink={ 0 }
            height="100%"
            overflow="hidden"
            width={ 3 }>
            { LineIndices.map(Line) }
        </Box>
    );
}

