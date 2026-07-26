/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/JsonBodyViewer
 *
 * @file      JsonBodyViewer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { JsonBodyViewer } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <JsonBodyViewer Height={ 4 }
    Value={ { ready: true, value: 42 } } />;
export default SimpleStory({
    Basic: { Code: "<JsonBodyViewer Value={{ready: true, value: 42}} />", Preview: Basic },
    Description: "Pretty-prints and syntax-highlights JSON-compatible data.",
    Examples: [ { Code: "<JsonBodyViewer Height={20} Value={response.body} />", Preview: Basic, Title: "Response body" } ],
    Name: "JsonBodyViewer",
    Source: { Component: "JsonBodyViewer", Path: "CodeEditor/JsonBodyViewer.tsx", Props: "JsonBodyViewerProps" }
});
