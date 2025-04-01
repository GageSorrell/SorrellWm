"use strict";
exports.id = "Source_Main_Core_Tray_ts";
exports.ids = ["Source_Main_Core_Tray_ts"];
exports.modules = {

/***/ "./Source/Main/Core/Tray.ts":
/*!**********************************!*\
  !*** ./Source/Main/Core/Tray.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Settings_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! #/Settings/Settings */ "./Source/Main/Settings/Settings.ts");
/* harmony import */ var _MainWindow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #/MainWindow */ "./Source/Main/MainWindow.ts");
/* File:      Tray.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



const Tray = { Ref: undefined };
electron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady().then(() => {
    Tray.Ref = new electron__WEBPACK_IMPORTED_MODULE_0__.Tray("./Resource/Tray.png");
    const ContextMenu = electron__WEBPACK_IMPORTED_MODULE_0__.Menu.buildFromTemplate([
        {
            click: _Settings_Settings__WEBPACK_IMPORTED_MODULE_1__.OpenSettings,
            label: "Settings",
            type: "normal"
        },
        {
            click: () => electron__WEBPACK_IMPORTED_MODULE_0__.app.exit(),
            label: "Exit",
            type: "normal"
        }
    ]);
    Tray.Ref.setToolTip("SorrellWm v0.0.1\nUp to date");
    Tray.Ref.setContextMenu(ContextMenu);
    Tray.Ref.addListener("click", _MainWindow__WEBPACK_IMPORTED_MODULE_2__.Activate);
});


/***/ }),

/***/ "./Source/Main/Settings/Settings.ts":
/*!******************************************!*\
  !*** ./Source/Main/Settings/Settings.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenSettings: () => (/* binding */ OpenSettings),
/* harmony export */   UpdateSettings: () => (/* binding */ UpdateSettings)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #/Core/Utility */ "./Source/Main/Core/Utility.ts");
/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



