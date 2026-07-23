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
    shorthands,
    tokens
} from "@fluentui/react-components";
import type { ShortcutDto } from "../../Shared/Hotkey.js";

/** Presentation properties for a primary overlay command. */
export interface CommandButtonProps
{
    readonly Active: boolean;
    readonly Description: string;
    readonly Icon: NonNullable<ButtonProps["icon"]>;
    readonly Label: string;
    readonly OnInvoke: () => void;
    readonly Shortcut: ShortcutDto;
}

const UseStyles = makeStyles({
    Button: {
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        minHeight: "4.5rem",
        textAlign: "left",
        width: "100%",
        ...shorthands.gap("0.9rem"),
        ...shorthands.padding("0.8rem", "1rem")
    },
    Content: {
        display: "grid",
        minWidth: 0,
        ...shorthands.gap("0.2rem")
    },
    Description: {
        color: tokens.colorNeutralForeground2,
        fontSize: "0.82rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    Keycap: {
        backgroundColor: tokens.colorNeutralBackground3,
        borderRadius: "0.4rem",
        minWidth: "1.8rem",
        textAlign: "center",
        ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
        ...shorthands.padding("0.3rem", "0.45rem")
    },
    Label: {
        fontWeight: 600
    },
    Shortcut: {
        alignItems: "center",
        backgroundColor: "transparent",
        color: tokens.colorNeutralForeground1,
        display: "inline-flex",
        fontFamily: "inherit",
        ...shorthands.gap("0.25rem")
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
            icon={ Props.Icon }
            onClick={ Props.OnInvoke }
            size="large"
            title={ Props.Description }>
            <span className={ Styles.Content }>
                <span className={ Styles.Label }>{ Props.Label }</span>
                <span className={ Styles.Description }>
                    { Props.Description }
                </span>
            </span>
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
        </Button>
    );
};
