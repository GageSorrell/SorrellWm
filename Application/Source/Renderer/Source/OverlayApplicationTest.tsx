/**
 * @module @sorrell/wm/Renderer/OverlayApplicationTest
 *
 * @file      OverlayApplicationTest.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { OverlayCommandDto, OverlayScreenDto } from "../../Shared/OverlayCommand.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { OverlayApplication } from "./OverlayApplication.js";

const Commands: ReadonlyArray<OverlayCommandDto> = [
    Command("Focus", "SelectLeft", "H", 0x48),
    Command("Insert", "SelectUp", "K", 0x4B),
    Command("Move", "SelectDown", "J", 0x4A),
    Command("Resize", "SelectRight", "L", 0x4C)
];
const HomeScreen: OverlayScreenDto = {
    CanGoBack: false,
    Commands,
    Id: "Home"
};
const FocusScreen: OverlayScreenDto = {
    CanGoBack: true,
    Commands: [
        Command("FocusMoveLeft", "SelectLeft", "H", 0x48),
        Command("FocusMoveUp", "SelectUp", "K", 0x4B),
        Command("FocusMoveDown", "SelectDown", "J", 0x4A),
        Command("FocusMoveRight", "SelectRight", "L", 0x4C)
    ],
    Id: "Focus"
};

describe("OverlayApplication", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(HomeScreen);
        vi.mocked(window.sorrell.overlay.invoke).mockResolvedValue();
    });

    it("renders the primary commands in action-key order and invokes them", async() =>
    {
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "Choose Action" }))
            .toHaveAttribute("aria-current", "page");
        expect(screen.getByText("Choose how to manage your windows.")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();

        const CommandsRegion = screen.getByRole("region", { name: "Available commands" });
        const Buttons = within(CommandsRegion).getAllByRole("button");

        expect(Buttons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("Focus"),
            expect.stringContaining("Insert"),
            expect.stringContaining("Move"),
            expect.stringContaining("Resize")
        ]);
        expect(Buttons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("H"),
            expect.stringContaining("K"),
            expect.stringContaining("J"),
            expect.stringContaining("L")
        ]);

        fireEvent.click(Buttons[2] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("Move");
    });

    it("renders the Focus screen's four placeholder commands and can go back", async() =>
    {
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(FocusScreen);
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "Focus" }))
            .toHaveAttribute("aria-current", "page");
        expect(screen.getByText("Choose a direction to move the focus selection."))
            .toBeInTheDocument();
        expect(screen.getByRole("button", { name: /move left/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /move up/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /move down/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /move right/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /move left/i }));
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("FocusMoveLeft");

        const BackButton = screen.getByRole("button", { name: "Back to Choose Action" });
        expect(BackButton).toHaveAttribute("title", "Back");
        expect(BackButton).not.toHaveTextContent("Back");

        fireEvent.click(BackButton);
        expect(window.sorrell.overlay.back).toHaveBeenCalledOnce();

        fireEvent.click(screen.getByRole("button", { name: "Choose Action" }));
        expect(window.sorrell.overlay.back).toHaveBeenCalledTimes(2);
    });
});

/** Construct one renderer-safe command fixture. */
function Command(
    Id: OverlayCommandDto["Id"],
    HotkeyId: OverlayCommandDto["HotkeyId"],
    KeyLabel: string,
    KeyCode: number
): OverlayCommandDto
{
    return {
        HotkeyId,
        Id,
        Shortcut:
        {
            KeyCode,
            KeyLabel,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        }
    };
}
