/**
 *
 *
 * @module @sorrell/log/Test/Formatting.test
 *
 * @file      Formatting.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { Format as JsonLine } from "../Source/Formatting/JsonLinesFormatter.js";
import { Pretty } from "../Source/Formatting/PrettyFormatter.js";
import { RecordFixture } from "./Fixture.js";

describe("formatters", () =>
{
    it("emits stable ANSI-free output in Never mode", () =>
    {
        const Output = Pretty({
            ColorMode: "Never",
            IncludeFiber: true,
            IncludeSource: true
        }).Format(RecordFixture({
            Annotations: {
                Count: 4,
                Layout: "Grid"
            },
            Fiber: { Identifier: 7 },
            Level: "Error"
        }));

        expect(Output).toContain("21:42:08.153 ERROR Application.Test JavaScript #7 message");
        expect(Output).toContain("Count: 4");
        expect(Output).not.toMatch(/\u001B\[/u);
    });

    it("uses Chalk styling in Always mode and supports custom themes", () =>
    {
        const Styled = Pretty({ ColorMode: "Always" }).Format(RecordFixture());
        expect(Styled).toMatch(/\u001B\[/u);

        const Custom = Pretty({
            ColorMode: "Never",
            Theme: {
                Category: (Text: string): string => `<${ Text }>`
            }
        }).Format(RecordFixture());
        expect(Custom).toContain("<Application.Test>");
    });

    it("serializes valid one-record JSON Lines without ANSI", () =>
    {
        const Line = JsonLine(RecordFixture());
        expect(Line.endsWith("\n")).toBe(true);
        expect(JSON.parse(Line)).toMatchObject({
            SchemaVersion: 1,
            Category: "Application.Test"
        });
        expect(Line).not.toMatch(/\u001B\[/u);
    });
});
