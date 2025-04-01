"use strict";
exports.id = "Source_Main_RendererFunctions_Generated_ts";
exports.ids = ["Source_Main_RendererFunctions_Generated_ts"];
exports.modules = {

/***/ "./Source/Main/RendererFunctions.Generated.ts":
/*!****************************************************!*\
  !*** ./Source/Main/RendererFunctions.Generated.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__);
/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
/* AUTO-GENERATED FILE. */
/* eslint-disable */


electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle("GetFocusedWindow", () => {
    return Promise.resolve((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetFocusedWindow)());
});
electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle("GetIsLightMode", () => {
    return Promise.resolve((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetIsLightMode)());
});
electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle("GetThemeColor", () => {
    return Promise.resolve((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetThemeColor)());
});


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fUmVuZGVyZXJGdW5jdGlvbnNfR2VuZXJhdGVkX3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFFSCwwQkFBMEI7QUFFMUIsb0JBQW9CO0FBRWM7QUFDaUY7QUFFbkgsNkNBQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsR0FBcUIsRUFBRTtJQUV0RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsb0VBQWdCLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FBQyxDQUFDO0FBRUgsNkNBQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsR0FBcUIsRUFBRTtJQUVwRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0VBQWMsRUFBRSxDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFFSCw2Q0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsR0FBdUIsRUFBRTtJQUVyRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUVBQWEsRUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9SZW5kZXJlckZ1bmN0aW9ucy5HZW5lcmF0ZWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRmlsZTogICAgICBHZW5lcmF0ZWRUeXBlcy5kLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuLyogQVVUTy1HRU5FUkFURUQgRklMRS4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IHsgaXBjTWFpbiB9IGZyb20gXCJlbGVjdHJvblwiXG5pbXBvcnQgeyBHZXRGb2N1c2VkV2luZG93LCBHZXRJc0xpZ2h0TW9kZSwgR2V0VGhlbWVDb2xvciwgdHlwZSBIV2luZG93LCB0eXBlIEZIZXhDb2xvciB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcblxuaXBjTWFpbi5oYW5kbGUoXCJHZXRGb2N1c2VkV2luZG93XCIsICgpOiBQcm9taXNlPEhXaW5kb3c+ID0+XG57XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShHZXRGb2N1c2VkV2luZG93KCkpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwiR2V0SXNMaWdodE1vZGVcIiwgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT5cbntcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEdldElzTGlnaHRNb2RlKCkpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwiR2V0VGhlbWVDb2xvclwiLCAoKTogUHJvbWlzZTxGSGV4Q29sb3I+ID0+XG57XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShHZXRUaGVtZUNvbG9yKCkpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=