/**
 *
 *
 * @module @sorrell/log/Test/React.test
 *
 * @file      React.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// @vitest-environment jsdom

import {
    fireEvent,
    render
} from "@testing-library/react";
import { Effect } from "effect";
import { useEffect, useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Make as MakeRuntime } from "../Source/Effect/LogRuntime.js";
import {
    LogErrorBoundary,
    LogProvider,
    useLogCategory,
    useLogger
} from "../Source/React/index.js";
import { Make as MakeMemorySink } from "../Source/Testing/InMemorySink.js";

describe("React integration", () =>
{
    it("composes providers, annotations, categories, and stable logger identity", async () =>
    {
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });
        const Identities: Array<boolean> = [];

        /**
         *
         */
        function Button(): React.ReactNode
        {
            const Logger = useLogger("Settings");
            const Category = useLogCategory();
            const Previous = useRef(Logger);
            useEffect(() =>
            {
                Identities.push(Previous.current === Logger);
                Previous.current = Logger;
            });

            return (
                <button onClick={ () => Logger.Info("Saving settings", Category) }>
                    Save
                </button>
            );
        }

        const View = render(
            <LogProvider
                Annotations={ { Window: 1 } }
                Category="Renderer"
                Runtime={ Runtime }
            >
                <LogProvider Annotations={ { Panel: "General" } }
                    Category="Preferences">
                    <Button />
                </LogProvider>
            </LogProvider>
        );

        fireEvent.click(View.getByText("Save"));
        View.rerender(
            <LogProvider
                Annotations={ { Window: 1 } }
                Category="Renderer"
                Runtime={ Runtime }
            >
                <LogProvider Annotations={ { Panel: "General" } }
                    Category="Preferences">
                    <Button />
                </LogProvider>
            </LogProvider>
        );
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records[0]).toMatchObject({
            Annotations: {
                Panel: "General",
                Window: 1
            },
            Category: "Renderer.Preferences.Settings",
            Source: "React"
        });
        expect(Identities[0]).toBe(true);
    });

    it("logs one captured error with the React component stack", async () =>
    {
        const ConsoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const Sink = MakeMemorySink();
        const Runtime = MakeRuntime({ Sinks: [ Sink ] });

        /**
         *
         */
        function Crashing(): React.ReactNode
        {
            throw new Error("render failed");
        }

        render(
            <LogProvider Category="Renderer"
                Runtime={ Runtime }>
                <LogErrorBoundary Category="Boundary"
                    Fallback={ <div>Crash</div> }>
                    <Crashing />
                </LogErrorBoundary>
            </LogProvider>
        );
        await Effect.runPromise(Runtime.Flush);

        expect(Sink.Records).toHaveLength(1);
        expect(Sink.Records[0]).toMatchObject({
            Category: "Renderer.Boundary",
            Level: "Error",
            Source: "React"
        });
        expect(JSON.stringify(Sink.Records[0]?.Message)).toContain("ComponentStack");
        ConsoleError.mockRestore();
    });
});
