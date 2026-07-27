/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Button
 *
 * @file      Button.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Button } from "../../Source/Button/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement =>
    <Button
        Disabled
        Id="showcase-button">
        Continue
    </Button>;

const Appearances = (): React.ReactElement =>
    <Ink.Box gap={ 1 }>
        <Button Appearance="primary"
            Disabled
            Id="primary">Primary</Button>
        <Button Appearance="outline"
            Disabled
            Id="outline">Outline</Button>
    </Ink.Box>;

export default SimpleStory({
    Basic: { Code: "<Button Id=\"continue\">Continue</Button>", Preview: Basic },
    Description: "A themed focusable action with keyboard, mouse, hover, pressed, and disabled states.",
    Examples:
    [
        {
            Code: "<Button Appearance=\"primary\">Primary</Button>\n" +
                "<Button Appearance=\"outline\">Outline</Button>",
            Preview: Appearances,
            Title: "Appearances"
        }
    ],
    Name: "Button",
    Source: { Component: "Button", Path: "Button/Button.tsx", Props: "ButtonProps" }
});
