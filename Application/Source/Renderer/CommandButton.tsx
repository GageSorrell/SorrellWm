/**
 * A renderer-owned presentation of one overlay command and its shortcut.
 *
 * @module @sorrell/wm/Renderer/CommandButton
 *
 * @file      CommandButton.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import {
    Button,
    type ButtonProps,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import type { ShortcutDto } from "../Shared/Hotkey.js";

/** Presentation properties for a primary overlay command. */
export interface CommandButtonProps
{
    readonly Active: boolean;
    readonly ApplicationIcon?: React.ReactNode | undefined;
    readonly Description: string | undefined;
    readonly Disabled?: boolean | undefined;
    readonly Icon: NonNullable<ButtonProps["icon"]>;
    readonly Label: string;
    readonly OnHoverChange?: ((Hovered: boolean) => void) | undefined;
    readonly OnInvoke: () => void;
    readonly Shortcut: ShortcutDto;
}

const UseStyles = makeStyles({
    ApplicationIcon:
    {
        alignItems: "center",
        display: "inline-flex",
        flexShrink: 0,
        fontSize: "1.5rem",
        height: "1.5rem",
        justifyContent: "center",
        width: "1.5rem"
    },
    Button:
    {
        display: "grid",
        gap: "0.9rem",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        minHeight: "4.5rem",
        padding: "0.8rem 1rem",
        textAlign: "left",
        width: "100%"
    },
    CompactButton:
    {
        display: "grid",
        gap: "0.65rem",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        maxWidth: "100%",
        minHeight: "2.25rem",
        padding: "0.35rem 0.75rem",
        textAlign: "left"
    },
    Content:
    {
        display: "grid",
        gap: "0.2rem",
        minWidth: 0
    },
    Description:
    {
        color: tokens.colorNeutralForeground2,
        display: "inline-block",
        fontSize: "0.82rem",
        minBlockSize: "1lh",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    Keycap:
    {
        backgroundColor: tokens.colorNeutralBackground3,
        border: `1px solid ${ tokens.colorNeutralStroke2 }`,
        borderRadius: "0.4rem",
        minWidth: "1.8rem",
        padding: "0.3rem 0.45rem",
        textAlign: "center"
    },
    Label:
    {
        fontWeight: 600
    },
    Shortcut:
    {
        alignItems: "center",
        backgroundColor: "transparent",
        color: tokens.colorNeutralForeground1,
        display: "inline-flex",
        fontFamily: "inherit",
        gap: "0.25rem"
    },
    Trailing:
    {
        alignItems: "center",
        display: "inline-flex",
        gap: "0.75rem"
    }
});

const GetShortcutParts = (Shortcut: ShortcutDto): ReadonlyArray<string> =>
{
    const Parts = new Array<string>();

    if (Shortcut.Modifiers.Control)
    {
        Parts.push("Ctrl");
    }
    if (Shortcut.Modifiers.Shift)
    {
        Parts.push("Shift");
    }
    if (Shortcut.Modifiers.Alt)
    {
        Parts.push("Alt");
    }
    if (Shortcut.Modifiers.Super)
    {
        Parts.push("Win");
    }

    Parts.push(Shortcut.KeyLabel);
    return Parts;
};

export/** Render a primary overlay command with renderer-specific presentation. */
const CommandButton = (Props: CommandButtonProps): React.JSX.Element =>
{
    const Styles = UseStyles();
    const ShortcutParts = GetShortcutParts(Props.Shortcut);

    return (
        <Button
            appearance={ Props.Active ? "primary" : "subtle" }
            aria-pressed={ Props.Active }
            className={ Styles.Button }
            disabled={ Props.Disabled === true }
            icon={ Props.Icon }
            onClick={ Props.OnInvoke }
            onMouseEnter={ () => Props.OnHoverChange?.(true) }
            onMouseLeave={ () => Props.OnHoverChange?.(false) }
            size="large"
            title={ Props.Description }>
            <span className={ Styles.Content }>
                <span className={ Styles.Label }>{ Props.Label }</span>
                <span className={ Styles.Description }>
                    { Props.Description }
                </span>
            </span>
            <span className={ Styles.Trailing }>
                { Props.ApplicationIcon !== undefined && (
                    <span
                        aria-hidden="true"
                        className={ Styles.ApplicationIcon }
                        data-testid="application-icon">
                        { Props.ApplicationIcon }
                    </span>
                ) }
                <kbd
                    aria-label={ ShortcutParts.join(" plus ") }
                    className={ Styles.Shortcut }>
                    { ShortcutParts.map((Part: string, Index: number) => (
                        <React.Fragment key={ Part }>
                            { Index > 0 && <span aria-hidden="true">+</span> }
                            <span className={ Styles.Keycap }>{ Part }</span>
                        </React.Fragment>
                    )) }
                </kbd>
            </span>
        </Button>
    );
};

/**
 * A compact button representing an action that is less relevant to the user's
 * experience.
 *
 * @category Interaction
 * @since 0.1.0
 */
export interface CompactCommandButtonProps extends Omit<CommandButtonProps, "Description"> { }

export/** Render a primary overlay command with renderer-specific presentation. */
const CompactCommandButton = (Props: CompactCommandButtonProps): React.ReactNode =>
{
    const Styles = UseStyles();
    const ShortcutParts = GetShortcutParts(Props.Shortcut);

    return (
        <Button
            appearance={ Props.Active ? "primary" : "subtle" }
            aria-pressed={ Props.Active }
            className={ Styles.CompactButton }
            disabled={ Props.Disabled === true }
            icon={ Props.Icon }
            onClick={ Props.OnInvoke }
            onMouseEnter={ () => Props.OnHoverChange?.(true) }
            onMouseLeave={ () => Props.OnHoverChange?.(false) }
            size="small"
            title={ Props.Label }>
            <span className={ Styles.Content }>
                <span className={ Styles.Label }>{ Props.Label }</span>
            </span>
            <span className={ Styles.Trailing }>
                { Props.ApplicationIcon !== undefined && (
                    <span
                        aria-hidden="true"
                        className={ Styles.ApplicationIcon }
                        data-testid="application-icon">
                        { Props.ApplicationIcon }
                    </span>
                ) }
                <kbd
                    aria-label={ ShortcutParts.join(" plus ") }
                    className={ Styles.Shortcut }>
                    { ShortcutParts.map((Part: string, Index: number) => (
                        <React.Fragment key={ Part }>
                            { Index > 0 && <span aria-hidden="true">+</span> }
                            <span className={ Styles.Keycap }>{ Part }</span>
                        </React.Fragment>
                    )) }
                </kbd>
            </span>
        </Button>
    );
};
