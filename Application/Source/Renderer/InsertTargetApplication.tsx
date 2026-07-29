/**
 * The temporary acrylic target used to complete a tiled Insert operation.
 *
 * @module @sorrell/wm/Renderer/InsertTargetApplication
 *
 * @file      InsertTargetApplication.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import "./InsertTargetApplication.css";
import * as Logging from "./Logging.js";
import {
    Button,
    Checkbox,
    type CheckboxOnChangeData,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import type { InsertTargetPresentation } from "../Shared/InsertTarget.js";

const InitialPresentation: InsertTargetPresentation = Object.freeze({
    CaptureNextWindow: false,
    DragActive: false
});

const UseStyles = makeStyles({
    Actions:
    {
        display: "flex",
        flexWrap: "wrap",
        gap: tokens.spacingHorizontalM,
        justifyContent: "center"
    },
    Content:
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL,
        maxWidth: "32rem",
        padding: tokens.spacingHorizontalXXL,
        position: "relative",
        textAlign: "center",
        zIndex: 1
    },
    Message:
    {
        fontSize: tokens.fontSizeBase400,
        lineHeight: tokens.lineHeightBase400,
        margin: 0
    },
    Outline:
    {
        border: `8px dashed ${ tokens.colorBrandForeground1 }`,
        borderRadius: tokens.borderRadiusLarge,
        inset: tokens.spacingHorizontalM,
        pointerEvents: "none",
        position: "absolute"
    },
    Shell:
    {
        alignItems: "center",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100vw"
    }
});

export/**
       * Renders the drag, next-window, and cancellation controls for a
       * temporary tiled Insert target.
       *
       * @category components
       * @since 0.1.0
       */
const InsertTargetApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Presentation, SetPresentation ] = useState(InitialPresentation);

    useEffect(() =>
    {
        let Mounted = true;
        const StopChanges = window.sorrell.insertTarget.onChanged(SetPresentation);
        const OnKeyDown = (Event: KeyboardEvent): void =>
        {
            if (Event.key === "Escape")
            {
                Event.preventDefault();
                void window.sorrell.insertTarget.cancel().catch(
                    Logging.ReportRejection(
                        "InsertTarget",
                        "Could not cancel the tiled Insert target."
                    )
                );
            }
        };

        window.addEventListener("keydown", OnKeyDown);
        void window.sorrell.insertTarget.get().then((
            Value: InsertTargetPresentation
        ): void =>
        {
            if (Mounted)
            {
                SetPresentation(Value);
            }
        }).catch(Logging.ReportRejection(
            "InsertTarget",
            "Could not retrieve the tiled Insert target."
        ));

        return (): void =>
        {
            Mounted = false;
            StopChanges();
            window.removeEventListener("keydown", OnKeyDown);
        };
    }, [ ]);

    const SetCaptureNext = (
        _Event: React.ChangeEvent<HTMLInputElement>,
        Data: CheckboxOnChangeData
    ): void =>
    {
        const Enabled = Data.checked === true;
        SetPresentation((Current: InsertTargetPresentation) => ({
            ...Current,
            CaptureNextWindow: Enabled
        }));
        void window.sorrell.insertTarget.setCaptureNext(Enabled).catch(
            Logging.ReportRejection(
                "InsertTarget",
                "Could not change next-window capture."
            )
        );
    };

    return (
        <main className={ Styles.Shell }>
            { Presentation.DragActive && (
                <div
                    aria-hidden="true"
                    className={
                        `${ Styles.Outline } sorrell-insert-target-drop-outline`
                    } />
            ) }

            <section className={ Styles.Content }>
                <p className={ Styles.Message }>
                    Drag a floating window over this target and release the
                    cursor inside its bounds to tile the window here.
                </p>

                { !Presentation.DragActive && (
                    <>
                        <Checkbox
                            checked={ Presentation.CaptureNextWindow }
                            label="Tile the next eligible window created"
                            onChange={ SetCaptureNext } />

                        <div className={ Styles.Actions }>
                            <Button
                                appearance="primary"
                                onClick={ () =>
                                {
                                    void window.sorrell.insertTarget.chooseWindow()
                                        .catch(Logging.ReportRejection(
                                            "InsertTarget",
                                            "Could not return to the window list."
                                        ));
                                } }>
                                Choose from floating windows
                            </Button>
                            <Button
                                appearance="secondary"
                                onClick={ () =>
                                {
                                    void window.sorrell.insertTarget.cancel()
                                        .catch(Logging.ReportRejection(
                                            "InsertTarget",
                                            "Could not cancel the tiled Insert target."
                                        ));
                                } }>
                                Cancel
                            </Button>
                        </div>
                    </>
                ) }
            </section>
        </main>
    );
};
