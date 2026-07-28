/**
 * A compact, clickable display of a keyboard shortcut's keys with a trailing edit
 * affordance. Behaves as a normal button, so it can be used directly as a Fluent
 * `DialogTrigger`'s child to open a {@link KeybindEditorDialogBody}.
 *
 * @module @sorrell/keyboard-ui/KeybindBadge
 *
 * @file      KeybindBadge.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { Edit16Regular } from "@fluentui/react-icons";
import { KeyChip } from "./KeyChip.js";

const UseStyles = makeStyles({
    EditIcon:
    {
        color: tokens.colorNeutralForeground3,
        flexShrink: 0
    },
    Root:
    {
        alignItems: "center",
        backgroundColor: "transparent",
        border: "none",
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        gap: tokens.spacingHorizontalXS,
        padding: 0
    }
});

/** Props for {@link KeybindBadge}. */
export interface KeybindBadgeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type">
{
    /** The keys to display, in order, e.g. `[<WindowsLogo />, "Ctrl", "T"]`. */
    readonly Keys: ReadonlyArray<ReactNode>;
}

export/** A clickable display of a keyboard shortcut, suitable as a dialog trigger. */
const KeybindBadge = forwardRef<HTMLButtonElement, KeybindBadgeProps>((
    { className, Keys, ...Rest }: KeybindBadgeProps,
    Ref: React.ForwardedRef<HTMLButtonElement>): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <button
            { ...Rest }
            className={ mergeClasses(Styles.Root, className) }
            ref={ Ref }
            type="button">
            { Keys.map((Key: ReactNode, Index: number) => (
                <KeyChip Size="small"
                    key={ Index }>{ Key }</KeyChip>
            )) }

            <Edit16Regular className={ Styles.EditIcon } />
        </button>
    );
});

KeybindBadge.displayName = "KeybindBadge";
