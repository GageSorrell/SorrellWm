/**
 * Themed, focusable terminal button.
 *
 * @module @sorrell/ink-ui/Button
 *
 * @file      Button.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    Box,
    type BoxMouseDownEvent,
    type BoxMouseDragEvent,
    type BoxMouseEvent,
    type BoxMouseUpEvent,
    type BoxProps
} from "../Box/index.js";
import {
    type ButtonStyleState,
    type ButtonVisualStyle,
    ResolveButtonStyle,
    useTheme
} from "../Theme.js";
import { type FocusableState, useFocusable, useRoutedInput } from "../Interaction/index.js";
import type { CornerShapeValue } from "../Box/CompactBorder.js";
import type { LocalMouseEvent } from "../Mouse/MouseEvent.ts";
import { Button as MouseButton } from "../Mouse/index.js";

/**
 * The identifier that determines the respective styles of button's elements, according to the current theme.
 *
 * @category Theme
 * @since 1.0.0
 */
export type ButtonAppearance =
    /** Emphasizes the button. */
    | "primary"

    /** The default appearance. */
    | "secondary"

    /** Minimizes emphasis when not hovered or focused. */
    | "subtle"

    /** No background or border. */
    | "transparent"

    /** No background. */
    | "outline";

/**
 * The position of the icon, relative to its children.
 *
 * @category Theme
 * @since 1.0.0
 */
export type IconPosition =
    | "before"
    | "after";

/**
 * An event triggered by the user interacting with a button.
 *
 * @category Interaction
 * @since 1.0.0
 */
export type ButtonPressEvent =
    | {
        readonly Input: string;
        readonly Key: Ink.Key;
        readonly Source: "keyboard";
    }
    | {
        readonly Event: BoxMouseUpEvent;
        readonly Source: "mouse";
    };

/** {@inheritDoc Button} */
export interface ButtonProps extends Omit<BoxProps, "children">
{
    readonly Appearance?: ButtonAppearance;
    readonly AutoFocus?: boolean;
    readonly children?: React.ReactNode;
    readonly Disabled?: boolean;
    readonly DisabledFocusable?: boolean;
    /** Duration of the active-style fallback when key releases are unavailable. */
    readonly FlashDurationMs?: number;
    readonly Icon?: React.ReactNode;
    readonly IconPosition?: IconPosition;
    readonly Id?: string;
    readonly Large?: boolean;
    readonly OnBlur?: (() => void) | undefined;
    readonly OnFocus?: (() => void) | undefined;
    readonly OnPress?: ((Event: ButtonPressEvent) => void) | undefined;
    readonly Order?: number;
    readonly Shape?: CornerShapeValue;
}

export/**
       * A themed button activated by primary clicks, Enter, or Space.
       *
       * Place Button below `InteractionProvider` and `MouseProvider` so focus,
       * routed input, hover, and pointer activation share their application-level
       * dispatchers.
       *
       * @category Component
       * @since 1.0.0
       */
