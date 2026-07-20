/**
 * @file      index.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { CodeAnimation } from "./CodeAnimation/index.js";
import type { FC } from "react";
import { registerRoot } from "remotion";

/**
 * This should be called in the Remotion entrypoint, so that Remotion Studio
 * will open the given {@link CodeAnimation} component.
 *
 * @param AnimationComponent - The component to open in Remotion Studio.
 */
export function RunStudio(AnimationComponent: FC): void
{
    registerRoot(AnimationComponent);
}

export * from "./CodeAnimation/index.js";
