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



const GetIconPath = (Icon) => {
    const LightDarkMode = electron__WEBPACK_IMPORTED_MODULE_2__.nativeTheme.shouldUseDarkColors
        ? "Dark"
        : "Light";
    const IconFileName = Icon + LightDarkMode + ".png";
    return path__WEBPACK_IMPORTED_MODULE_0__.join((0,_Paths__WEBPACK_IMPORTED_MODULE_1__.GetPaths)().Resource, IconFileName);
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
    Tray.Ref = new electron__WEBPACK_IMPORTED_MODULE_0__.Tray((0,_Icon__WEBPACK_IMPORTED_MODULE_2__.GetIconPath)("Brand"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fQ29yZV9UcmF5X3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBRTBCO0FBRU07QUFDSTtBQUVoQyxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQVcsRUFBVSxFQUFFO0lBRS9DLE1BQU0sYUFBYSxHQUFxQixpREFBVyxDQUFDLG1CQUFtQjtRQUNuRSxDQUFDLENBQUMsTUFBTTtRQUNSLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFFZCxNQUFNLFlBQVksR0FBVyxJQUFJLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQztJQUUzRCxPQUFPLHNDQUFTLENBQUMsZ0RBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJGOzs7O0dBSUc7QUFFK0Q7QUFDMUI7QUFFSDtBQUNLO0FBRTFDLE1BQU0sSUFBSSxHQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBRXZDLE1BQU0sUUFBUSxHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUV2QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksMENBQVksQ0FBQyxrREFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFbEQsTUFBTSxXQUFXLEdBQVMsMENBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUM3QztZQUNJLEtBQUssRUFBRSxtREFBWTtZQUNuQixLQUFLLEVBQUUsVUFBVTtZQUNqQixJQUFJLEVBQUUsUUFBUTtTQUNqQjtRQUNEO1lBQ0ksS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLHlDQUFHLENBQUMsSUFBSSxFQUFFO1lBQ3ZCLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLFFBQVE7U0FDakI7S0FDSixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxpREFBUSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYseUNBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQ3BDL0I7Ozs7R0FJRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKSDs7OztHQUlHO0FBRTBCO0FBQzBCO0FBQ0Q7QUFDZDtBQUV4QyxJQUFJLGNBQWMsR0FBOEIsU0FBUyxDQUFDO0FBRW5ELE1BQU0sWUFBWSxHQUFHLEdBQVMsRUFBRTtJQUVuQyxJQUFJLFlBQVksR0FBRyxLQUFLLElBQUksRUFBRTtJQUc5QixDQUFDLENBQUM7SUFFRixJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQ2hDLENBQUM7UUFDRyxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsR0FBRyxtRUFBbUIsQ0FBQztZQUNqRSxlQUFlLEVBQUUsSUFBSTtZQUNyQixrQkFBa0IsRUFBRSxNQUFNO1lBQzFCLEtBQUssRUFBRSxJQUFJO1lBQ1gsTUFBTSxFQUFFLEdBQUc7WUFDWCxJQUFJLEVBQUUsc0NBQVMsQ0FBQyxxREFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQztZQUNwRSxXQUFXLEVBQUUsSUFBSTtZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLElBQUksRUFBRSxJQUFJO1lBQ1YsV0FBVyxFQUFFLEtBQUs7WUFDbEIsS0FBSyxFQUFFLG9CQUFvQjtZQUMzQixhQUFhLEVBQUUsU0FBUztZQUN4QixXQUFXLEVBQUUsSUFBSTtZQUNqQixLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztRQUVILGNBQWMsR0FBRyxNQUFNLENBQUM7UUFDeEIsWUFBWSxHQUFHLGNBQWMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU3Qiw2Q0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFzQixFQUFRLEVBQUU7UUFFekQsY0FBYyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBRUgsWUFBWSxFQUFFLENBQUM7SUFFZixjQUFjLENBQUMsRUFBRSxDQUNiLG9CQUFvQixFQUNwQixDQUFDLEtBQXFCLEVBQUUsTUFBYyxFQUFFLFlBQXFCLEVBQVEsRUFBRTtRQUVuRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUNKLENBQUM7SUFFRiw2Q0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQXNCLEVBQUUsR0FBRyxVQUEwQixFQUFRLEVBQUU7UUFFekYsY0FBYyxFQUFFLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFSyxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQW1CLEVBQUU7QUFHeEQsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEVGOzs7O0dBSUc7QUFFa0M7QUFDVjtBQUNNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9JY29uLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvVHJheS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9TZXR0aW5ncy9TZXR0aW5ncy5UeXBlcy50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9TZXR0aW5ncy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9TZXR0aW5ncy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBGaWxlOiAgICAgIEljb24udHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEZJY29uIH0gZnJvbSBcIi4vSWNvbi5UeXBlc1wiO1xuaW1wb3J0IHsgR2V0UGF0aHMgfSBmcm9tIFwiLi9QYXRoc1wiO1xuaW1wb3J0IHsgbmF0aXZlVGhlbWUgfSBmcm9tIFwiZWxlY3Ryb25cIjtcblxuZXhwb3J0IGNvbnN0IEdldEljb25QYXRoID0gKEljb246IEZJY29uKTogc3RyaW5nID0+XG57XG4gICAgY29uc3QgTGlnaHREYXJrTW9kZTogXCJMaWdodFwiIHwgXCJEYXJrXCIgPSBuYXRpdmVUaGVtZS5zaG91bGRVc2VEYXJrQ29sb3JzXG4gICAgICAgID8gXCJEYXJrXCJcbiAgICAgICAgOiBcIkxpZ2h0XCI7XG5cbiAgICBjb25zdCBJY29uRmlsZU5hbWU6IHN0cmluZyA9IEljb24gKyBMaWdodERhcmtNb2RlICsgXCIucG5nXCI7XG5cbiAgICByZXR1cm4gUGF0aC5qb2luKEdldFBhdGhzKCkuUmVzb3VyY2UsIEljb25GaWxlTmFtZSk7XG59O1xuIiwiLyogRmlsZTogICAgICBUcmF5LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgVHJheSBhcyBFbGVjdHJvblRyYXksIE1lbnUsIGFwcCBhcyBBcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IEFjdGl2YXRlIH0gZnJvbSBcIiMvTWFpbldpbmRvd1wiO1xuaW1wb3J0IHR5cGUgeyBGVHJheSB9IGZyb20gXCIuL1RyYXkuVHlwZXNcIjtcbmltcG9ydCB7IEdldEljb25QYXRoIH0gZnJvbSBcIi4vSWNvblwiO1xuaW1wb3J0IHsgT3BlblNldHRpbmdzIH0gZnJvbSBcIiMvU2V0dGluZ3NcIjtcblxuY29uc3QgVHJheTogRlRyYXkgPSB7IFJlZjogdW5kZWZpbmVkIH07XG5cbmNvbnN0IE1ha2VUcmF5ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBUcmF5LlJlZiA9IG5ldyBFbGVjdHJvblRyYXkoR2V0SWNvblBhdGgoXCJCcmFuZFwiKSk7XG5cbiAgICBjb25zdCBDb250ZXh0TWVudTogTWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAgICB7XG4gICAgICAgICAgICBjbGljazogT3BlblNldHRpbmdzLFxuICAgICAgICAgICAgbGFiZWw6IFwiU2V0dGluZ3NcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm9ybWFsXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgY2xpY2s6ICgpID0+IEFwcC5leGl0KCksXG4gICAgICAgICAgICBsYWJlbDogXCJFeGl0XCIsXG4gICAgICAgICAgICB0eXBlOiBcIm5vcm1hbFwiXG4gICAgICAgIH1cbiAgICBdKTtcblxuICAgIFRyYXkuUmVmLnNldFRvb2xUaXAoXCJTb3JyZWxsV20gdjAuMC4xXFxuVXAgdG8gZGF0ZVwiKTtcbiAgICBUcmF5LlJlZi5zZXRDb250ZXh0TWVudShDb250ZXh0TWVudSk7XG4gICAgVHJheS5SZWYuYWRkTGlzdGVuZXIoXCJjbGlja1wiLCBBY3RpdmF0ZSk7XG59O1xuXG5BcHAud2hlblJlYWR5KCkudGhlbihNYWtlVHJheSk7XG4iLCIvKiBGaWxlOiAgICAgIFNldHRpbmdzLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgRlRlbXAgPSBcIlwiO1xuIiwiLyogRmlsZTogICAgICBTZXR0aW5ncy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHR5cGUgQnJvd3NlcldpbmRvdywgaXBjTWFpbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgQ3JlYXRlQnJvd3NlcldpbmRvdyB9IGZyb20gXCIjL0Jyb3dzZXJXaW5kb3dcIjtcbmltcG9ydCB7IEdldFBhdGhzIH0gZnJvbSBcIiMvQ29yZS9QYXRoc1wiO1xuXG5sZXQgU2V0dGluZ3NXaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjb25zdCBPcGVuU2V0dGluZ3MgPSAoKTogdm9pZCA9Plxue1xuICAgIGxldCBMb2FkRnJvbnRlbmQgPSBhc3luYyAoKSA9PlxuICAgIHtcblxuICAgIH07XG5cbiAgICBpZiAoU2V0dGluZ3NXaW5kb3cgPT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IHsgV2luZG93LCBMb2FkRnJvbnRlbmQ6IEluTG9hZEZyb250ZW5kIH0gPSBDcmVhdGVCcm93c2VyV2luZG93KHtcbiAgICAgICAgICAgIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tncm91bmRNYXRlcmlhbDogXCJtaWNhXCIsXG4gICAgICAgICAgICBmcmFtZTogdHJ1ZSxcbiAgICAgICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICAgICAgaWNvbjogUGF0aC5qb2luKEdldFBhdGhzKCkuUmVzb3VyY2UsIFwiU2V0dGluZ3NcIiwgXCJTZXR0aW5nc0Rhcmsuc3ZnXCIpLFxuICAgICAgICAgICAgbWF4aW1pemFibGU6IHRydWUsXG4gICAgICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgc2tpcFRhc2tiYXI6IGZhbHNlLFxuICAgICAgICAgICAgdGl0bGU6IFwiU29ycmVsbFdtIFNldHRpbmdzXCIsXG4gICAgICAgICAgICB0aXRsZUJhclN0eWxlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgd2lkdGg6IDEyMDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgU2V0dGluZ3NXaW5kb3cgPSBXaW5kb3c7XG4gICAgICAgIExvYWRGcm9udGVuZCA9IEluTG9hZEZyb250ZW5kO1xuICAgIH1cblxuICAgIFNldHRpbmdzV2luZG93LnNldE1lbnUobnVsbCk7XG5cbiAgICBpcGNNYWluLm9uKFwiUmVhZHlGb3JSb3V0ZVwiLCAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFNldHRpbmdzV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJTZXR0aW5nc1wiKTtcbiAgICB9KTtcblxuICAgIExvYWRGcm9udGVuZCgpO1xuXG4gICAgU2V0dGluZ3NXaW5kb3cub24oXG4gICAgICAgIFwicGFnZS10aXRsZS11cGRhdGVkXCIsXG4gICAgICAgIChFdmVudDogRWxlY3Ryb24uRXZlbnQsIF9UaXRsZTogc3RyaW5nLCBfRXhwbGljaXRTZXQ6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgaXBjTWFpbi5vbihcIlVwZGF0ZVNldHRpbmdzXCIsIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFVwZGF0ZVNldHRpbmdzKCk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgVXBkYXRlU2V0dGluZ3MgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuXG59O1xuXG4iLCIvKiBGaWxlOiAgICAgIGluZGV4LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vSW5pdGlhbGl6ZVNldHRpbmdzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TZXR0aW5nc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU2V0dGluZ3MuVHlwZXNcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==