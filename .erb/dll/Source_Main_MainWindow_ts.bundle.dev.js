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
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./Source/Main/util.ts");
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */






let MainWindow = undefined;
const GetLeastInvisiblePosition = () => {
    const Displays = electron__WEBPACK_IMPORTED_MODULE_2__.screen.getAllDisplays();
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
    MainWindow = new electron__WEBPACK_IMPORTED_MODULE_2__.BrowserWindow({
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
            preload: electron__WEBPACK_IMPORTED_MODULE_2__.app.isPackaged
                ? path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, "Preload.js")
                : path__WEBPACK_IMPORTED_MODULE_1__.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });
    MainWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
        MainWindow?.webContents.closeDevTools();
    });
    MainWindow.loadURL((0,_util__WEBPACK_IMPORTED_MODULE_5__.resolveHtmlPath)("index.html"));
};
function OnActivation(State) {
    if (State === "Down") {
        const ScreenshotPath = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.CaptureWindowScreenshot)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.GetFocusedWindow)());
        const Screenshot = fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(ScreenshotPath);
        const ScreenshotEncoded = `data:image/png;base64,${Screenshot.toString("base64")}`;
        // @TODO These calls only need to be made once.  Move to an init function.
        electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("GetThemeColor", async (_Event, _Argument) => {
            MainWindow?.webContents.send("GetThemeColor", (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.GetThemeColor)());
        });
        electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("GetIsLightMode", async (_Event, _Argument) => {
            const IsLightMode = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.GetIsLightMode)();
            MainWindow?.webContents.send("GetIsLightMode", IsLightMode);
        });
        electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("BackgroundImage", async (_Event, _Argument) => {
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.CoverWindow)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.GetFocusedWindow)());
        });
        MainWindow?.webContents.send("BackgroundImage", ScreenshotEncoded);
    }
    else {
        MainWindow?.on("closed", (_) => {
            LaunchMainWindow();
        });
        MainWindow?.close();
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_3__.TestFun)();
    }
}
electron__WEBPACK_IMPORTED_MODULE_2__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_4__.Keyboard.Subscribe(OnActivation);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fTWFpbldpbmRvd190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0dBR0c7QUFFc0I7QUFDSTtBQUNrQztBQU94QjtBQUNEO0FBQ0c7QUFFekMsSUFBSSxVQUFVLEdBQThCLFNBQVMsQ0FBQztBQUV0RCxNQUFNLHlCQUF5QixHQUFHLEdBQTZCLEVBQUU7SUFFN0QsTUFBTSxRQUFRLEdBQTRCLDRDQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHbEUsTUFBTSxhQUFhLEdBQTBCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUF5QixFQUFrQixFQUFFO1FBRXBHLE9BQU87WUFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1lBQ2hELElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSztZQUM5QyxHQUFHLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hCLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUVILGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFpQixFQUFFLENBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUvRixNQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXNCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxh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QUUsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7U0FFRCxDQUFDO1FBQ0csVUFBVSxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFpQixFQUFRLEVBQUU7WUFFakQsZ0JBQWdCLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztRQUNILFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUVwQiwyREFBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0FBQ0wsQ0FBQztBQUVELHlDQUFHLENBQUMsU0FBUyxFQUFFO0tBQ1YsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0tBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEIsK0NBQVEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NYWluV2luZG93LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgIE1haW5XaW5kb3cudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgRnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCcm93c2VyV2luZG93LCBhcHAsIGlwY01haW4sIHNjcmVlbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHtcbiAgICBDYXB0dXJlV2luZG93U2NyZWVuc2hvdCxcbiAgICBDb3ZlcldpbmRvdyxcbiAgICBHZXRGb2N1c2VkV2luZG93LFxuICAgIEdldElzTGlnaHRNb2RlLFxuICAgIEdldFRoZW1lQ29sb3IsXG4gICAgVGVzdEZ1bn0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi9LZXlib2FyZFwiO1xuaW1wb3J0IHsgcmVzb2x2ZUh0bWxQYXRoIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5sZXQgTWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuY29uc3QgR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbiA9ICgpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPT5cbntcbiAgICBjb25zdCBEaXNwbGF5czogQXJyYXk8RWxlY3Ryb24uRGlzcGxheT4gPSBzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcblxuICAgIHR5cGUgRk1vbml0b3JCb3VuZHMgPSB7IGxlZnQ6IG51bWJlcjsgcmlnaHQ6IG51bWJlcjsgdG9wOiBudW1iZXI7IGJvdHRvbTogbnVtYmVyIH07XG4gICAgY29uc3QgTW9uaXRvckJvdW5kczogQXJyYXk8Rk1vbml0b3JCb3VuZHM+ID0gRGlzcGxheXMubWFwKChkaXNwbGF5OiBFbGVjdHJvbi5EaXNwbGF5KTogRk1vbml0b3JCb3VuZHMgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBib3R0b206IGRpc3BsYXkuYm91bmRzLnkgKyBkaXNwbGF5LmJvdW5kcy5oZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LmJvdW5kcy54LFxuICAgICAgICAgICAgcmlnaHQ6IGRpc3BsYXkuYm91bmRzLnggKyBkaXNwbGF5LmJvdW5kcy53aWR0aCxcbiAgICAgICAgICAgIHRvcDogZGlzcGxheS5ib3VuZHMueVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgTW9uaXRvckJvdW5kcy5zb3J0KChBOiBGTW9uaXRvckJvdW5kcywgQjogRk1vbml0b3JCb3VuZHMpID0+IEEubGVmdCAtIEIubGVmdCB8fCBBLnRvcCAtIEIudG9wKTtcblxuICAgIGNvbnN0IE1heFJpZ2h0OiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLnJpZ2h0KSk7XG4gICAgY29uc3QgTWF4Qm90dG9tOiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLmJvdHRvbSkpO1xuXG4gICAgY29uc3QgSW52aXNpYmxlWDogbnVtYmVyID0gKE1heFJpZ2h0ICsgMSkgKiAyO1xuICAgIGNvbnN0IEludmlzaWJsZVk6IG51bWJlciA9IChNYXhCb3R0b20gKyAxKSAqIDI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBJbnZpc2libGVYLFxuICAgICAgICB5OiBJbnZpc2libGVZXG4gICAgfTtcbn07XG5cbmNvbnN0IExhdW5jaE1haW5XaW5kb3cgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGNvbnNvbGUubG9nKFwiTGF1bmNoaW5nIG1haW4gd2luZG93LlwiKTtcbiAgICBNYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcbiAgICAgICAgZnJhbWU6IHRydWUsXG4gICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICBza2lwVGFza2JhcjogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIsXG4gICAgICAgIHRpdGxlQmFyU3R5bGU6IFwiaGlkZGVuXCIsXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICB3ZWJQcmVmZXJlbmNlczpcbiAgICAgICAge1xuICAgICAgICAgICAgZGV2VG9vbHM6IGZhbHNlLFxuICAgICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgcHJlbG9hZDogYXBwLmlzUGFja2FnZWRcbiAgICAgICAgICAgICAgICA/IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiUHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgICAgIDogUGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi8uZXJiL2RsbC9wcmVsb2FkLmpzXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgIC4uLkdldExlYXN0SW52aXNpYmxlUG9zaXRpb24oKVxuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBNYWluV2luZG93LmxvYWRVUkwocmVzb2x2ZUh0bWxQYXRoKFwiaW5kZXguaHRtbFwiKSk7XG59O1xuXG5mdW5jdGlvbiBPbkFjdGl2YXRpb24oU3RhdGU6IHN0cmluZyk6IHZvaWRcbntcbiAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgIHtcbiAgICAgICAgY29uc3QgU2NyZWVuc2hvdFBhdGg6IHN0cmluZyA9IENhcHR1cmVXaW5kb3dTY3JlZW5zaG90KEdldEZvY3VzZWRXaW5kb3coKSk7XG4gICAgICAgIGNvbnN0IFNjcmVlbnNob3Q6IEJ1ZmZlciA9IEZzLnJlYWRGaWxlU3luYyhTY3JlZW5zaG90UGF0aCk7XG4gICAgICAgIGNvbnN0IFNjcmVlbnNob3RFbmNvZGVkOiBzdHJpbmcgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7IFNjcmVlbnNob3QudG9TdHJpbmcoXCJiYXNlNjRcIikgfWA7XG5cbiAgICAgICAgLy8gQFRPRE8gVGhlc2UgY2FsbHMgb25seSBuZWVkIHRvIGJlIG1hZGUgb25jZS4gIE1vdmUgdG8gYW4gaW5pdCBmdW5jdGlvbi5cblxuICAgICAgICBpcGNNYWluLm9uKFwiR2V0VGhlbWVDb2xvclwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0FyZ3VtZW50OiB1bmtub3duKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0VGhlbWVDb2xvclwiLCBHZXRUaGVtZUNvbG9yKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpcGNNYWluLm9uKFwiR2V0SXNMaWdodE1vZGVcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Bcmd1bWVudDogIHVua25vd24pID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElzTGlnaHRNb2RlOiBib29sZWFuID0gR2V0SXNMaWdodE1vZGUoKTtcbiAgICAgICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRJc0xpZ2h0TW9kZVwiLCBJc0xpZ2h0TW9kZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlwY01haW4ub24oXCJCYWNrZ3JvdW5kSW1hZ2VcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Bcmd1bWVudDogdW5rbm93bikgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgQ292ZXJXaW5kb3coR2V0Rm9jdXNlZFdpbmRvdygpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJCYWNrZ3JvdW5kSW1hZ2VcIiwgU2NyZWVuc2hvdEVuY29kZWQpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBNYWluV2luZG93Py5vbihcImNsb3NlZFwiLCAoXzogRWxlY3Ryb24uRXZlbnQpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIExhdW5jaE1haW5XaW5kb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIE1haW5XaW5kb3c/LmNsb3NlKCk7XG5cbiAgICAgICAgVGVzdEZ1bigpO1xuICAgIH1cbn1cblxuYXBwLndoZW5SZWFkeSgpXG4gICAgLnRoZW4oTGF1bmNoTWFpbldpbmRvdylcbiAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG5LZXlib2FyZC5TdWJzY3JpYmUoT25BY3RpdmF0aW9uKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==