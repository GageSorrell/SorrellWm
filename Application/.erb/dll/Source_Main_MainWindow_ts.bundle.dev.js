"use strict";
exports.id = "Source_Main_MainWindow_ts";
exports.ids = ["Source_Main_MainWindow_ts"];
exports.modules = {

/***/ "./Source/Main/MainWindow.ts":
/*!***********************************!*\
  !*** ./Source/Main/MainWindow.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./Source/Main/util.ts");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4__);
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */


// import {
//     BlurBackground,
//     CaptureWindowScreenshot,
//     CoverWindow,
//     GetFocusedWindow,
//     GetIsLightMode,
//     GetThemeColor,
//     StartBlurOverlay,
//     StartBlurOverlayNew } from "@sorrellwm/windows";



let MainWindow = undefined;
const GetLeastInvisiblePosition = () => {
    const Displays = electron__WEBPACK_IMPORTED_MODULE_1__.screen.getAllDisplays();
    const MonitorBounds = Displays.map((display) => {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });
    MonitorBounds.sort((A, B) => A.left - B.left || A.top - B.top);
    const MaxRight = Math.max(...MonitorBounds.map((bounds) => bounds.right));
    const MaxBottom = Math.max(...MonitorBounds.map((bounds) => bounds.bottom));
    const InvisibleX = (MaxRight + 1) * 2;
    const InvisibleY = (MaxBottom + 1) * 2;
    return {
        x: InvisibleX,
        y: InvisibleY
    };
};
const LaunchMainWindow = async () => {
    console.log("Launching main window.");
    MainWindow = new electron__WEBPACK_IMPORTED_MODULE_1__.BrowserWindow({
        alwaysOnTop: true,
        frame: true,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
            preload: electron__WEBPACK_IMPORTED_MODULE_1__.app.isPackaged
                ? path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "Preload.js")
                : path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });
    MainWindow.on("show", (_Event, _IsAlwaysOnTop) => {
        MainWindow?.webContents.send("Navigate", "Main");
    });
    MainWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
        MainWindow?.webContents.closeDevTools();
    });
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("Log", async (_Event, ...Arguments) => {
        const StringifiedArguments = Arguments
            .map((Argument) => {
            return typeof Argument === "string"
                ? Argument
                : JSON.stringify(Argument);
        })
            .join();
        const Birdie = "🐥 ";
        let OutString = Birdie;
        for (let Index = 0; Index < StringifiedArguments.length; Index++) {
            const Character = StringifiedArguments[Index];
            if (Character === "\n" && Index !== StringifiedArguments.length - 1) {
                OutString += Birdie + Character;
            }
            else {
                OutString += Character;
            }
        }
        console.log(OutString);
    });
    MainWindow.loadURL((0,_util__WEBPACK_IMPORTED_MODULE_3__.resolveHtmlPath)("index.html"));
    console.log("Launched MainWindow with Component argument.");
};
function OnActivation(State) {
    console.log("OnActivaoit");
    if (State === "Down") {
        console.log("Going to call MyBlur...");
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4__.MyBlur)();
        // StartBlurOverlay(GetFocusedWindow());
        // CaptureImage(GetFocusedWindow());
        // StartBlurOverlayNew(GetFocusedWindow(), () => { });
        // // const ScreenshotPath: string = CaptureWindowScreenshot(GetFocusedWindow());
        // // const Screenshot: Buffer = Fs.readFileSync(ScreenshotPath);
        // // const ScreenshotEncoded: string = `data:image/png;base64,${ Screenshot.toString("base64") }`;
        // const ScreenshotEncoded: string = "";
        // // @TODO These calls only need to be made once.  Move to an init function.
        // ipcMain.on("GetThemeColor", async (_Event: Electron.Event, _Argument: unknown) =>
        // {
        //     MainWindow?.webContents.send("GetThemeColor", GetThemeColor());
        // });
        // ipcMain.on("GetIsLightMode", async (_Event: Electron.Event, _Argument:  unknown) =>
        // {
        //     const IsLightMode: boolean = GetIsLightMode();
        //     MainWindow?.webContents.send("GetIsLightMode", IsLightMode);
        // });
        // MainWindow?.webContents.send("BackgroundImage", ScreenshotEncoded);
        // // CoverWindow(GetFocusedWindow());
    }
    else {
        // MainWindow?.on("closed", (_: Electron.Event): void =>
        // {
        //     LaunchMainWindow();
        // });
        // MainWindow?.close();
        // TestFun();
    }
}
electron__WEBPACK_IMPORTED_MODULE_1__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_2__.Keyboard.Subscribe(OnActivation);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsWUFBWSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NYWluV2luZG93LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgIE1haW5XaW5kb3cudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgRnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCcm93c2VyV2luZG93LCBhcHAsIGlwY01haW4sIHNjcmVlbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuLy8gaW1wb3J0IHtcbi8vICAgICBCbHVyQmFja2dyb3VuZCxcbi8vICAgICBDYXB0dXJlV2luZG93U2NyZWVuc2hvdCxcbi8vICAgICBDb3ZlcldpbmRvdyxcbi8vICAgICBHZXRGb2N1c2VkV2luZG93LFxuLy8gICAgIEdldElzTGlnaHRNb2RlLFxuLy8gICAgIEdldFRoZW1lQ29sb3IsXG4vLyAgICAgU3RhcnRCbHVyT3ZlcmxheSxcbi8vICAgICBTdGFydEJsdXJPdmVybGF5TmV3IH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi9LZXlib2FyZFwiO1xuaW1wb3J0IHsgcmVzb2x2ZUh0bWxQYXRoIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHsgTXlCbHVyIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5sZXQgTWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuY29uc3QgR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbiA9ICgpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPT5cbntcbiAgICBjb25zdCBEaXNwbGF5czogQXJyYXk8RWxlY3Ryb24uRGlzcGxheT4gPSBzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcblxuICAgIHR5cGUgRk1vbml0b3JCb3VuZHMgPSB7IGxlZnQ6IG51bWJlcjsgcmlnaHQ6IG51bWJlcjsgdG9wOiBudW1iZXI7IGJvdHRvbTogbnVtYmVyIH07XG4gICAgY29uc3QgTW9uaXRvckJvdW5kczogQXJyYXk8Rk1vbml0b3JCb3VuZHM+ID0gRGlzcGxheXMubWFwKChkaXNwbGF5OiBFbGVjdHJvbi5EaXNwbGF5KTogRk1vbml0b3JCb3VuZHMgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBib3R0b206IGRpc3BsYXkuYm91bmRzLnkgKyBkaXNwbGF5LmJvdW5kcy5oZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LmJvdW5kcy54LFxuICAgICAgICAgICAgcmlnaHQ6IGRpc3BsYXkuYm91bmRzLnggKyBkaXNwbGF5LmJvdW5kcy53aWR0aCxcbiAgICAgICAgICAgIHRvcDogZGlzcGxheS5ib3VuZHMueVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgTW9uaXRvckJvdW5kcy5zb3J0KChBOiBGTW9uaXRvckJvdW5kcywgQjogRk1vbml0b3JCb3VuZHMpID0+IEEubGVmdCAtIEIubGVmdCB8fCBBLnRvcCAtIEIudG9wKTtcblxuICAgIGNvbnN0IE1heFJpZ2h0OiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLnJpZ2h0KSk7XG4gICAgY29uc3QgTWF4Qm90dG9tOiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLmJvdHRvbSkpO1xuXG4gICAgY29uc3QgSW52aXNpYmxlWDogbnVtYmVyID0gKE1heFJpZ2h0ICsgMSkgKiAyO1xuICAgIGNvbnN0IEludmlzaWJsZVk6IG51bWJlciA9IChNYXhCb3R0b20gKyAxKSAqIDI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBJbnZpc2libGVYLFxuICAgICAgICB5OiBJbnZpc2libGVZXG4gICAgfTtcbn07XG5cbmNvbnN0IExhdW5jaE1haW5XaW5kb3cgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGNvbnNvbGUubG9nKFwiTGF1bmNoaW5nIG1haW4gd2luZG93LlwiKTtcbiAgICBNYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcbiAgICAgICAgZnJhbWU6IHRydWUsXG4gICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICBza2lwVGFza2JhcjogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIsXG4gICAgICAgIHRpdGxlQmFyU3R5bGU6IFwiaGlkZGVuXCIsXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICB3ZWJQcmVmZXJlbmNlczpcbiAgICAgICAge1xuICAgICAgICAgICAgZGV2VG9vbHM6IGZhbHNlLFxuICAgICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgcHJlbG9hZDogYXBwLmlzUGFja2FnZWRcbiAgICAgICAgICAgICAgICA/IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiUHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgICAgIDogUGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi8uZXJiL2RsbC9wcmVsb2FkLmpzXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgIC4uLkdldExlYXN0SW52aXNpYmxlUG9zaXRpb24oKVxuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcInNob3dcIiwgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Jc0Fsd2F5c09uVG9wOiBib29sZWFuKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIk5hdmlnYXRlXCIsIFwiTWFpblwiKTtcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cub24oXG4gICAgICAgIFwicGFnZS10aXRsZS11cGRhdGVkXCIsXG4gICAgICAgIChFdmVudDogRWxlY3Ryb24uRXZlbnQsIF9UaXRsZTogc3RyaW5nLCBfRXhwbGljaXRTZXQ6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgaXBjTWFpbi5vbihcIkxvZ1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IFN0cmluZ2lmaWVkQXJndW1lbnRzOiBzdHJpbmcgPSBBcmd1bWVudHNcbiAgICAgICAgICAgIC5tYXAoKEFyZ3VtZW50OiB1bmtub3duKTogc3RyaW5nID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBBcmd1bWVudCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICA/IEFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIDogSlNPTi5zdHJpbmdpZnkoQXJndW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCk7XG5cbiAgICAgICAgY29uc3QgQmlyZGllOiBzdHJpbmcgPSBcIvCfkKUgXCI7XG4gICAgICAgIGxldCBPdXRTdHJpbmc6IHN0cmluZyA9IEJpcmRpZTtcbiAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IDA7IEluZGV4IDwgU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoOyBJbmRleCsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBDaGFyYWN0ZXI6IHN0cmluZyA9IFN0cmluZ2lmaWVkQXJndW1lbnRzW0luZGV4XTtcbiAgICAgICAgICAgIGlmIChDaGFyYWN0ZXIgPT09IFwiXFxuXCIgJiYgSW5kZXggIT09IFN0cmluZ2lmaWVkQXJndW1lbnRzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0U3RyaW5nICs9IEJpcmRpZSArIENoYXJhY3RlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQ2hhcmFjdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coT3V0U3RyaW5nKTtcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cubG9hZFVSTChyZXNvbHZlSHRtbFBhdGgoXCJpbmRleC5odG1sXCIpKTtcbiAgICBjb25zb2xlLmxvZyhcIkxhdW5jaGVkIE1haW5XaW5kb3cgd2l0aCBDb21wb25lbnQgYXJndW1lbnQuXCIpO1xufTtcblxuZnVuY3Rpb24gT25BY3RpdmF0aW9uKFN0YXRlOiBzdHJpbmcpOiB2b2lkXG57XG4gICAgY29uc29sZS5sb2coXCJPbkFjdGl2YW9pdFwiKTtcbiAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb2luZyB0byBjYWxsIE15Qmx1ci4uLlwiKTtcbiAgICAgICAgTXlCbHVyKCk7XG4gICAgICAgIC8vIFN0YXJ0Qmx1ck92ZXJsYXkoR2V0Rm9jdXNlZFdpbmRvdygpKTtcblxuICAgICAgICAvLyBDYXB0dXJlSW1hZ2UoR2V0Rm9jdXNlZFdpbmRvdygpKTtcblxuICAgICAgICAvLyBTdGFydEJsdXJPdmVybGF5TmV3KEdldEZvY3VzZWRXaW5kb3coKSwgKCkgPT4geyB9KTtcbiAgICAgICAgLy8gLy8gY29uc3QgU2NyZWVuc2hvdFBhdGg6IHN0cmluZyA9IENhcHR1cmVXaW5kb3dTY3JlZW5zaG90KEdldEZvY3VzZWRXaW5kb3coKSk7XG4gICAgICAgIC8vIC8vIGNvbnN0IFNjcmVlbnNob3Q6IEJ1ZmZlciA9IEZzLnJlYWRGaWxlU3luYyhTY3JlZW5zaG90UGF0aCk7XG4gICAgICAgIC8vIC8vIGNvbnN0IFNjcmVlbnNob3RFbmNvZGVkOiBzdHJpbmcgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7IFNjcmVlbnNob3QudG9TdHJpbmcoXCJiYXNlNjRcIikgfWA7XG4gICAgICAgIC8vIGNvbnN0IFNjcmVlbnNob3RFbmNvZGVkOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vIC8vIEBUT0RPIFRoZXNlIGNhbGxzIG9ubHkgbmVlZCB0byBiZSBtYWRlIG9uY2UuICBNb3ZlIHRvIGFuIGluaXQgZnVuY3Rpb24uXG5cbiAgICAgICAgLy8gaXBjTWFpbi5vbihcIkdldFRoZW1lQ29sb3JcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Bcmd1bWVudDogdW5rbm93bikgPT5cbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldFRoZW1lQ29sb3JcIiwgR2V0VGhlbWVDb2xvcigpKTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy8gaXBjTWFpbi5vbihcIkdldElzTGlnaHRNb2RlXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfQXJndW1lbnQ6ICB1bmtub3duKSA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBjb25zdCBJc0xpZ2h0TW9kZTogYm9vbGVhbiA9IEdldElzTGlnaHRNb2RlKCk7XG4gICAgICAgIC8vICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0SXNMaWdodE1vZGVcIiwgSXNMaWdodE1vZGUpO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICAvLyBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiQmFja2dyb3VuZEltYWdlXCIsIFNjcmVlbnNob3RFbmNvZGVkKTtcbiAgICAgICAgLy8gLy8gQ292ZXJXaW5kb3coR2V0Rm9jdXNlZFdpbmRvdygpKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgLy8gTWFpbldpbmRvdz8ub24oXCJjbG9zZWRcIiwgKF86IEVsZWN0cm9uLkV2ZW50KTogdm9pZCA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBMYXVuY2hNYWluV2luZG93KCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBNYWluV2luZG93Py5jbG9zZSgpO1xuXG4gICAgICAgIC8vIFRlc3RGdW4oKTtcbiAgICB9XG59XG5cbmFwcC53aGVuUmVhZHkoKVxuICAgIC50aGVuKExhdW5jaE1haW5XaW5kb3cpXG4gICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuS2V5Ym9hcmQuU3Vic2NyaWJlKE9uQWN0aXZhdGlvbik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=