const Button = React.forwardRef<Ink.DOMElement, ButtonProps>(function ButtonComponent(
    Props: ButtonProps,
    Reference: React.ForwardedRef<Ink.DOMElement>
): React.ReactElement
{
    const {
        Appearance = "secondary",
        AutoFocus = false,
        children,
        Disabled = false,
        DisabledFocusable = false,
        FlashDurationMs = 120,
        Icon,
        IconPosition = "before",
        Id,
        Large = false,
        OnBlur,
        OnFocus,
        OnPress,
        Order = 0,
        Shape,
        onClick,
        onMouseDown,
        onMouseDrag,
        onMouseEnter,
        onMouseLeave,
        onMouseUp,
        ...BoxPropsValue
    } = Props;
    const Theme = useTheme();
    const Focus: FocusableState = useFocusable({
        AutoFocus,
        Disabled: Disabled && !DisabledFocusable,
        ...(Id === undefined ? { } : { Id }),
        OnBlur,
        OnFocus,
        Order
    });
    const [ Hovered, SetHovered ] = React.useState(false);
    const [ MousePressed, SetMousePressed ] = React.useState(false);
    const [ KeyboardPressed, SetKeyboardPressed ] = React.useState(false);
    const KeyboardArmedReference = React.useRef(false);
    const FlashTimerReference = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const PressHandlerReference = React.useRef(OnPress);
    PressHandlerReference.current = OnPress;

    const ClearFlash = React.useCallback((): void =>
    {
        if (FlashTimerReference.current !== undefined)
        {
            clearTimeout(FlashTimerReference.current);
            FlashTimerReference.current = undefined;
        }
    }, [ ]);
    const FlashPressed = React.useCallback((): void =>
    {
        ClearFlash();
        SetKeyboardPressed(true);
        FlashTimerReference.current = setTimeout(() =>
        {
            FlashTimerReference.current = undefined;
            SetKeyboardPressed(false);
        }, Math.max(0, Number.isFinite(FlashDurationMs) ? FlashDurationMs : 120));
    }, [ ClearFlash, FlashDurationMs ]);

    React.useEffect(() => () => ClearFlash(), [ ClearFlash ]);
    React.useEffect(() =>
    {
        if (!Focus.Focused || Disabled)
        {
            KeyboardArmedReference.current = false;
            SetKeyboardPressed(false);
            ClearFlash();
        }
    }, [ ClearFlash, Disabled, Focus.Focused ]);

    useRoutedInput((Input: string, Key: Ink.Key): boolean =>
    {
        if (!IsCommitKey(Input, Key))
        {
            return false;
        }

        if (Key.eventType === "release")
        {
            const WasArmed: boolean = KeyboardArmedReference.current;
            KeyboardArmedReference.current = false;
            SetKeyboardPressed(false);
            if (WasArmed)
            {
                PressHandlerReference.current?.({ Input, Key, Source: "keyboard" });
            }
            return true;
        }

        if (Key.eventType === "repeat")
        {
            return true;
        }

        if (Key.eventType === "press")
        {
            KeyboardArmedReference.current = true;
            SetKeyboardPressed(true);
            return true;
        }

        FlashPressed();
        PressHandlerReference.current?.({ Input, Key, Source: "keyboard" });
        return true;
    }, { Active: Focus.Focused && !Disabled, Priority: 100 });

    const Pressed: boolean = MousePressed || KeyboardPressed;
    const State: ButtonStyleState = Disabled ? "Disabled"
        : Pressed ? "Pressed"
            : Hovered ? "Hovered"
                : Focus.Focused ? "Focused"
                    : "Default";
    const Style: ButtonVisualStyle = ResolveButtonStyle(Theme, Appearance, State);
    const PaddingX: number | undefined = BoxPropsValue.paddingX
        ?? (BoxPropsValue.padding === undefined
            ? (Style.PaddingX ?? 1) + (Large ? 1 : 0)
            : undefined);
    const PaddingY: number | undefined = BoxPropsValue.paddingY
        ?? (BoxPropsValue.padding === undefined
            ? (Style.PaddingY ?? 0) + (Large ? 1 : 0)
            : undefined);
    const AccessibleLabel: string | undefined = BoxPropsValue["aria-label"]
        ?? ToAccessibleLabel(children);
    const BackgroundColor: string | undefined = BoxPropsValue.backgroundColor
        ?? Style.BackgroundColor;
    const BorderColor: string | undefined = BoxPropsValue.borderColor ?? Style.BorderColor;
    const BorderStyle: BoxProps["borderStyle"] = BoxPropsValue.borderStyle
        ?? (Shape === undefined ? Style.BorderStyle : "compact");
    const CornerShape: CornerShapeValue | undefined = BoxPropsValue.cornerShape ?? Shape;
    const Label = children === undefined ? null : (
        <Ink.Text
            bold={ Style.Bold ?? false }
            color={ Style.Color ?? Theme.Text }
            dimColor={ Style.DimColor ?? false }>
            { children }
        </Ink.Text>
    );
    const Gap = Icon !== undefined && children !== undefined ? <Ink.Text> </Ink.Text> : null;

    return (
        <Box
            { ...BoxPropsValue }
            alignItems={ BoxPropsValue.alignItems ?? "center" }
            alignSelf={ BoxPropsValue.alignSelf ?? "flex-start" }
            { ...(AccessibleLabel === undefined ? { } : { "aria-label": AccessibleLabel }) }
            aria-role={ BoxPropsValue["aria-role"] ?? "button" }
            aria-state={ {
                ...BoxPropsValue["aria-state"],
                disabled: Disabled
            } }
            { ...(BackgroundColor === undefined ? { } : { backgroundColor: BackgroundColor }) }
            { ...(BorderColor === undefined ? { } : { borderColor: BorderColor }) }
            { ...(BorderStyle === undefined ? { } : { borderStyle: BorderStyle }) }
            { ...(CornerShape === undefined ? { } : { cornerShape: CornerShape }) }
            flexDirection={ BoxPropsValue.flexDirection ?? "row" }
            onClick={ (Event: BoxMouseUpEvent): void =>
            {
                SetMousePressed(false);
                if (!Disabled)
                {
                    PressHandlerReference.current?.({ Event, Source: "mouse" });
                    onClick?.(Event);
                }
            } }
            onMouseDown={ (Event: BoxMouseDownEvent): void =>
            {
                if (!Disabled || DisabledFocusable)
                {
                    Focus.Focus();
                }
                if (!Disabled && Event.Button === MouseButton.Left)
                {
                    SetMousePressed(true);
                }
                if (!Disabled)
                {
                    onMouseDown?.(Event);
                }
            } }
            onMouseDrag={ (Event: BoxMouseDragEvent): void =>
            {
                if (!Disabled && Event.Button === MouseButton.Left)
                {
                    SetMousePressed(true);
                }
                if (!Disabled)
                {
                    onMouseDrag?.(Event);
                }
            } }
            onMouseEnter={ (Event: BoxMouseEvent<LocalMouseEvent>): void =>
            {
                SetHovered(true);
                onMouseEnter?.(Event);
            } }
            onMouseLeave={ (Event: BoxMouseEvent<LocalMouseEvent>): void =>
            {
                SetHovered(false);
                SetMousePressed(false);
                onMouseLeave?.(Event);
            } }
            onMouseUp={ (Event: BoxMouseUpEvent): void =>
            {
                SetMousePressed(false);
                if (!Disabled)
                {
                    onMouseUp?.(Event);
                }
            } }
            { ...(PaddingX === undefined ? { } : { paddingX: PaddingX }) }
            { ...(PaddingY === undefined ? { } : { paddingY: PaddingY }) }
            ref={ Reference }>
            { Icon !== undefined && IconPosition === "before" ? Icon : null }
            { IconPosition === "before" ? Gap : null }
            { Label }
            { IconPosition === "after" ? Gap : null }
            { Icon !== undefined && IconPosition === "after" ? Icon : null }
        </Box>
    );
});

Button.displayName = "Button";

/** A temporary way of determining if the commit key was pressed. */
const IsCommitKey = (Input: string, Key: Ink.Key): boolean =>
{
    return Key.return || Input === " ";
};

const ToAccessibleLabel = (Value: React.ReactNode): string | undefined =>
{
    if ([ "string", "number", "bigint" ].includes(typeof Value))
    {
        return String(Value);
    }
    if (Array.isArray(Value))
    {
        const Parts: ReadonlyArray<string | undefined> = Value.map(ToAccessibleLabel);
        return Parts.includes(undefined) ? undefined : Parts.join("");
    }
    return undefined;
};
