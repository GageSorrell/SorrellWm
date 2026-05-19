/**
 * @file      CodeAnimation.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    FHandlers,
    FSteps,
    PCodeAnimation
} from "./CodeAnimation.Types.js";
import type { HighlightedCode } from "@sorrell/codehike/code";
import type { MarkdownSchema } from "./CodeAnimation.Internal.js";
import type { ReactNode } from "react";
import type { z } from "zod";

export type PVideo =
    Required<Pick<
        PCodeAnimation,
        | "FrameRate"
        | "Resolution"
        | "Handlers"
        | "style"
    >> &
    {
        Steps: FSteps;
    };

export type FMarkdownSteps = z.infer<typeof MarkdownSchema>;

export type FStepsInternal = FMarkdownSteps["steps"];
export type FStepInternal = FStepsInternal[number];

export type PVideoStep =
    FVideoStepInherited &
    {
        Index: number;
    };

export type FVideoStepInherited =
    Pick<
        PVideo,
        | "FrameRate"
        | "Handlers"
        | "Resolution"
        | "Steps"
        | "style"
    >;

export type FToVideoStep = (Step: FStepInternal, Index: number) => ReactNode;

export type PCode =
    Required<Pick<
        PCodeAnimation,
        | "FrameRate"
        | "Resolution"
        | "style"
    >> &
    {
        OldCode?: HighlightedCode | undefined;
        NewCode: HighlightedCode;
        Handlers: FHandlers;
    };
