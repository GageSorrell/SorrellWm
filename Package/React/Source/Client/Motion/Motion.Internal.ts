/**
 * @file      Motion.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FNavigatorWithHints, FNetworkConnection } from "./Motion.Internal.Types.js";
import type { TThen } from "@sorrell/utilities/async";

function GetClosestCommonFrameRate(EstimatedFrameRate: number): number
{
    const CommonFrameRates: ReadonlyArray<number> = [ 30, 60, 75, 90, 120, 144, 165, 240 ] as const;

    return CommonFrameRates.reduce((ClosestFrameRate: number, CurrentFrameRate: number): number =>
    {
        return Math.abs(CurrentFrameRate - EstimatedFrameRate) <
            Math.abs(ClosestFrameRate - EstimatedFrameRate)
            ? CurrentFrameRate
            : ClosestFrameRate;
    }, 60);
}

export function ChooseLandingPageAnimationFrameRate(EstimatedFrameRate: number): number
{
    const NavigatorHints: FNavigatorWithHints = navigator as FNavigatorWithHints;

    const PrefersReducedMotion: boolean = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const SaveData: boolean = NavigatorHints.connection?.saveData === true;
    const EffectiveType: FNetworkConnection["effectiveType"] = NavigatorHints.connection?.effectiveType;
    const HardwareConcurrency: number = navigator.hardwareConcurrency ?? 4;
    const DeviceMemory: number = NavigatorHints.deviceMemory ?? 4;

    if (PrefersReducedMotion || SaveData)
    {
        return 30;
    }

    if (EffectiveType === "slow-2g" || EffectiveType === "2g" || EffectiveType === "3g")
    {
        return 30;
    }

    if (HardwareConcurrency <= 4 || DeviceMemory <= 4)
    {
        return Math.min(60, EstimatedFrameRate >= 55 ? 60 : 30);
    }

    const ClosestFrameRate: number = GetClosestCommonFrameRate(EstimatedFrameRate);

    if (ClosestFrameRate >= 90)
    {
        return 90;
    }

    if (ClosestFrameRate >= 55)
    {
        return 60;
    }

    return 30;
}

export async function EstimateRequestAnimationFrameRate(): Promise<number>
{
    return new Promise((Resolve: TThen<number>) =>
    {
        const FrameTimes: Array<number> = [ ];
        let AnimationFrameHandle: number = 0;

        const MeasureFrame = (Timestamp: number) =>
        {
            FrameTimes.push(Timestamp);

            if (FrameTimes.length < 75)
            {
                AnimationFrameHandle = requestAnimationFrame(MeasureFrame);
                return;
            }

            cancelAnimationFrame(AnimationFrameHandle);

            const Differences: Array<number> = FrameTimes
                .slice(1)
                .map((FrameTime: number, Index: number) => FrameTime - (FrameTimes[Index] || 0));

            Differences.sort((FirstValue: number, SecondValue: number) => FirstValue - SecondValue);

            const TrimmedDifferences: Array<number> = Differences.slice(
                Math.floor(Differences.length * 0.1),
                Math.ceil(Differences.length * 0.9)
            );

            const AverageDifference: number =
                TrimmedDifferences.reduce((Total: number, Difference: number) => Total + Difference, 0) /
                TrimmedDifferences.length;

            Resolve(Math.round(1000 / AverageDifference));
        };

        AnimationFrameHandle = requestAnimationFrame(MeasureFrame);
    });
}
