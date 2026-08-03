/**
 * WinUI 3-like scrollbars for web content.
 *
 * @module @sorrell/windows-ui/Scrollbars
 *
 * @file      Scrollbars.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";

export/**
       * The type identifier for this module.
       *
       * @category Constant
       * @since 1.0.0
       */
const TypeId = "~sorrell/windows-ui/Scrollbars" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const ArrowImage = (Path: string): string =>
    [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ",
        "viewBox='0 0 12 12'%3E%3Cpath ",
        `d='${ Path }' fill='none' stroke='%23616161' `,
        "stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
    ].join("");

const UpArrow = ArrowImage("M3 7.5 6 4.5l3 3");
const DownArrow = ArrowImage("m3 4.5 3 3 3-3");
const LeftArrow = ArrowImage("M7.5 3 4.5 6l3 3");
const RightArrow = ArrowImage("m4.5 3 3 3-3 3");
const ArrowSize = 12 as const;
const ScrollbarSize = 16 as const;
const ArrowSizeCss = `${ ArrowSize }px`;
const ScrollbarSizeCss = `${ ScrollbarSize }px`;
const HoverAttribute = "data-sorrell-scrollbar-hovered" as const;
const HoverSelector = `&[${ HoverAttribute }], & [${ HoverAttribute }]`;

const VerticalDecrementSelector =
    "&::-webkit-scrollbar-button:vertical:decrement:start, "
    + "& *::-webkit-scrollbar-button:vertical:decrement:start";
const VerticalIncrementSelector =
    "&::-webkit-scrollbar-button:vertical:increment:end, "
    + "& *::-webkit-scrollbar-button:vertical:increment:end";
const HorizontalDecrementSelector =
    "&::-webkit-scrollbar-button:horizontal:decrement:start, "
    + "& *::-webkit-scrollbar-button:horizontal:decrement:start";
const HorizontalIncrementSelector =
    "&::-webkit-scrollbar-button:horizontal:increment:end, "
    + "& *::-webkit-scrollbar-button:horizontal:increment:end";

const IsScrollableOverflow = (Value: string): boolean =>
    Value === "auto" || Value === "scroll" || Value === "overlay";

const IsPointInScrollbar = (
    ElementValue: HTMLElement,
    ClientX: number,
    ClientY: number
): boolean =>
{
    const Bounds = ElementValue.getBoundingClientRect();
    const Style = getComputedStyle(ElementValue);
    const WithinHorizontalBounds = ClientX >= Bounds.left && ClientX <= Bounds.right;
    const WithinVerticalBounds = ClientY >= Bounds.top && ClientY <= Bounds.bottom;
    const HasVerticalScrollbar = IsScrollableOverflow(Style.overflowY)
        && ElementValue.scrollHeight > ElementValue.clientHeight;
    const HasHorizontalScrollbar = IsScrollableOverflow(Style.overflowX)
        && ElementValue.scrollWidth > ElementValue.clientWidth;
    const IsOverVerticalScrollbar = HasVerticalScrollbar
        && WithinVerticalBounds
        && (Style.direction === "rtl"
            ? ClientX >= Bounds.left && ClientX <= Bounds.left + ScrollbarSize
            : ClientX >= Bounds.right - ScrollbarSize && ClientX <= Bounds.right);
    const IsOverHorizontalScrollbar = HasHorizontalScrollbar
        && WithinHorizontalBounds
        && ClientY >= Bounds.bottom - ScrollbarSize
        && ClientY <= Bounds.bottom;

    return IsOverVerticalScrollbar || IsOverHorizontalScrollbar;
};

const FindHoveredScrollbar = (
    Target: EventTarget,
    Root: HTMLElement,
    ClientX: number,
    ClientY: number
): HTMLElement | null =>
{
    let Candidate = Target instanceof HTMLElement ? Target : null;

    while (Candidate !== null && Root.contains(Candidate))
    {
        if (IsPointInScrollbar(Candidate, ClientX, ClientY))
        {
            return Candidate;
        }

        if (Candidate === Root)
        {
            break;
        }

        Candidate = Candidate.parentElement;
    }

    return null;
};

