/**
 * The root of the Storybook-inspired documentation viewer.
 *
 * @module @sorrell/ink-ui/Showcase/Documentation/Viewport
 *
 * @file      Viewport.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";

/** {@inheritDoc Viewport} */
export interface ViewportProps extends React.PropsWithChildren
{
    readonly Active: boolean;
    readonly Height: number;
}

export/**
       * The root of the Storybook-inspired documentation viewer.
       *
       * @category Component
       * @since 1.0.0
       */
const Viewport = ({ Active, children, Height }: ViewportProps): React.ReactElement =>
{
    const Content = React.useRef<Ink.DOMElement>(null);
    const [ Offset, SetOffset ] = React.useState(0);
    const PageSize = Math.max(1, Height - 2);

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        const ContentHeight = Content.current === null ? Height : Ink.measureElement(Content.current).height;
        const Maximum = Math.max(0, ContentHeight - Height);
        if (Key.home)
        {
            SetOffset(0);
        }
        else if (Key.end)
        {
            SetOffset(Maximum);
        }
        else if (Key.pageUp)
        {
            SetOffset((Value: number) => Math.max(0, Value - PageSize));
        }
        else if (Key.pageDown)
        {
            SetOffset((Value: number) => Math.min(Maximum, Value + PageSize));
        }
        else if (Key.upArrow || Input === "k")
        {
            SetOffset((Value: number) => Math.max(0, Value - 1));
        }
        else if (Key.downArrow || Input === "j")
        {
            SetOffset((Value: number) => Math.min(Maximum, Value + 1));
        }
    }, { isActive: Active });

    React.useEffect(() => SetOffset(0), [ children ]);

    return (
        <Ink.Box
            height={ Height }
            overflow="hidden">
            <Ink.Box flexDirection="column"
                marginTop={ -Offset }
                ref={ Content }>
                { children }
            </Ink.Box>
        </Ink.Box>
    );
};
