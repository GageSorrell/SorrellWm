/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/MouseProvider
 *
 * @file      MouseProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { MouseProvider, useMouseEvent } from "../../Source/Mouse/index.js";
import type { MouseEvent } from "../../Source/Mouse/index.js";
import { SimpleStory } from "./Factory.js";

const Readout = (): React.ReactElement =>
{
    const [ Event, SetEvent ] = React.useState<MouseEvent.MouseEvent>();
    useMouseEvent(SetEvent);
    return <Ink.Text>{ Event?._tag ?? "Move or click the mouse" }</Ink.Text>;
};
const Basic = (): React.ReactElement => <MouseProvider><Readout /></MouseProvider>;
export default SimpleStory({
    Basic: { Code: "<MouseProvider>{ /* ... */ }</MouseProvider>", Preview: Basic },
    Description: "Installs one shared terminal mouse listener and recognizes clicks, drags, and wheels.",
    Examples:
    [
        {
            Code: "<MouseProvider DoubleClickTimeMs={300}>{ /* ... */ }</MouseProvider>",
            Preview: Basic,
            Title: "Gesture tuning"
        }
    ],
    Name: "MouseProvider",
    Source: { Component: "MouseProvider", Path: "Mouse/Context.tsx", Props: "MouseProviderProps" }
});
