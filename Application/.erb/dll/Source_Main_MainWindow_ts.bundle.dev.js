"use strict";
exports.id = "Source_Main_MainWindow_ts";
exports.ids = ["Source_Main_MainWindow_ts"];
exports.modules = {

/***/ "./Source/Main/Development/Log.ts":
/*!****************************************!*\
  !*** ./Source/Main/Development/Log.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* binding */ Log)
/* harmony export */ });
/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */
/** @TODO */
const Log = (...Arguments) => {
    console.log(...Arguments);
    // process.stdout.write(
    //     chalk.bgMagenta.white(" Backend ") +
    //     " " +
    //     JSON.stringify(Arguments, null, 4)
    // );
};


/***/ }),

/***/ "./Source/Main/Development/TestWindows.ts":
/*!************************************************!*\
  !*** ./Source/Main/Development/TestWindows.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateTestWindows: () => (/* binding */ CreateTestWindows)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #/Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! #/Tree */ "./Source/Main/Tree.ts");
/* harmony import */ var Windows__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Windows */ "./Windows/index.js");
/* harmony import */ var Windows__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(Windows__WEBPACK_IMPORTED_MODULE_4__);
/* File:      TestWindows.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */





const CreateTestWindow = (Index) => {
    const TestWindow = new electron__WEBPACK_IMPORTED_MODULE_1__.BrowserWindow({
        autoHideMenuBar: true,
        show: true,
        title: `Test Window #${Index}`,
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
            preload: electron__WEBPACK_IMPORTED_MODULE_1__.app.isPackaged
                ? path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "Preload.js")
                : path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "../../.erb/dll/preload.js")
        }
    });
    TestWindow.setMenu(null);
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("ReadyForRoute", (_Event) => {
        TestWindow.webContents.send("Navigate", "TestWindow");
    });
    TestWindow.loadURL((0,_Core_Utility__WEBPACK_IMPORTED_MODULE_2__.ResolveHtmlPath)("index.html"));
    TestWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
    });
    return TestWindow;
};
const CreateTestWindows = async () => {
    const TestWindows = [];
    for (let Index = 0; Index < 10; Index++) {
        TestWindows.push(CreateTestWindow(Index));
    }
    const RightMonitor = (0,_Tree__WEBPACK_IMPORTED_MODULE_3__.Find)((Vertex) => {
        if ((0,_Tree__WEBPACK_IMPORTED_MODULE_3__.IsPanel)(Vertex)) {
            return Vertex.Size.X === 2738;
        }
        else {
            return false;
        }
    });
    if (RightMonitor !== undefined) {
        TestWindows.forEach((TestWindow) => {
            const WindowTitle = TestWindow.getTitle();
            const Handle = (0,Windows__WEBPACK_IMPORTED_MODULE_4__.GetWindowByName)(WindowTitle);
            (0,_Tree__WEBPACK_IMPORTED_MODULE_3__.BringIntoPanel)(RightMonitor, Handle);
        });
    }
};


/***/ }),

/***/ "./Source/Main/Development/index.ts":
/*!******************************************!*\
  !*** ./Source/Main/Development/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* reexport safe */ _Log__WEBPACK_IMPORTED_MODULE_0__.Log)
/* harmony export */ });
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Log */ "./Source/Main/Development/Log.ts");
/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



/***/ }),

/***/ "./Source/Main/MainWindow.ts":
/*!***********************************!*\
  !*** ./Source/Main/MainWindow.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetActiveWindow: () => (/* binding */ GetActiveWindow)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tree */ "./Source/Main/Tree.ts");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/Domain/Common/Component/Keyboard/Keyboard */ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Development_TestWindows__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Development/TestWindows */ "./Source/Main/Development/TestWindows.ts");
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */










