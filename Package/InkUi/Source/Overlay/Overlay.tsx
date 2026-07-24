/**
 * Modal and picker components for Ink.
 *
 * @module @sorrell/ink-ui/Overlay
 *
 * @file      Overlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Frame } from "../Frame.tsx";

/** {@inheritDoc Overlay} */
export interface OverlayProps extends React.PropsWithChildren
{
    readonly Footer?: string;
    readonly Title: string;
    readonly Width?: number | `${ number }%`;
}

export/**
       * Presents modal content in a prominent framed terminal region.
       *
       * @category Overlay
       * @since 1.0.0
       */
const Overlay = ({
    children,
    Footer = "Escape to close",
    Title,
    Width = "80%"
}: OverlayProps): React.ReactNode => (
    <Ink.Box
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        width="100%">
        <Ink.Box
            flexDirection="column"
            width={ Width }>
            <Frame
                Active
                Footer={ Footer }
                Title={ Title }>
                { children }
            </Frame>
        </Ink.Box>
    </Ink.Box>
);

export { ConfirmOverlay } from "./ConfirmOverlay.js";
export type { ConfirmOverlayProps } from "./ConfirmOverlay.js";
export { HelpOverlay } from "./HelpOverlay.js";
export type {
    HelpEntry,
    HelpOverlayProps,
    HelpSection
} from "./HelpOverlay.js";
export { PickerOverlay } from "./PickerOverlay.js";
export type {
    PickerItem,
    PickerOverlayProps
} from "./PickerOverlay.js";
export { ThemePickerOverlay } from "./ThemeOverlay.js";
export type { ThemePickerOverlayProps } from "./ThemeOverlay.js";
