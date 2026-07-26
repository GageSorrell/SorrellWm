/**
 * SVG component tests.
 *
 * @module @sorrell/ink-ui/Test/Svg
 *
 * @file      Svg.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import { Svg } from "../Source/Svg/index.js";

describe("Svg", () =>
{
    it("fails silently when terminal pixel dimensions are unavailable", () =>
    {
        const Frame = render(
            <Svg>{ "<svg width=\"16\" height=\"16\"><rect width=\"16\" height=\"16\"/></svg>" }</Svg>
        ).lastFrame();

        expect(Frame).toBe("");
    });

    it("renders an element fallback when SVG parsing fails", () =>
    {
        const Frame = render(
            <Svg fallback={ <Ink.Text>Unavailable</Ink.Text> }>{ "not an svg" }</Svg>
        ).lastFrame();

        expect(Frame).toBe("Unavailable");
    });

    it("renders a component fallback when SVG parsing fails", () =>
    {
        const Fallback = ({ error }: { readonly error: Error }): React.ReactElement =>
            <Ink.Text>{ error.message }</Ink.Text>;
        const Frame = render(
            <Svg fallback={ Fallback }>{ "<svg" }</Svg>
        ).lastFrame();

        expect(Frame).not.toBe("");
    });

    it("accepts an SVG React element", () =>
    {
        const Frame = render(
            <Svg>
                <svg height="10"
                    width="20">
                    <rect height="10"
                        width="20" />
                </svg>
            </Svg>
        ).lastFrame();

        expect(Frame).toBe("");
    });
});
