/**
 * @module @sorrell/wm/Test/OverlaySession
 *
 * @file      OverlaySession.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type FocusWindowCandidate,
    SelectDirectionalWindow
} from "../Source/Main/Overlay/Session.ts";
import { describe, expect, it } from "vitest";
import { Box } from "@sorrell/math";
import type { Handle } from "@sorrell/windows";
import { Option } from "effect";
import { OverlayCommandId } from "../Source/Shared/OverlayCommand.js";

const Candidate = (
    Window: bigint,
    Top: number,
    Right: number,
    Bottom: number,
    Left: number
): FocusWindowCandidate => ({
    Bounds: Box.Box(Top, Right, Bottom, Left),
    Window: Window as Handle.HWND
});

describe("OverlaySession.SelectDirectionalWindow", () =>
{
    const Current = Box.Box(100, 200, 200, 100);
    const LeftNear = Candidate(2n, 110, 90, 190, 10);
    const LeftFar = Candidate(3n, 100, -100, 200, -200);
    const Right = Candidate(4n, 100, 400, 200, 300);
    const Up = Candidate(5n, -100, 200, 0, 100);
    const Down = Candidate(6n, 300, 200, 400, 100);
    const Candidates = [ LeftFar, Right, Down, LeftNear, Up ];

    it("selects the nearest center in each requested half-plane", () =>
    {
        expect(SelectDirectionalWindow(
            Current,
            Candidates,
            OverlayCommandId.FocusMoveLeft
        )).toEqual(Option.some(LeftNear));
        expect(SelectDirectionalWindow(
            Current,
            Candidates,
            OverlayCommandId.FocusMoveRight
        )).toEqual(Option.some(Right));
        expect(SelectDirectionalWindow(
            Current,
            Candidates,
            OverlayCommandId.FocusMoveUp
        )).toEqual(Option.some(Up));
        expect(SelectDirectionalWindow(
            Current,
            Candidates,
            OverlayCommandId.FocusMoveDown
        )).toEqual(Option.some(Down));
    });

    it("returns None when no candidate center is in the requested direction", () =>
    {
        expect(Option.isNone(SelectDirectionalWindow(
            Current,
            [ LeftNear, LeftFar ],
            OverlayCommandId.FocusMoveRight
        ))).toBe(true);
    });
});