let SettingsWindow = undefined;
const OpenSettings = () => {
    if (SettingsWindow === undefined) {
        SettingsWindow = new electron__WEBPACK_IMPORTED_MODULE_1__.BrowserWindow({
            autoHideMenuBar: true,
            backgroundMaterial: "mica",
            frame: true,
            height: 900,
            maximizable: true,
            resizable: true,
            show: true,
            skipTaskbar: false,
            title: "SorrellWm Settings",
            titleBarStyle: "default",
            transparent: true,
            webPreferences: {
                devTools: false,
                nodeIntegration: true,
                preload: electron__WEBPACK_IMPORTED_MODULE_1__.app.isPackaged
                    ? path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "Preload.js")
                    : path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "../../.erb/dll/preload.js")
            },
            width: 1200
        });
    }
    SettingsWindow.setMenu(null);
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("ReadyForRoute", (_Event) => {
        SettingsWindow?.webContents.send("Navigate", "Settings");
    });
    SettingsWindow.loadURL((0,_Core_Utility__WEBPACK_IMPORTED_MODULE_2__.ResolveHtmlPath)("index.html"));
    SettingsWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
    });
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("UpdateSettings", (_Event, ..._Arguments) => {
        UpdateSettings();
    });
};
const UpdateSettings = async () => {
};


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fQ29yZV9UcmF5X3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFFd0Q7QUFFUjtBQUNYO0FBRXhDLE1BQU0sSUFBSSxHQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBRXZDLHlDQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUV0QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksMENBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRW5ELE1BQU0sV0FBVyxHQUFTLDBDQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDN0M7WUFDSSxLQUFLLEVBQUUsNERBQVk7WUFDbkIsS0FBSyxFQUFFLFVBQVU7WUFDakIsSUFBSSxFQUFFLFFBQVE7U0FDakI7UUFDRDtZQUNJLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyx5Q0FBRyxDQUFDLElBQUksRUFBRTtZQUN2QixLQUFLLEVBQUUsTUFBTTtZQUNiLElBQUksRUFBRSxRQUFRO1NBQ2pCO0tBQ0osQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsaURBQVEsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQ0g7Ozs7R0FJRztBQUUwQjtBQUMwQjtBQUNOO0FBRWpELElBQUksY0FBYyxHQUE4QixTQUFTLENBQUM7QUFFbkQsTUFBTSxZQUFZLEdBQUcsR0FBUyxFQUFFO0lBRW5DLElBQUksY0FBYyxLQUFLLFNBQVMsRUFDaEMsQ0FBQztRQUNHLGNBQWMsR0FBRyxJQUFJLG1EQUFhLENBQUM7WUFDL0IsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsTUFBTTtZQUMxQixLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxHQUFHO1lBQ1gsV0FBVyxFQUFFLElBQUk7WUFDakIsU0FBUyxFQUFFLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSTtZQUNWLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsYUFBYSxFQUFFLFNBQVM7WUFDeEIsV0FBVyxFQUFFLElBQUk7WUFDakIsY0FBYyxFQUNkO2dCQUNJLFFBQVEsRUFBRSxLQUFLO2dCQUNmLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixPQUFPLEVBQUUseUNBQUcsQ0FBQyxVQUFVO29CQUNuQixDQUFDLENBQUMsc0NBQVMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO29CQUNwQyxDQUFDLENBQUMsc0NBQVMsQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUM7YUFDMUQ7WUFDRCxLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTdCLDZDQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQXNCLEVBQVEsRUFBRTtRQUV6RCxjQUFjLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxjQUFjLENBQUMsT0FBTyxDQUFDLDhEQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUV0RCxjQUFjLENBQUMsRUFBRSxDQUNiLG9CQUFvQixFQUNwQixDQUFDLEtBQXFCLEVBQUUsTUFBYyxFQUFFLFlBQXFCLEVBQVEsRUFBRTtRQUVuRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUNKLENBQUM7SUFFRiw2Q0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQXNCLEVBQUUsR0FBRyxVQUEwQixFQUFRLEVBQUU7UUFFekYsY0FBYyxFQUFFLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFSyxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQW1CLEVBQUU7QUFHeEQsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9UcmF5LnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL1NldHRpbmdzL1NldHRpbmdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgVHJheS50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBUcmF5IGFzIEVsZWN0cm9uVHJheSwgTWVudSwgYXBwIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZUcmF5IH0gZnJvbSBcIi4vVHJheS5UeXBlc1wiO1xuaW1wb3J0IHsgT3BlblNldHRpbmdzIH0gZnJvbSBcIiMvU2V0dGluZ3MvU2V0dGluZ3NcIjtcbmltcG9ydCB7IEFjdGl2YXRlIH0gZnJvbSBcIiMvTWFpbldpbmRvd1wiO1xuXG5jb25zdCBUcmF5OiBGVHJheSA9IHsgUmVmOiB1bmRlZmluZWQgfTtcblxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKCkgPT5cbntcbiAgICBUcmF5LlJlZiA9IG5ldyBFbGVjdHJvblRyYXkoXCIuL1Jlc291cmNlL1RyYXkucG5nXCIpO1xuXG4gICAgY29uc3QgQ29udGV4dE1lbnU6IE1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKFtcbiAgICAgICAge1xuICAgICAgICAgICAgY2xpY2s6IE9wZW5TZXR0aW5ncyxcbiAgICAgICAgICAgIGxhYmVsOiBcIlNldHRpbmdzXCIsXG4gICAgICAgICAgICB0eXBlOiBcIm5vcm1hbFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiBhcHAuZXhpdCgpLFxuICAgICAgICAgICAgbGFiZWw6IFwiRXhpdFwiLFxuICAgICAgICAgICAgdHlwZTogXCJub3JtYWxcIlxuICAgICAgICB9XG4gICAgXSk7XG5cbiAgICBUcmF5LlJlZi5zZXRUb29sVGlwKFwiU29ycmVsbFdtIHYwLjAuMVxcblVwIHRvIGRhdGVcIik7XG4gICAgVHJheS5SZWYuc2V0Q29udGV4dE1lbnUoQ29udGV4dE1lbnUpO1xuICAgIFRyYXkuUmVmLmFkZExpc3RlbmVyKFwiY2xpY2tcIiwgQWN0aXZhdGUpO1xufSk7XG4iLCIvKiBGaWxlOiAgICAgIFNldHRpbmdzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGFwcCwgaXBjTWFpbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgUmVzb2x2ZUh0bWxQYXRoIH0gZnJvbSBcIiMvQ29yZS9VdGlsaXR5XCI7XG5cbmxldCBTZXR0aW5nc1dpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuZXhwb3J0IGNvbnN0IE9wZW5TZXR0aW5ncyA9ICgpOiB2b2lkID0+XG57XG4gICAgaWYgKFNldHRpbmdzV2luZG93ID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBTZXR0aW5nc1dpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgICAgIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tncm91bmRNYXRlcmlhbDogXCJtaWNhXCIsXG4gICAgICAgICAgICBmcmFtZTogdHJ1ZSxcbiAgICAgICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICAgICAgbWF4aW1pemFibGU6IHRydWUsXG4gICAgICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgc2tpcFRhc2tiYXI6IGZhbHNlLFxuICAgICAgICAgICAgdGl0bGU6IFwiU29ycmVsbFdtIFNldHRpbmdzXCIsXG4gICAgICAgICAgICB0aXRsZUJhclN0eWxlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGV2VG9vbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcmVsb2FkOiBhcHAuaXNQYWNrYWdlZFxuICAgICAgICAgICAgICAgICAgICA/IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiUHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgICAgICAgICA6IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLmVyYi9kbGwvcHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdpZHRoOiAxMjAwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIFNldHRpbmdzV2luZG93LnNldE1lbnUobnVsbCk7XG5cbiAgICBpcGNNYWluLm9uKFwiUmVhZHlGb3JSb3V0ZVwiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFNldHRpbmdzV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJTZXR0aW5nc1wiKTtcbiAgICB9KTtcblxuICAgIFNldHRpbmdzV2luZG93LmxvYWRVUkwoUmVzb2x2ZUh0bWxQYXRoKFwiaW5kZXguaHRtbFwiKSk7XG5cbiAgICBTZXR0aW5nc1dpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpcGNNYWluLm9uKFwiVXBkYXRlU2V0dGluZ3NcIiwgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgVXBkYXRlU2V0dGluZ3MoKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBVcGRhdGVTZXR0aW5ncyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG5cbn07XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==