/**
 * @file      CodePresentation.Internal.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { AbsoluteFill, Sequence, type SequenceProps } from "remotion";
import { Block, HighlightedCodeBlock } from "@sorrell/codehike/blocks";
import { type CSSProperties, type FC, type HTMLProps, type ReactNode } from "react";
import type { FResolution, FStep } from "./CodePresentation.Types.js";
import type {
    FStepInternal,
    FToVideoStep,
    FVideoStepInherited,
    PCode,
    PVideo,
    PVideoStep
} from "./CodePresentation.Internal.Types.js";
import { Pre } from "@sorrell/codehike/code";
import { z } from "zod";

/* eslint-disable @typescript-eslint/typedef, @typescript-eslint/no-unused-vars, jsdoc/require-jsdoc */

export const StepSchema = Block.extend({
    Delay: z.coerce.number().optional(),
    Duration: z.coerce.number().optional(),
    code: HighlightedCodeBlock
});

export const MarkdownSchema = Block.extend({ steps: z.array(StepSchema) });

/* eslint-enable @typescript-eslint/typedef, @typescript-eslint/no-unused-vars */

function Code({ FrameRate, Handlers, Hook, OldCode, NewCode, Resolution, style }: PCode): ReactNode
{
    const { Code, Ref } = Hook(OldCode, NewCode, FrameRate);

    const BaseFontSizeRem: number = 2.5;
    const FontSizeScalars: Record<FResolution, number> =
        {
            "1296x864": 1296 / 1920,
            "1920x1280": 1,
            "2400x1600": 2400 / 1920
        };

    const Style: CSSProperties =
        {
            fontSize: `${ BaseFontSizeRem * FontSizeScalars[Resolution] }rem`,
            ...style
        };

    return (
        <Pre
            code={ Code }
            handlers={ [ ...Handlers ] }
            ref={ Ref }
            style={ Style }
        />
    );
}

function VideoStep(Props: PVideoStep): ReactNode
{
    const {
        FrameRate,
        Handlers,
        Hook,
        Index,
        Resolution,
        Steps,
        style
    } = Props;

    const Step: FStep = Steps[Index];

    const SequenceComponent: FC<SequenceProps> = Sequence as FC<SequenceProps>;

    return (
        <SequenceComponent
            durationInFrames={ Step.Duration ?? FrameRate }
            from={ GetStartFrame(FrameRate, Steps, Index) }
            layout="none"
            name={ Step.title }>
            <Code
                NewCode={ Step.code }
                OldCode={ Steps[Index - 1]?.code }
                { ...{ FrameRate, Handlers, Hook, Resolution, style } }
            />
        </SequenceComponent>
    );

    // return (
    //     <Sequence
    //         durationInFrames={ DurationInFrames }
    //         from={ DurationInFrames * Index }
    //         layout="none"
    //         name={ Step.title }>
    //         <Code
    //             NewCode={ Step.code }
    //             OldCode={ Steps[Index - 1]?.code }
    //             { ...{ FrameRate, Handlers, Hook, Resolution, style } }
    //         />
    //     </Sequence>
    // );
}

function MakeToVideoStep(InheritedProps: FVideoStepInherited): FToVideoStep
{
    return function ToVideoStep(Step: FStepInternal, Index: number): ReactNode
    {
        return (
            <VideoStep
                key={ Index }
                { ...{ ...InheritedProps, Index, ...Step } }
            />
        );
    };
}

export function Video(Props: PVideo): ReactNode
{
    const AbsoluteFillComponent: FC<HTMLProps<HTMLDivElement>> =
        AbsoluteFill as FC<HTMLProps<HTMLDivElement>>;

    return (
        <AbsoluteFill
            style={ {
                alignItems: "center",
                background: "#0D1117",
                fontSize: 24
            } }>
            { Props.Steps.map(MakeToVideoStep(Props)) }
        </AbsoluteFill>
    );
}

function GetStartFrame(FrameRate: number, Steps: ReadonlyArray<FStep>, Index: number)
{
    let StartFrame: number = 0;

    for (let ThisIndex: number = 0; ThisIndex < Index; ThisIndex++)
    {
        const PreviousStep: FStep = Steps[ThisIndex];

        StartFrame += PreviousStep.Duration ?? (FrameRate);
        StartFrame += PreviousStep.Delay ?? (FrameRate * 0.5);
    }

    return StartFrame;
}

export function MakeStepSequence(
    FrameRate: number,
    Steps: ReadonlyArray<FStep>
): (Step: FStep, Index: number) => ReactNode
{
    const SequenceComponent: FC<SequenceProps> = Sequence as FC<SequenceProps>;
    return function ToStepSequence(Step: FStep, StepIndex: number): ReactNode
    {
        return (
            <SequenceComponent
                durationInFrames={ Step.Duration ?? FrameRate }
                from={ GetStartFrame(FrameRate, Steps, StepIndex) }
                key={ StepIndex }
                layout="none"
                name={ Step.title }>
                { Step.children }
            </SequenceComponent>
        );
    };
}

export function GetTotalDurationInFrames(FrameRate: number, Steps: ReadonlyArray<FStep>): number
{
    if (Steps.length === 0)
    {
        return 1;
    }

    let TotalDurationInFrames: number = 0;

    for (let Index: number = 0; Index < Steps.length; Index++)
    {
        const Step: FStep = Steps[Index];

        TotalDurationInFrames += Math.floor((Step.Duration || 1000) * 0.001 * FrameRate);

        if (Index !== Steps.length - 1)
        {
            TotalDurationInFrames += Math.floor((Step.Delay || 200) * 0.001 * FrameRate);
        }
    }

    return TotalDurationInFrames;
}
