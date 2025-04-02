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
 * Copyright: (c) 2025 Gage Sorrell
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
/* harmony import */ var _Utility_Utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #/Utility/Utility */ "./Source/Main/Utility/Utility.ts");
/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
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
                    : path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "../Intermediate/Preload.js")
            },
            width: 1200
        });
    }
    SettingsWindow.setMenu(null);
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("ReadyForRoute", (_Event) => {
        SettingsWindow?.webContents.send("Navigate", "Settings");
    });
    SettingsWindow.loadURL((0,_Utility_Utility__WEBPACK_IMPORTED_MODULE_2__.ResolveHtmlPath)("index.html"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fQ29yZV9UcmF5X3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFFd0Q7QUFFUjtBQUNYO0FBRXhDLE1BQU0sSUFBSSxHQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBRXZDLHlDQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUV0QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksMENBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRW5ELE1BQU0sV0FBVyxHQUFTLDBDQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDN0M7WUFDSSxLQUFLLEVBQUUsNERBQVk7WUFDbkIsS0FBSyxFQUFFLFVBQVU7WUFDakIsSUFBSSxFQUFFLFFBQVE7U0FDakI7UUFDRDtZQUNJLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyx5Q0FBRyxDQUFDLElBQUksRUFBRTtZQUN2QixLQUFLLEVBQUUsTUFBTTtZQUNiLElBQUksRUFBRSxRQUFRO1NBQ2pCO0tBQ0osQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsaURBQVEsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQ0g7Ozs7R0FJRztBQUUwQjtBQUMwQjtBQUNIO0FBRXBELElBQUksY0FBYyxHQUE4QixTQUFTLENBQUM7QUFFbkQsTUFBTSxZQUFZLEdBQUcsR0FBUyxFQUFFO0lBRW5DLElBQUksY0FBYyxLQUFLLFNBQVMsRUFDaEMsQ0FBQztRQUNHLGNBQWMsR0FBRyxJQUFJLG1EQUFhLENBQUM7WUFDL0IsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsTUFBTTtZQUMxQixLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxHQUFHO1lBQ1gsV0FBVyxFQUFFLElBQUk7WUFDakIsU0FBUyxFQUFFLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSTtZQUNWLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsYUFBYSxFQUFFLFNBQVM7WUFDeEIsV0FBVyxFQUFFLElBQUk7WUFDakIsY0FBYyxFQUNkO2dCQUNJLFFBQVEsRUFBRSxLQUFLO2dCQUNmLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixPQUFPLEVBQUUseUNBQUcsQ0FBQyxVQUFVO29CQUNuQixDQUFDLENBQUMsc0NBQVMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO29CQUNwQyxDQUFDLENBQUMsc0NBQVMsQ0FBQyxTQUFTLEVBQUUsNEJBQTRCLENBQUM7YUFDM0Q7WUFDRCxLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTdCLDZDQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQXNCLEVBQVEsRUFBRTtRQUV6RCxjQUFjLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxjQUFjLENBQUMsT0FBTyxDQUFDLGlFQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUV0RCxjQUFjLENBQUMsRUFBRSxDQUNiLG9CQUFvQixFQUNwQixDQUFDLEtBQXFCLEVBQUUsTUFBYyxFQUFFLFlBQXFCLEVBQVEsRUFBRTtRQUVuRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUNKLENBQUM7SUFFRiw2Q0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQXNCLEVBQUUsR0FBRyxVQUEwQixFQUFRLEVBQUU7UUFFekYsY0FBYyxFQUFFLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFSyxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQW1CLEVBQUU7QUFHeEQsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9UcmF5LnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL1NldHRpbmdzL1NldHRpbmdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgVHJheS50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB7IFRyYXkgYXMgRWxlY3Ryb25UcmF5LCBNZW51LCBhcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB0eXBlIHsgRlRyYXkgfSBmcm9tIFwiLi9UcmF5LlR5cGVzXCI7XG5pbXBvcnQgeyBPcGVuU2V0dGluZ3MgfSBmcm9tIFwiIy9TZXR0aW5ncy9TZXR0aW5nc1wiO1xuaW1wb3J0IHsgQWN0aXZhdGUgfSBmcm9tIFwiIy9NYWluV2luZG93XCI7XG5cbmNvbnN0IFRyYXk6IEZUcmF5ID0geyBSZWY6IHVuZGVmaW5lZCB9O1xuXG5hcHAud2hlblJlYWR5KCkudGhlbigoKSA9Plxue1xuICAgIFRyYXkuUmVmID0gbmV3IEVsZWN0cm9uVHJheShcIi4vUmVzb3VyY2UvVHJheS5wbmdcIik7XG5cbiAgICBjb25zdCBDb250ZXh0TWVudTogTWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAgICB7XG4gICAgICAgICAgICBjbGljazogT3BlblNldHRpbmdzLFxuICAgICAgICAgICAgbGFiZWw6IFwiU2V0dGluZ3NcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm9ybWFsXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgY2xpY2s6ICgpID0+IGFwcC5leGl0KCksXG4gICAgICAgICAgICBsYWJlbDogXCJFeGl0XCIsXG4gICAgICAgICAgICB0eXBlOiBcIm5vcm1hbFwiXG4gICAgICAgIH1cbiAgICBdKTtcblxuICAgIFRyYXkuUmVmLnNldFRvb2xUaXAoXCJTb3JyZWxsV20gdjAuMC4xXFxuVXAgdG8gZGF0ZVwiKTtcbiAgICBUcmF5LlJlZi5zZXRDb250ZXh0TWVudShDb250ZXh0TWVudSk7XG4gICAgVHJheS5SZWYuYWRkTGlzdGVuZXIoXCJjbGlja1wiLCBBY3RpdmF0ZSk7XG59KTtcbiIsIi8qIEZpbGU6ICAgICAgU2V0dGluZ3MudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCcm93c2VyV2luZG93LCBhcHAsIGlwY01haW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IFJlc29sdmVIdG1sUGF0aCB9IGZyb20gXCIjL1V0aWxpdHkvVXRpbGl0eVwiO1xuXG5sZXQgU2V0dGluZ3NXaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjb25zdCBPcGVuU2V0dGluZ3MgPSAoKTogdm9pZCA9Plxue1xuICAgIGlmIChTZXR0aW5nc1dpbmRvdyA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgU2V0dGluZ3NXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgICAgICBhdXRvSGlkZU1lbnVCYXI6IHRydWUsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kTWF0ZXJpYWw6IFwibWljYVwiLFxuICAgICAgICAgICAgZnJhbWU6IHRydWUsXG4gICAgICAgICAgICBoZWlnaHQ6IDkwMCxcbiAgICAgICAgICAgIG1heGltaXphYmxlOiB0cnVlLFxuICAgICAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgIHNraXBUYXNrYmFyOiBmYWxzZSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlNvcnJlbGxXbSBTZXR0aW5nc1wiLFxuICAgICAgICAgICAgdGl0bGVCYXJTdHlsZTogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIHdlYlByZWZlcmVuY2VzOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRldlRvb2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlbG9hZDogYXBwLmlzUGFja2FnZWRcbiAgICAgICAgICAgICAgICAgICAgPyBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIlByZWxvYWQuanNcIilcbiAgICAgICAgICAgICAgICAgICAgOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL0ludGVybWVkaWF0ZS9QcmVsb2FkLmpzXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2lkdGg6IDEyMDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgU2V0dGluZ3NXaW5kb3cuc2V0TWVudShudWxsKTtcblxuICAgIGlwY01haW4ub24oXCJSZWFkeUZvclJvdXRlXCIsIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgU2V0dGluZ3NXaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJOYXZpZ2F0ZVwiLCBcIlNldHRpbmdzXCIpO1xuICAgIH0pO1xuXG4gICAgU2V0dGluZ3NXaW5kb3cubG9hZFVSTChSZXNvbHZlSHRtbFBhdGgoXCJpbmRleC5odG1sXCIpKTtcblxuICAgIFNldHRpbmdzV2luZG93Lm9uKFxuICAgICAgICBcInBhZ2UtdGl0bGUtdXBkYXRlZFwiLFxuICAgICAgICAoRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfVGl0bGU6IHN0cmluZywgX0V4cGxpY2l0U2V0OiBib29sZWFuKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGlwY01haW4ub24oXCJVcGRhdGVTZXR0aW5nc1wiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBVcGRhdGVTZXR0aW5ncygpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IFVwZGF0ZVNldHRpbmdzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcblxufTtcblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9