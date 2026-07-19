"use strict";
exports.id = "Source_Main_Settings_InitializeSettings_ts";
exports.ids = ["Source_Main_Settings_InitializeSettings_ts"];
exports.modules = {

/***/ "./Source/Main/Settings/InitializeSettings.ts"
/*!****************************************************!*\
  !*** ./Source/Main/Settings/InitializeSettings.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      InitializeSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __webpack_require__(/*! ../../Shared */ "./Source/Shared/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const electron_settings_1 = __importDefault(__webpack_require__(/*! electron-settings */ "../node_modules/electron-settings/dist/settings.js"));
const InitializeSettings = async () => {
    if (!electron_settings_1.default.hasSync("Settings")) {
        await electron_settings_1.default.set("Settings", JSON.stringify(Shared_1.DefaultSettings));
    }
};
(0, Initialize_1.RegisterInitializationFunction)("Settings", InitializeSettings);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fU2V0dGluZ3NfSW5pdGlhbGl6ZVNldHRpbmdzX3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0dBS0c7Ozs7O0FBRUgscUZBQStDO0FBQy9DLGtIQUF5RTtBQUN6RSxnSkFBeUM7QUFFekMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLElBQW1CLEVBQUU7SUFFakQsSUFBSSxDQUFDLDJCQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUNqQyxDQUFDO1FBQ0csTUFBTSwyQkFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyx3QkFBZSxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsK0NBQThCLEVBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1NldHRpbmdzL0luaXRpYWxpemVTZXR0aW5ncy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlICAgICAgSW5pdGlhbGl6ZVNldHRpbmdzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgRGVmYXVsdFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uIH0gZnJvbSBcIiMvSW5pdGlhbGl6ZS9Jbml0aWFsaXplXCI7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcImVsZWN0cm9uLXNldHRpbmdzXCI7XG5cbmNvbnN0IEluaXRpYWxpemVTZXR0aW5ncyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgaWYgKCFTZXR0aW5ncy5oYXNTeW5jKFwiU2V0dGluZ3NcIikpXG4gICAge1xuICAgICAgICBhd2FpdCBTZXR0aW5ncy5zZXQoXCJTZXR0aW5nc1wiLCBKU09OLnN0cmluZ2lmeShEZWZhdWx0U2V0dGluZ3MpKTtcbiAgICB9XG59O1xuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJTZXR0aW5nc1wiLCBJbml0aWFsaXplU2V0dGluZ3MpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9