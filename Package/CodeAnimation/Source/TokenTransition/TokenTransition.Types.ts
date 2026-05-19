/**
 * @file      TokenTransition.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { HighlightedCode } from "@sorrell/codehike/code";
import type { RefObject } from "react";

/**
 * The hook that processes token transitions.
 *
 * @param OldCode - The content of the previous step.
 * @param NewCode - The content of the current step.
 * @param Duration - The duration of the given step.
 */
export type FTokenTransitionHook = (
    OldCode: HighlightedCode | undefined,
    NewCode: HighlightedCode,
    Duration: number
) => {
    Code: HighlightedCode;
    Ref: RefObject<HTMLPreElement | null>;
};
