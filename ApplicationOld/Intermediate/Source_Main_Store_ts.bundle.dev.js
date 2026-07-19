"use strict";
exports.id = "Source_Main_Store_ts";
exports.ids = ["Source_Main_Store_ts"];
exports.modules = {

/***/ "./Source/Main/Store.ts"
/*!******************************!*\
  !*** ./Source/Main/Store.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Store.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetStore = exports.GetStore = void 0;
const Shared_1 = __webpack_require__(/*! ../Shared */ "./Source/Shared/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const electron_settings_1 = __importDefault(__webpack_require__(/*! electron-settings */ "../node_modules/electron-settings/dist/settings.js"));
const GetStore = async () => {
    const OutSettings = await electron_settings_1.default.get("Store");
    return (OutSettings !== null)
        ? OutSettings
        : (0, Shared_1.GetDefaultStore)();
};
exports.GetStore = GetStore;
const SetStore = async (NewStore) => {
    await electron_settings_1.default.set("Store", NewStore);
};
exports.SetStore = SetStore;
const InitializeStore = async () => {
    if (!electron_settings_1.default.hasSync("Store")) {
        electron_settings_1.default.set("Store", (0, Shared_1.GetDefaultStore)());
    }
};
(0, Initialize_1.RegisterInitializationFunction)("Store", InitializeStore);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fU3RvcmVfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7Ozs7O0FBRUgsa0ZBQXlEO0FBQ3pELGtIQUF5RTtBQUN6RSxnSkFBeUM7QUFFbEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxJQUFxQixFQUFFO0lBRWhELE1BQU0sV0FBVyxHQUFrQixNQUFNLDJCQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBa0IsQ0FBQztJQUNoRixPQUFPLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQztRQUN6QixDQUFDLENBQUMsV0FBVztRQUNiLENBQUMsQ0FBQyw0QkFBZSxHQUFFLENBQUM7QUFDNUIsQ0FBQyxDQUFDO0FBTlcsZ0JBQVEsWUFNbkI7QUFFSyxNQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsUUFBZ0IsRUFBaUIsRUFBRTtJQUU5RCxNQUFNLDJCQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFIVyxnQkFBUSxZQUduQjtBQUVGLE1BQU0sZUFBZSxHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUU5QyxJQUFJLENBQUMsMkJBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQzlCLENBQUM7UUFDRywyQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsNEJBQWUsR0FBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLCtDQUE4QixFQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vU3RvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSAgICAgIFN0b3JlLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgdHlwZSBGU3RvcmUsIEdldERlZmF1bHRTdG9yZSB9IGZyb20gXCIuLi9TaGFyZWRcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIjL0luaXRpYWxpemUvSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gXCJlbGVjdHJvbi1zZXR0aW5nc1wiO1xuXG5leHBvcnQgY29uc3QgR2V0U3RvcmUgPSBhc3luYyAoKTogUHJvbWlzZTxGU3RvcmU+ID0+XG57XG4gICAgY29uc3QgT3V0U2V0dGluZ3M6IEZTdG9yZSB8IG51bGwgPSBhd2FpdCBTZXR0aW5ncy5nZXQoXCJTdG9yZVwiKSBhcyBGU3RvcmUgfCBudWxsO1xuICAgIHJldHVybiAoT3V0U2V0dGluZ3MgIT09IG51bGwpXG4gICAgICAgID8gT3V0U2V0dGluZ3NcbiAgICAgICAgOiBHZXREZWZhdWx0U3RvcmUoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBTZXRTdG9yZSA9IGFzeW5jIChOZXdTdG9yZTogRlN0b3JlKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGF3YWl0IFNldHRpbmdzLnNldChcIlN0b3JlXCIsIE5ld1N0b3JlKTtcbn07XG5cbmNvbnN0IEluaXRpYWxpemVTdG9yZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgaWYgKCFTZXR0aW5ncy5oYXNTeW5jKFwiU3RvcmVcIikpXG4gICAge1xuICAgICAgICBTZXR0aW5ncy5zZXQoXCJTdG9yZVwiLCBHZXREZWZhdWx0U3RvcmUoKSk7XG4gICAgfVxufTtcblxuUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFwiU3RvcmVcIiwgSW5pdGlhbGl6ZVN0b3JlKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==