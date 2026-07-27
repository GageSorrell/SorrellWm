/**
 * Heading component tests.
 *
 * @module @sorrell/ink-ui/Test/Header
 *
 * @file      Header.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import { describe, expect, it } from "vitest";
import { H2, H3, H4, H5, H6 } from "../Source/Header/index.js";
import type { TextProps } from "../Source/Text/Text.js";

describe("Header", () =>
{
    it.each<readonly [ string, typeof H2 ]>([
        [ "H2", H2 ],
        [ "H3", H3 ],
        [ "H4", H4 ],
        [ "H5", H5 ],
        [ "H6", H6 ]
    ])("%s applies the web heading's bold default", (_Name, Heading) =>
    {
        const Element = Heading({ children: "Heading" }) as React.ReactElement<TextProps>;

        expect(Element.props).toMatchObject({ fontWeight: "bold" });
    });
});
