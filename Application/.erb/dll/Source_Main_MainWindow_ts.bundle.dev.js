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
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            devTools: false,
            // devTools: true,
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
        // MainWindow?.webContents.openDevTools();
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
    if (State === "Down") {
        console.log("Going to call MyBlur...");
        const { CoveringWindow, ThemeMode } = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4__.MyBlur)();
        MainWindow?.webContents.send("Summoned");
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
    }
    else {
        // MainWindow?.webContents.send("TearDown");
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4__.TearDown)();
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
electron__WEBPACK_IMPORTED_MODULE_1__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_2__.Keyboard.Subscribe(OnActivation);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QjtRQUMxQixNQUFNO1FBQ04sdUJBQXVCO1FBRXZCLGFBQWE7SUFDakIsQ0FBQztBQUNMLENBQUM7QUFFRCx5Q0FBRyxDQUFDLFNBQVMsRUFBRTtLQUNWLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztLQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXhCLCtDQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbldpbmRvdy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBGaWxlOiAgICBNYWluV2luZG93LnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCAqIGFzIEZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgQnJvd3NlcldpbmRvdywgYXBwLCBpcGNNYWluLCBzY3JlZW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbi8vIGltcG9ydCB7XG4vLyAgICAgQmx1ckJhY2tncm91bmQsXG4vLyAgICAgQ2FwdHVyZVdpbmRvd1NjcmVlbnNob3QsXG4vLyAgICAgQ292ZXJXaW5kb3csXG4vLyAgICAgR2V0Rm9jdXNlZFdpbmRvdyxcbi8vICAgICBHZXRJc0xpZ2h0TW9kZSxcbi8vICAgICBHZXRUaGVtZUNvbG9yLFxuLy8gICAgIFN0YXJ0Qmx1ck92ZXJsYXksXG4vLyAgICAgU3RhcnRCbHVyT3ZlcmxheU5ldyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcIi4vS2V5Ym9hcmRcIjtcbmltcG9ydCB7IHJlc29sdmVIdG1sUGF0aCB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IE15Qmx1ciwgVGVhckRvd24sIHR5cGUgRkJsdXJSZXR1cm5UeXBlLCB0eXBlIEZUaGVtZU1vZGUgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmxldCBNYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5jb25zdCBHZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uID0gKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9Plxue1xuICAgIGNvbnN0IERpc3BsYXlzOiBBcnJheTxFbGVjdHJvbi5EaXNwbGF5PiA9IHNjcmVlbi5nZXRBbGxEaXNwbGF5cygpO1xuXG4gICAgdHlwZSBGTW9uaXRvckJvdW5kcyA9IHsgbGVmdDogbnVtYmVyOyByaWdodDogbnVtYmVyOyB0b3A6IG51bWJlcjsgYm90dG9tOiBudW1iZXIgfTtcbiAgICBjb25zdCBNb25pdG9yQm91bmRzOiBBcnJheTxGTW9uaXRvckJvdW5kcz4gPSBEaXNwbGF5cy5tYXAoKGRpc3BsYXk6IEVsZWN0cm9uLkRpc3BsYXkpOiBGTW9uaXRvckJvdW5kcyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvdHRvbTogZGlzcGxheS5ib3VuZHMueSArIGRpc3BsYXkuYm91bmRzLmhlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkuYm91bmRzLngsXG4gICAgICAgICAgICByaWdodDogZGlzcGxheS5ib3VuZHMueCArIGRpc3BsYXkuYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgdG9wOiBkaXNwbGF5LmJvdW5kcy55XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBNb25pdG9yQm91bmRzLnNvcnQoKEE6IEZNb25pdG9yQm91bmRzLCBCOiBGTW9uaXRvckJvdW5kcykgPT4gQS5sZWZ0IC0gQi5sZWZ0IHx8IEEudG9wIC0gQi50b3ApO1xuXG4gICAgY29uc3QgTWF4UmlnaHQ6IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMucmlnaHQpKTtcbiAgICBjb25zdCBNYXhCb3R0b206IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMuYm90dG9tKSk7XG5cbiAgICBjb25zdCBJbnZpc2libGVYOiBudW1iZXIgPSAoTWF4UmlnaHQgKyAxKSAqIDI7XG4gICAgY29uc3QgSW52aXNpYmxlWTogbnVtYmVyID0gKE1heEJvdHRvbSArIDEpICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IEludmlzaWJsZVgsXG4gICAgICAgIHk6IEludmlzaWJsZVlcbiAgICB9O1xufTtcblxuY29uc3QgTGF1bmNoTWFpbldpbmRvdyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgY29uc29sZS5sb2coXCJMYXVuY2hpbmcgbWFpbiB3aW5kb3cuXCIpO1xuICAgIE1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIGFsd2F5c09uVG9wOiB0cnVlLFxuICAgICAgICBmcmFtZTogZmFsc2UsXG4gICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICBza2lwVGFza2JhcjogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIsXG4gICAgICAgIHRpdGxlQmFyU3R5bGU6IFwiaGlkZGVuXCIsXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICB3ZWJQcmVmZXJlbmNlczpcbiAgICAgICAge1xuICAgICAgICAgICAgZGV2VG9vbHM6IGZhbHNlLFxuICAgICAgICAgICAgLy8gZGV2VG9vbHM6IHRydWUsXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBwcmVsb2FkOiBhcHAuaXNQYWNrYWdlZFxuICAgICAgICAgICAgICAgID8gUGF0aC5qb2luKF9fZGlybmFtZSwgXCJQcmVsb2FkLmpzXCIpXG4gICAgICAgICAgICAgICAgOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uLy5lcmIvZGxsL3ByZWxvYWQuanNcIilcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgLi4uR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpXG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93Lm9uKFwic2hvd1wiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0lzQWx3YXlzT25Ub3A6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJNYWluXCIpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGlwY01haW4ub24oXCJMb2dcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdHJpbmdpZmllZEFyZ3VtZW50czogc3RyaW5nID0gQXJndW1lbnRzXG4gICAgICAgICAgICAubWFwKChBcmd1bWVudDogdW5rbm93bik6IHN0cmluZyA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgQXJndW1lbnQgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgPyBBcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KEFyZ3VtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbigpO1xuXG4gICAgICAgIGNvbnN0IEJpcmRpZTogc3RyaW5nID0gXCLwn5ClIFwiO1xuICAgICAgICBsZXQgT3V0U3RyaW5nOiBzdHJpbmcgPSBCaXJkaWU7XG4gICAgICAgIGZvciAobGV0IEluZGV4OiBudW1iZXIgPSAwOyBJbmRleCA8IFN0cmluZ2lmaWVkQXJndW1lbnRzLmxlbmd0aDsgSW5kZXgrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgQ2hhcmFjdGVyOiBzdHJpbmcgPSBTdHJpbmdpZmllZEFyZ3VtZW50c1tJbmRleF07XG4gICAgICAgICAgICBpZiAoQ2hhcmFjdGVyID09PSBcIlxcblwiICYmIEluZGV4ICE9PSBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGggLSAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBCaXJkaWUgKyBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0U3RyaW5nICs9IENoYXJhY3RlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKE91dFN0cmluZyk7XG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93LmxvYWRVUkwocmVzb2x2ZUh0bWxQYXRoKFwiaW5kZXguaHRtbFwiKSk7XG4gICAgY29uc29sZS5sb2coXCJMYXVuY2hlZCBNYWluV2luZG93IHdpdGggQ29tcG9uZW50IGFyZ3VtZW50LlwiKTtcbn07XG5cbmZ1bmN0aW9uIE9uQWN0aXZhdGlvbihTdGF0ZTogc3RyaW5nKTogdm9pZFxue1xuICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvaW5nIHRvIGNhbGwgTXlCbHVyLi4uXCIpO1xuICAgICAgICBjb25zdCB7IENvdmVyaW5nV2luZG93LCBUaGVtZU1vZGUgfTogRkJsdXJSZXR1cm5UeXBlID0gTXlCbHVyKCk7XG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJTdW1tb25lZFwiKTtcblxuICAgICAgICAvLyBTdGFydEJsdXJPdmVybGF5KEdldEZvY3VzZWRXaW5kb3coKSk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZUltYWdlKEdldEZvY3VzZWRXaW5kb3coKSk7XG5cbiAgICAgICAgLy8gU3RhcnRCbHVyT3ZlcmxheU5ldyhHZXRGb2N1c2VkV2luZG93KCksICgpID0+IHsgfSk7XG4gICAgICAgIC8vIC8vIGNvbnN0IFNjcmVlbnNob3RQYXRoOiBzdHJpbmcgPSBDYXB0dXJlV2luZG93U2NyZWVuc2hvdChHZXRGb2N1c2VkV2luZG93KCkpO1xuICAgICAgICAvLyAvLyBjb25zdCBTY3JlZW5zaG90OiBCdWZmZXIgPSBGcy5yZWFkRmlsZVN5bmMoU2NyZWVuc2hvdFBhdGgpO1xuICAgICAgICAvLyAvLyBjb25zdCBTY3JlZW5zaG90RW5jb2RlZDogc3RyaW5nID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwkeyBTY3JlZW5zaG90LnRvU3RyaW5nKFwiYmFzZTY0XCIpIH1gO1xuICAgICAgICAvLyBjb25zdCBTY3JlZW5zaG90RW5jb2RlZDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAvLyAvLyBAVE9ETyBUaGVzZSBjYWxscyBvbmx5IG5lZWQgdG8gYmUgbWFkZSBvbmNlLiAgTW92ZSB0byBhbiBpbml0IGZ1bmN0aW9uLlxuXG4gICAgICAgIC8vIGlwY01haW4ub24oXCJHZXRUaGVtZUNvbG9yXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfQXJndW1lbnQ6IHVua25vd24pID0+XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRUaGVtZUNvbG9yXCIsIEdldFRoZW1lQ29sb3IoKSk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIC8vIGlwY01haW4ub24oXCJHZXRJc0xpZ2h0TW9kZVwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0FyZ3VtZW50OiAgdW5rbm93bikgPT5cbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc3QgSXNMaWdodE1vZGU6IGJvb2xlYW4gPSBHZXRJc0xpZ2h0TW9kZSgpO1xuICAgICAgICAvLyAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldElzTGlnaHRNb2RlXCIsIElzTGlnaHRNb2RlKTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy8gTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkJhY2tncm91bmRJbWFnZVwiLCBTY3JlZW5zaG90RW5jb2RlZCk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJUZWFyRG93blwiKTtcbiAgICAgICAgVGVhckRvd24oKTtcbiAgICAgICAgLy8gaXBjTWFpbi5vbihcIlRlYXJEb3duXCIsICgpOiB2b2lkID0+XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFRlYXJEb3duKCk7XG4gICAgICAgIC8vICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+XG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBHZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgTWFpbldpbmRvdz8uc2V0UG9zaXRpb24oeCwgeSwgZmFsc2UpO1xuICAgICAgICAvLyAgICAgfSwgMTAwKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJUZWFyRG93blwiKTtcblxuICAgICAgICAvLyBNYWluV2luZG93Py5vbihcImNsb3NlZFwiLCAoXzogRWxlY3Ryb24uRXZlbnQpOiB2b2lkID0+XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIExhdW5jaE1haW5XaW5kb3coKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIE1haW5XaW5kb3c/LmNsb3NlKCk7XG5cbiAgICAgICAgLy8gVGVzdEZ1bigpO1xuICAgIH1cbn1cblxuYXBwLndoZW5SZWFkeSgpXG4gICAgLnRoZW4oTGF1bmNoTWFpbldpbmRvdylcbiAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG5LZXlib2FyZC5TdWJzY3JpYmUoT25BY3RpdmF0aW9uKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==