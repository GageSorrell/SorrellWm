/**
 * Showcase story for toast.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Toast
 *
 * @file      Toast.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Toast } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <Toast DurationMilliseconds={ 60_000 }
    Message="Saved" />;
export default SimpleStory({
    Basic: { Code: "<Toast Message=\"Saved\" DurationMilliseconds={3000} />", Preview: Basic },
    Description: "Shows a temporary, themed notification message.",
    Examples: [ { Code: "<Toast Message=\"Connection restored\" DurationMilliseconds={5000} />", Preview: Basic, Title: "Timed notification" } ],
    Name: "Toast",
    Source: { Component: "Toast", Path: "Toast.tsx", Props: "ToastProps" }
});
