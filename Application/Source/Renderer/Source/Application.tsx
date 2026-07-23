/**
 *
 *
 * @module @sorrell/wm/Renderer/Application
 *
 * @file      Application.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Button, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { BackdropApplication } from "./BackdropApplication.js";
import { Effect } from "effect";
import { OverlayApplication } from "./OverlayApplication.js";
import { useState } from "react";

const effectStatus: string = Effect.runSync(
    Effect.succeed("Effect runtime ready")
);

const UseStyles = makeStyles({
    AppShell: {
        backgroundColor: "transparent",
        minHeight: "100vh",
        overflow: "hidden",
        ...shorthands.padding("clamp(2rem, 7vw, 6rem)")
    },
    BridgeCheck: {
        marginTop: "1.5rem"
    },
    Eyebrow: {
        color: tokens.colorBrandForeground1,
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.18em",
        ...shorthands.margin(0, 0, "0.75rem"),
        textTransform: "uppercase"
    },
    Heading: {
        fontSize: "clamp(3rem, 8vw, 6.5rem)",
        fontWeight: 650,
        letterSpacing: "-0.065em",
        lineHeight: 0.95,
        maxWidth: "12ch",
        ...shorthands.margin(0)
    },
    Hero: {
        maxWidth: "52rem"
    },
    StatusCard: {
        backgroundColor: tokens.colorNeutralBackground1Hover,
        borderRadius: "0.8rem",
        display: "grid",
        ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
        ...shorthands.gap("0.35rem"),
        ...shorthands.padding("1rem")
    },
    StatusGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))",
        marginTop: "4rem",
        maxWidth: "62rem",
        ...shorthands.gap("0.75rem")
    },
    StatusLabel: {
        color: tokens.colorNeutralForeground3,
        fontSize: "0.75rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase"
    },
    StatusValue: {
        fontSize: "0.95rem",
        fontWeight: 600
    },
    Summary: {
        color: tokens.colorNeutralForeground2,
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        lineHeight: 1.65,
        marginTop: "2rem",
        maxWidth: "42rem"
    }
});

/**
 * The initial renderer shell for the window manager.
 *
 * @returns {React.JSX.Element} The application status screen.
 */
const MainApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ bridgeStatus, setBridgeStatus ] = useState("Not checked");

    const checkBridge = (): void =>
    {
        void window.sorrell.ping().then(setBridgeStatus);
    };

    return (
        <main className={ Styles.AppShell }>
            <section className={ Styles.Hero }>
                <p className={ Styles.Eyebrow }>SorrellWm</p>
                <h1 className={ Styles.Heading }>Window manager foundation</h1>
                <p className={ Styles.Summary }>
                    Electron, React, TypeScript, and Effect are connected and ready
                    for the Windows integration layer.
                </p>
            </section>

            <section
                aria-label="Runtime status"
                className={ Styles.StatusGrid }>
                <article className={ Styles.StatusCard }>
                    <span className={ Styles.StatusLabel }>Renderer</span>
                    <strong className={ Styles.StatusValue }>React ready</strong>
                </article>
                <article className={ Styles.StatusCard }>
                    <span className={ Styles.StatusLabel }>Effects</span>
                    <strong className={ Styles.StatusValue }>{ effectStatus }</strong>
                </article>
                <article className={ Styles.StatusCard }>
                    <span className={ Styles.StatusLabel }>Platform</span>
                    <strong className={ Styles.StatusValue }>{ window.sorrell.platform }</strong>
                </article>
                <article className={ Styles.StatusCard }>
                    <span className={ Styles.StatusLabel }>Electron</span>
                    <strong className={ Styles.StatusValue }>
                        { window.sorrell.versions.electron }
                    </strong>
                </article>
            </section>

            <Button
                appearance="primary"
                className={ Styles.BridgeCheck }
                onClick={ checkBridge }
                type="button">
                Check preload bridge: { bridgeStatus }
            </Button>
        </main>
    );
};

/** Render the surface associated with the current logical browser window. */
export function Application(): React.JSX.Element
{
    switch (new URLSearchParams(window.location.search).get("window"))
    {
        case "Backdrop":
            return <BackdropApplication />;
        case "Overlay":
            return <OverlayApplication />;
        default:
            return <MainApplication />;
    }
}
