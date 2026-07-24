/**
 *
 *
 * @module @sorrell/ink-ui/Tips
 *
 * @file      Tips.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.js";

/** {@inheritDoc Tips} */
export interface TipsProps
{
    readonly Index?: number;
    readonly Tips: ReadonlyArray<string>;
}

export/**
       * Displays one stable tip from a supplied collection.
       *
       * @category Feedback
       * @since 1.0.0
       */
const Tips = ({ Index, Tips: Values }: TipsProps): React.ReactNode =>
{
    const Theme = useTheme();
    const Value = React.useMemo(
        () => Values.length === 0
            ? ""
            : Values[(Index ?? Math.floor(Math.random() * Values.length)) % Values.length],
        [ Index, Values ]
    );

    return (
        <Ink.Text color={ Theme.TextMuted }>
            { Value === "" ? "" : `Tip: ${ Value }` }
        </Ink.Text>
    );
};
