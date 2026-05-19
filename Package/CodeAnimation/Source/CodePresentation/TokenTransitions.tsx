/**
 * @file      TokenTransitions.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import {
    type AnnotationHandler,
    type HighlightedCode,
    InnerPre,
    InnerToken
} from "@sorrell/codehike/code";
import {
    type ComponentProps,
    type ReactNode,
    type RefObject,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import { Easing, continueRender, delayRender, useCurrentFrame } from "remotion";
import {
    type TokenTransition,
    type TokenTransitionsSnapshot,
    calculateTransitions,
    getStartingSnapshot
} from "@sorrell/codehike/utils/token-transitions";
import { interpolate, interpolateColors } from "remotion";
import type { FTokenTransitionsHook } from "./CodePresentation.Types.js";

export function UseTokenTransitions(
    OldCode: HighlightedCode | undefined,
    NewCode: HighlightedCode,
    FrameRate: number
): ReturnType<FTokenTransitionsHook>
{
    const Frame: number = useCurrentFrame();
    const Ref: RefObject<HTMLPreElement | null> = useRef<HTMLPreElement>(null);
    const [ Snapshot, SetSnapshot ] = useState<TokenTransitionsSnapshot>();
    const [ Handle ] = useState(() => delayRender());

    /* If there is no old code, then transition from empty code. */
    const PreviousCode: HighlightedCode = OldCode || { ...NewCode, annotations: [ ], tokens: [ ] };

    useLayoutEffect(() =>
    {
        if (!Snapshot)
        {
            SetSnapshot(getStartingSnapshot(Ref.current!));
            return;
        }

        const Transitions: Array<TokenTransition> = calculateTransitions(Ref.current!, Snapshot);

        function ApplyTransition({ element, keyframes, options }: TokenTransition): void
        {
            interpolateStyle(
                element,
                keyframes,
                Frame,
                FrameRate * options.delay,
                FrameRate * options.duration
            );
        };

        Transitions.forEach(ApplyTransition);

        continueRender(Handle);
    }, [ Snapshot, Handle, Frame, FrameRate ]);

    const Code: HighlightedCode = Snapshot
        ? NewCode
        : PreviousCode;

    return { Code, Ref };
}

export const TokenTransitions: AnnotationHandler =
    {
        Pre: (Props: ComponentProps<typeof InnerPre>["merge"]): ReactNode => (
            <InnerPre
                merge={ Props }
                style={ { position: "relative" } }
            />
        ),
        Token: (Props: ComponentProps<typeof InnerToken>["merge"]): ReactNode => (
            <InnerToken
                merge={ Props }
                style={ { display: "inline-block" } }
            />
        ),
        name: "token-transitions"
    };

function interpolateStyle(
    Element: HTMLElement,
    Keyframes: TokenTransition["keyframes"],
    Frame: number,
    Delay: number,
    Duration: number
)
{
    const {
        color: Color,
        opacity: Opacity,
        translateX: TranslateX,
        translateY: TranslateY
    } = Keyframes;

    const Progress: number = interpolate(
        Frame,
        [ Delay, Delay + Duration ],
        [ 0, 1 ],
        {
            easing: Easing.inOut(Easing.ease),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );

    if (Opacity)
    {
        Element.style.opacity = interpolate(Progress, [ 0, 1 ], Opacity).toString();
    }
    if (Color)
    {
        Element.style.color = interpolateColors(Progress, [ 0, 1 ], Color);
    }
    if (TranslateX || TranslateY)
    {
        const X: number = interpolate(Progress, [ 0, 1 ], TranslateX!);
        const Y: number = interpolate(Progress, [ 0, 1 ], TranslateY!);
        Element.style.translate = `${ X }px ${ Y }px`;
    }
}
