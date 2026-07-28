/**
 * A single key glyph rendered as a small, light, bordered chip - suitable for inline
 * shortcut reminders next to a menu item or command, as opposed to {@link KeyChip}'s
 * bolder, brand-colored treatment.
 *
 * @module @sorrell/keyboard-ui/CompactKey
 *
 * @file      CompactKey.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { makeStyles, tokens } from "@fluentui/react-components";
import type { ReactNode } from "react";

const UseStyles = makeStyles({
    Root:
    {
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground1,
        border: `${ tokens.strokeWidthThin } solid ${ tokens.colorNeutralStroke2 }`,
        borderRadius: tokens.borderRadiusMedium,
        boxSizing: "border-box",
        color: tokens.colorNeutralForeground3,
        display: "flex",
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightRegular,
        // fontWeight: tokens.fontWeightRegular,
        justifyContent: "center",
        maxHeight: "1.25rem",
        // maxWidth: "1.5rem",
        minHeight: "1.25rem",
        minWidth: "1.25rem"
    }
});

/** Props for {@link CompactKey}. */
export interface CompactKeyProps
{
    /**
     * The key's glyph. A short string for most keys (e.g. `"Ctrl"`, `"V"`), or a Fluent
     * icon for keys better shown as a symbol, e.g. `<Grid16Regular />` for the Windows key
     * or `<ArrowUpRegular />` for Shift.
     */
    readonly children: ReactNode;
}

export/** A single key glyph, in the small, light "compact" style. */
const CompactKey = ({ children }: CompactKeyProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <span className={ Styles.Root }>
            { children }
        </span>
    );
};
