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
import { type CSSProperties, type ReactNode, useState } from "react";
import {
    CaretDownFilled,
    CaretLeftFilled,
    CaretRightFilled,
    CaretUpFilled,
    type FluentIcon
} from "@fluentui/react-icons";
import { Color as ColorPackage, Contrast } from "@sorrell/color";
import { Option, pipe } from "effect";
import { ColorScheme } from "../../Shared/Theme.js";
import { GetShortcutParts } from "./CommandButton.js";
import { Keybind } from "@sorrell/keyboard-ui";
import type { ShortcutDto } from "../../Shared/Hotkey.js";
import type { Thunk } from "@sorrell/utility/Function";
import { UseColorScheme } from "../Hook/UseColorScheme.js";
import { UseGuardedHover } from "../Hook/UseGuardedHover.js";

/** One direction's presentation on the pad. */
export interface DirectionalPadDirection
{
    readonly Color: Option.Option<string>;
    readonly Disabled: boolean;

    /**
     * Caption shown immediately below the caret. Absolutely positioned, so its
     * presence or content never shifts any other part of the pad.
     */
    readonly Label?: ReactNode;

    readonly OnHoverChange?: ((Hovered: boolean) => void) | undefined;
    readonly OnInvoke: Thunk;
    readonly Shortcut: ShortcutDto;
}

/** {@inheritDoc DirectionalPad} */
export interface DirectionalPadProps
{
    readonly Down?: DirectionalPadDirection;

    /**
     * Flip every caret to point toward the pad's center instead of away from
     * it, *e.g.*, to represent shrinking a window's edges inward rather than
     * growing them outward. Purely visual; direction assignment is unaffected.
     */
    readonly Invert?: boolean;

