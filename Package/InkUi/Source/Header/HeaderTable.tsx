/**
 *
 *
 * @module @sorrell/ink-ui/Header/HeaderTable
 *
 * @file      HeaderTable.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import type { HeaderTableRow } from "./HeaderTableRow.tsx";
import { useTheme } from "../Theme.js";

/** {@inheritDoc HeaderTable} */
export interface HeaderTableProps
{
    readonly Rows: ReadonlyArray<HeaderTableRow>;
}

export/**
       * Renders aligned name-value rows suitable for headers and metadata.
       *
       * @category Display
       * @since 1.0.0
       */
const HeaderTable = ({ Rows }: HeaderTableProps): React.ReactNode =>
{
    const Theme = useTheme();
    const Width = Rows.reduce(
        (Maximum: number, Row: HeaderTableRow) => Math.max(Maximum, Row.Name.length),
        0
    );

    return (
        <Ink.Box flexDirection="column">
            { Rows.map((Row: HeaderTableRow) => (
                <Ink.Text key={ Row.Name }>
                    <Ink.Text color={ Theme.Secondary }>
                        { Row.Name.padEnd(Width) }
                    </Ink.Text>
                    <Ink.Text color={ Theme.TextMuted }> │ </Ink.Text>
                    <Ink.Text color={ Theme.Text }>{ Row.Value }</Ink.Text>
                </Ink.Text>
            )) }
        </Ink.Box>
    );
};