const UseStyles = makeStyles({
    Root:
    {
        "--sorrell-scrollbar-button-display": "none",
        "--sorrell-scrollbar-thumb-border-radius": "0.5px",
        "--sorrell-scrollbar-thumb-inset": "7px",
        "--sorrell-scrollbar-track-end-padding": tokens.spacingVerticalXS,

        [ HoverSelector ]:
        {
            "--sorrell-scrollbar-button-display": "block",
            "--sorrell-scrollbar-thumb-border-radius": "9999px",
            "--sorrell-scrollbar-thumb-inset": "5px",
            "--sorrell-scrollbar-track-end-padding": "0px"
        },

        "&::-webkit-scrollbar, & *::-webkit-scrollbar":
        {
            height: ScrollbarSizeCss,
            width: ScrollbarSizeCss
        },

        "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track":
        {
            backgroundColor: "transparent"
        },

        "&::-webkit-scrollbar-track:vertical, & *::-webkit-scrollbar-track:vertical":
        {
            marginBlock: "var(--sorrell-scrollbar-track-end-padding)"
        },

        "&::-webkit-scrollbar-track:horizontal, & *::-webkit-scrollbar-track:horizontal":
        {
            marginInline: "var(--sorrell-scrollbar-track-end-padding)"
        },

        "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner":
        {
            backgroundColor: "transparent"
        },

        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb":
        {
            backgroundClip: "content-box",
            backgroundColor: tokens.colorNeutralStroke1,
            borderBottomColor: "transparent",
            borderBottomStyle: "solid",
            borderBottomWidth: 0,
            borderLeftColor: "transparent",
            borderLeftStyle: "solid",
            borderLeftWidth: 0,
            borderRadius: "var(--sorrell-scrollbar-thumb-border-radius)",
            borderRightColor: "transparent",
            borderRightStyle: "solid",
            borderRightWidth: 0,
            borderTopColor: "transparent",
            borderTopStyle: "solid",
            borderTopWidth: 0
        },

        "&::-webkit-scrollbar-thumb:vertical, & *::-webkit-scrollbar-thumb:vertical":
        {
            borderLeftWidth: "var(--sorrell-scrollbar-thumb-inset)",
            borderRightWidth: "var(--sorrell-scrollbar-thumb-inset)"
        },

        "&::-webkit-scrollbar-thumb:horizontal, & *::-webkit-scrollbar-thumb:horizontal":
        {
            borderBottomWidth: "var(--sorrell-scrollbar-thumb-inset)",
            borderTopWidth: "var(--sorrell-scrollbar-thumb-inset)"
        },

        "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
        {
            backgroundColor: tokens.colorNeutralStroke1Hover
        },

        "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
        {
            backgroundColor: tokens.colorNeutralStroke1Pressed
        },

        "&::-webkit-scrollbar-button, & *::-webkit-scrollbar-button":
        {
            backgroundColor: "transparent",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: `${ ArrowSizeCss } ${ ArrowSizeCss }`,
            display: "none",
            height: ScrollbarSizeCss,
            width: ScrollbarSizeCss
        },

        "&::-webkit-scrollbar-button:hover, & *::-webkit-scrollbar-button:hover":
        {
            backgroundColor: tokens.colorSubtleBackgroundHover
        },

        "&::-webkit-scrollbar-button:active, & *::-webkit-scrollbar-button:active":
        {
            backgroundColor: tokens.colorSubtleBackgroundPressed
        },

        [ VerticalDecrementSelector ]:
        {
            backgroundImage: UpArrow,
            display: "var(--sorrell-scrollbar-button-display)"
        },

        [ VerticalIncrementSelector ]:
        {
            backgroundImage: DownArrow,
            display: "var(--sorrell-scrollbar-button-display)"
        },

        [ HorizontalDecrementSelector ]:
        {
            backgroundImage: LeftArrow,
            display: "var(--sorrell-scrollbar-button-display)"
        },

        [ HorizontalIncrementSelector ]:
        {
            backgroundImage: RightArrow,
            display: "var(--sorrell-scrollbar-button-display)"
        }
    }
});

/** {@inheritDoc Scrollbars} */
export interface ScrollbarsProps extends React.HTMLAttributes<HTMLDivElement> { }

export/**
       * Provides WinUI 3-like scrollbars to every scrollable descendant.
       *
       * # Details
       *
       * The scrollbar thumb is two pixels wide at rest.  Moving the cursor over the
       * scrollbar expands the thumb and reveals its direction buttons while the track
       * remains transparent.
       *
       * # Gotchas
       *
       * Chromium-based browsers receive the complete appearance.  Browsers without
       * WebKit scrollbar selectors retain their platform scrollbar.
       *
       * @category Component
       * @since 1.0.0
       */
const Scrollbars = React.forwardRef<HTMLDivElement, ScrollbarsProps>(
    (
        {
            children,
            className,
            onMouseLeave,
            onMouseMoveCapture,
            ...Rest
        }: ScrollbarsProps,
        Ref: React.ForwardedRef<HTMLDivElement>
    ): React.JSX.Element =>
    {
        const Styles = UseStyles();
        const HoveredScrollbarRef = React.useRef<HTMLElement | null>(null);

        React.useEffect(() => () =>
        {
            HoveredScrollbarRef.current?.removeAttribute(HoverAttribute);
        }, [ ]);

        const SetHoveredScrollbar = (ElementValue: HTMLElement | null): void =>
        {
            if (HoveredScrollbarRef.current === ElementValue)
            {
                return;
            }

            HoveredScrollbarRef.current?.removeAttribute(HoverAttribute);
            ElementValue?.setAttribute(HoverAttribute, "");
            HoveredScrollbarRef.current = ElementValue;
        };

        return (
            <div
                { ...Rest }
                className={ mergeClasses(Styles.Root, className) }
                onMouseLeave={ (Event: React.MouseEvent<HTMLDivElement>) =>
                {
                    SetHoveredScrollbar(null);
                    onMouseLeave?.(Event);
                } }
                onMouseMoveCapture={ (Event: React.MouseEvent<HTMLDivElement>) =>
                {
                    SetHoveredScrollbar(FindHoveredScrollbar(
                        Event.target,
                        Event.currentTarget,
                        Event.clientX,
                        Event.clientY
                    ));
                    onMouseMoveCapture?.(Event);
                } }
                ref={ Ref }>
                { children }
            </div>
        );
    }
);

Scrollbars.displayName = "Scrollbars";
