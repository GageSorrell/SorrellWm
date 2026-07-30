/**
 * A compact button below the Focus screen's directional pad, previewing the
 * window (if any) available in one direction.
 *
 * @module @sorrell/wm/Renderer/FocusDirectionButton
 *
 * @file      FocusDirectionButton.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { AppGenericRegular, type FluentIcon } from "@fluentui/react-icons";
import { Button, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import type { CSSProperties } from "react";
import type { OverlayCommandDto } from "../Shared/OverlayCommand.js";
import { UseDominantColor } from "./UseDominantColor.js";
import { UseGuardedHover } from "./UseGuardedHover.js";

/** Props for {@link FocusDirectionButton}. */
export interface FocusDirectionButtonProps
{
    readonly Command: OverlayCommandDto;
    readonly Icon: FluentIcon;
    readonly OnHoverChange?: ((Hovered: boolean) => void) | undefined;
    readonly OnInvoke: () => void;
}

const UseStyles = makeStyles({
    ApplicationIcon:
    {
        flexShrink: 0,
        height: "1rem",
        objectFit: "contain",
        width: "1rem"
    },
    Button:
    {
        display: "grid",
        gap: "0.6rem",
        gridTemplateColumns: "auto auto minmax(0, 1fr)",
        justifyContent: "flex-start",
        minHeight: "2.25rem",
        padding: "0.5rem 0.75rem",
        textAlign: "left",
        width: "100%"
    },
    ButtonDisabled:
    {
        gridTemplateColumns: "auto",
        justifyContent: "center",
        visibility: "hidden"
    },
    DirectionIcon:
    {
        alignItems: "center",
        display: "inline-flex",
        flexShrink: 0,
        fontSize: "1rem"
    },
    Title:
    {
        fontSize: tokens.fontSizeBase200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    }
});

export/** Render one direction's target window, tinted by the window's icon color. */
const FocusDirectionButton = (Props: FocusDirectionButtonProps): React.JSX.Element =>
{
    const Styles = UseStyles();
    const Target = Props.Command.Target;
    const Disabled = Props.Command.Disabled || Target === undefined;
    const Color = UseDominantColor(Target?.Icon);
    const Icon = Props.Icon;
    const TintStyle: CSSProperties | undefined = Disabled || Color === undefined
        ? undefined
        : { backgroundColor: `rgba(${ Color.R }, ${ Color.G }, ${ Color.B }, 0.16)` };
    const HoverHandlers = UseGuardedHover(Props.OnHoverChange);

    return (
        <Button
            appearance="subtle"
            className={ mergeClasses(Styles.Button, Disabled && Styles.ButtonDisabled) }
            disabled={ Disabled }
            onClick={ Props.OnInvoke }
            { ...HoverHandlers }
            style={ TintStyle }
            title={ Target?.Title }>
            <span
                aria-hidden="true"
                className={ Styles.DirectionIcon }>
                <Icon />
            </span>

            { !Disabled && (
                <>
                    { Target.Icon === undefined
                        ? <AppGenericRegular className={ Styles.ApplicationIcon } />
                        : (
                            <img
                                alt=""
                                className={ Styles.ApplicationIcon }
                                src={ `data:image/png;base64,${ Target.Icon }` } />
                        ) }
                    <span className={ Styles.Title }>{ Target.Title }</span>
                </>
            ) }
        </Button>
    );
};
