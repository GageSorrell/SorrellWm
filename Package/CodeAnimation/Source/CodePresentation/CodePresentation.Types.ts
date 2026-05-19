/**
 * @file      CodePresentation.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { AnnotationHandler, BlockAnnotation, HighlightedCode } from "@sorrell/codehike/code";
import type { CSSProperties, PropsWithChildren, RefObject } from "react";
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CodePresentation } from "./CodePresentation.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
import type { FStepInternal } from "./CodePresentation.Internal.Types.js";

/** The object such that a sequence of these objects define an animation. */
export type FStep = FStepInternal;

/** An array whose elements are of type {@link FStep}. */
export type FSteps = ReadonlyArray<FStep>;

/** The possible frame rates for animations. */
export type FFrameRate =
    | 30
    | 90;

/** The possible resolutions for animations. */
export type FResolution =
    /** The *small* resolution. */
    | "1296x864"

    /** The *medium* (default) resolution. */
    | "1920x1280"

    /** The *large* resolution. */
    | "2400x1600";

/**
 * The props type of the {@link CodePresentation} component.
 *
 * @property {FSteps} Steps - The steps that define a {@link CodePresentation}.
 * @property {FMarkdownSteps} Content - The default import of the Markdown file that defines the animation.
 */
export type PCodePresentation =
    {
        Content: unknown;
        FrameRate?: FFrameRate;
        Handlers?: FHandlers;
        Hook?: FTokenTransitionsHook;
        Name: string;
        Resolution?: FResolution;
        style?: CSSProperties;
    };

/**
 * The hook that processes token transitions.
 *
 * @param OldCode - The content of the previous step.
 * @param NewCode - The content of the current step.
 * @param Duration - The duration of the given step.
 */
export type FTokenTransitionsHook = (
    OldCode: HighlightedCode | undefined,
    NewCode: HighlightedCode,
    Duration: number
) => {
    Code: HighlightedCode;
    Ref: RefObject<HTMLPreElement | null>;
};

/** The props type for defining {@link AnnotationHandler | AnnotationHandlers}. */
export type PBlock =
    PropsWithChildren &
    {
        annotation: BlockAnnotation;
    };

/** The (optional) {@link AnnotationHandler | AnnotationHandlers} for your animation. */
export type FHandlers = ReadonlyArray<AnnotationHandler>;
