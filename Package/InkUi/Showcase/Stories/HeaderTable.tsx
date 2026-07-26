/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/HeaderTable
 *
 * @file      HeaderTable.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { HeaderTable } from "../../Source/index.js";
import { SimpleStory } from "./Factory.js";

const Basic = (): React.ReactElement => <HeaderTable Rows={ [ { Name: "Name", Value: "Ink UI" }, { Name: "Version", Value: "1.0.0" } ] } />;
export default SimpleStory({
    Basic: { Code: "<HeaderTable Rows={[{Name: \"Name\", Value: \"Ink UI\"}]} />", Preview: Basic },
    Description: "Displays compact name/value metadata rows.",
    Examples: [ { Code: "<HeaderTable Rows={requestMetadata} />", Preview: Basic, Title: "Request metadata" } ],
    Name: "HeaderTable",
    Source: { Component: "HeaderTable", Path: "Header/HeaderTable.tsx", Props: "HeaderTableProps" }
});
