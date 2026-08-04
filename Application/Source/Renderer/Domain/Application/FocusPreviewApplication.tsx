/**
 * A click-through proxy shown over a fully obscured floating Focus target.
 *
 * @module @sorrell/wm/Renderer/FocusPreviewApplication
 *
 * @file      FocusPreviewApplication.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type CSSProperties, useEffect, useId, useState } from "react";
import type {
    FocusPreviewExcludedRegion,
    FocusPreviewPresentation
} from "../../../Shared/FocusPreview.js";
import { makeStyles, tokens } from "@fluentui/react-components";
import { AppGenericRegular } from "@fluentui/react-icons";
import { UseDominantColor } from "../../Hook/index.js";

const UseStyles = makeStyles({
    Fill:
    {
        height: "100%",
        inset: 0,
        position: "absolute",
        width: "100%"
    },
    Icon:
    {
        filter: `drop-shadow(0 2px 8px ${ tokens.colorNeutralShadowAmbient })`,
        height: "var(--focus-preview-icon-size)",
        maxHeight: "15%",
        maxWidth: "15%",
        objectFit: "contain",
        position: "relative",
        width: "var(--focus-preview-icon-size)"
    },
    Root:
    {
        alignItems: "center",
        backgroundColor: "transparent",
        boxSizing: "border-box",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
        position: "relative",
        width: "100vw"
    }
});

const IconStyle = {
    "--focus-preview-icon-size": "clamp(1rem, 6vmin, 2.5rem)"
} as CSSProperties;

export/** Render one translucent sampled-color Focus target proxy. */
const FocusPreviewApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const MaskId = useId();
    const [ Presentation, SetPresentation ] = useState<FocusPreviewPresentation | undefined>();
    const [ Size, SetSize ] = useState(() => ({
        Height: window.innerHeight,
        Width: window.innerWidth
    }));
    const Color = UseDominantColor(Presentation?.Icon);

    useEffect(
        () => window.sorrell.focusPreview.onChanged(SetPresentation),
        [ ]
    );

    useEffect(() =>
    {
        const UpdateSize = (): void => SetSize({
            Height: window.innerHeight,
            Width: window.innerWidth
        });

        window.addEventListener("resize", UpdateSize);
        return () => window.removeEventListener("resize", UpdateSize);
    }, [ ]);

    const FillColor = Presentation?.Color ?? (Color === undefined
        ? "rgb(96, 96, 96)"
        : `rgb(${ Color.R }, ${ Color.G }, ${ Color.B })`);

    return (
        <div
            aria-hidden="true"
            className={ Styles.Root }
            data-testid="focus-preview">
            <svg
                aria-hidden="true"
                className={ Styles.Fill }
                data-testid="focus-preview-fill"
                preserveAspectRatio="none"
                viewBox={ `0 0 ${ Size.Width } ${ Size.Height }` }>
                <defs>
                    <mask
                        height={ Size.Height }
                        id={ MaskId }
                        maskUnits="userSpaceOnUse"
                        width={ Size.Width }
                        x="0"
                        y="0">
                        <rect
                            fill="white"
                            height={ Size.Height }
                            width={ Size.Width } />
                        { Presentation?.ExcludedRegions.map((
                            Region: FocusPreviewExcludedRegion,
                            Index: number
                        ) => (
                            <rect
                                fill="black"
                                height={ Region.Bottom - Region.Top }
                                key={ Index }
                                width={ Region.Right - Region.Left }
                                x={ Region.Left }
                                y={ Region.Top } />
                        )) }
                    </mask>
                </defs>
                { Presentation !== undefined && (
                    <rect
                        fill={ FillColor }
                        fillOpacity={ Presentation.Opacity / 100 }
                        height={ Math.max(0, Size.Height - 1) }
                        mask={ `url(#${ MaskId })` }
                        shapeRendering="crispEdges"
                        stroke={ FillColor }
                        strokeWidth="1"
                        width={ Math.max(0, Size.Width - 1) }
                        x="0.5"
                        y="0.5" />
                ) }
            </svg>
            { Presentation !== undefined && Presentation.ShowIcon !== false && (
                Presentation.Icon === undefined
                    ? (
                        <AppGenericRegular
                            className={ Styles.Icon }
                            style={ IconStyle } />
                    )
                    : (
                        <img
                            alt=""
                            className={ Styles.Icon }
                            src={ `data:image/png;base64,${ Presentation.Icon }` }
                            style={ IconStyle } />
                    )
            ) }
        </div>
    );
};
