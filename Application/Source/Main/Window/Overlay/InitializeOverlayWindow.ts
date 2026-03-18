/* File:      InitializeOverlayWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Activate, Deactivate, GetLeastInvisiblePosition, InitializeMainWindow } from "./OverlayWindow";
import { type BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import type { FLogger, FVirtualKey } from "../../../Shared";
import { CreateBrowserWindow } from "#/Window/BrowserWindow";
import { type FKeyboardEvent } from "#/Keyboard/Keyboard.Types";
import { FinishFocus } from "#/Tree/Tree";
import { GetDevSettings } from "#/Development/DevSettings";
import { GetLogger } from "#/Development/Log/Log";
import { Keyboard } from "#/Keyboard/Keyboard";
import { OverlayEvents } from "./OverlayEvents";
import { RegisterCommonIpcCallbacks } from "#/Event/CommonEvents";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";
import { RegisterIpcCallbacks } from "#/Event/Event";
import { Vk } from "../../../Shared";

const Log: FLogger = GetLogger("InitializeOverlayWindow");

async function InitializeOverlayWindow(): Promise<void>
{
    const ConstructorOptions: BrowserWindowConstructorOptions =
    {
        alwaysOnTop: true,
        backgroundMaterial: "acrylic",
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences:
        {
            devTools: false
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    };

    const { Window, LoadFrontend } = await CreateBrowserWindow(ConstructorOptions);

    const MainWindow: BrowserWindow = InitializeMainWindow(Window);

    // On("GetCurrentPanel", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const Panel: FPanel | undefined = GetCurrentPanel();
    //     MainWindow?.webContents.send("GetCurrentPanel", Panel);
    // });

    /** @TODO Find better place for this. */
    // On("GetAnnotatedPanels", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const Panels: TArray<FPanel> = GetPanels();
    //     const AnnotatedPanels: TArray<FAnnotatedPanel> = (await Promise.all(Panels.map(AnnotatePanel)))
    //         .filter((Value: FAnnotatedPanel | undefined): boolean =>
    //         {
    //             return Value !== undefined;
    //         }) as TArray<FAnnotatedPanel>;

    //     MainWindow?.webContents.send("GetAnnotatedPanels", AnnotatedPanels);
    // });

    /**
     * @TODO On the Focus screen, the Move buttons should be disabled
     * (greyed out) if there is only one vertex in the current panel.
     */

    /** @TODO Find better place for this. */

    RegisterCommonIpcCallbacks(MainWindow);
    RegisterIpcCallbacks(MainWindow, OverlayEvents);

    /* eslint-disable @stylistic/max-len */
    // On("OnChangeFocus", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    // {
    //     const FocusChange: FFocusChange = Arguments[0] as FFocusChange;
    //     const InterimFocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
    //     if (InterimFocusedVertex)
    //     {
    //         /* eslint-disable-next-line @stylistic/max-len */
    //         // Log(`In OnChangeFocus, InterimFocusedVertex is ${ VertexToString(InterimFocusedVertex) } at ${ PositionToString(InterimFocusedVertex.Size) }.`);
    //     }
    //     ChangeFocus(FocusChange);
    //     Deactivate();
    //     // setTimeout((): void =>
    //     // {
    //     //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
    //     //     if (InterimFocus !== undefined)
    //     //     {
    //     //         BlurBackground(InterimFocus.Size);
    //     //     }
    //     // }, 250);
    //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
    //     if (InterimFocus !== undefined)
    //     {
    //         BlurBackground(InterimFocus.Size);
    //     }

    //     // GetFocusData(_Event, ...Arguments);
    //     Log("FocusChange", FocusChange);
    // });

    // /** @TODO Find better place for this. */
    // On("GetPanelScreenshots", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const Panels: TArray<FPanel> = GetPanels();
    //     const Screenshots: TArray<string> = (await Promise.all(Panels.map(GetPanelScreenshot)))
    //         .filter((Value: string | undefined): boolean =>
    //         {
    //             return Value !== undefined;
    //         }) as TArray<string>;

    //     MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    // });

    // On("BringIntoPanel", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    // {
    //     BringIntoPanel(Arguments[0] as FAnnotatedPanel, GetActiveWindow() as HWindow);
    // });

    // On("TearDown", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     SetActiveWindow(undefined);
    //     Deactivate();
    // });

    // On("GetInsertableWindowData", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const GetInsertableWindowDatum = async (TileableWindow: HWindow): Promise<FInsertableWindowData> =>
    //     {
    //         const Icon: string = await GetPngBase64(WriteTaskbarIconToPng(TileableWindow));

    //         return {
    //             Handle: TileableWindow,
    //             Icon,
    //             Title: GetWindowTitle(TileableWindow)
    //         };
    //     };

    //     const InsertableWindowData: TArray<FInsertableWindowData> =
    //         await Promise.all(GetTileableWindows().map(GetInsertableWindowDatum));

    //     MainWindow?.webContents.send("GetInsertableWindowData", InsertableWindowData);
    // });

    //     const StringifiedArguments: string = Arguments
    //         .map((Argument: unknown): string =>
    //         {
    //             return typeof Argument === "string"
    //                 ? Argument
    //                 : JSON.stringify(Argument);
    //         })
    //         .join();

    //     const Birdie: string = chalk.bgMagenta(" ⚛️ ") + " ";
    //     let OutString: string = Birdie;
    //     for (let Index: number = 0; Index < StringifiedArguments.length; Index++)
    //     {
    //         const Character: string = StringifiedArguments[Index];
    //         if (Character === "\n" && Index !== StringifiedArguments.length - 1)
    //         {
    //             OutString += Birdie + Character;
    //         }
    //         else
    //         {
    //             OutString += Character;
    //         }
    //     }

    //     console.log(OutString);
    // });
    /* eslint-enable @stylistic/max-len */

    LoadFrontend();

    setTimeout((): void =>
    {
        if (GetDevSettings().StaticMode.Enabled)
        {
            Log("DevSettings.StaticMode.Enabled is true: calling Activate()...");
            Activate();
        }
    }, 3000);

    /** @TODO Run this by flag with `npm start`. */
    // CreateTestWindows();
    // CreateNotepadTestWindows(4);

    function OnKey(Event: FKeyboardEvent): void
    {
        const { State, VkCode } = Event;
        if (MainWindow === undefined)
        {
            return;
        }

        /** @TODO Make this a modifiable setting. */
        const ActivationKey: FVirtualKey = Vk["F20"];

        if (VkCode === ActivationKey)
        {
            if (State === "Down")
            {
                Activate();
            }
            else
            {
                FinishFocus();
                if (!GetDevSettings().StaticMode.Enabled)
                {
                    Deactivate();
                }
                // setTimeout(KillOrphans, 750);
            }
        }
        else
        {
            MainWindow.webContents.send("Keyboard", Event);
        }
    }

    Keyboard.Subscribe(OnKey);
};

RegisterInitializationFunction("OverlayWindow", InitializeOverlayWindow);
