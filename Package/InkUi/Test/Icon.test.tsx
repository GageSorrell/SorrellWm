/**
 * One-cell icon tests.
 *
 * @module @sorrell/ink-ui/Test/Icon
 *
 * @file      Icon.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import { Icon } from "../Source/Icon/index.js";
import * as PhosphorIcon from "../Source/PhosphorIcon/index.js";

describe("Icon", () =>
{
    it("fails silently when terminal pixel dimensions are unavailable", () =>
    {
        const Frame = render(<Icon src={
            "<svg width=\"16\" height=\"16\"><circle cx=\"8\" cy=\"8\" r=\"8\"/></svg>"
        } />).lastFrame();

        expect(Frame).toBe("");
    });

    it("passes rendering failures to a fallback", () =>
    {
        const Frame = render(<Icon fallback={ <Ink.Text>Unavailable</Ink.Text> }
            src="not an svg" />).lastFrame();

        expect(Frame).toBe("Unavailable");
    });
});

describe("PhosphorIcon", () =>
{
    const Styles = [
        PhosphorIcon.Bold,
        PhosphorIcon.Duotone,
        PhosphorIcon.Fill,
        PhosphorIcon.Light,
        PhosphorIcon.Regular,
        PhosphorIcon.Thin
    ] as const;

    it("exports every catalog icon from every style", () =>
    {
        for (const Style of Styles)
        {
            expect(Object.keys(Style)).toHaveLength(1512);
            expect(Style.AcornIcon).toBeTypeOf("function");
            expect(Style.YoutubeLogoIcon).toBeTypeOf("function");
        }
    });

    it("adapts Phosphor SVG components without failing", () =>
    {
        for (const Style of Styles)
        {
            const Frame = render(
                <Style.HeartIcon
                    color="#ff0000"
                    fallback={ <Ink.Text>Failed</Ink.Text> } />
            ).lastFrame();

            expect(Frame).toBe("");
        }
    });
});