    readonly Left?: DirectionalPadDirection;
    readonly Right?: DirectionalPadDirection;
    readonly Up?: DirectionalPadDirection;
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
        gap: "0.1rem",
        position: "relative"
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
    Label:
    {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        // Absolutely positioned so its presence, absence, or content length
        // never changes the size of the flex/grid layout around it, and so
        // never shifts any other part of the pad.
        marginTop: "0.25rem",
        position: "absolute",
        top: "100%",
        whiteSpace: "nowrap"
    },
    LabelCenter:
    {
        left: "50%",
        transform: "translateX(-50%)"
    },
    LabelLeft:
    {
        left: 0
    },
    LabelRight:
    {
        right: 0
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

export/**
       * The base color of the window's acrylic background material, before any accent
       * or wallpaper tinting, for each color scheme.
       */
const AcrylicBaseColorHex: Readonly<Record<ColorScheme, string>> = {
    [ ColorScheme.Dark ]: "#202020",
    [ ColorScheme.Light ]: "#f3f3f3"
};

export/** Matches Fluent UI's `colorNeutralForegroundDisabled` token for each color scheme. */
const InactiveForegroundColorHex: Readonly<Record<ColorScheme, string>> = {
    [ ColorScheme.Dark ]: "#5c5c5c",
    [ ColorScheme.Light ]: "#bdbdbd"
};

export/** How much more contrast an adjusted caret color should have than the baseline. */
const ContrastMargin = 1.05;

const ParseCssColor = (Value: string): ColorPackage.Color | undefined =>
    Option.getOrUndefined(pipe(
        ColorPackage.From.Rgb(Value),
        Option.orElse(() => ColorPackage.From.Hex(Value))
    ));

const MixColor = (
    GrayColor: ColorPackage.Color,
    TintColor: ColorPackage.Color,
    GrayPercent: number
): ColorPackage.Color =>
{
    const GrayWeight = GrayPercent / 100;
    const TintWeight = 1 - GrayWeight;

    return ColorPackage.Color(
        GrayColor.R * GrayWeight + TintColor.R * TintWeight,
        GrayColor.G * GrayWeight + TintColor.G * TintWeight,
        GrayColor.B * GrayWeight + TintColor.B * TintWeight
    );
};

export/**
       * Mix the disabled-gray token with a target tint color, ensuring the result has
       * at least as much contrast against the acrylic background as the disabled-gray
       * token itself does (with a bit to spare), so a dim tint never becomes hard to
       * see.
       */
const GetTintedFill = (
    TintColorValue: string,
    GrayPercent: number,
    Scheme: ColorScheme
): string =>
{
    const InactiveColor = Option.getOrThrow(
        ColorPackage.From.Hex(InactiveForegroundColorHex[ Scheme ])
    );
    const BackgroundColor = Option.getOrThrow(
        ColorPackage.From.Hex(AcrylicBaseColorHex[ Scheme ])
    );
    const TintColor = ParseCssColor(TintColorValue) ?? InactiveColor;
    const MixedColor = MixColor(InactiveColor, TintColor, GrayPercent);

    const BaselineRatio = Contrast.ContrastRatio(InactiveColor, BackgroundColor);
    const MixedRatio = Contrast.ContrastRatio(MixedColor, BackgroundColor);

    const ResultColor = MixedRatio < BaselineRatio
        ? Contrast.EnsureContrast(MixedColor, BackgroundColor, BaselineRatio * ContrastMargin)
        : MixedColor;

    return ColorPackage.Format.Hex(ResultColor);
};

const DirectionCaret = (Props: DirectionCaretProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const { Color, Disabled, Icon, OnHoverChange, OnInvoke } = Props;
    const [ IsHovered, SetIsHovered ] = useState(false);
    const CurrentColorScheme = UseColorScheme();
    const HasColor = !Disabled && Option.isSome(Color);

    const primaryFill = Disabled || Option.isNone(Color)
        ? tokens.colorNeutralForegroundDisabled
        : GetTintedFill(
            Color.value,
            IsHovered ? CaretHoveredGrayPercent : CaretGrayPercent,
            CurrentColorScheme
        );
    const IconStyle: CSSProperties | undefined = HasColor && IsHovered
        ? { filter: "saturate(1.35)" }
        : undefined;
    const HoverHandlers = UseGuardedHover((Hovered: boolean) =>
    {
        SetIsHovered(Hovered);
        OnHoverChange?.(Hovered);
    });

    return (
        <Button
            appearance="transparent"
            aria-hidden="true"
            className={ mergeClasses(Styles.Caret, Disabled && Styles.CaretDisabled) }
            disabled={ Disabled }
            onClick={ OnInvoke }
            { ...HoverHandlers }>
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
                { Props.Up !== undefined && (
                    <div className={ mergeClasses(Styles.Direction, Styles.DirectionColumn, Styles.Up) }>
                        <DirectionCaret
                            Color={ Props.Up.Color }
                            Disabled={ Props.Up.Disabled }
                            Icon={ Props.Invert === true ? CaretDownFilled : CaretUpFilled }
                            OnHoverChange={ Props.Up.OnHoverChange }
                            OnInvoke={ Props.Up.OnInvoke } />
                        <Keybind Keys={ GetShortcutParts(Props.Up.Shortcut) } />
                        { Props.Up.Label !== undefined && (
                            <span className={ mergeClasses(Styles.Label, Styles.LabelCenter) }>
                                { Props.Up.Label }
                            </span>
                        ) }
                    </div>
                ) }

                { Props.Left !== undefined && (
                    <div className={ mergeClasses(Styles.Direction, Styles.Left) }>
                        <DirectionCaret
                            Color={ Props.Left.Color }
                            Disabled={ Props.Left.Disabled }
                            Icon={ Props.Invert === true ? CaretRightFilled : CaretLeftFilled }
                            OnHoverChange={ Props.Left.OnHoverChange }
                            OnInvoke={ Props.Left.OnInvoke } />
                        <Keybind Keys={ GetShortcutParts(Props.Left.Shortcut) } />
                        { Props.Left.Label !== undefined && (
                            <span className={ mergeClasses(Styles.Label, Styles.LabelLeft) }>
                                { Props.Left.Label }
                            </span>
                        ) }
                    </div>
                ) }

                <div className={ Styles.Center }>
                    <span className={ Styles.CenterDot } />
                </div>

                { Props.Right !== undefined && (
                    <div className={ mergeClasses(Styles.Direction, Styles.Right) }>
                        <DirectionCaret
                            Color={ Props.Right.Color }
                            Disabled={ Props.Right.Disabled }
                            Icon={ Props.Invert === true ? CaretLeftFilled : CaretRightFilled }
                            OnHoverChange={ Props.Right.OnHoverChange }
                            OnInvoke={ Props.Right.OnInvoke } />
                        <Keybind Keys={ GetShortcutParts(Props.Right.Shortcut) } />
                        { Props.Right.Label !== undefined && (
                            <span className={ mergeClasses(Styles.Label, Styles.LabelRight) }>
                                { Props.Right.Label }
                            </span>
                        ) }
                    </div>
                ) }

                { Props.Down !== undefined && (
                    <div className={ mergeClasses(Styles.Direction, Styles.DirectionColumn, Styles.Down) }>
                        <DirectionCaret
                            Color={ Props.Down.Color }
                            Disabled={ Props.Down.Disabled }
                            Icon={ Props.Invert === true ? CaretUpFilled : CaretDownFilled }
                            OnHoverChange={ Props.Down.OnHoverChange }
                            OnInvoke={ Props.Down.OnInvoke } />
                        <Keybind Keys={ GetShortcutParts(Props.Down.Shortcut) } />
                        { Props.Down.Label !== undefined && (
                            <span className={ mergeClasses(Styles.Label, Styles.LabelCenter) }>
                                { Props.Down.Label }
                            </span>
                        ) }
                    </div>
                ) }
            </div>
        </div>
    );
};
