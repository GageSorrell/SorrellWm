"use strict";
exports.id = "Source_Main_Tray_InitializeTray_ts";
exports.ids = ["Source_Main_Tray_InitializeTray_ts"];
exports.modules = {

/***/ "./Source/Main/Tray/InitializeTray.ts"
/*!********************************************!*\
  !*** ./Source/Main/Tray/InitializeTray.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Tray.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Tray_Types_1 = __webpack_require__(/*! ./Tray.Types */ "./Source/Main/Tray/Tray.Types.ts");
const Miscellaneous_1 = __webpack_require__(/*! ../Miscellaneous */ "./Source/Main/Miscellaneous/index.ts");
const Tray_1 = __webpack_require__(/*! ./Tray */ "./Source/Main/Tray/Tray.ts");
const Settings_1 = __webpack_require__(/*! #/Window/Settings */ "./Source/Main/Window/Settings/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const InitializeTray = async () => {
    const Tray = (0, Tray_1.InitializeTrayValue)(new Tray_Types_1.FTray(await (0, Miscellaneous_1.GetIconPath)("Brand", "PNG")));
    const ContextMenu = electron_1.Menu.buildFromTemplate([
        {
            click: Settings_1.OpenSettings,
            label: "Settings",
            type: "normal"
        },
        {
            /**
             * @TODO Replace this with launching a window to confirm;
             * make the appearance of this confirmation window optional
             * via a setting.
             */
            click: () => electron_1.app.exit(),
            label: "Exit",
            type: "normal"
        }
    ]);
    Tray.setToolTip("SorrellWm v0.0.1\nUp to date");
    Tray.setContextMenu(ContextMenu);
    Tray.addListener("click", Settings_1.OpenSettings);
};
(0, Initialize_1.RegisterInitializationFunction)("Tray", InitializeTray);


/***/ },

/***/ "./Source/Main/Tray/Tray.Types.ts"
/*!****************************************!*\
  !*** ./Source/Main/Tray/Tray.Types.ts ***!
  \****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Tray.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FTray = void 0;
const electron_1 = __webpack_require__(/*! electron */ "electron");
class FTray extends electron_1.Tray {
}
exports.FTray = FTray;
;


/***/ },

/***/ "./Source/Main/Tray/Tray.ts"
/*!**********************************!*\
  !*** ./Source/Main/Tray/Tray.ts ***!
  \**********************************/
(__unused_webpack_module, exports) {


/**
 * @file      Tray.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetTray = exports.InitializeTrayValue = void 0;
let Tray = undefined;
const InitializeTrayValue = (In) => {
    Tray = In;
    return In;
};
exports.InitializeTrayValue = InitializeTrayValue;
const GetTray = () => {
    /* Since this function will never be called before the `InitializeTray` *
     * side effect is loaded, we can safely cast away `undefined`.          */
    return Tray;
};
exports.GetTray = GetTray;


/***/ },

