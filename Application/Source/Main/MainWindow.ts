/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import * as Path from "path";
import { BlurBackground, UnblurBackground } from "@sorrellwm/windows";
import { BrowserWindow, app, ipcMain, screen } from "electron";
import { Keyboard } from "./Keyboard";
import { resolveHtmlPath } from "./util";

let MainWindow: BrowserWindow | undefined = undefined;

const GetLeastInvisiblePosition = (): { x: number; y: number } =>
{
    const Displays: Array<Electron.Display> = screen.getAllDisplays();

    type FMonitorBounds = { left: number; right: number; top: number; bottom: number };
    const MonitorBounds: Array<FMonitorBounds> = Displays.map((display: Electron.Display): FMonitorBounds =>
    {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });

    MonitorBounds.sort((A: FMonitorBounds, B: FMonitorBounds) => A.left - B.left || A.top - B.top);

    const MaxRight: number = Math.max(...MonitorBounds.map((bounds: FMonitorBounds) => bounds.right));
    const MaxBottom: number = Math.max(...MonitorBounds.map((bounds: FMonitorBounds) => bounds.bottom));

    const InvisibleX: number = (MaxRight + 1) * 2;
    const InvisibleY: number = (MaxBottom + 1) * 2;

    return {
        x: InvisibleX,
        y: InvisibleY
    };
};

const LaunchMainWindow = async (): Promise<void> =>
{
    console.log("Launching main window.");
    MainWindow = new BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences:
        {
            devTools: false,
            // devTools: true,
            nodeIntegration: true,
            preload: app.isPackaged
                ? Path.join(__dirname, "Preload.js")
                : Path.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });

    MainWindow.on("show", (_Event: Electron.Event, _IsAlwaysOnTop: boolean): void =>
    {
        MainWindow?.webContents.send("Navigate", "Main");
    });

    MainWindow.on(
        "page-title-updated",
        (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
        {
            Event.preventDefault();
            // MainWindow?.webContents.openDevTools();
        }
    );

    ipcMain.on("Log", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        const StringifiedArguments: string = Arguments
            .map((Argument: unknown): string =>
            {
                return typeof Argument === "string"
                    ? Argument
                    : JSON.stringify(Argument);
            })
            .join();

        const Birdie: string = "🐥 ";
        let OutString: string = Birdie;
        for (let Index: number = 0; Index < StringifiedArguments.length; Index++)
        {
            const Character: string = StringifiedArguments[Index];
            if (Character === "\n" && Index !== StringifiedArguments.length - 1)
            {
                OutString += Birdie + Character;
            }
            else
            {
                OutString += Character;
            }
        }

        console.log(OutString);
    });

    MainWindow.loadURL(resolveHtmlPath("index.html"));
    console.log("Launched MainWindow with Component argument.");
};

function OnActivation(State: string): void
{
    if (State === "Down")
    {
        // const { CoveringWindow, ThemeMode }: FBlurReturnType = MyBlur();
        BlurBackground();
    }
    else
    {
        // MainWindow?.webContents.send("TearDown");
        UnblurBackground();
        // ipcMain.on("TearDown", (): void =>
        // {
        //     TearDown();
        //     setTimeout((): void =>
        //     {
        //         const { x, y } = GetLeastInvisiblePosition();
        //         MainWindow?.setPosition(x, y, false);
        //     }, 100);
        // });
        // MainWindow?.webContents.send("TearDown");

        // MainWindow?.on("closed", (_: Electron.Event): void =>
        // {
        //     LaunchMainWindow();
        // });
        // MainWindow?.close();

        // TestFun();
    }
}

app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);

Keyboard.Subscribe(OnActivation);
