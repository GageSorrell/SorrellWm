/**
 * A row of {@link CompactKey} glyphs representing one keyboard shortcut, e.g. an inline
 * reminder next to a menu item:
 *
 * ```tsx
 * <CompactKeybind Keys={ [ <Grid16Regular />, <ArrowUpRegular />, "V" ] } />
 * ```
 *
 * @module @sorrell/keyboard-ui/Keybind
 *
 * @file      Keybind.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { makeStyles, tokens } from "@fluentui/react-components";
import { CompactKey } from "./CompactKey.tsx";
import type { ReactNode } from "react";

const UseStyles = makeStyles({
    Root:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalXS
    }
});

/** Props for {@link Keybind}. */
export interface KeybindProps
{
    /** The shortcut's keys, in order, e.g. `[<Grid16Regular />, "Ctrl", "T"]`. */
    readonly Keys: ReadonlyArray<ReactNode>;
}

export/** A row of {@link CompactKey} glyphs representing one keyboard shortcut. */
const Keybind = ({ Keys }: KeybindProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <div className={ Styles.Root }>
            {
                /*
                 * `Key` is a `ReactNode` that may be an icon element (e.g. `<Key.Shift />`),
                 * not a plain hashable value — `Keys` is a fixed-order array rebuilt fresh
                 * on every render, so the index alone is a safe, stable React key.
                 */
                Keys.map((Key: ReactNode, Index: number) => (
                    <CompactKey key={ Index }>{ Key }</CompactKey>
                ))
            }
        </div>
    );
};
