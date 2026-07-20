/**
 * @file      Motion.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { ChooseLandingPageAnimationFrameRate, EstimateRequestAnimationFrameRate } from "./Motion.Internal.js";
import { useEffect, useState } from "react";

/**
 * Get the highest framerate that is reasonable, based on the client device's exposed hardware details.
 *
 * @returns {readonly [ FrameRate: number ]} The framerate best suited to the client.
 */
export function UsePreferredAnimationFrameRate(): readonly [ FrameRate: number ]
{
    const [ FrameRate, SetFrameRate ] = useState(60);

    useEffect(() =>
    {
        let IsMounted: boolean = true;

        EstimateRequestAnimationFrameRate().then((EstimatedFrameRate: number) =>
        {
            if (!IsMounted)
            {
                return;
            }

            SetFrameRate(ChooseLandingPageAnimationFrameRate(EstimatedFrameRate));
        });

        return () =>
        {
            IsMounted = false;
        };
    }, [ ]);

    return [ FrameRate ] as const;
};
