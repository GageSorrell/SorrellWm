/**
 * @file      CodePresentation.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    FHandlers,
    FSteps,
    FTokenTransitionsHook,
    PCodePresentation
} from "./CodePresentation.Types.js";
import type { HighlightedCode } from "codehike/code";
import type { MarkdownSchema } from "./CodePresentation.Internal.js";
import type { ReactNode } from "react";
import type { z } from "zod";

export type PVideo =
    Required<Pick<
        PCodePresentation,
        | "FrameRate"
        | "Resolution"
        | "Hook"
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
        | "Hook"
        | "Resolution"
        | "Steps"
        | "style"
    >;

export type FToVideoStep = (Step: FStepInternal, Index: number) => ReactNode;

export type PCode =
    Required<Pick<
        PCodePresentation,
        | "FrameRate"
        | "Resolution"
        | "style"
    >> &
    {
        OldCode?: HighlightedCode | undefined;
        NewCode: HighlightedCode;
        Handlers: FHandlers;
        Hook: FTokenTransitionsHook;
    };
