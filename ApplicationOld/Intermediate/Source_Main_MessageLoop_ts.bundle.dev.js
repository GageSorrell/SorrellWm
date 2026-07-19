"use strict";
exports.id = "Source_Main_MessageLoop_ts";
exports.ids = ["Source_Main_MessageLoop_ts"];
exports.modules = {

/***/ "./Source/Main/MessageLoop.ts"
/*!************************************!*\
  !*** ./Source/Main/MessageLoop.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      MessageLoop.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** This file must be side-effect imported by `Main`. */
const windows_1 = __webpack_require__(/*! @sorrellwm/windows */ "@sorrellwm/windows");
const RunInitializeMessageLoop = () => {
    (0, windows_1.InitializeMessageLoop)(() => {
    });
};
RunInitializeMessageLoop();


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fTWVzc2FnZUxvb3BfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHOztBQUVILHdEQUF3RDtBQUV4RCxzRkFBMkQ7QUFFM0QsTUFBTSx3QkFBd0IsR0FBRyxHQUFTLEVBQUU7SUFFeEMsbUNBQXFCLEVBQUMsR0FBRyxFQUFFO0lBRzNCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRUYsd0JBQXdCLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9NYWluL01lc3NhZ2VMb29wLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgTWVzc2FnZUxvb3AudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG4vKiogVGhpcyBmaWxlIG11c3QgYmUgc2lkZS1lZmZlY3QgaW1wb3J0ZWQgYnkgYE1haW5gLiAqL1xuXG5pbXBvcnQgeyBJbml0aWFsaXplTWVzc2FnZUxvb3AgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmNvbnN0IFJ1bkluaXRpYWxpemVNZXNzYWdlTG9vcCA9ICgpOiB2b2lkID0+XG57XG4gICAgSW5pdGlhbGl6ZU1lc3NhZ2VMb29wKCgpID0+XG4gICAge1xuXG4gICAgfSk7XG59O1xuXG5SdW5Jbml0aWFsaXplTWVzc2FnZUxvb3AoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==