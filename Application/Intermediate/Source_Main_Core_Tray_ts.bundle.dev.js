"use strict";
exports.id = "Source_Main_Core_Tray_ts";
exports.ids = ["Source_Main_Core_Tray_ts"];
exports.modules = {

/***/ "./Source/Main/Core/Icon.ts":
/*!**********************************!*\
  !*** ./Source/Main/Core/Icon.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetIconPath: () => (/* binding */ GetIconPath)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Paths__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Paths */ "./Source/Main/Core/Paths.ts");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* File:      Icon.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */



const GetIconPath = async (Icon) => {
    const LightDarkMode = electron__WEBPACK_IMPORTED_MODULE_2__.nativeTheme.shouldUseDarkColors
        ? "Dark"
        : "Light";
    const IconFileName = Icon + LightDarkMode + ".png";
    return path__WEBPACK_IMPORTED_MODULE_0__.join((0,_Paths__WEBPACK_IMPORTED_MODULE_1__.GetPaths)().Resource, "Icon", Icon, IconFileName);
};


/***/ }),

/***/ "./Source/Main/Core/Tray.ts":
/*!**********************************!*\
  !*** ./Source/Main/Core/Tray.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MainWindow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! #/MainWindow */ "./Source/Main/MainWindow.ts");
/* harmony import */ var _Icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Icon */ "./Source/Main/Core/Icon.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! #/Settings */ "./Source/Main/Settings/index.ts");
/* File:      Tray.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */




const Tray = { Ref: undefined };
const MakeTray = async () => {
    Tray.Ref = new electron__WEBPACK_IMPORTED_MODULE_0__.Tray(await (0,_Icon__WEBPACK_IMPORTED_MODULE_2__.GetIconPath)("Brand"));
    const ContextMenu = electron__WEBPACK_IMPORTED_MODULE_0__.Menu.buildFromTemplate([
        {
            click: _Settings__WEBPACK_IMPORTED_MODULE_3__.OpenSettings,
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
    Tray.Ref.addListener("click", _MainWindow__WEBPACK_IMPORTED_MODULE_1__.Activate);
};
electron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady().then(MakeTray);


/***/ }),

/***/ "./Source/Main/Settings/Settings.Types.ts":
/*!************************************************!*\
  !*** ./Source/Main/Settings/Settings.Types.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */



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
/* harmony import */ var _BrowserWindow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #/BrowserWindow */ "./Source/Main/BrowserWindow.ts");
/* harmony import */ var _Core_Paths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! #/Core/Paths */ "./Source/Main/Core/Paths.ts");
/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */




let SettingsWindow = undefined;
const OpenSettings = () => {
    let LoadFrontend = async () => {
    };
    if (SettingsWindow === undefined) {
        const { Window, LoadFrontend: InLoadFrontend } = (0,_BrowserWindow__WEBPACK_IMPORTED_MODULE_2__.CreateBrowserWindow)({
            autoHideMenuBar: true,
            backgroundMaterial: "mica",
            frame: true,
            height: 900,
            icon: path__WEBPACK_IMPORTED_MODULE_0__.join((0,_Core_Paths__WEBPACK_IMPORTED_MODULE_3__.GetPaths)().Resource, "Settings", "SettingsDark.svg"),
            maximizable: true,
            resizable: true,
            show: true,
            skipTaskbar: false,
            title: "SorrellWm Settings",
            titleBarStyle: "default",
            transparent: true,
            width: 1200
        });
        SettingsWindow = Window;
        LoadFrontend = InLoadFrontend;
    }
    SettingsWindow.setMenu(null);
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("ReadyForRoute", (_Event) => {
        SettingsWindow?.webContents.send("Navigate", "Settings");
    });
    LoadFrontend();
    SettingsWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
    });
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.on("UpdateSettings", (_Event, ..._Arguments) => {
        UpdateSettings();
    });
};
const UpdateSettings = async () => {
};


/***/ }),

