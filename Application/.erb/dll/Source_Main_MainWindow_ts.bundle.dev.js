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
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_4__.TearDown)();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Iiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbldpbmRvdy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBGaWxlOiAgICBNYWluV2luZG93LnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCAqIGFzIEZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgQnJvd3NlcldpbmRvdywgYXBwLCBpcGNNYWluLCBzY3JlZW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbi8vIGltcG9ydCB7XG4vLyAgICAgQmx1ckJhY2tncm91bmQsXG4vLyAgICAgQ2FwdHVyZVdpbmRvd1NjcmVlbnNob3QsXG4vLyAgICAgQ292ZXJXaW5kb3csXG4vLyAgICAgR2V0Rm9jdXNlZFdpbmRvdyxcbi8vICAgICBHZXRJc0xpZ2h0TW9kZSxcbi8vICAgICBHZXRUaGVtZUNvbG9yLFxuLy8gICAgIFN0YXJ0Qmx1ck92ZXJsYXksXG4vLyAgICAgU3RhcnRCbHVyT3ZlcmxheU5ldyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcIi4vS2V5Ym9hcmRcIjtcbmltcG9ydCB7IHJlc29sdmVIdG1sUGF0aCB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IE15Qmx1ciwgVGVhckRvd24gfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmxldCBNYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5jb25zdCBHZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uID0gKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9Plxue1xuICAgIGNvbnN0IERpc3BsYXlzOiBBcnJheTxFbGVjdHJvbi5EaXNwbGF5PiA9IHNjcmVlbi5nZXRBbGxEaXNwbGF5cygpO1xuXG4gICAgdHlwZSBGTW9uaXRvckJvdW5kcyA9IHsgbGVmdDogbnVtYmVyOyByaWdodDogbnVtYmVyOyB0b3A6IG51bWJlcjsgYm90dG9tOiBudW1iZXIgfTtcbiAgICBjb25zdCBNb25pdG9yQm91bmRzOiBBcnJheTxGTW9uaXRvckJvdW5kcz4gPSBEaXNwbGF5cy5tYXAoKGRpc3BsYXk6IEVsZWN0cm9uLkRpc3BsYXkpOiBGTW9uaXRvckJvdW5kcyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvdHRvbTogZGlzcGxheS5ib3VuZHMueSArIGRpc3BsYXkuYm91bmRzLmhlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkuYm91bmRzLngsXG4gICAgICAgICAgICByaWdodDogZGlzcGxheS5ib3VuZHMueCArIGRpc3BsYXkuYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgdG9wOiBkaXNwbGF5LmJvdW5kcy55XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBNb25pdG9yQm91bmRzLnNvcnQoKEE6IEZNb25pdG9yQm91bmRzLCBCOiBGTW9uaXRvckJvdW5kcykgPT4gQS5sZWZ0IC0gQi5sZWZ0IHx8IEEudG9wIC0gQi50b3ApO1xuXG4gICAgY29uc3QgTWF4UmlnaHQ6IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMucmlnaHQpKTtcbiAgICBjb25zdCBNYXhCb3R0b206IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMuYm90dG9tKSk7XG5cbiAgICBjb25zdCBJbnZpc2libGVYOiBudW1iZXIgPSAoTWF4UmlnaHQgKyAxKSAqIDI7XG4gICAgY29uc3QgSW52aXNpYmxlWTogbnVtYmVyID0gKE1heEJvdHRvbSArIDEpICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IEludmlzaWJsZVgsXG4gICAgICAgIHk6IEludmlzaWJsZVlcbiAgICB9O1xufTtcblxuY29uc3QgTGF1bmNoTWFpbldpbmRvdyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgY29uc29sZS5sb2coXCJMYXVuY2hpbmcgbWFpbiB3aW5kb3cuXCIpO1xuICAgIE1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIGFsd2F5c09uVG9wOiB0cnVlLFxuICAgICAgICBmcmFtZTogdHJ1ZSxcbiAgICAgICAgaGVpZ2h0OiA5MDAsXG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIHNraXBUYXNrYmFyOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCJTb3JyZWxsV20gTWFpbiBXaW5kb3dcIixcbiAgICAgICAgdGl0bGVCYXJTdHlsZTogXCJoaWRkZW5cIixcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgICBkZXZUb29sczogZmFsc2UsXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBwcmVsb2FkOiBhcHAuaXNQYWNrYWdlZFxuICAgICAgICAgICAgICAgID8gUGF0aC5qb2luKF9fZGlybmFtZSwgXCJQcmVsb2FkLmpzXCIpXG4gICAgICAgICAgICAgICAgOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uLy5lcmIvZGxsL3ByZWxvYWQuanNcIilcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgLi4uR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpXG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93Lm9uKFwic2hvd1wiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0lzQWx3YXlzT25Ub3A6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJNYWluXCIpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpcGNNYWluLm9uKFwiTG9nXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgU3RyaW5naWZpZWRBcmd1bWVudHM6IHN0cmluZyA9IEFyZ3VtZW50c1xuICAgICAgICAgICAgLm1hcCgoQXJndW1lbnQ6IHVua25vd24pOiBzdHJpbmcgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIEFyZ3VtZW50ID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgID8gQXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgOiBKU09OLnN0cmluZ2lmeShBcmd1bWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oKTtcblxuICAgICAgICBjb25zdCBCaXJkaWU6IHN0cmluZyA9IFwi8J+QpSBcIjtcbiAgICAgICAgbGV0IE91dFN0cmluZzogc3RyaW5nID0gQmlyZGllO1xuICAgICAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGg7IEluZGV4KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gU3RyaW5naWZpZWRBcmd1bWVudHNbSW5kZXhdO1xuICAgICAgICAgICAgaWYgKENoYXJhY3RlciA9PT0gXCJcXG5cIiAmJiBJbmRleCAhPT0gU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQmlyZGllICsgQ2hhcmFjdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhPdXRTdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5sb2FkVVJMKHJlc29sdmVIdG1sUGF0aChcImluZGV4Lmh0bWxcIikpO1xuICAgIGNvbnNvbGUubG9nKFwiTGF1bmNoZWQgTWFpbldpbmRvdyB3aXRoIENvbXBvbmVudCBhcmd1bWVudC5cIik7XG59O1xuXG5mdW5jdGlvbiBPbkFjdGl2YXRpb24oU3RhdGU6IHN0cmluZyk6IHZvaWRcbntcbiAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb2luZyB0byBjYWxsIE15Qmx1ci4uLlwiKTtcbiAgICAgICAgTXlCbHVyKCk7XG4gICAgICAgIC8vIFN0YXJ0Qmx1ck92ZXJsYXkoR2V0Rm9jdXNlZFdpbmRvdygpKTtcblxuICAgICAgICAvLyBDYXB0dXJlSW1hZ2UoR2V0Rm9jdXNlZFdpbmRvdygpKTtcblxuICAgICAgICAvLyBTdGFydEJsdXJPdmVybGF5TmV3KEdldEZvY3VzZWRXaW5kb3coKSwgKCkgPT4geyB9KTtcbiAgICAgICAgLy8gLy8gY29uc3QgU2NyZWVuc2hvdFBhdGg6IHN0cmluZyA9IENhcHR1cmVXaW5kb3dTY3JlZW5zaG90KEdldEZvY3VzZWRXaW5kb3coKSk7XG4gICAgICAgIC8vIC8vIGNvbnN0IFNjcmVlbnNob3Q6IEJ1ZmZlciA9IEZzLnJlYWRGaWxlU3luYyhTY3JlZW5zaG90UGF0aCk7XG4gICAgICAgIC8vIC8vIGNvbnN0IFNjcmVlbnNob3RFbmNvZGVkOiBzdHJpbmcgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7IFNjcmVlbnNob3QudG9TdHJpbmcoXCJiYXNlNjRcIikgfWA7XG4gICAgICAgIC8vIGNvbnN0IFNjcmVlbnNob3RFbmNvZGVkOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vIC8vIEBUT0RPIFRoZXNlIGNhbGxzIG9ubHkgbmVlZCB0byBiZSBtYWRlIG9uY2UuICBNb3ZlIHRvIGFuIGluaXQgZnVuY3Rpb24uXG5cbiAgICAgICAgLy8gaXBjTWFpbi5vbihcIkdldFRoZW1lQ29sb3JcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Bcmd1bWVudDogdW5rbm93bikgPT5cbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldFRoZW1lQ29sb3JcIiwgR2V0VGhlbWVDb2xvcigpKTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy8gaXBjTWFpbi5vbihcIkdldElzTGlnaHRNb2RlXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfQXJndW1lbnQ6ICB1bmtub3duKSA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBjb25zdCBJc0xpZ2h0TW9kZTogYm9vbGVhbiA9IEdldElzTGlnaHRNb2RlKCk7XG4gICAgICAgIC8vICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0SXNMaWdodE1vZGVcIiwgSXNMaWdodE1vZGUpO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICAvLyBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiQmFja2dyb3VuZEltYWdlXCIsIFNjcmVlbnNob3RFbmNvZGVkKTtcbiAgICAgICAgLy8gLy8gQ292ZXJXaW5kb3coR2V0Rm9jdXNlZFdpbmRvdygpKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgVGVhckRvd24oKTtcbiAgICAgICAgLy8gTWFpbldpbmRvdz8ub24oXCJjbG9zZWRcIiwgKF86IEVsZWN0cm9uLkV2ZW50KTogdm9pZCA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBMYXVuY2hNYWluV2luZG93KCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBNYWluV2luZG93Py5jbG9zZSgpO1xuXG4gICAgICAgIC8vIFRlc3RGdW4oKTtcbiAgICB9XG59XG5cbmFwcC53aGVuUmVhZHkoKVxuICAgIC50aGVuKExhdW5jaE1haW5XaW5kb3cpXG4gICAgLmNhdGNoKGNvbnNvbGUubG9nKTtcblxuS2V5Ym9hcmQuU3Vic2NyaWJlKE9uQWN0aXZhdGlvbik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=