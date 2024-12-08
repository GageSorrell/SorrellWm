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
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./Source/Main/util.ts");
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */





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
    MainWindow.loadURL((0,_util__WEBPACK_IMPORTED_MODULE_4__.resolveHtmlPath)("index.html"));
    console.log("Launched MainWindow with Component argument.");
};
function OnActivation(State) {
    if (State === "Down") {
        // StartBlurOverlay(GetFocusedWindow());
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.CaptureImage)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)());
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
_Keyboard__WEBPACK_IMPORTED_MODULE_3__.Keyboard.Subscribe(OnActivation);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLE9BQU8sQ0FBQyxzREFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ2hFLENBQUMsQ0FBQztBQUVGLFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFFL0IsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUNwQixDQUFDO1FBQ0csd0NBQXdDO1FBRXhDLGdFQUFZLENBQUMsb0VBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBRWpDLHNEQUFzRDtRQUN0RCxpRkFBaUY7UUFDakYsaUVBQWlFO1FBQ2pFLG1HQUFtRztRQUNuRyx3Q0FBd0M7UUFFeEMsNkVBQTZFO1FBRTdFLG9GQUFvRjtRQUNwRixJQUFJO1FBQ0osc0VBQXNFO1FBQ3RFLE1BQU07UUFFTixzRkFBc0Y7UUFDdEYsSUFBSTtRQUNKLHFEQUFxRDtRQUNyRCxtRUFBbUU7UUFDbkUsTUFBTTtRQUVOLHNFQUFzRTtRQUN0RSxzQ0FBc0M7SUFDMUMsQ0FBQztTQUVELENBQUM7UUFDRyx3REFBd0Q7UUFDeEQsSUFBSTtRQUNKLDBCQUEwQjtRQUMxQixNQUFNO1FBQ04sdUJBQXVCO1FBRXZCLGFBQWE7SUFDakIsQ0FBQztBQUNMLENBQUM7QUFFRCx5Q0FBRyxDQUFDLFNBQVMsRUFBRTtLQUNWLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztLQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXhCLCtDQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbldpbmRvdy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBGaWxlOiAgICBNYWluV2luZG93LnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCAqIGFzIEZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgQnJvd3NlcldpbmRvdywgYXBwLCBpcGNNYWluLCBzY3JlZW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7XG4gICAgQ2FwdHVyZUltYWdlLFxuICAgIENhcHR1cmVXaW5kb3dTY3JlZW5zaG90LFxuICAgIENvdmVyV2luZG93LFxuICAgIEdldEZvY3VzZWRXaW5kb3csXG4gICAgR2V0SXNMaWdodE1vZGUsXG4gICAgR2V0VGhlbWVDb2xvcixcbiAgICBTdGFydEJsdXJPdmVybGF5LFxuICAgIFN0YXJ0Qmx1ck92ZXJsYXlOZXcgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgeyBLZXlib2FyZCB9IGZyb20gXCIuL0tleWJvYXJkXCI7XG5pbXBvcnQgeyByZXNvbHZlSHRtbFBhdGggfSBmcm9tIFwiLi91dGlsXCI7XG5cbmxldCBNYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5jb25zdCBHZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uID0gKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9Plxue1xuICAgIGNvbnN0IERpc3BsYXlzOiBBcnJheTxFbGVjdHJvbi5EaXNwbGF5PiA9IHNjcmVlbi5nZXRBbGxEaXNwbGF5cygpO1xuXG4gICAgdHlwZSBGTW9uaXRvckJvdW5kcyA9IHsgbGVmdDogbnVtYmVyOyByaWdodDogbnVtYmVyOyB0b3A6IG51bWJlcjsgYm90dG9tOiBudW1iZXIgfTtcbiAgICBjb25zdCBNb25pdG9yQm91bmRzOiBBcnJheTxGTW9uaXRvckJvdW5kcz4gPSBEaXNwbGF5cy5tYXAoKGRpc3BsYXk6IEVsZWN0cm9uLkRpc3BsYXkpOiBGTW9uaXRvckJvdW5kcyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvdHRvbTogZGlzcGxheS5ib3VuZHMueSArIGRpc3BsYXkuYm91bmRzLmhlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkuYm91bmRzLngsXG4gICAgICAgICAgICByaWdodDogZGlzcGxheS5ib3VuZHMueCArIGRpc3BsYXkuYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgdG9wOiBkaXNwbGF5LmJvdW5kcy55XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBNb25pdG9yQm91bmRzLnNvcnQoKEE6IEZNb25pdG9yQm91bmRzLCBCOiBGTW9uaXRvckJvdW5kcykgPT4gQS5sZWZ0IC0gQi5sZWZ0IHx8IEEudG9wIC0gQi50b3ApO1xuXG4gICAgY29uc3QgTWF4UmlnaHQ6IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMucmlnaHQpKTtcbiAgICBjb25zdCBNYXhCb3R0b206IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMuYm90dG9tKSk7XG5cbiAgICBjb25zdCBJbnZpc2libGVYOiBudW1iZXIgPSAoTWF4UmlnaHQgKyAxKSAqIDI7XG4gICAgY29uc3QgSW52aXNpYmxlWTogbnVtYmVyID0gKE1heEJvdHRvbSArIDEpICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IEludmlzaWJsZVgsXG4gICAgICAgIHk6IEludmlzaWJsZVlcbiAgICB9O1xufTtcblxuY29uc3QgTGF1bmNoTWFpbldpbmRvdyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgY29uc29sZS5sb2coXCJMYXVuY2hpbmcgbWFpbiB3aW5kb3cuXCIpO1xuICAgIE1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIGFsd2F5c09uVG9wOiB0cnVlLFxuICAgICAgICBmcmFtZTogdHJ1ZSxcbiAgICAgICAgaGVpZ2h0OiA5MDAsXG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIHNraXBUYXNrYmFyOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCJTb3JyZWxsV20gTWFpbiBXaW5kb3dcIixcbiAgICAgICAgdGl0bGVCYXJTdHlsZTogXCJoaWRkZW5cIixcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgICBkZXZUb29sczogZmFsc2UsXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBwcmVsb2FkOiBhcHAuaXNQYWNrYWdlZFxuICAgICAgICAgICAgICAgID8gUGF0aC5qb2luKF9fZGlybmFtZSwgXCJQcmVsb2FkLmpzXCIpXG4gICAgICAgICAgICAgICAgOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uLy5lcmIvZGxsL3ByZWxvYWQuanNcIilcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgLi4uR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpXG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93Lm9uKFwic2hvd1wiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0lzQWx3YXlzT25Ub3A6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJNYWluXCIpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpcGNNYWluLm9uKFwiTG9nXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgU3RyaW5naWZpZWRBcmd1bWVudHM6IHN0cmluZyA9IEFyZ3VtZW50c1xuICAgICAgICAgICAgLm1hcCgoQXJndW1lbnQ6IHVua25vd24pOiBzdHJpbmcgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIEFyZ3VtZW50ID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgID8gQXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgOiBKU09OLnN0cmluZ2lmeShBcmd1bWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oKTtcblxuICAgICAgICBjb25zdCBCaXJkaWU6IHN0cmluZyA9IFwi8J+QpSBcIjtcbiAgICAgICAgbGV0IE91dFN0cmluZzogc3RyaW5nID0gQmlyZGllO1xuICAgICAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGg7IEluZGV4KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gU3RyaW5naWZpZWRBcmd1bWVudHNbSW5kZXhdO1xuICAgICAgICAgICAgaWYgKENoYXJhY3RlciA9PT0gXCJcXG5cIiAmJiBJbmRleCAhPT0gU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQmlyZGllICsgQ2hhcmFjdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhPdXRTdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5sb2FkVVJMKHJlc29sdmVIdG1sUGF0aChcImluZGV4Lmh0bWxcIikpO1xuICAgIGNvbnNvbGUubG9nKFwiTGF1bmNoZWQgTWFpbldpbmRvdyB3aXRoIENvbXBvbmVudCBhcmd1bWVudC5cIik7XG59O1xuXG5mdW5jdGlvbiBPbkFjdGl2YXRpb24oU3RhdGU6IHN0cmluZyk6IHZvaWRcbntcbiAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgIHtcbiAgICAgICAgLy8gU3RhcnRCbHVyT3ZlcmxheShHZXRGb2N1c2VkV2luZG93KCkpO1xuXG4gICAgICAgIENhcHR1cmVJbWFnZShHZXRGb2N1c2VkV2luZG93KCkpO1xuXG4gICAgICAgIC8vIFN0YXJ0Qmx1ck92ZXJsYXlOZXcoR2V0Rm9jdXNlZFdpbmRvdygpLCAoKSA9PiB7IH0pO1xuICAgICAgICAvLyAvLyBjb25zdCBTY3JlZW5zaG90UGF0aDogc3RyaW5nID0gQ2FwdHVyZVdpbmRvd1NjcmVlbnNob3QoR2V0Rm9jdXNlZFdpbmRvdygpKTtcbiAgICAgICAgLy8gLy8gY29uc3QgU2NyZWVuc2hvdDogQnVmZmVyID0gRnMucmVhZEZpbGVTeW5jKFNjcmVlbnNob3RQYXRoKTtcbiAgICAgICAgLy8gLy8gY29uc3QgU2NyZWVuc2hvdEVuY29kZWQ6IHN0cmluZyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsJHsgU2NyZWVuc2hvdC50b1N0cmluZyhcImJhc2U2NFwiKSB9YDtcbiAgICAgICAgLy8gY29uc3QgU2NyZWVuc2hvdEVuY29kZWQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgLy8gLy8gQFRPRE8gVGhlc2UgY2FsbHMgb25seSBuZWVkIHRvIGJlIG1hZGUgb25jZS4gIE1vdmUgdG8gYW4gaW5pdCBmdW5jdGlvbi5cblxuICAgICAgICAvLyBpcGNNYWluLm9uKFwiR2V0VGhlbWVDb2xvclwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0FyZ3VtZW50OiB1bmtub3duKSA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0VGhlbWVDb2xvclwiLCBHZXRUaGVtZUNvbG9yKCkpO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICAvLyBpcGNNYWluLm9uKFwiR2V0SXNMaWdodE1vZGVcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Bcmd1bWVudDogIHVua25vd24pID0+XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IElzTGlnaHRNb2RlOiBib29sZWFuID0gR2V0SXNMaWdodE1vZGUoKTtcbiAgICAgICAgLy8gICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRJc0xpZ2h0TW9kZVwiLCBJc0xpZ2h0TW9kZSk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJCYWNrZ3JvdW5kSW1hZ2VcIiwgU2NyZWVuc2hvdEVuY29kZWQpO1xuICAgICAgICAvLyAvLyBDb3ZlcldpbmRvdyhHZXRGb2N1c2VkV2luZG93KCkpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAvLyBNYWluV2luZG93Py5vbihcImNsb3NlZFwiLCAoXzogRWxlY3Ryb24uRXZlbnQpOiB2b2lkID0+XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIExhdW5jaE1haW5XaW5kb3coKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIE1haW5XaW5kb3c/LmNsb3NlKCk7XG5cbiAgICAgICAgLy8gVGVzdEZ1bigpO1xuICAgIH1cbn1cblxuYXBwLndoZW5SZWFkeSgpXG4gICAgLnRoZW4oTGF1bmNoTWFpbldpbmRvdylcbiAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG5LZXlib2FyZC5TdWJzY3JpYmUoT25BY3RpdmF0aW9uKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==