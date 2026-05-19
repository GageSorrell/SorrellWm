/**
 * @file      index.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { CodePresentation } from "./CodePresentation/index.js";
import type { FC } from "react";
import { registerRoot } from "remotion";

/**
 * This should be called in the Remotion entrypoint, so that Remotion Studio
 * will open the given {@link CodePresentation} component.
 *
 * @param PresentationComponent - The component to open in Remotion Studio.
 */
export function RunStudio(PresentationComponent: FC): void
{
    registerRoot(PresentationComponent);
}

export * from "./CodePresentation/index.js";
