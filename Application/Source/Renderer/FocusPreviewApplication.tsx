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

import { type CSSProperties, useEffect, useState } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { AppGenericRegular } from "@fluentui/react-icons";
import type { FocusPreviewPresentation } from "../Shared/FocusPreview.js";
import { UseDominantColor } from "./UseDominantColor.js";

const UseStyles = makeStyles({
    Fill:
    {
        boxSizing: "border-box",
        inset: 0,
        position: "absolute"
    },
    Icon:
    {
        filter: `drop-shadow(0 2px 8px ${ tokens.colorNeutralShadowAmbient })`,
        height: "clamp(4rem, 24vmin, 10rem)",
        maxHeight: "60%",
        maxWidth: "60%",
        objectFit: "contain",
        position: "relative",
        width: "clamp(4rem, 24vmin, 10rem)"
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

export/** Render one translucent sampled-color Focus target proxy. */
const FocusPreviewApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Presentation, SetPresentation ] = useState<FocusPreviewPresentation | undefined>();
    const Color = UseDominantColor(Presentation?.Icon);

    useEffect(
        () => window.sorrell.focusPreview.onChanged(SetPresentation),
        [ ]
    );

    const FillStyle: CSSProperties = Presentation === undefined
        ? { backgroundColor: "transparent" }
        : Color === undefined
            ? {
                backgroundColor: `rgba(96, 96, 96, ${ Presentation.Opacity / 100 })`,
                border: "1px solid rgb(96, 96, 96)"
            }
            : {
                backgroundColor: `rgba(${ Color.R }, ${ Color.G }, ${ Color.B }, ` +
                `${ Presentation.Opacity / 100 })`,
                border: `1px solid rgb(${ Color.R }, ${ Color.G }, ${ Color.B })`
            };

    return (
        <div
            aria-hidden="true"
            className={ Styles.Root }
            data-testid="focus-preview">
            <div
                className={ Styles.Fill }
                data-testid="focus-preview-fill"
                style={ FillStyle } />
            { Presentation !== undefined && (
                Presentation.Icon === undefined
                    ? <AppGenericRegular className={ Styles.Icon } />
                    : (
                        <img
                            alt=""
                            className={ Styles.Icon }
                            src={ `data:image/png;base64,${ Presentation.Icon }` } />
                    )
            ) }
        </div>
    );
};
