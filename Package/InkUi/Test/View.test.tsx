/**
 * Shared-frame View component tests.
 *
 * @module @sorrell/ink-ui/Test/View
 *
 * @file      View.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";
import {
    ThemeProvider,
    View,
    ViewPane
} from "../Source/index.js";

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("View", () =>
{
    it("shares one joined border between horizontally adjacent panes", () =>
    {
        expect(Render(
            <View Columns={ [ 3, 3 ] }
                Rows={ [ 1 ] }>
                <ViewPane Column={ 0 }
                    Row={ 0 }>A</ViewPane>
                <ViewPane Column={ 1 }
                    Row={ 0 }>B</ViewPane>
            </View>
        )).toBe([
            "┌───┬───┐",
            "│A  │B  │",
            "└───┴───┘"
        ].join("\n"));
    });

    it("uses a cross where four pane frames intersect", () =>
    {
        expect(Render(
            <View Columns={ [ 1, 1 ] }
                Rows={ [ 1, 1 ] }>
                <ViewPane Column={ 0 }
                    Row={ 0 }>A</ViewPane>
                <ViewPane Column={ 1 }
                    Row={ 0 }>B</ViewPane>
                <ViewPane Column={ 0 }
                    Row={ 1 }>C</ViewPane>
                <ViewPane Column={ 1 }
                    Row={ 1 }>D</ViewPane>
            </View>
        )).toBe([
            "┌─┬─┐",
            "│A│B│",
            "├─┼─┤",
            "│C│D│",
            "└─┴─┘"
        ].join("\n"));
    });

    it("forms a T-junction beside a row-spanning pane", () =>
    {
        expect(Render(
            <View Columns={ [ 3, 3 ] }
                Rows={ [ 1, 1 ] }>
                <ViewPane Column={ 0 }
                    Row={ 0 }
                    RowSpan={ 2 }>A</ViewPane>
                <ViewPane Column={ 1 }
                    Row={ 0 }>B</ViewPane>
                <ViewPane Column={ 1 }
                    Row={ 1 }>C</ViewPane>
            </View>
        )).toBe([
            "┌───┬───┐",
            "│A  │B  │",
            "│   ├───┤",
            "│   │C  │",
            "└───┴───┘"
        ].join("\n"));
    });
});
