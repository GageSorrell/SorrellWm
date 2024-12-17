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
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./Source/Main/util.ts");
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
            preload: electron__WEBPACK_IMPORTED_MODULE_2__.app.isPackaged
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
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("Log", async (_Event, ...Arguments) => {
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
        // const { CoveringWindow, ThemeMode }: FBlurReturnType = MyBlur();
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.BlurBackground)();
    }
    else {
        // MainWindow?.webContents.send("TearDown");
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.UnblurBackground)();
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
electron__WEBPACK_IMPORTED_MODULE_2__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_3__.Keyboard.Subscribe(OnActivation);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fTWFpbldpbmRvd190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBRTBCO0FBQ3lDO0FBQ1A7QUFDekI7QUFDRztBQUV6QyxJQUFJLFVBQVUsR0FBOEIsU0FBUyxDQUFDO0FBRXRELE1BQU0seUJBQXlCLEdBQUcsR0FBNkIsRUFBRTtJQUU3RCxNQUFNLFFBQVEsR0FBNEIsNENBQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUdsRSxNQUFNLGFBQWEsR0FBMEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQXlCLEVBQWtCLEVBQUU7UUFFcEcsT0FBTztZQUNILE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU07WUFDaEQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQzlDLEdBQUcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEIsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0lBRUgsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWlCLEVBQUUsQ0FBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRS9GLE1BQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBc0IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEcsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFzQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVwRyxNQUFNLFVBQVUsR0FBVyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsTUFBTSxVQUFVLEdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRS9DLE9BQU87UUFDSCxDQUFDLEVBQUUsVUFBVTtRQUNiLENBQUMsRUFBRSxVQUFVO0tBQ2hCLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUUvQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDdEMsVUFBVSxHQUFHLElBQUksbURBQWEsQ0FBQztRQUMzQixXQUFXLEVBQUUsSUFBSTtRQUNqQixLQUFLLEVBQUUsS0FBSztRQUNaLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLElBQUk7UUFDVixXQUFXLEVBQUUsSUFBSTtRQUNqQixLQUFLLEVBQUUsdUJBQXVCO1FBQzlCLGFBQWEsRUFBRSxRQUFRO1FBQ3ZCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGNBQWMsRUFDZDtZQUNJLFFBQVEsRUFBRSxLQUFLO1lBQ2Ysa0JBQWtCO1lBQ2xCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLE9BQU8sRUFBRSx5Q0FBRyxDQUFDLFVBQVU7Z0JBQ25CLENBQUMsQ0FBQyxzQ0FBUyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxzQ0FBUyxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsQ0FBQztTQUMxRDtRQUNELEtBQUssRUFBRSxHQUFHO1FBQ1YsR0FBRyx5QkFBeUIsRUFBRTtLQUNqQyxDQUFDLENBQUM7SUFFSCxVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQXNCLEVBQUUsY0FBdUIsRUFBUSxFQUFFO1FBRTVFLFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxFQUFFLENBQ1Qsb0JBQW9CLEVBQ3BCLENBQUMsS0FBcUIsRUFBRSxNQUFjLEVBQUUsWUFBcUIsRUFBUSxFQUFFO1FBRW5FLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QiwwQ0FBMEM7SUFDOUMsQ0FBQyxDQUNKLENBQUM7SUFFRiw2Q0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQXNCLEVBQUUsR0FBRyxTQUF5QixFQUFFLEVBQUU7UUFFN0UsTUFBTSxvQkFBb0IsR0FBVyxTQUFTO2FBQ3pDLEdBQUcsQ0FBQyxDQUFDLFFBQWlCLEVBQVUsRUFBRTtZQUUvQixPQUFPLE9BQU8sUUFBUSxLQUFLLFFBQVE7Z0JBQy9CLENBQUMsQ0FBQyxRQUFRO2dCQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQzthQUNELElBQUksRUFBRSxDQUFDO1FBRVosTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDO1FBQzdCLElBQUksU0FBUyxHQUFXLE1BQU0sQ0FBQztRQUMvQixLQUFLLElBQUksS0FBSyxHQUFXLENBQUMsRUFBRSxLQUFLLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUN4RSxDQUFDO1lBQ0csTUFBTSxTQUFTLEdBQVcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEQsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNuRSxDQUFDO2dCQUNHLFNBQVMsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQ3BDLENBQUM7aUJBRUQsQ0FBQztnQkFDRyxTQUFTLElBQUksU0FBUyxDQUFDO1lBQzNCLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxPQUFPLENBQUMsc0RBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQztBQUNoRSxDQUFDLENBQUM7QUFFRixTQUFTLFlBQVksQ0FBQyxLQUFhO0lBRS9CLElBQUksS0FBSyxLQUFLLE1BQU0sRUFDcEIsQ0FBQztRQUNHLG1FQUFtRTtRQUNuRSxrRUFBYyxFQUFFLENBQUM7SUFDckIsQ0FBQztTQUVELENBQUM7UUFDRyw0Q0FBNEM7UUFDNUMsb0VBQWdCLEVBQUUsQ0FBQztRQUNuQixxQ0FBcUM7UUFDckMsSUFBSTtRQUNKLGtCQUFrQjtRQUNsQiw2QkFBNkI7UUFDN0IsUUFBUTtRQUNSLHdEQUF3RDtRQUN4RCxnREFBZ0Q7UUFDaEQsZUFBZTtRQUNmLE1BQU07UUFDTiw0Q0FBNEM7UUFFNUMsd0RBQXdEO1FBQ3hELElBQUk7UUFDSiwwQkFBMEI7UUFDMUIsTUFBTTtRQUNOLHVCQUF1QjtRQUV2QixhQUFhO0lBQ2pCLENBQUM7QUFDTCxDQUFDO0FBRUQseUNBQUcsQ0FBQyxTQUFTLEVBQUU7S0FDVixJQUFJLENBQUMsZ0JBQWdCLENBQUM7S0FDdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV4QiwrQ0FBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL01haW5XaW5kb3cudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRmlsZTogICAgTWFpbldpbmRvdy50c1xuICogQXV0aG9yOiAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCbHVyQmFja2dyb3VuZCwgVW5ibHVyQmFja2dyb3VuZCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGFwcCwgaXBjTWFpbiwgc2NyZWVuIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBLZXlib2FyZCB9IGZyb20gXCIuL0tleWJvYXJkXCI7XG5pbXBvcnQgeyByZXNvbHZlSHRtbFBhdGggfSBmcm9tIFwiLi91dGlsXCI7XG5cbmxldCBNYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5jb25zdCBHZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uID0gKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9Plxue1xuICAgIGNvbnN0IERpc3BsYXlzOiBBcnJheTxFbGVjdHJvbi5EaXNwbGF5PiA9IHNjcmVlbi5nZXRBbGxEaXNwbGF5cygpO1xuXG4gICAgdHlwZSBGTW9uaXRvckJvdW5kcyA9IHsgbGVmdDogbnVtYmVyOyByaWdodDogbnVtYmVyOyB0b3A6IG51bWJlcjsgYm90dG9tOiBudW1iZXIgfTtcbiAgICBjb25zdCBNb25pdG9yQm91bmRzOiBBcnJheTxGTW9uaXRvckJvdW5kcz4gPSBEaXNwbGF5cy5tYXAoKGRpc3BsYXk6IEVsZWN0cm9uLkRpc3BsYXkpOiBGTW9uaXRvckJvdW5kcyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvdHRvbTogZGlzcGxheS5ib3VuZHMueSArIGRpc3BsYXkuYm91bmRzLmhlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkuYm91bmRzLngsXG4gICAgICAgICAgICByaWdodDogZGlzcGxheS5ib3VuZHMueCArIGRpc3BsYXkuYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgdG9wOiBkaXNwbGF5LmJvdW5kcy55XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBNb25pdG9yQm91bmRzLnNvcnQoKEE6IEZNb25pdG9yQm91bmRzLCBCOiBGTW9uaXRvckJvdW5kcykgPT4gQS5sZWZ0IC0gQi5sZWZ0IHx8IEEudG9wIC0gQi50b3ApO1xuXG4gICAgY29uc3QgTWF4UmlnaHQ6IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMucmlnaHQpKTtcbiAgICBjb25zdCBNYXhCb3R0b206IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMuYm90dG9tKSk7XG5cbiAgICBjb25zdCBJbnZpc2libGVYOiBudW1iZXIgPSAoTWF4UmlnaHQgKyAxKSAqIDI7XG4gICAgY29uc3QgSW52aXNpYmxlWTogbnVtYmVyID0gKE1heEJvdHRvbSArIDEpICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IEludmlzaWJsZVgsXG4gICAgICAgIHk6IEludmlzaWJsZVlcbiAgICB9O1xufTtcblxuY29uc3QgTGF1bmNoTWFpbldpbmRvdyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgY29uc29sZS5sb2coXCJMYXVuY2hpbmcgbWFpbiB3aW5kb3cuXCIpO1xuICAgIE1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIGFsd2F5c09uVG9wOiB0cnVlLFxuICAgICAgICBmcmFtZTogZmFsc2UsXG4gICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICBza2lwVGFza2JhcjogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIsXG4gICAgICAgIHRpdGxlQmFyU3R5bGU6IFwiaGlkZGVuXCIsXG4gICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICB3ZWJQcmVmZXJlbmNlczpcbiAgICAgICAge1xuICAgICAgICAgICAgZGV2VG9vbHM6IGZhbHNlLFxuICAgICAgICAgICAgLy8gZGV2VG9vbHM6IHRydWUsXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBwcmVsb2FkOiBhcHAuaXNQYWNrYWdlZFxuICAgICAgICAgICAgICAgID8gUGF0aC5qb2luKF9fZGlybmFtZSwgXCJQcmVsb2FkLmpzXCIpXG4gICAgICAgICAgICAgICAgOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uLy5lcmIvZGxsL3ByZWxvYWQuanNcIilcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgLi4uR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpXG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93Lm9uKFwic2hvd1wiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgX0lzQWx3YXlzT25Ub3A6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJNYWluXCIpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGlwY01haW4ub24oXCJMb2dcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdHJpbmdpZmllZEFyZ3VtZW50czogc3RyaW5nID0gQXJndW1lbnRzXG4gICAgICAgICAgICAubWFwKChBcmd1bWVudDogdW5rbm93bik6IHN0cmluZyA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgQXJndW1lbnQgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgPyBBcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KEFyZ3VtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbigpO1xuXG4gICAgICAgIGNvbnN0IEJpcmRpZTogc3RyaW5nID0gXCLwn5ClIFwiO1xuICAgICAgICBsZXQgT3V0U3RyaW5nOiBzdHJpbmcgPSBCaXJkaWU7XG4gICAgICAgIGZvciAobGV0IEluZGV4OiBudW1iZXIgPSAwOyBJbmRleCA8IFN0cmluZ2lmaWVkQXJndW1lbnRzLmxlbmd0aDsgSW5kZXgrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgQ2hhcmFjdGVyOiBzdHJpbmcgPSBTdHJpbmdpZmllZEFyZ3VtZW50c1tJbmRleF07XG4gICAgICAgICAgICBpZiAoQ2hhcmFjdGVyID09PSBcIlxcblwiICYmIEluZGV4ICE9PSBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGggLSAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBCaXJkaWUgKyBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0U3RyaW5nICs9IENoYXJhY3RlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKE91dFN0cmluZyk7XG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93LmxvYWRVUkwocmVzb2x2ZUh0bWxQYXRoKFwiaW5kZXguaHRtbFwiKSk7XG4gICAgY29uc29sZS5sb2coXCJMYXVuY2hlZCBNYWluV2luZG93IHdpdGggQ29tcG9uZW50IGFyZ3VtZW50LlwiKTtcbn07XG5cbmZ1bmN0aW9uIE9uQWN0aXZhdGlvbihTdGF0ZTogc3RyaW5nKTogdm9pZFxue1xuICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAge1xuICAgICAgICAvLyBjb25zdCB7IENvdmVyaW5nV2luZG93LCBUaGVtZU1vZGUgfTogRkJsdXJSZXR1cm5UeXBlID0gTXlCbHVyKCk7XG4gICAgICAgIEJsdXJCYWNrZ3JvdW5kKCk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJUZWFyRG93blwiKTtcbiAgICAgICAgVW5ibHVyQmFja2dyb3VuZCgpO1xuICAgICAgICAvLyBpcGNNYWluLm9uKFwiVGVhckRvd25cIiwgKCk6IHZvaWQgPT5cbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgVGVhckRvd24oKTtcbiAgICAgICAgLy8gICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbiAgICAgICAgLy8gICAgIHtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCB7IHgsIHkgfSA9IEdldExlYXN0SW52aXNpYmxlUG9zaXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICBNYWluV2luZG93Py5zZXRQb3NpdGlvbih4LCB5LCBmYWxzZSk7XG4gICAgICAgIC8vICAgICB9LCAxMDApO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIlRlYXJEb3duXCIpO1xuXG4gICAgICAgIC8vIE1haW5XaW5kb3c/Lm9uKFwiY2xvc2VkXCIsIChfOiBFbGVjdHJvbi5FdmVudCk6IHZvaWQgPT5cbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTGF1bmNoTWFpbldpbmRvdygpO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gTWFpbldpbmRvdz8uY2xvc2UoKTtcblxuICAgICAgICAvLyBUZXN0RnVuKCk7XG4gICAgfVxufVxuXG5hcHAud2hlblJlYWR5KClcbiAgICAudGhlbihMYXVuY2hNYWluV2luZG93KVxuICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbktleWJvYXJkLlN1YnNjcmliZShPbkFjdGl2YXRpb24pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9