let MainWindow = undefined;
const GetLeastInvisiblePosition = () => {
    const Displays = electron__WEBPACK_IMPORTED_MODULE_3__.screen.getAllDisplays();
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
    MainWindow = new electron__WEBPACK_IMPORTED_MODULE_3__.BrowserWindow({
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
            preload: electron__WEBPACK_IMPORTED_MODULE_3__.app.isPackaged
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
    });
    /** @TODO Find better place for this. */
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("GetAnnotatedPanels", async (_Event, ..._Arguments) => {
        const Panels = (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.GetPanels)();
        const AnnotatedPanels = (await Promise.all(Panels.map(_Tree__WEBPACK_IMPORTED_MODULE_1__.AnnotatePanel)))
            .filter((Value) => {
            return Value !== undefined;
        });
        MainWindow?.webContents.send("GetAnnotatedPanels", AnnotatedPanels);
    });
    /** @TODO Find better place for this. */
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("GetPanelScreenshots", async (_Event, ..._Arguments) => {
        const Panels = (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.GetPanels)();
        const Screenshots = (await Promise.all(Panels.map(_Tree__WEBPACK_IMPORTED_MODULE_1__.GetPanelScreenshot)))
            .filter((Value) => {
            return Value !== undefined;
        });
        MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    });
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("BringIntoPanel", async (_Event, ...Arguments) => {
        // Log("BringIntoPanel", Arguments[0]);
        console.log("BringIntoPanel !! !!", ...Arguments);
        (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.BringIntoPanel)(Arguments[0], GetActiveWindow());
    });
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("TearDown", async (_Event, ..._Arguments) => {
        ActiveWindow = undefined;
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.UnblurBackground)();
    });
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("Log", async (_Event, ...Arguments) => {
        const StringifiedArguments = Arguments
            .map((Argument) => {
            return typeof Argument === "string"
                ? Argument
                : JSON.stringify(Argument);
        })
            .join();
        const Birdie = chalk__WEBPACK_IMPORTED_MODULE_8___default().bgMagenta(" ⚛️ ") + " ";
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
    MainWindow.loadURL((0,_Core_Utility__WEBPACK_IMPORTED_MODULE_6__.ResolveHtmlPath)("index.html"));
    /** @TODO Run this by flag with `npm start`. */
    (0,_Development_TestWindows__WEBPACK_IMPORTED_MODULE_9__.CreateTestWindows)();
};
/** The window that SorrellWm is being drawn over. */
let ActiveWindow = undefined;
const GetActiveWindow = () => {
    return ActiveWindow;
};
function OnKey(Event) {
    const { State, VkCode } = Event;
    if (MainWindow === undefined) {
        return;
    }
    /** @TODO Make this a modifiable setting. */
    const ActivationKey = _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_7__.Vk["F24"];
    if (VkCode === ActivationKey) {
        if (State === "Down") {
            if ((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetWindowTitle)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)()) !== "SorrellWm Main Window") {
                ActiveWindow = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)();
                const IsTiled = (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.IsWindowTiled)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)());
                (0,_Development__WEBPACK_IMPORTED_MODULE_5__.Log)(`Focused Window of IsTiled call is ${(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetWindowTitle)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)())}.`);
                MainWindow.webContents.send("Navigate", "", { IsTiled });
                (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.BlurBackground)();
            }
        }
        else {
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.UnblurBackground)();
        }
    }
    else {
        MainWindow.webContents.send("Keyboard", Event);
    }
}
electron__WEBPACK_IMPORTED_MODULE_3__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_4__.Keyboard.Subscribe(OnKey);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fTWFpbldpbmRvd190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFJSCxZQUFZO0FBQ0wsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFNBQXlCLEVBQVEsRUFBRTtJQUV0RCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFDMUIsd0JBQXdCO0lBQ3hCLDJDQUEyQztJQUMzQyxZQUFZO0lBQ1oseUNBQXlDO0lBQ3pDLEtBQUs7QUFDVCxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJGOzs7O0dBSUc7QUFFMEI7QUFDMEI7QUFDTjtBQUNpQjtBQUVWO0FBRXhELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFhLEVBQWlCLEVBQUU7SUFFdEQsTUFBTSxVQUFVLEdBQWtCLElBQUksbURBQWEsQ0FBQztRQUNoRCxlQUFlLEVBQUUsSUFBSTtRQUNyQixJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRSxnQkFBaUIsS0FBTSxFQUFFO1FBQ2hDLGNBQWMsRUFDZDtZQUNJLFFBQVEsRUFBRSxLQUFLO1lBQ2YsZUFBZSxFQUFFLElBQUk7WUFDckIsT0FBTyxFQUFFLHlDQUFHLENBQUMsVUFBVTtnQkFDbkIsQ0FBQyxDQUFDLHNDQUFTLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztnQkFDcEMsQ0FBQyxDQUFDLHNDQUFTLENBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDO1NBQzFEO0tBQ0osQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV6Qiw2Q0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFzQixFQUFRLEVBQUU7UUFFekQsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFD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LEVBQUUsQ0FBQztnQkFDbEMsTUFBTSxPQUFPLEdBQVksb0RBQWEsQ0FBQyxvRUFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBQzNELGlEQUFHLENBQUMscUNBQXNDLGtFQUFjLENBQUMsb0VBQWdCLEVBQUUsQ0FBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEYsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ3pELGtFQUFjLEVBQUUsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQzthQUVELENBQUM7WUFDRyxvRUFBZ0IsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7SUFDTCxDQUFDO1NBRUQsQ0FBQztRQUNHLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0FBQ0wsQ0FBQztBQUVELHlDQUFHLENBQUMsU0FBUyxFQUFFO0tBQ1YsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0tBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEIsK0NBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9Mb2cudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvVGVzdFdpbmRvd3MudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbldpbmRvdy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBGaWxlOiAgICAgIExvZy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5cbi8qKiBAVE9ETyAqL1xuZXhwb3J0IGNvbnN0IExvZyA9ICguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KTogdm9pZCA9Plxue1xuICAgIGNvbnNvbGUubG9nKC4uLkFyZ3VtZW50cyk7XG4gICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoXG4gICAgLy8gICAgIGNoYWxrLmJnTWFnZW50YS53aGl0ZShcIiBCYWNrZW5kIFwiKSArXG4gICAgLy8gICAgIFwiIFwiICtcbiAgICAvLyAgICAgSlNPTi5zdHJpbmdpZnkoQXJndW1lbnRzLCBudWxsLCA0KVxuICAgIC8vICk7XG59O1xuIiwiLyogRmlsZTogICAgICBUZXN0V2luZG93cy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCcm93c2VyV2luZG93LCBhcHAsIGlwY01haW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IFJlc29sdmVIdG1sUGF0aCB9IGZyb20gXCIjL0NvcmUvVXRpbGl0eVwiO1xuaW1wb3J0IHsgQnJpbmdJbnRvUGFuZWwsIEZpbmQsIEdldEZvcmVzdCwgSXNQYW5lbCB9IGZyb20gXCIjL1RyZWVcIjtcbmltcG9ydCB0eXBlIHsgRlBhbmVsLCBGVmVydGV4IH0gZnJvbSBcIiMvVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHsgR2V0V2luZG93QnlOYW1lLCB0eXBlIEhXaW5kb3cgfSBmcm9tIFwiV2luZG93c1wiO1xuXG5jb25zdCBDcmVhdGVUZXN0V2luZG93ID0gKEluZGV4OiBudW1iZXIpOiBCcm93c2VyV2luZG93ID0+XG57XG4gICAgY29uc3QgVGVzdFdpbmRvdzogQnJvd3NlcldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgYXV0b0hpZGVNZW51QmFyOiB0cnVlLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICB0aXRsZTogYFRlc3QgV2luZG93ICMkeyBJbmRleCB9YCxcbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGRldlRvb2xzOiBmYWxzZSxcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHByZWxvYWQ6IGFwcC5pc1BhY2thZ2VkXG4gICAgICAgICAgICAgICAgPyBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIlByZWxvYWQuanNcIilcbiAgICAgICAgICAgICAgICA6IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLmVyYi9kbGwvcHJlbG9hZC5qc1wiKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBUZXN0V2luZG93LnNldE1lbnUobnVsbCk7XG5cbiAgICBpcGNNYWluLm9uKFwiUmVhZHlGb3JSb3V0ZVwiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFRlc3RXaW5kb3cud2ViQ29udGVudHMuc2VuZChcIk5hdmlnYXRlXCIsIFwiVGVzdFdpbmRvd1wiKTtcbiAgICB9KTtcblxuICAgIFRlc3RXaW5kb3cubG9hZFVSTChSZXNvbHZlSHRtbFBhdGgoXCJpbmRleC5odG1sXCIpKTtcblxuICAgIFRlc3RXaW5kb3cub24oXG4gICAgICAgIFwicGFnZS10aXRsZS11cGRhdGVkXCIsXG4gICAgICAgIChFdmVudDogRWxlY3Ryb24uRXZlbnQsIF9UaXRsZTogc3RyaW5nLCBfRXhwbGljaXRTZXQ6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgcmV0dXJuIFRlc3RXaW5kb3c7XG59O1xuXG5leHBvcnQgY29uc3QgQ3JlYXRlVGVzdFdpbmRvd3MgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGNvbnN0IFRlc3RXaW5kb3dzOiBBcnJheTxCcm93c2VyV2luZG93PiA9IFsgXTtcbiAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCAxMDsgSW5kZXgrKylcbiAgICB7XG4gICAgICAgIFRlc3RXaW5kb3dzLnB1c2goQ3JlYXRlVGVzdFdpbmRvdyhJbmRleCkpO1xuICAgIH1cblxuICAgIGNvbnN0IFJpZ2h0TW9uaXRvcjogRlBhbmVsIHwgdW5kZWZpbmVkID0gRmluZCgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKElzUGFuZWwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFZlcnRleC5TaXplLlggPT09IDI3Mzg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KSBhcyBGUGFuZWwgfCB1bmRlZmluZWQ7XG4gICAgaWYgKFJpZ2h0TW9uaXRvciAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgVGVzdFdpbmRvd3MuZm9yRWFjaCgoVGVzdFdpbmRvdzogQnJvd3NlcldpbmRvdyk6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgV2luZG93VGl0bGU6IHN0cmluZyA9IFRlc3RXaW5kb3cuZ2V0VGl0bGUoKTtcbiAgICAgICAgICAgIGNvbnN0IEhhbmRsZTogSFdpbmRvdyA9IEdldFdpbmRvd0J5TmFtZShXaW5kb3dUaXRsZSk7XG4gICAgICAgICAgICBCcmluZ0ludG9QYW5lbChSaWdodE1vbml0b3IsIEhhbmRsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufTtcbiIsIi8qIEZpbGU6ICAgICAgaW5kZXgudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vTG9nXCI7XG4iLCIvKiBGaWxlOiAgICBNYWluV2luZG93LnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEFubm90YXRlUGFuZWwsIEJyaW5nSW50b1BhbmVsLCBHZXRQYW5lbFNjcmVlbnNob3QsIEdldFBhbmVscywgSXNXaW5kb3dUaWxlZCB9IGZyb20gXCIuL1RyZWVcIjtcbmltcG9ydCB7XG4gICAgQmx1ckJhY2tncm91bmQsXG4gICAgR2V0Rm9jdXNlZFdpbmRvdyxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICB0eXBlIEhXaW5kb3csXG4gICAgVW5ibHVyQmFja2dyb3VuZCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGFwcCwgaXBjTWFpbiwgc2NyZWVuIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZBbm5vdGF0ZWRQYW5lbCwgRlBhbmVsIH0gZnJvbSBcIi4vVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZWaXJ0dWFsS2V5IH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmQuVHlwZXNcIjtcbmltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcIi4vS2V5Ym9hcmRcIjtcbmltcG9ydCB7IExvZyB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgeyBSZXNvbHZlSHRtbFBhdGggfSBmcm9tIFwiLi9Db3JlL1V0aWxpdHlcIjtcbmltcG9ydCB7IFZrIH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmRcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7IENyZWF0ZVRlc3RXaW5kb3dzIH0gZnJvbSBcIi4vRGV2ZWxvcG1lbnQvVGVzdFdpbmRvd3NcIjtcblxubGV0IE1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmNvbnN0IEdldExlYXN0SW52aXNpYmxlUG9zaXRpb24gPSAoKTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9ID0+XG57XG4gICAgY29uc3QgRGlzcGxheXM6IEFycmF5PEVsZWN0cm9uLkRpc3BsYXk+ID0gc2NyZWVuLmdldEFsbERpc3BsYXlzKCk7XG5cbiAgICB0eXBlIEZNb25pdG9yQm91bmRzID0geyBsZWZ0OiBudW1iZXI7IHJpZ2h0OiBudW1iZXI7IHRvcDogbnVtYmVyOyBib3R0b206IG51bWJlciB9O1xuICAgIGNvbnN0IE1vbml0b3JCb3VuZHM6IEFycmF5PEZNb25pdG9yQm91bmRzPiA9IERpc3BsYXlzLm1hcCgoZGlzcGxheTogRWxlY3Ryb24uRGlzcGxheSk6IEZNb25pdG9yQm91bmRzID0+XG4gICAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYm90dG9tOiBkaXNwbGF5LmJvdW5kcy55ICsgZGlzcGxheS5ib3VuZHMuaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogZGlzcGxheS5ib3VuZHMueCxcbiAgICAgICAgICAgIHJpZ2h0OiBkaXNwbGF5LmJvdW5kcy54ICsgZGlzcGxheS5ib3VuZHMud2lkdGgsXG4gICAgICAgICAgICB0b3A6IGRpc3BsYXkuYm91bmRzLnlcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIE1vbml0b3JCb3VuZHMuc29ydCgoQTogRk1vbml0b3JCb3VuZHMsIEI6IEZNb25pdG9yQm91bmRzKSA9PiBBLmxlZnQgLSBCLmxlZnQgfHwgQS50b3AgLSBCLnRvcCk7XG5cbiAgICBjb25zdCBNYXhSaWdodDogbnVtYmVyID0gTWF0aC5tYXgoLi4uTW9uaXRvckJvdW5kcy5tYXAoKGJvdW5kczogRk1vbml0b3JCb3VuZHMpID0+IGJvdW5kcy5yaWdodCkpO1xuICAgIGNvbnN0IE1heEJvdHRvbTogbnVtYmVyID0gTWF0aC5tYXgoLi4uTW9uaXRvckJvdW5kcy5tYXAoKGJvdW5kczogRk1vbml0b3JCb3VuZHMpID0+IGJvdW5kcy5ib3R0b20pKTtcblxuICAgIGNvbnN0IEludmlzaWJsZVg6IG51bWJlciA9IChNYXhSaWdodCArIDEpICogMjtcbiAgICBjb25zdCBJbnZpc2libGVZOiBudW1iZXIgPSAoTWF4Qm90dG9tICsgMSkgKiAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogSW52aXNpYmxlWCxcbiAgICAgICAgeTogSW52aXNpYmxlWVxuICAgIH07XG59O1xuXG5jb25zdCBMYXVuY2hNYWluV2luZG93ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBjb25zb2xlLmxvZyhcIkxhdW5jaGluZyBtYWluIHdpbmRvdy5cIik7XG4gICAgTWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgYWx3YXlzT25Ub3A6IHRydWUsXG4gICAgICAgIGZyYW1lOiBmYWxzZSxcbiAgICAgICAgaGVpZ2h0OiA5MDAsXG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIHNraXBUYXNrYmFyOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCJTb3JyZWxsV20gTWFpbiBXaW5kb3dcIixcbiAgICAgICAgdGl0bGVCYXJTdHlsZTogXCJoaWRkZW5cIixcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgICBkZXZUb29sczogZmFsc2UsXG4gICAgICAgICAgICAvLyBkZXZUb29sczogdHJ1ZSxcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHByZWxvYWQ6IGFwcC5pc1BhY2thZ2VkXG4gICAgICAgICAgICAgICAgPyBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIlByZWxvYWQuanNcIilcbiAgICAgICAgICAgICAgICA6IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLmVyYi9kbGwvcHJlbG9hZC5qc1wiKVxuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAuLi5HZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uKClcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cub24oXCJzaG93XCIsIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfSXNBbHdheXNPblRvcDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJOYXZpZ2F0ZVwiLCBcIk1haW5cIik7XG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93Lm9uKFxuICAgICAgICBcInBhZ2UtdGl0bGUtdXBkYXRlZFwiLFxuICAgICAgICAoRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfVGl0bGU6IHN0cmluZywgX0V4cGxpY2l0U2V0OiBib29sZWFuKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8qKiBAVE9ETyBGaW5kIGJldHRlciBwbGFjZSBmb3IgdGhpcy4gKi9cbiAgICBpcGNNYWluLm9uKFwiR2V0QW5ub3RhdGVkUGFuZWxzXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IFBhbmVsczogQXJyYXk8RlBhbmVsPiA9IEdldFBhbmVscygpO1xuICAgICAgICBjb25zdCBBbm5vdGF0ZWRQYW5lbHM6IEFycmF5PEZBbm5vdGF0ZWRQYW5lbD4gPSAoYXdhaXQgUHJvbWlzZS5hbGwoUGFuZWxzLm1hcChBbm5vdGF0ZVBhbmVsKSkpXG4gICAgICAgICAgICAuZmlsdGVyKChWYWx1ZTogRkFubm90YXRlZFBhbmVsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBWYWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSkgYXMgQXJyYXk8RkFubm90YXRlZFBhbmVsPjtcblxuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0QW5ub3RhdGVkUGFuZWxzXCIsIEFubm90YXRlZFBhbmVscyk7XG4gICAgfSk7XG5cbiAgICAvKiogQFRPRE8gRmluZCBiZXR0ZXIgcGxhY2UgZm9yIHRoaXMuICovXG4gICAgaXBjTWFpbi5vbihcIkdldFBhbmVsU2NyZWVuc2hvdHNcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgUGFuZWxzOiBBcnJheTxGUGFuZWw+ID0gR2V0UGFuZWxzKCk7XG4gICAgICAgIGNvbnN0IFNjcmVlbnNob3RzOiBBcnJheTxzdHJpbmc+ID0gKGF3YWl0IFByb21pc2UuYWxsKFBhbmVscy5tYXAoR2V0UGFuZWxTY3JlZW5zaG90KSkpXG4gICAgICAgICAgICAuZmlsdGVyKChWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBWYWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSkgYXMgQXJyYXk8c3RyaW5nPjtcblxuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiLCBTY3JlZW5zaG90cyk7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLm9uKFwiQnJpbmdJbnRvUGFuZWxcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICAvLyBMb2coXCJCcmluZ0ludG9QYW5lbFwiLCBBcmd1bWVudHNbMF0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJyaW5nSW50b1BhbmVsICEhICEhXCIsIC4uLkFyZ3VtZW50cyk7XG4gICAgICAgIEJyaW5nSW50b1BhbmVsKEFyZ3VtZW50c1swXSBhcyBGQW5ub3RhdGVkUGFuZWwsIEdldEFjdGl2ZVdpbmRvdygpIGFzIEhXaW5kb3cpO1xuICAgIH0pO1xuXG4gICAgaXBjTWFpbi5vbihcIlRlYXJEb3duXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIEFjdGl2ZVdpbmRvdyA9IHVuZGVmaW5lZDtcbiAgICAgICAgVW5ibHVyQmFja2dyb3VuZCgpO1xuICAgIH0pO1xuXG4gICAgaXBjTWFpbi5vbihcIkxvZ1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IFN0cmluZ2lmaWVkQXJndW1lbnRzOiBzdHJpbmcgPSBBcmd1bWVudHNcbiAgICAgICAgICAgIC5tYXAoKEFyZ3VtZW50OiB1bmtub3duKTogc3RyaW5nID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBBcmd1bWVudCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICA/IEFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIDogSlNPTi5zdHJpbmdpZnkoQXJndW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCk7XG5cbiAgICAgICAgY29uc3QgQmlyZGllOiBzdHJpbmcgPSBjaGFsay5iZ01hZ2VudGEoXCIg4pqb77iPIFwiKSArIFwiIFwiO1xuICAgICAgICBsZXQgT3V0U3RyaW5nOiBzdHJpbmcgPSBCaXJkaWU7XG4gICAgICAgIGZvciAobGV0IEluZGV4OiBudW1iZXIgPSAwOyBJbmRleCA8IFN0cmluZ2lmaWVkQXJndW1lbnRzLmxlbmd0aDsgSW5kZXgrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgQ2hhcmFjdGVyOiBzdHJpbmcgPSBTdHJpbmdpZmllZEFyZ3VtZW50c1tJbmRleF07XG4gICAgICAgICAgICBpZiAoQ2hhcmFjdGVyID09PSBcIlxcblwiICYmIEluZGV4ICE9PSBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGggLSAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBCaXJkaWUgKyBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0U3RyaW5nICs9IENoYXJhY3RlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKE91dFN0cmluZyk7XG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93LmxvYWRVUkwoUmVzb2x2ZUh0bWxQYXRoKFwiaW5kZXguaHRtbFwiKSk7XG5cbiAgICAvKiogQFRPRE8gUnVuIHRoaXMgYnkgZmxhZyB3aXRoIGBucG0gc3RhcnRgLiAqL1xuICAgIENyZWF0ZVRlc3RXaW5kb3dzKCk7XG59O1xuXG4vKiogVGhlIHdpbmRvdyB0aGF0IFNvcnJlbGxXbSBpcyBiZWluZyBkcmF3biBvdmVyLiAqL1xubGV0IEFjdGl2ZVdpbmRvdzogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbmV4cG9ydCBjb25zdCBHZXRBY3RpdmVXaW5kb3cgPSAoKTogSFdpbmRvdyB8IHVuZGVmaW5lZCA9Plxue1xuICAgIHJldHVybiBBY3RpdmVXaW5kb3c7XG59O1xuXG5mdW5jdGlvbiBPbktleShFdmVudDogRktleWJvYXJkRXZlbnQpOiB2b2lkXG57XG4gICAgY29uc3QgeyBTdGF0ZSwgVmtDb2RlIH0gPSBFdmVudDtcbiAgICBpZiAoTWFpbldpbmRvdyA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKiBAVE9ETyBNYWtlIHRoaXMgYSBtb2RpZmlhYmxlIHNldHRpbmcuICovXG4gICAgY29uc3QgQWN0aXZhdGlvbktleTogRlZpcnR1YWxLZXkgPSBWa1tcIkYyNFwiXTtcblxuICAgIGlmIChWa0NvZGUgPT09IEFjdGl2YXRpb25LZXkpXG4gICAge1xuICAgICAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoR2V0V2luZG93VGl0bGUoR2V0Rm9jdXNlZFdpbmRvdygpKSAhPT0gXCJTb3JyZWxsV20gTWFpbiBXaW5kb3dcIilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3RpdmVXaW5kb3cgPSBHZXRGb2N1c2VkV2luZG93KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgSXNUaWxlZDogYm9vbGVhbiA9IElzV2luZG93VGlsZWQoR2V0Rm9jdXNlZFdpbmRvdygpKTtcbiAgICAgICAgICAgICAgICBMb2coYEZvY3VzZWQgV2luZG93IG9mIElzVGlsZWQgY2FsbCBpcyAkeyBHZXRXaW5kb3dUaXRsZShHZXRGb2N1c2VkV2luZG93KCkpIH0uYCk7XG4gICAgICAgICAgICAgICAgTWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJcIiwgeyBJc1RpbGVkIH0pO1xuICAgICAgICAgICAgICAgIEJsdXJCYWNrZ3JvdW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBVbmJsdXJCYWNrZ3JvdW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgTWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKFwiS2V5Ym9hcmRcIiwgRXZlbnQpO1xuICAgIH1cbn1cblxuYXBwLndoZW5SZWFkeSgpXG4gICAgLnRoZW4oTGF1bmNoTWFpbldpbmRvdylcbiAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG5LZXlib2FyZC5TdWJzY3JpYmUoT25LZXkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9