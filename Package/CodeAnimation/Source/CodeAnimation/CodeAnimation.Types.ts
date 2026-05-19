/**
 * @file      CodeAnimation.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { AnnotationHandler, BlockAnnotation } from "@sorrell/codehike/code";
import type { CSSProperties, PropsWithChildren } from "react";
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CodeAnimation } from "./CodeAnimation.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
import type { FStepInternal } from "./CodeAnimation.Internal.Types.js";

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
 * The props type of the {@link CodeAnimation} component.
 *
 * @property {FSteps} Steps - The steps that define a {@link CodeAnimation}.
 * @property {FMarkdownSteps} Content - The default import of the Markdown file that defines the animation.
 */
export type PCodeAnimation =
    {
        Content: unknown;
        FrameRate?: FFrameRate;
        Handlers?: FHandlers;
        Name: string;
        Resolution?: FResolution;
        style?: CSSProperties;
    };

/** The props type for defining {@link AnnotationHandler | AnnotationHandlers}. */
export type PBlock =
    PropsWithChildren &
    {
        annotation: BlockAnnotation;
    };

/** The (optional) {@link AnnotationHandler | AnnotationHandlers} for your animation. */
export type FHandlers = ReadonlyArray<AnnotationHandler>;
