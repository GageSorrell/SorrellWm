"use strict";
exports.id = "Source_Main_WinEvent_ts";
exports.ids = ["Source_Main_WinEvent_ts"];
exports.modules = {

/***/ "./Source/Main/WinEvent.ts":
/*!*********************************!*\
  !*** ./Source/Main/WinEvent.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WinEvent: () => (/* binding */ WinEvent)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dispatcher */ "./Source/Main/Dispatcher.ts");
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Tree */ "./Source/Main/Tree.ts");
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
/* File:      WinEvent.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */





const Log = (0,_Development__WEBPACK_IMPORTED_MODULE_4__.GetLogger)("WinEvent");
const WinEvent = new _Dispatcher__WEBPACK_IMPORTED_MODULE_2__.TDispatcher();
(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeWinEvents)();
const WindowInitialRect = new Map();
(0,_NodeIpc__WEBPACK_IMPORTED_MODULE_1__.Subscribe)("WinEvent", (...Arguments) => {
    const { Event, Handle, IdObject } = Arguments[0];
    const ResizeEvent = 32772;
    const MouseMoveEvent = 32779;
    /* eslint-disable-next-line @stylistic/max-len */
    /* (For now) prevent windows from being moved by dragging the cursor by moving tiled windows back to where they "should" be under SorrellWm. */
    const IsWindowEvent = IdObject === 0 && Handle !== undefined && (0,_Tree__WEBPACK_IMPORTED_MODULE_3__.IsWindowTiled)(Handle);
    if (IsWindowEvent) {
        const InitialBounds = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetWindowLocationAndSize)(Handle);
        if (Event === 10) // MoveSizeStart
         {
            WindowInitialRect.set(Handle.Handle, InitialBounds);
        }
        else if (Event === 11) // MoveSizeEnd
         {
            const InitialBounds = WindowInitialRect.get(Handle.Handle);
            if (InitialBounds !== undefined) {
                const FinalBounds = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetWindowLocationAndSize)(Handle);
                const WindowWasResizedByDragging = InitialBounds.Height === FinalBounds.Height &&
                    InitialBounds.Width === FinalBounds.Width;
                if (WindowWasResizedByDragging) {
                    Log("!! Window Was Resized By Dragging !!");
                    (0,_Tree__WEBPACK_IMPORTED_MODULE_3__.Publish)();
                }
            }
        }
    }
    // if (Event !== MouseMoveEvent)
    // {
    //     Log(`WinEvent Event value is ${ Event }.`);
    // }
});


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luRXZlbnRfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBR3lHO0FBQ3RFO0FBQ0s7QUFDSztBQUNOO0FBRTFDLE1BQU0sR0FBRyxHQUFHLHVEQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFM0IsTUFBTSxRQUFRLEdBQTJCLElBQUksb0RBQVcsRUFBYSxDQUFDO0FBRTdFLHVFQUFtQixFQUFFLENBQUM7QUFFdEIsTUFBTSxpQkFBaUIsR0FBc0IsSUFBSSxHQUFHLEVBQWdCLENBQUM7QUFFckUsbURBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLFNBQXlCLEVBQVEsRUFBRTtJQUV6RCxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBcUIsU0FBUyxDQUFDLENBQUMsQ0FBcUIsQ0FBQztJQUN2RixNQUFNLFdBQVcsR0FBVyxLQUFLLENBQUM7SUFDbEMsTUFBTSxjQUFjLEdBQVcsS0FBSyxDQUFDO0lBQ3JDLGlEQUFpRDtJQUNqRCwrSUFBK0k7SUFDL0ksTUFBTSxhQUFhLEdBQVksUUFBUSxLQUFLLENBQUMsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLG9EQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0YsSUFBSSxhQUFhLEVBQ2pCLENBQUM7UUFDRyxNQUFNLGFBQWEsR0FBUyw0RUFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsZ0JBQWdCO1NBQ2xDLENBQUM7WUFDRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN4RCxDQUFDO2FBQ0ksSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLGNBQWM7U0FDckMsQ0FBQztZQUNHLE1BQU0sYUFBYSxHQUFxQixpQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdFLElBQUksYUFBYSxLQUFLLFNBQVMsRUFDL0IsQ0FBQztnQkFDRyxNQUFNLFdBQVcsR0FBUyw0RUFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0QsTUFBTSwwQkFBMEIsR0FDNUIsYUFBYSxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsTUFBTTtvQkFDM0MsYUFBYSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsS0FBSyxDQUFDO2dCQUU5QyxJQUFJLDBCQUEwQixFQUM5QixDQUFDO29CQUNHLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO29CQUM1Qyw4Q0FBTyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELGdDQUFnQztJQUNoQyxJQUFJO0lBQ0osa0RBQWtEO0lBQ2xELElBQUk7QUFDUixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL1dpbkV2ZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgV2luRXZlbnQudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZXaW5FdmVudFBheWxvYWQgfSBmcm9tIFwiLi9XaW5FdmVudC5UeXBlc1wiO1xuaW1wb3J0IHsgR2V0V2luZG93TG9jYXRpb25BbmRTaXplLCBJbml0aWFsaXplV2luRXZlbnRzLCB0eXBlIEZCb3gsIHR5cGUgSFdpbmRvdyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyIH0gZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuaW1wb3J0IHsgSXNXaW5kb3dUaWxlZCwgUHVibGlzaCB9IGZyb20gXCIuL1RyZWVcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG5cbmNvbnN0IExvZyA9IEdldExvZ2dlcihcIldpbkV2ZW50XCIpO1xuXG5leHBvcnQgY29uc3QgV2luRXZlbnQ6IFREaXNwYXRjaGVyPHVuZGVmaW5lZD4gPSBuZXcgVERpc3BhdGNoZXI8dW5kZWZpbmVkPigpO1xuXG5Jbml0aWFsaXplV2luRXZlbnRzKCk7XG5cbmNvbnN0IFdpbmRvd0luaXRpYWxSZWN0OiBNYXA8c3RyaW5nLCBGQm94PiA9IG5ldyBNYXA8c3RyaW5nLCBGQm94PigpO1xuXG5TdWJzY3JpYmUoXCJXaW5FdmVudFwiLCAoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbntcbiAgICBjb25zdCB7IEV2ZW50LCBIYW5kbGUsIElkT2JqZWN0IH06IEZXaW5FdmVudFBheWxvYWQgPSBBcmd1bWVudHNbMF0gYXMgRldpbkV2ZW50UGF5bG9hZDtcbiAgICBjb25zdCBSZXNpemVFdmVudDogbnVtYmVyID0gMzI3NzI7XG4gICAgY29uc3QgTW91c2VNb3ZlRXZlbnQ6IG51bWJlciA9IDMyNzc5O1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAvKiAoRm9yIG5vdykgcHJldmVudCB3aW5kb3dzIGZyb20gYmVpbmcgbW92ZWQgYnkgZHJhZ2dpbmcgdGhlIGN1cnNvciBieSBtb3ZpbmcgdGlsZWQgd2luZG93cyBiYWNrIHRvIHdoZXJlIHRoZXkgXCJzaG91bGRcIiBiZSB1bmRlciBTb3JyZWxsV20uICovXG4gICAgY29uc3QgSXNXaW5kb3dFdmVudDogYm9vbGVhbiA9IElkT2JqZWN0ID09PSAwICYmIEhhbmRsZSAhPT0gdW5kZWZpbmVkICYmIElzV2luZG93VGlsZWQoSGFuZGxlKTtcbiAgICBpZiAoSXNXaW5kb3dFdmVudClcbiAgICB7XG4gICAgICAgIGNvbnN0IEluaXRpYWxCb3VuZHM6IEZCb3ggPSBHZXRXaW5kb3dMb2NhdGlvbkFuZFNpemUoSGFuZGxlKTtcbiAgICAgICAgaWYgKEV2ZW50ID09PSAxMCkgLy8gTW92ZVNpemVTdGFydFxuICAgICAgICB7XG4gICAgICAgICAgICBXaW5kb3dJbml0aWFsUmVjdC5zZXQoSGFuZGxlLkhhbmRsZSwgSW5pdGlhbEJvdW5kcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoRXZlbnQgPT09IDExKSAvLyBNb3ZlU2l6ZUVuZFxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBJbml0aWFsQm91bmRzOiBGQm94IHwgdW5kZWZpbmVkID0gV2luZG93SW5pdGlhbFJlY3QuZ2V0KEhhbmRsZS5IYW5kbGUpO1xuICAgICAgICAgICAgaWYgKEluaXRpYWxCb3VuZHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBGaW5hbEJvdW5kczogRkJveCA9IEdldFdpbmRvd0xvY2F0aW9uQW5kU2l6ZShIYW5kbGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IFdpbmRvd1dhc1Jlc2l6ZWRCeURyYWdnaW5nOiBib29sZWFuID1cbiAgICAgICAgICAgICAgICAgICAgSW5pdGlhbEJvdW5kcy5IZWlnaHQgPT09IEZpbmFsQm91bmRzLkhlaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICBJbml0aWFsQm91bmRzLldpZHRoID09PSBGaW5hbEJvdW5kcy5XaWR0aDtcblxuICAgICAgICAgICAgICAgIGlmIChXaW5kb3dXYXNSZXNpemVkQnlEcmFnZ2luZylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIExvZyhcIiEhIFdpbmRvdyBXYXMgUmVzaXplZCBCeSBEcmFnZ2luZyAhIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgUHVibGlzaCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChFdmVudCAhPT0gTW91c2VNb3ZlRXZlbnQpXG4gICAgLy8ge1xuICAgIC8vICAgICBMb2coYFdpbkV2ZW50IEV2ZW50IHZhbHVlIGlzICR7IEV2ZW50IH0uYCk7XG4gICAgLy8gfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=