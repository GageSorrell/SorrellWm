/**
 * A single key glyph rendered as a small brand-colored chip, shared by {@link KeybindBadge}
 * and {@link KeybindEditorDialogBody}.
 *
 * @module @sorrell/keyboard-ui/KeyChip
 *
 * @file      KeyChip.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { CompactKey } from "./CompactKey.tsx";
import type { PropsWithChildren } from "react";

const UseStyles = makeStyles({
    Large:
    {
        borderRadius: tokens.borderRadiusLarge,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
        minWidth: "2.75rem",
        padding: `${ tokens.spacingVerticalM } ${ tokens.spacingHorizontalL }`
    },
    Root:
    {
        alignItems: "center",
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        display: "flex",
        justifyContent: "center"
    },
    Small:
    {
        borderRadius: tokens.borderRadiusMedium,
        fontSize: tokens.fontSizeBase200,
        fontWeight: tokens.fontWeightSemibold,
        minWidth: "1.5rem",
        padding: `${ tokens.spacingVerticalXS } ${ tokens.spacingHorizontalSNudge }`
    }
});

/**
 * The size of the key.  Each size has its purpose.
 *
 * @category Key
 * @since 1.0.0
 */
export type KeySize =
    /** Very large, used for the editor modal. */
    | "large"
    /** The default size. */
    | "small"
    /** Inline (compact) usage. */
    | "inline";

/** {@inheritDoc KeyChip} */
export interface KeyChipProps extends PropsWithChildren
{
    readonly Size?: KeySize | undefined;
}

export/**
       * A single key glyph rendered as a small brand-colored chip.
       *
       * @category Key
       * @since 1.0.0
       */
const KeyChip = ({ Size = "small", children }: KeyChipProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    if (Size === "inline")
    {
        return <CompactKey>{ children }</CompactKey>;
    }

    const className = mergeClasses(
        Styles.Root,
        Size === "large" ? Styles.Large : Styles.Small
    );

    return (
        <span { ...{ className } }>
            { children }
        </span>
    );
};