/***/ "./Source/Main/Settings/index.ts":
/*!***************************************!*\
  !*** ./Source/Main/Settings/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OpenSettings: () => (/* reexport safe */ _Settings__WEBPACK_IMPORTED_MODULE_1__.OpenSettings),
/* harmony export */   UpdateSettings: () => (/* reexport safe */ _Settings__WEBPACK_IMPORTED_MODULE_1__.UpdateSettings)
/* harmony export */ });
/* harmony import */ var _InitializeSettings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InitializeSettings */ "./Source/Main/Settings/InitializeSettings.ts");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings */ "./Source/Main/Settings/Settings.ts");
/* harmony import */ var _Settings_Types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings.Types */ "./Source/Main/Settings/Settings.Types.ts");
/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */





/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fQ29yZV9UcmF5X3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBRTBCO0FBRU07QUFDSTtBQUVoQyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsSUFBVyxFQUFtQixFQUFFO0lBRTlELE1BQU0sYUFBYSxHQUFxQixpREFBVyxDQUFDLG1CQUFtQjtRQUNuRSxDQUFDLENBQUMsTUFBTTtRQUNSLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFFZCxNQUFNLFlBQVksR0FBVyxJQUFJLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQztJQUUzRCxPQUFPLHNDQUFTLENBQUMsZ0RBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3RFLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQkY7Ozs7R0FJRztBQUUrRDtBQUMxQjtBQUVIO0FBQ0s7QUFFMUMsTUFBTSxJQUFJLEdBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBRXZDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSwwQ0FBWSxDQUFDLE1BQU0sa0RBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXhELE1BQU0sV0FBVyxHQUFTLDBDQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDN0M7WUFDSSxLQUFLLEVBQUUsbURBQVk7WUFDbkIsS0FBSyxFQUFFLFVBQVU7WUFDakIsSUFBSSxFQUFFLFFBQVE7U0FDakI7UUFDRDtZQUNJLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyx5Q0FBRyxDQUFDLElBQUksRUFBRTtZQUN2QixLQUFLLEVBQUUsTUFBTTtZQUNiLElBQUksRUFBRSxRQUFRO1NBQ2pCO0tBQ0osQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsaURBQVEsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQztBQUVGLHlDQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUNwQy9COzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkg7Ozs7R0FJRztBQUUwQjtBQUMwQjtBQUNEO0FBQ2Q7QUFFeEMsSUFBSSxjQUFjLEdBQThCLFNBQVMsQ0FBQztBQUVuRCxNQUFNLFlBQVksR0FBRyxHQUFTLEVBQUU7SUFFbkMsSUFBSSxZQUFZLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFHOUIsQ0FBQyxDQUFDO0lBRUYsSUFBSSxjQUFjLEtBQUssU0FBUyxFQUNoQyxDQUFDO1FBQ0csTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLEdBQUcsbUVBQW1CLENBQUM7WUFDakUsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsTUFBTTtZQUMxQixLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxHQUFHO1lBQ1gsSUFBSSxFQUFFLHNDQUFTLENBQUMscURBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUM7WUFDcEUsV0FBVyxFQUFFLElBQUk7WUFDakIsU0FBUyxFQUFFLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSTtZQUNWLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsYUFBYSxFQUFFLFNBQVM7WUFDeEIsV0FBVyxFQUFFLElBQUk7WUFDakIsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7UUFFSCxjQUFjLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLFlBQVksR0FBRyxjQUFjLENBQUM7SUFDbEMsQ0FBQztJQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFN0IsNkNBQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBc0IsRUFBUSxFQUFFO1FBRXpELGNBQWMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQztJQUVILFlBQVksRUFBRSxDQUFDO0lBRWYsY0FBYyxDQUFDLEVBQUUsQ0FDYixvQkFBb0IsRUFDcEIsQ0FBQyxLQUFxQixFQUFFLE1BQWMsRUFBRSxZQUFxQixFQUFRLEVBQUU7UUFFbkUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FDSixDQUFDO0lBRUYsNkNBQU8sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFzQixFQUFFLEdBQUcsVUFBMEIsRUFBUSxFQUFFO1FBRXpGLGNBQWMsRUFBRSxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRUssTUFBTSxjQUFjLEdBQUcsS0FBSyxJQUFtQixFQUFFO0FBR3hELENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BFRjs7OztHQUlHO0FBRWtDO0FBQ1Y7QUFDTSIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvSWNvbi50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Db3JlL1RyYXkudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vU2V0dGluZ3MvU2V0dGluZ3MuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vU2V0dGluZ3MvU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vU2V0dGluZ3MvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRmlsZTogICAgICBJY29uLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBGSWNvbiB9IGZyb20gXCIuL0ljb24uVHlwZXNcIjtcbmltcG9ydCB7IEdldFBhdGhzIH0gZnJvbSBcIi4vUGF0aHNcIjtcbmltcG9ydCB7IG5hdGl2ZVRoZW1lIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5cbmV4cG9ydCBjb25zdCBHZXRJY29uUGF0aCA9IGFzeW5jIChJY29uOiBGSWNvbik6IFByb21pc2U8c3RyaW5nPiA9Plxue1xuICAgIGNvbnN0IExpZ2h0RGFya01vZGU6IFwiTGlnaHRcIiB8IFwiRGFya1wiID0gbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9yc1xuICAgICAgICA/IFwiRGFya1wiXG4gICAgICAgIDogXCJMaWdodFwiO1xuXG4gICAgY29uc3QgSWNvbkZpbGVOYW1lOiBzdHJpbmcgPSBJY29uICsgTGlnaHREYXJrTW9kZSArIFwiLnBuZ1wiO1xuXG4gICAgcmV0dXJuIFBhdGguam9pbihHZXRQYXRocygpLlJlc291cmNlLCBcIkljb25cIiwgSWNvbiwgSWNvbkZpbGVOYW1lKTtcbn07XG4iLCIvKiBGaWxlOiAgICAgIFRyYXkudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBhcHAgYXMgQXBwLCBUcmF5IGFzIEVsZWN0cm9uVHJheSwgTWVudSB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgQWN0aXZhdGUgfSBmcm9tIFwiIy9NYWluV2luZG93XCI7XG5pbXBvcnQgdHlwZSB7IEZUcmF5IH0gZnJvbSBcIi4vVHJheS5UeXBlc1wiO1xuaW1wb3J0IHsgR2V0SWNvblBhdGggfSBmcm9tIFwiLi9JY29uXCI7XG5pbXBvcnQgeyBPcGVuU2V0dGluZ3MgfSBmcm9tIFwiIy9TZXR0aW5nc1wiO1xuXG5jb25zdCBUcmF5OiBGVHJheSA9IHsgUmVmOiB1bmRlZmluZWQgfTtcblxuY29uc3QgTWFrZVRyYXkgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIFRyYXkuUmVmID0gbmV3IEVsZWN0cm9uVHJheShhd2FpdCBHZXRJY29uUGF0aChcIkJyYW5kXCIpKTtcblxuICAgIGNvbnN0IENvbnRleHRNZW51OiBNZW51ID0gTWVudS5idWlsZEZyb21UZW1wbGF0ZShbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsaWNrOiBPcGVuU2V0dGluZ3MsXG4gICAgICAgICAgICBsYWJlbDogXCJTZXR0aW5nc1wiLFxuICAgICAgICAgICAgdHlwZTogXCJub3JtYWxcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBjbGljazogKCkgPT4gQXBwLmV4aXQoKSxcbiAgICAgICAgICAgIGxhYmVsOiBcIkV4aXRcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm9ybWFsXCJcbiAgICAgICAgfVxuICAgIF0pO1xuXG4gICAgVHJheS5SZWYuc2V0VG9vbFRpcChcIlNvcnJlbGxXbSB2MC4wLjFcXG5VcCB0byBkYXRlXCIpO1xuICAgIFRyYXkuUmVmLnNldENvbnRleHRNZW51KENvbnRleHRNZW51KTtcbiAgICBUcmF5LlJlZi5hZGRMaXN0ZW5lcihcImNsaWNrXCIsIEFjdGl2YXRlKTtcbn07XG5cbkFwcC53aGVuUmVhZHkoKS50aGVuKE1ha2VUcmF5KTtcbiIsIi8qIEZpbGU6ICAgICAgU2V0dGluZ3MuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBGVGVtcCA9IFwiXCI7XG4iLCIvKiBGaWxlOiAgICAgIFNldHRpbmdzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgdHlwZSBCcm93c2VyV2luZG93LCBpcGNNYWluIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBDcmVhdGVCcm93c2VyV2luZG93IH0gZnJvbSBcIiMvQnJvd3NlcldpbmRvd1wiO1xuaW1wb3J0IHsgR2V0UGF0aHMgfSBmcm9tIFwiIy9Db3JlL1BhdGhzXCI7XG5cbmxldCBTZXR0aW5nc1dpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuZXhwb3J0IGNvbnN0IE9wZW5TZXR0aW5ncyA9ICgpOiB2b2lkID0+XG57XG4gICAgbGV0IExvYWRGcm9udGVuZCA9IGFzeW5jICgpID0+XG4gICAge1xuXG4gICAgfTtcblxuICAgIGlmIChTZXR0aW5nc1dpbmRvdyA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgeyBXaW5kb3csIExvYWRGcm9udGVuZDogSW5Mb2FkRnJvbnRlbmQgfSA9IENyZWF0ZUJyb3dzZXJXaW5kb3coe1xuICAgICAgICAgICAgYXV0b0hpZGVNZW51QmFyOiB0cnVlLFxuICAgICAgICAgICAgYmFja2dyb3VuZE1hdGVyaWFsOiBcIm1pY2FcIixcbiAgICAgICAgICAgIGZyYW1lOiB0cnVlLFxuICAgICAgICAgICAgaGVpZ2h0OiA5MDAsXG4gICAgICAgICAgICBpY29uOiBQYXRoLmpvaW4oR2V0UGF0aHMoKS5SZXNvdXJjZSwgXCJTZXR0aW5nc1wiLCBcIlNldHRpbmdzRGFyay5zdmdcIiksXG4gICAgICAgICAgICBtYXhpbWl6YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICBza2lwVGFza2JhcjogZmFsc2UsXG4gICAgICAgICAgICB0aXRsZTogXCJTb3JyZWxsV20gU2V0dGluZ3NcIixcbiAgICAgICAgICAgIHRpdGxlQmFyU3R5bGU6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICB3aWR0aDogMTIwMFxuICAgICAgICB9KTtcblxuICAgICAgICBTZXR0aW5nc1dpbmRvdyA9IFdpbmRvdztcbiAgICAgICAgTG9hZEZyb250ZW5kID0gSW5Mb2FkRnJvbnRlbmQ7XG4gICAgfVxuXG4gICAgU2V0dGluZ3NXaW5kb3cuc2V0TWVudShudWxsKTtcblxuICAgIGlwY01haW4ub24oXCJSZWFkeUZvclJvdXRlXCIsIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgU2V0dGluZ3NXaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJOYXZpZ2F0ZVwiLCBcIlNldHRpbmdzXCIpO1xuICAgIH0pO1xuXG4gICAgTG9hZEZyb250ZW5kKCk7XG5cbiAgICBTZXR0aW5nc1dpbmRvdy5vbihcbiAgICAgICAgXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIixcbiAgICAgICAgKEV2ZW50OiBFbGVjdHJvbi5FdmVudCwgX1RpdGxlOiBzdHJpbmcsIF9FeHBsaWNpdFNldDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpcGNNYWluLm9uKFwiVXBkYXRlU2V0dGluZ3NcIiwgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgVXBkYXRlU2V0dGluZ3MoKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBVcGRhdGVTZXR0aW5ncyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG5cbn07XG5cbiIsIi8qIEZpbGU6ICAgICAgaW5kZXgudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9Jbml0aWFsaXplU2V0dGluZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TZXR0aW5ncy5UeXBlc1wiO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9