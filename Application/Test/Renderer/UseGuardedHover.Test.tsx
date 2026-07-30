/**
 * @module @sorrell/wm/Test/UseGuardedHover
 *
 * @file      UseGuardedHover.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { UseGuardedHover } from "../../Source/Renderer/UseGuardedHover.ts";

interface ProbeProps
{
    readonly OnHoverChange: (Hovered: boolean) => void;
}

const Probe = ({ OnHoverChange }: ProbeProps): React.JSX.Element =>
{
    const HoverHandlers = UseGuardedHover(OnHoverChange);
    return (
        <div
            { ...HoverHandlers }
            role="button">
            Target
        </div>
    );
};

describe("UseGuardedHover", () =>
{
    it("ignores a mouseenter with no cursor movement", () =>
    {
        const OnHoverChange = vi.fn();
        render(<Probe OnHoverChange={ OnHoverChange } />);

        fireEvent.mouseEnter(screen.getByRole("button"), { movementX: 0, movementY: 0 });

        expect(OnHoverChange).not.toHaveBeenCalled();
    });

    it("activates hover on a mouseenter with real cursor movement", () =>
    {
        const OnHoverChange = vi.fn();
        render(<Probe OnHoverChange={ OnHoverChange } />);

        fireEvent.mouseEnter(screen.getByRole("button"), { movementX: 4, movementY: -2 });

        expect(OnHoverChange).toHaveBeenCalledWith(true);
    });

    it("restores normal hover once the cursor leaves a suppressed element", () =>
    {
        const OnHoverChange = vi.fn();
        render(<Probe OnHoverChange={ OnHoverChange } />);
        const Target = screen.getByRole("button");

        fireEvent.mouseEnter(Target, { movementX: 0, movementY: 0 });
        expect(OnHoverChange).not.toHaveBeenCalled();

        fireEvent.mouseLeave(Target);
        OnHoverChange.mockClear();

        fireEvent.mouseEnter(Target, { movementX: 3, movementY: 0 });
        expect(OnHoverChange).toHaveBeenCalledWith(true);
    });
});