/***/ "./Source/Main/Window/Settings/index.ts"
/*!**********************************************!*\
  !*** ./Source/Main/Window/Settings/index.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./SettingsWindow */ "./Source/Main/Window/Settings/SettingsWindow.ts"), exports);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fVHJheV9Jbml0aWFsaXplVHJheV90cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7OztHQUtHOztBQUVILG1FQUE0QztBQUM1QyxpR0FBcUM7QUFDckMsNEdBQStDO0FBQy9DLCtFQUE2QztBQUM3QywwR0FBaUQ7QUFDakQsa0hBQXlFO0FBRXpFLE1BQU0sY0FBYyxHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUU3QyxNQUFNLElBQUksR0FBVSw4QkFBbUIsRUFBQyxJQUFJLGtCQUFLLENBQUMsTUFBTSwrQkFBVyxFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsTUFBTSxXQUFXLEdBQVMsZUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQzdDO1lBQ0ksS0FBSyxFQUFFLHVCQUFZO1lBQ25CLEtBQUssRUFBRSxVQUFVO1lBQ2pCLElBQUksRUFBRSxRQUFRO1NBQ2pCO1FBQ0Q7WUFDSTs7OztlQUlHO1lBQ0gsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLGNBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxFQUFFLE1BQU07WUFDYixJQUFJLEVBQUUsUUFBUTtTQUNqQjtLQUNKLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLHVCQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUM7QUFFRiwrQ0FBOEIsRUFBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQ3pDdkQ7Ozs7O0dBS0c7OztBQUVILG1FQUFnQztBQUVoQyxNQUFhLEtBQU0sU0FBUSxlQUFJO0NBQUk7QUFBbkMsc0JBQW1DO0FBQUEsQ0FBQzs7Ozs7Ozs7Ozs7O0FDVHBDOzs7OztHQUtHOzs7QUFJSCxJQUFJLElBQUksR0FBc0IsU0FBUyxDQUFDO0FBRWpDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxFQUFTLEVBQVMsRUFBRTtJQUVwRCxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ1YsT0FBTyxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUM7QUFKVywyQkFBbUIsdUJBSTlCO0FBRUssTUFBTSxPQUFPLEdBQUcsR0FBVSxFQUFFO0lBRS9COzhFQUMwRTtJQUMxRSxPQUFPLElBQWEsQ0FBQztBQUN6QixDQUFDLENBQUM7QUFMVyxlQUFPLFdBS2xCOzs7Ozs7Ozs7Ozs7QUN0QkY7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzSEFBaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1RyYXkvSW5pdGlhbGl6ZVRyYXkudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9UcmF5L1RyYXkuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9UcmF5L1RyYXkudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9XaW5kb3cvU2V0dGluZ3MvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSAgICAgIFRyYXkudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBhcHAgYXMgQXBwLCBNZW51IH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBGVHJheSB9IGZyb20gXCIuL1RyYXkuVHlwZXNcIjtcbmltcG9ydCB7IEdldEljb25QYXRoIH0gZnJvbSBcIi4uL01pc2NlbGxhbmVvdXNcIjtcbmltcG9ydCB7IEluaXRpYWxpemVUcmF5VmFsdWUgfSBmcm9tIFwiLi9UcmF5XCI7XG5pbXBvcnQgeyBPcGVuU2V0dGluZ3MgfSBmcm9tIFwiIy9XaW5kb3cvU2V0dGluZ3NcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIjL0luaXRpYWxpemUvSW5pdGlhbGl6ZVwiO1xuXG5jb25zdCBJbml0aWFsaXplVHJheSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgY29uc3QgVHJheTogRlRyYXkgPSBJbml0aWFsaXplVHJheVZhbHVlKG5ldyBGVHJheShhd2FpdCBHZXRJY29uUGF0aChcIkJyYW5kXCIsIFwiUE5HXCIpKSk7XG5cbiAgICBjb25zdCBDb250ZXh0TWVudTogTWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAgICB7XG4gICAgICAgICAgICBjbGljazogT3BlblNldHRpbmdzLFxuICAgICAgICAgICAgbGFiZWw6IFwiU2V0dGluZ3NcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm9ybWFsXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAVE9ETyBSZXBsYWNlIHRoaXMgd2l0aCBsYXVuY2hpbmcgYSB3aW5kb3cgdG8gY29uZmlybTtcbiAgICAgICAgICAgICAqIG1ha2UgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyBjb25maXJtYXRpb24gd2luZG93IG9wdGlvbmFsXG4gICAgICAgICAgICAgKiB2aWEgYSBzZXR0aW5nLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjbGljazogKCkgPT4gQXBwLmV4aXQoKSxcbiAgICAgICAgICAgIGxhYmVsOiBcIkV4aXRcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm9ybWFsXCJcbiAgICAgICAgfVxuICAgIF0pO1xuXG4gICAgVHJheS5zZXRUb29sVGlwKFwiU29ycmVsbFdtIHYwLjAuMVxcblVwIHRvIGRhdGVcIik7XG4gICAgVHJheS5zZXRDb250ZXh0TWVudShDb250ZXh0TWVudSk7XG4gICAgVHJheS5hZGRMaXN0ZW5lcihcImNsaWNrXCIsIE9wZW5TZXR0aW5ncyk7XG59O1xuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJUcmF5XCIsIEluaXRpYWxpemVUcmF5KTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBUcmF5LlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgVHJheSB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5leHBvcnQgY2xhc3MgRlRyYXkgZXh0ZW5kcyBUcmF5IHsgfTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBUcmF5LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGVHJheSB9IGZyb20gXCIuL1RyYXkuVHlwZXNcIjtcblxubGV0IFRyYXk6IEZUcmF5IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5leHBvcnQgY29uc3QgSW5pdGlhbGl6ZVRyYXlWYWx1ZSA9IChJbjogRlRyYXkpOiBGVHJheSA9Plxue1xuICAgIFRyYXkgPSBJbjtcbiAgICByZXR1cm4gSW47XG59O1xuXG5leHBvcnQgY29uc3QgR2V0VHJheSA9ICgpOiBGVHJheSA9Plxue1xuICAgIC8qIFNpbmNlIHRoaXMgZnVuY3Rpb24gd2lsbCBuZXZlciBiZSBjYWxsZWQgYmVmb3JlIHRoZSBgSW5pdGlhbGl6ZVRyYXlgICpcbiAgICAgKiBzaWRlIGVmZmVjdCBpcyBsb2FkZWQsIHdlIGNhbiBzYWZlbHkgY2FzdCBhd2F5IGB1bmRlZmluZWRgLiAgICAgICAgICAqL1xuICAgIHJldHVybiBUcmF5IGFzIEZUcmF5O1xufTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBpbmRleC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzV2luZG93XCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=