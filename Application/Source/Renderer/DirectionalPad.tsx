/**
 * A visual up/down/left/right pad for the Focus screen, showing each
 * direction's keybind and whether it currently has a focusable target.
 *
 * @module @sorrell/wm/Renderer/DirectionalPad
 *
 * @file      DirectionalPad.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Button, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { type CSSProperties, useState } from "react";
import {
    CaretDownFilled,
    CaretLeftFilled,
    CaretRightFilled,
    CaretUpFilled,
    type FluentIcon
} from "@fluentui/react-icons";
import { GetShortcutParts } from "./CommandButton.js";
import { Keybind } from "@sorrell/keyboard-ui";
import { Option } from "effect";
import type { ShortcutDto } from "../Shared/Hotkey.js";

/** One direction's presentation on the pad. */
export interface DirectionalPadDirection
{
    readonly Color: Option.Option<string>;
    readonly Disabled: boolean;
    readonly OnHoverChange?: ((Hovered: boolean) => void) | undefined;
    readonly OnInvoke: () => void;
    readonly Shortcut: ShortcutDto;
}

/** Props for {@link DirectionalPad}. */
export interface DirectionalPadProps
{
    readonly Down: DirectionalPadDirection;
    readonly Left: DirectionalPadDirection;
    readonly Right: DirectionalPadDirection;
    readonly Up: DirectionalPadDirection;
}

const UseStyles = makeStyles({
    Caret:
    {
        borderRadius: "50%",
        color: tokens.colorNeutralForegroundDisabled,
        display: "inline-flex",
        fontSize: "11rem",
        margin: "-2rem"
    },
    CaretDisabled:
    {
        color: tokens.colorNeutralForeground4
    },
    Center:
    {
        alignItems: "center",
        display: "flex",
        gridColumn: 2,
        gridRow: 2,
        justifyContent: "center"
    },
    CenterDot:
    {
        backgroundColor: tokens.colorNeutralForeground4,
        borderRadius: "50%",
        height: "2rem",
        width: "2rem"
    },
    Direction:
    {
        alignItems: "center",
        display: "flex",
        gap: "0.1rem"
    },
    DirectionColumn:
    {
        flexDirection: "column"
    },
    Down:
    {
        alignSelf: "end",
        flexDirection: "column-reverse",
        gridColumn: 2,
        gridRow: 3
    },
    Left:
    {
        gridColumn: 1,
        gridRow: 2,
        justifySelf: "start"
    },
    Outer:
    {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        width: "100%"
    },
    Right:
    {
        flexDirection: "row-reverse",
        gridColumn: 3,
        gridRow: 2,
        justifySelf: "end"
    },
    Root:
    {
        alignItems: "center",
        aspectRatio: 1,
        display: "grid",
        gap: "0.5rem",
        gridTemplateColumns: "1fr auto 1fr",
        gridTemplateRows: "1fr auto 1fr",
        justifyContent: "center",
        justifyItems: "center",
        maxWidth: "30rem",
        width: "100%"
    },
    Up:
    {
        alignSelf: "start",
        flexDirection: "column",
        gridColumn: 2,
        gridRow: 1
    }
});

interface DirectionCaretProps extends
    Pick<DirectionalPadDirection, "Color" | "Disabled" | "OnHoverChange" | "OnInvoke">
{
    readonly Icon: FluentIcon;
}

const CaretGrayPercent = 67;
const CaretHoveredGrayPercent = 30;

const DirectionCaret = (Props: DirectionCaretProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const { Color, Disabled, Icon, OnHoverChange, OnInvoke } = Props;
    const [ IsHovered, SetIsHovered ] = useState(false);
    const HasColor = !Disabled && Option.isSome(Color);

    const primaryFill = Disabled || Option.isNone(Color)
        ? tokens.colorNeutralForegroundDisabled
        : `color-mix(in srgb, ${ tokens.colorNeutralForegroundDisabled } ` +
            `${ IsHovered ? CaretHoveredGrayPercent : CaretGrayPercent }%, ${ Color.value })`;
    const IconStyle: CSSProperties | undefined = HasColor && IsHovered
        ? { filter: "saturate(1.35)" }
        : undefined;

    return (
        <Button
            appearance="transparent"
            aria-hidden="true"
            className={ mergeClasses(Styles.Caret, Disabled && Styles.CaretDisabled) }
            disabled={ Disabled }
            onClick={ OnInvoke }
            onMouseEnter={ () =>
            {
                SetIsHovered(true);
                OnHoverChange?.(true);
            } }
            onMouseLeave={ () =>
            {
                SetIsHovered(false);
                OnHoverChange?.(false);
            } }>
            <Icon
                style={ IconStyle }
                { ...{ primaryFill } } />
        </Button>
    );
};

export/** Render the Focus screen's directional pad. */
const DirectionalPad = (Props: DirectionalPadProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <div className={ Styles.Outer }>
            <div
                aria-hidden="true"
                className={ Styles.Root }>
                <div className={ mergeClasses(Styles.Direction, Styles.DirectionColumn, Styles.Up) }>
                    <DirectionCaret
                        Color={ Props.Up.Color }
                        Disabled={ Props.Up.Disabled }
                        Icon={ CaretUpFilled }
                        OnHoverChange={ Props.Up.OnHoverChange }
                        OnInvoke={ Props.Up.OnInvoke } />
                    <Keybind Keys={ GetShortcutParts(Props.Up.Shortcut) } />
                </div>

                <div className={ mergeClasses(Styles.Direction, Styles.Left) }>
                    <DirectionCaret
                        Color={ Props.Left.Color }
                        Disabled={ Props.Left.Disabled }
                        Icon={ CaretLeftFilled }
                        OnHoverChange={ Props.Left.OnHoverChange }
                        OnInvoke={ Props.Left.OnInvoke } />
                    <Keybind Keys={ GetShortcutParts(Props.Left.Shortcut) } />
                </div>

                <div className={ Styles.Center }>
                    <span className={ Styles.CenterDot } />
                </div>

                <div className={ mergeClasses(Styles.Direction, Styles.Right) }>
                    <DirectionCaret
                        Color={ Props.Right.Color }
                        Disabled={ Props.Right.Disabled }
                        Icon={ CaretRightFilled }
                        OnHoverChange={ Props.Right.OnHoverChange }
                        OnInvoke={ Props.Right.OnInvoke } />
                    <Keybind Keys={ GetShortcutParts(Props.Right.Shortcut) } />
                </div>

                <div className={ mergeClasses(Styles.Direction, Styles.DirectionColumn, Styles.Down) }>
                    <DirectionCaret
                        Color={ Props.Down.Color }
                        Disabled={ Props.Down.Disabled }
                        Icon={ CaretDownFilled }
                        OnHoverChange={ Props.Down.OnHoverChange }
                        OnInvoke={ Props.Down.OnInvoke } />
                    <Keybind Keys={ GetShortcutParts(Props.Down.Shortcut) } />
                </div>
            </div>
        </div>
    );
};
