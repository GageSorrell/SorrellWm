/**
 * Ink log-client component tests.
 *
 * @module @sorrell/log-client/Test/Components.test
 *
 * @file      Components.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import {
    LogLine,
    LogViewer
} from "../Source/Components.js";
import { Record } from "./Fixture.js";

describe("Ink log client components", () =>
{
    it("renders structured records as readable stream text", () =>
    {
        const View = render(
            <LogLine Message={ {
                Record,
                Type: "Log"
            } } />
        );

        expect(View.lastFrame()).toContain("INFO");
        expect(View.lastFrame()).toContain("streamed message");
        View.unmount();
    });

    it("renders connection state and log records in the scrollable viewer", () =>
    {
        const View = render(
            <LogViewer
                Height={ 4 }
                Messages={ [
                    {
                        Application: { Name: "Test application" },
                        ProtocolVersion: 1,
                        Type: "Hello"
                    },
                    {
                        Record,
                        Type: "Log"
                    }
                ] } />
        );

        expect(View.lastFrame()).toContain("Connected to Test application");
        expect(View.lastFrame()).toContain("streamed message");
        View.unmount();
    });
});
