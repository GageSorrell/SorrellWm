/**
 * The renderer surface for the transient overlay backdrop.
 *
 * @module @sorrell/wm/Renderer/BackdropApplication
 *
 * @file      BackdropApplication.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useEffect, useState } from "react";
import type { BackdropPresentation } from "../../Shared/Backdrop.js";
import { makeStyles } from "@fluentui/react-components";

const TransparentPresentation: BackdropPresentation = Object.freeze({
    DurationMilliseconds: 0,
    Intensity: 0
});

const UseStyles = makeStyles({
    Backdrop: {
        height: "100vh",
        pointerEvents: "none",
        transitionProperty: "background-color",
        transitionTimingFunction: "ease-out",
        width: "100vw"
    }
});

export/** Render a composited CSS fade over the captured foreground-window bounds. */
const BackdropApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Presentation, SetPresentation ] = useState(TransparentPresentation);

    useEffect(
        () => window.sorrell.backdrop.onShow(SetPresentation),
        [ ]
    );

    return (
        <div
            aria-hidden="true"
            className={ Styles.Backdrop }
            data-testid="backdrop"
            style={ {
                backgroundColor: `rgba(0, 0, 0, ${ Presentation.Intensity / 100 })`,
                transitionDuration: `${ Presentation.DurationMilliseconds }ms`
            } } />
    );
};
