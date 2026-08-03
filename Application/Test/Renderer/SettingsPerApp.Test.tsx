/**
 * @module @sorrell/wm/Renderer/SettingsPerAppTest
 *
 * @file      SettingsPerApp.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    PerAppSettingPatch,
    PerAppSettingsApplicationDto,
    PerAppSettingsEntryDto
} from "../../Source/Shared/AppSettings.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SettingsPerApp } from "../../Source/Renderer/SettingsPerApp.tsx";

const ExecutablePath = String.raw`C:\Program Files\Example\Example.exe`;
const Entry: PerAppSettingsEntryDto = {
    ExecutablePath,
    FriendlyName: "Example Application",
    Icon: "application-icon",
    IgnoreModal: true,
    NewWindowBehavior: "FloatCenter"
};

describe("SettingsPerApp", () =>
{
    beforeEach(() =>
    {
        vi.mocked(window.sorrell.perAppSettings.get).mockResolvedValue([ ]);
        vi.mocked(window.sorrell.perAppSettings.getRecent).mockResolvedValue([ ]);
        vi.mocked(window.sorrell.perAppSettings.add).mockResolvedValue(null);
        vi.mocked(window.sorrell.perAppSettings.set).mockImplementation(async (
            Path: string,
            Patch: PerAppSettingPatch
        ) => ({
            ...Entry,
            ...Patch,
            ExecutablePath: Path
        }));
    });

    it("adds a selected executable and renders its collapsed application entry", async () =>
    {
        vi.mocked(window.sorrell.perAppSettings.add).mockResolvedValue(Entry);
        render(<SettingsPerApp />);

        const AddButton = screen.getByRole("button", { name: "Add Application" });
        fireEvent.click(AddButton);

        expect(window.sorrell.perAppSettings.add).toHaveBeenCalledOnce();
        expect(await screen.findByText("Example Application")).toBeInTheDocument();
        expect(screen.getByText(ExecutablePath)).toBeInTheDocument();
        expect(document.querySelector("img")).toHaveAttribute(
            "src",
            "data:image/png;base64,application-icon"
        );
        expect(screen.queryByText("New Window Behavior")).not.toBeInTheDocument();
    });

    it("offers at most five recent unconfigured applications and adds one directly", async () =>
    {
        const RecentApplications: ReadonlyArray<PerAppSettingsApplicationDto> =
            Array.from({ length: 6 }, (_Value: unknown, Index: number) => ({
                ExecutablePath: String.raw`C:\Applications\Application${ Index }.exe`,
                FriendlyName: `Recent Application ${ Index }`,
                Icon: `recent-icon-${ Index }`
            }));
        vi.mocked(window.sorrell.perAppSettings.getRecent)
            .mockResolvedValue(RecentApplications);
        vi.mocked(window.sorrell.perAppSettings.add).mockResolvedValue({
            ...Entry,
            ExecutablePath: RecentApplications[0]!.ExecutablePath
        });
        render(<SettingsPerApp />);

        expect(await screen.findByText("Recently opened applications"))
            .toBeVisible();
        expect(screen.getAllByRole("button", { name: /Add Recent Application/ }))
            .toHaveLength(5);
        expect(screen.queryByText("Recent Application 5")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {
            name: "Add Recent Application 0"
        }));

        expect(window.sorrell.perAppSettings.add).toHaveBeenCalledWith(
            RecentApplications[0]?.ExecutablePath
        );
        expect(await screen.findByText("Example Application")).toBeVisible();
        expect(screen.queryByText("Recent Application 0")).not.toBeInTheDocument();
    });

    it("warns when an overlay-targeted application has no per-app settings", async () =>
    {
        const View = render(<SettingsPerApp />);
        await screen.findByRole("button", { name: "Add Application" });
        View.rerender(
            <SettingsPerApp
                TargetApplicationName="Example Application"
                TargetExecutablePath={ ExecutablePath } />
        );

        expect(await screen.findByText("Per-app settings have not been created"))
            .toBeVisible();
        expect(screen.getByText(
            "Example Application is using the default window behavior."
        )).toBeVisible();
    });

    it("does not warn when the overlay-targeted application is already configured", async () =>
    {
        vi.mocked(window.sorrell.perAppSettings.get).mockResolvedValue([ Entry ]);
        vi.mocked(window.sorrell.perAppSettings.getRecent).mockResolvedValue([ Entry ]);
        render(
            <SettingsPerApp
                TargetApplicationName="Example Application"
                TargetExecutablePath={ ExecutablePath } />
        );

        expect(await screen.findByText(ExecutablePath)).toBeVisible();
        expect(screen.queryByText("Per-app settings have not been created"))
            .not.toBeInTheDocument();
        expect(screen.queryByText("Recently opened applications"))
            .not.toBeInTheDocument();
    });

    it("shows and persists both settings when an application is expanded", async () =>
    {
        vi.mocked(window.sorrell.perAppSettings.get).mockResolvedValue([ Entry ]);
        render(<SettingsPerApp />);

        fireEvent.click(await screen.findByRole("button", {
            name: /Example Application/
        }));

        expect(screen.getByText("New Window Behavior")).toBeInTheDocument();
        const IgnoreModal = screen.getByRole("switch", {
            name: "Ignore modal windows for Example Application"
        });
        expect(IgnoreModal).toBeChecked();

        fireEvent.click(IgnoreModal);

        expect(window.sorrell.perAppSettings.set).toHaveBeenCalledWith(
            ExecutablePath,
            { IgnoreModal: false }
        );

        fireEvent.click(screen.getByRole("combobox", {
            name: "New window behavior for Example Application"
        }));
        fireEvent.click(await screen.findByRole("option", {
            name: "Insert Before Current"
        }));

        expect(window.sorrell.perAppSettings.set).toHaveBeenCalledWith(
            ExecutablePath,
            { NewWindowBehavior: "InsertBeforeCurrent" }
        );
    });
});
