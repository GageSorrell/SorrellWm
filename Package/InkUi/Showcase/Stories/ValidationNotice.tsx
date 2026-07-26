/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/ValidationNotice
 *
 * @file      ValidationNotice.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { ValidationNotice } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <ValidationNotice Message="A value is required." />;
export default SimpleStory({
    Basic: { Code: "<ValidationNotice Message=\"A value is required.\" />", Preview: Basic },
    Description: "Displays an inline validation error using the active theme.",
    Examples: [ { Code: "<ValidationNotice Message=\"Enter a valid URL.\" />", Preview: Basic, Title: "Field validation" } ],
    Name: "ValidationNotice",
    Source: { Component: "ValidationNotice", Path: "ValidationNotice.tsx", Props: "ValidationNoticeProps" }
});
