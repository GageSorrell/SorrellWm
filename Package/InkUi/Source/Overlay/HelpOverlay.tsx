/**
 *
 *
 * @module @sorrell/ink-ui/Overlay/HelpOverlay
 *
 * @file      HelpOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Overlay } from "./Overlay.tsx";
import { useTheme } from "../Theme.tsx";

/**
 * An entry in a `HelpOverlay` component.
 *
 * @category Overlay
 * @since 1.0.0
 */
export interface HelpEntry
{
    readonly Description: string;
    readonly Keys: string;
}

/**
 * A section in a `HelpOverlay` component.
 *
 * @category Overlay
 * @since 1.0.0
 */
export interface HelpSection
{
    readonly Entries: ReadonlyArray<HelpEntry>;
    readonly Title: string;
}

/** {@inheritDoc HelpOverlay} */
export interface HelpOverlayProps
{
    readonly Sections: ReadonlyArray<HelpSection>;
    readonly Title?: string;
}

export/**
       * Displays grouped keyboard shortcuts and their descriptions.
       *
       * @category Overlay
       * @since 1.0.0
       */
const HelpOverlay = ({
    Sections,
    Title = "Keyboard shortcuts"
}: HelpOverlayProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Overlay Title={ Title }>
            { Sections.map((Section: HelpSection) => (
                <Ink.Box
                    flexDirection="column"
                    key={ Section.Title }>
                    <Ink.Text
                        bold
                        color={ Theme.Secondary }>
                        { Section.Title }
                    </Ink.Text>
                    { Section.Entries.map((Entry: HelpEntry) => (
                        <Ink.Text key={ `${ Entry.Keys }-${ Entry.Description }` }>
                            <Ink.Text color={ Theme.Primary }>
                                { Entry.Keys.padEnd(16) }
                            </Ink.Text>
                            <Ink.Text color={ Theme.Text }>{ Entry.Description }</Ink.Text>
                        </Ink.Text>
                    )) }
                </Ink.Box>
            )) }
        </Overlay>
    );
};
