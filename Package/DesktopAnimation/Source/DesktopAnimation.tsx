/**
 * Responsive React renderer for declarative desktop animation timelines.
 *
 * @module @sorrell/desktop-animation/DesktopAnimation
 *
 * @file      DesktopAnimation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { makeStyles, tokens } from "@fluentui/react-components";
import { useId, useMemo, type CSSProperties } from "react";
import { CompileAnimation } from "./Internal/CompileAnimation.js";
import { CursorVisual } from "./Internal/CursorVisual.js";
import type { DesktopAnimationDefinition } from "./Model.js";
import { DefineAnimation } from "./Timeline.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/DesktopAnimation" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const UseStyles = makeStyles({
    Canvas:
    {
        border: `${ tokens.strokeWidthThin } solid ${ tokens.colorNeutralStroke2 }`,
        borderRadius: tokens.borderRadiusLarge,
        boxSizing: "border-box",
        isolation: "isolate",
        overflow: "hidden",
        position: "relative",
        width: "100%"
    },
    CaptionButton:
    {
        alignItems: "center",
        color: tokens.colorNeutralForeground3,
        display: "inline-flex",
        fontSize: "7px",
        height: "100%",
        justifyContent: "center",
        width: "18px"
    },
    CaptionButtons:
    {
        alignItems: "stretch",
        display: "flex",
        height: "100%",
        marginLeft: "auto"
    },
    Cursor:
    {
        filter: "drop-shadow(0 1px 1px rgb(0 0 0 / 45%))",
        height: "24px",
        position: "absolute",
        transformOrigin: "top left",
        width: "24px",
        zIndex: 100
    },
    CursorType:
    {
        inset: 0,
        position: "absolute"
    },
    Window:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        border: `${ tokens.strokeWidthThin } solid ${ tokens.colorNeutralStroke2 }`,
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow28,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "absolute",
        transformOrigin: "center"
    },
    WindowContent:
    {
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground2,
        color: tokens.colorNeutralForeground2,
        display: "flex",
        flex: "1 1 auto",
        fontSize: tokens.fontSizeBase100,
        justifyContent: "center",
        minHeight: 0,
        overflow: "hidden",
        padding: tokens.spacingHorizontalXS
    },
    WindowTitle:
    {
        color: tokens.colorNeutralForeground2,
        flex: "1 1 auto",
        fontSize: "9px",
        overflow: "hidden",
        paddingLeft: tokens.spacingHorizontalS,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    WindowTitlebar:
    {
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground1,
        display: "flex",
        flex: "0 0 22px",
        minHeight: 0
    }
});

/**
 * Props for the desktop animation renderer.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DesktopAnimationProps
{
    readonly Animation: DesktopAnimationDefinition;
}

const AnimationStyle = (
    AnimationName: string,
    Duration: number,
    Loop: boolean
): CSSProperties =>
    ({
        animationDuration: `${ Duration }ms`,
        animationFillMode: "both",
        animationIterationCount: Loop ? "infinite" : 1,
        animationName: AnimationName,
        animationTimingFunction: "cubic-bezier(0.33, 0, 0.67, 1)"
    });

/**
 * Renders and automatically plays a Windows 11-style desktop animation.
 *
 * # Details
 *
 * Coordinates are expressed in logical canvas pixels and converted to responsive percentages.
 * The animation replays indefinitely only when `Animation.Loop` is `true`.
 *
 * @category Component
 * @since 1.0.0
 */
export const DesktopAnimation = ({ Animation }: DesktopAnimationProps): React.JSX.Element =>
{
    const Styles = UseStyles();
    const InstanceId = useId().replace(/[^a-zA-Z0-9_-]/gu, "-");
    const ValidatedAnimation = useMemo(() => DefineAnimation(Animation), [ Animation ]);
    const Compiled = useMemo(
        () => CompileAnimation(ValidatedAnimation, `desktop-animation-${ InstanceId }`),
        [ InstanceId, ValidatedAnimation ]
    );
    const Loop = ValidatedAnimation.Loop === true
        && ValidatedAnimation.Steps.some((Step) => Step.Duration > 0);

    return (
        <div
            aria-label={ ValidatedAnimation.Label }
            className={ Styles.Canvas }
            data-desktop-animation={ `desktop-animation-${ InstanceId }` }
            role="img"
            style={ {
                aspectRatio: `${ ValidatedAnimation.Canvas.Width } / ${ ValidatedAnimation.Canvas.Height }`,
                background: ValidatedAnimation.Canvas.Background ?? tokens.colorNeutralBackground3
            } }>
            <style>{ Compiled.StyleSheet }</style>

            { Compiled.Windows.map(({ AnimationName, Window }) => (
                <div
                    className={ Styles.Window }
                    data-animated
                    data-window-id={ Window.Id }
                    key={ Window.Id }
                    style={ {
                        ...AnimationStyle(AnimationName, Compiled.Duration, Loop),
                        borderTopColor: Window.AccentColor
                    } }>
                    <div className={ Styles.WindowTitlebar }>
                        <span className={ Styles.WindowTitle }>{ Window.Title }</span>
                        <span aria-hidden
                            className={ Styles.CaptionButtons }>
                            <span className={ Styles.CaptionButton }>—</span>
                            <span className={ Styles.CaptionButton }>□</span>
                            <span className={ Styles.CaptionButton }>×</span>
                        </span>
                    </div>
                    <div className={ Styles.WindowContent }>{ Window.Content }</div>
                </div>
            )) }

            { Compiled.Cursor !== undefined && (
                <div
                    aria-hidden
                    className={ Styles.Cursor }
                    data-animated
                    data-cursor
                    style={ AnimationStyle(
                        Compiled.Cursor.AnimationName,
                        Compiled.Duration,
                        Loop
                    ) }>
                    { Compiled.Cursor.Types.map((CursorType) =>
                    {
                        const TypeAnimationName =
                            Compiled.Cursor?.TypeAnimationNames.get(CursorType);

                        return TypeAnimationName === undefined
                            ? null
                            : (
                                <span
                                    className={ Styles.CursorType }
                                    data-animated
                                    data-cursor-type={ CursorType }
                                    key={ CursorType }
                                    style={ AnimationStyle(
                                        TypeAnimationName,
                                        Compiled.Duration,
                                        Loop
                                    ) }>
                                    <CursorVisual Type={ CursorType } />
                                </span>
                            );
                    }) }
                </div>
            ) }
        </div>
    );
};
