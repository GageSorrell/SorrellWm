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

import { Effect } from "effect";
import { useState } from "react";

const effectStatus: string = Effect.runSync(
    Effect.succeed("Effect runtime ready")
);

/**
 * The initial renderer shell for the window manager.
 *
 * @returns {React.JSX.Element} The application status screen.
 */
export function Application(): React.JSX.Element
{
    const [ bridgeStatus, setBridgeStatus ] = useState("Not checked");

    const checkBridge = (): void =>
    {
        void window.sorrell.ping().then(setBridgeStatus);
    };

    return (
        <main className="app-shell">
            <section className="hero">
                <p className="eyebrow">SorrellWm</p>
                <h1>Window manager foundation</h1>
                <p className="summary">
                    Electron, React, TypeScript, and Effect are connected and ready
                    for the Windows integration layer.
                </p>
            </section>

            <section
                aria-label="Runtime status"
                className="status-grid">
                <article className="status-card">
                    <span>Renderer</span>
                    <strong>React ready</strong>
                </article>
                <article className="status-card">
                    <span>Effects</span>
                    <strong>{ effectStatus }</strong>
                </article>
                <article className="status-card">
                    <span>Platform</span>
                    <strong>{ window.sorrell.platform }</strong>
                </article>
                <article className="status-card">
                    <span>Electron</span>
                    <strong>{ window.sorrell.versions.electron }</strong>
                </article>
            </section>

            <button
                className="bridge-check"
                onClick={ checkBridge }
                type="button">
                Check preload bridge: { bridgeStatus }
            </button>
        </main>
    );
}
