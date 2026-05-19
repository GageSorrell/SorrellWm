/**
 * @file      CodePresentation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type CalculateMetadataFunction, Composition, type CompositionProps } from "remotion";
import { type FC, type ReactNode, useCallback, useMemo } from "react";
import type { FMarkdownSteps, PVideo } from "./CodePresentation.Internal.Types.js";
import type { FResolution, PCodePresentation } from "./CodePresentation.Types.js";
import {
    GetTotalDurationInFrames,
    MarkdownSchema,
    Video
} from "./CodePresentation.Internal.js";
import { TokenTransitions, UseTokenTransitions } from "./TokenTransitions.js";
import type { AnnotationHandler } from "codehike/code";
import type { AnyZodObject } from "zod";
import { parseRoot } from "codehike/blocks";

/**
 * An animation, made up of {@link FStep | steps}, to explain code.
 *
 * @param Props - The sequence of {@link FStep | steps} that defines an animation.
 *
 * @throws {Error} If {@link PCodePresentation!Durations} is an {@link Array} and there is not
 * precisely one duration assigned to every step, then this will throw.
 *
 * @returns {ReactNode} A {@link Composition} with default values for
 * important props, suitable for code animations.
 */
export function CodePresentation(Props: PCodePresentation): ReactNode
{
    const {
        Content,
        FrameRate = 90,
        Handlers: InHandlers,
        Hook = UseTokenTransitions,
        Name,
        Resolution = "1920x1280",
        style = { }
    } = Props;

    const Handlers: ReadonlyArray<AnnotationHandler> = ((): ReadonlyArray<AnnotationHandler> =>
    {
        if (InHandlers === undefined)
        {
            return [ TokenTransitions ] as const;
        }
        else if (!InHandlers.includes(TokenTransitions))
        {
            return [ ...InHandlers, TokenTransitions ] as const;
        }
        else
        {
            return InHandlers;
        }
    })();

    const { steps: Steps } = useMemo(
        // @ts-expect-error parseRoot disagrees with the `zod` schema.
        (): FMarkdownSteps => parseRoot(Content, MarkdownSchema),
        [ Content ]
    );

    type FResolutions = Readonly<Record<FResolution, readonly [ number, number ]>>;
    const Resolutions: FResolutions = useMemo((): FResolutions =>
    {
        return {
            "1296x864": [ 1296, 864 ] as const,
            "1920x1280": [ 1920, 1080 ] as const,
            "2400x1600": [ 2400, 1600 ] as const
        } as const;
    }, [ ]);

    const VideoProps: PVideo =
        {
            FrameRate,
            Handlers,
            Hook,
            Resolution,
            Steps,
            style
        };

    // const FullSequence: FC = useMemo((): (() => ReactNode) =>
    // {
    //     // type FToStepSequence = (Step: FStep, Index: number) => ReactNode;
    //     // const ToStepSequence: FToStepSequence = MakeStepSequence(FrameRate, Steps);
    //     return function(): ReactNode
    //     {
    //         return (
    //             <AbsoluteFill>
    //                 { Steps.map() }
    //                 {/* { Steps.map(ToStepSequence) } */}
    //             </AbsoluteFill>
    //         );
    //     };
    // }, [ FrameRate, Steps ]);

    type FMetadataReturnType = ReturnType<CalculateMetadataFunction<PVideo>>;
    type FMetadataArgument = { props: PVideo; };
    /* eslint-disable-next-line @typescript-eslint/typedef */
    const Metadata = useCallback(({ props: { Steps } }: FMetadataArgument): FMetadataReturnType =>
    {
        return {
            durationInFrames: GetTotalDurationInFrames(FrameRate, Steps),
            fps: FrameRate,
            height: Resolutions[Resolution][1],
            width: Resolutions[Resolution][0]
        };
    }, [ FrameRate, Resolution, Resolutions ]);

    const CompComponent: FC<CompositionProps<AnyZodObject, PVideo>> = Composition as FC;

    return (
        <CompComponent
            calculateMetadata={ Metadata }
            component={ Video }
            defaultProps={ VideoProps }
            durationInFrames={ 1 }
            fps={ FrameRate }
            height={ Resolutions[Resolution][1] }
            id={ Name }
            width={ Resolutions[Resolution][0] }
        />
    );
}
// export function CodePresentation(Props: PCodePresentation): ReactNode
// {
//     const {
//         Content,
//         Duration,
//         FrameRate = 90,
//         Handlers: InHandlers,
//         Hook = UseTokenTransitions,
//         Name,
//         Resolution = "1920x1280",
//         style = { }
//     } = Props;

//     const Handlers: ReadonlyArray<AnnotationHandler> = ((): ReadonlyArray<AnnotationHandler> =>
//     {
//         if (InHandlers === undefined)
//         {
//             return [ TokenTransitions ] as const;
//         }
//         else if (!InHandlers.includes(TokenTransitions))
//         {
//             return [ ...InHandlers, TokenTransitions ] as const;
//         }
//         else
//         {
//             return InHandlers;
//         }
//     })();

//     const { steps: Steps } = useMemo(
//         // @ts-expect-error parseRoot disagrees with the `zod` schema.
//         (): FMarkdownSteps => parseRoot(Content, MarkdownSchema),
//         [ Content ]
//     );

//     const Resolutions: Readonly<Record<FResolution, readonly [ number, number ]>> =
//         {
//             "1296x864": [ 1296, 864 ] as const,
//             "1920x1280": [ 1920, 1080 ] as const,
//             "2400x1600": [ 2400, 1600 ] as const
//         } as const;

//     const VideoProps: PVideo =
//         {
//             Duration,
//             FrameRate,
//             Handlers,
//             Hook,
//             Resolution,
//             Steps,
//             style
//         };

//     const DurationInFrames: number = FrameRate * Duration;

//     return (
//         <Composition
//             component={ Video }
//             defaultProps={ VideoProps }
//             durationInFrames={ DurationInFrames }
//             fps={ FrameRate }
//             height={ Resolutions[Resolution][1] }
//             id={ Name }
//             width={ Resolutions[Resolution][0] }
//         />
//     );
// }
