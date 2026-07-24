/**
 *
 *
 * @module @sorrell/ink-ui/CodeEditor/JsonBodyViewer
 *
 * @file      JsonBodyViewer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { CodeEditor } from "./CodeEditor.tsx";

/** {@inheritDoc JsonBodyViewer} */
export interface JsonBodyViewerProps
{
    readonly Height?: number;
    readonly Value: string | unknown;
}

export/**
       * Pretty-prints and syntax-highlights JSON-compatible data.
       *
       * @category CodeEditor
       * @since 1.0.0
       */
const JsonBodyViewer = ({
    Height = 10,
    Value
}: JsonBodyViewerProps): React.ReactNode =>
{
    const TextValue = typeof Value === "string"
        ? Value
        : JSON.stringify(Value, null, 2);

    return (
        <CodeEditor
            Focused={ false }
            Height={ Height }
            Language="json"
            ReadOnly
            Value={ TextValue } />
    );
};
