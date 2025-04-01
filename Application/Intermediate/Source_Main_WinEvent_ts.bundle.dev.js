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
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Dispatcher */ "./Source/Main/Dispatcher.ts");
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tree */ "./Source/Main/Tree.ts");
/* File:      WinEvent.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */





const WinEvent = new _Dispatcher__WEBPACK_IMPORTED_MODULE_3__.TDispatcher();
(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeWinEvents)();
const WindowInitialRect = new Map();
(0,_NodeIpc__WEBPACK_IMPORTED_MODULE_2__.Subscribe)("WinEvent", (...Arguments) => {
    const { Event, Handle, IdObject } = Arguments[0];
    const ResizeEvent = 32772;
    const MouseMoveEvent = 32779;
    /* eslint-disable-next-line @stylistic/max-len */
    /* (For now) prevent windows from being moved by dragging the cursor by moving tiled windows back to where they "should" be under SorrellWm. */
    const IsWindowEvent = IdObject === 0 && Handle !== undefined && (0,_Tree__WEBPACK_IMPORTED_MODULE_4__.IsWindowTiled)(Handle);
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
                    (0,_Development__WEBPACK_IMPORTED_MODULE_1__.Log)("!! Window Was Resized By Dragging !!");
                    (0,_Tree__WEBPACK_IMPORTED_MODULE_4__.Publish)();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luRXZlbnRfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBR3lHO0FBQ3hFO0FBQ0U7QUFDSztBQUNLO0FBRXpDLE1BQU0sUUFBUSxHQUEyQixJQUFJLG9EQUFXLEVBQWEsQ0FBQztBQUU3RSx1RUFBbUIsRUFBRSxDQUFDO0FBRXRCLE1BQU0saUJBQWlCLEdBQXNCLElBQUksR0FBRyxFQUFnQixDQUFDO0FBRXJFLG1EQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxTQUF5QixFQUFRLEVBQUU7SUFFekQsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQXFCLFNBQVMsQ0FBQyxDQUFDLENBQXFCLENBQUM7SUFDdkYsTUFBTSxXQUFXLEdBQVcsS0FBSyxDQUFDO0lBQ2xDLE1BQU0sY0FBYyxHQUFXLEtBQUssQ0FBQztJQUNyQyxpREFBaUQ7SUFDakQsK0lBQStJO0lBQy9JLE1BQU0sYUFBYSxHQUFZLFFBQVEsS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxvREFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9GLElBQUksYUFBYSxFQUNqQixDQUFDO1FBQ0csTUFBTSxhQUFhLEdBQVMsNEVBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLGdCQUFnQjtTQUNsQyxDQUFDO1lBQ0csaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDeEQsQ0FBQzthQUNJLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRSxjQUFjO1NBQ3JDLENBQUM7WUFDRyxNQUFNLGFBQWEsR0FBcUIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3RSxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQy9CLENBQUM7Z0JBQ0csTUFBTSxXQUFXLEdBQVMsNEVBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzNELE1BQU0sMEJBQTBCLEdBQzVCLGFBQWEsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLE1BQU07b0JBQzNDLGFBQWEsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLEtBQUssQ0FBQztnQkFFOUMsSUFBSSwwQkFBMEIsRUFDOUIsQ0FBQztvQkFDRyxpREFBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7b0JBQzVDLDhDQUFPLEVBQUUsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLElBQUk7SUFDSixrREFBa0Q7SUFDbEQsSUFBSTtBQUNSLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vV2luRXZlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRmlsZTogICAgICBXaW5FdmVudC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZXaW5FdmVudFBheWxvYWQgfSBmcm9tIFwiLi9XaW5FdmVudC5UeXBlc1wiO1xuaW1wb3J0IHsgR2V0V2luZG93TG9jYXRpb25BbmRTaXplLCBJbml0aWFsaXplV2luRXZlbnRzLCB0eXBlIEZCb3gsIHR5cGUgSFdpbmRvdyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IExvZyB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgfSBmcm9tIFwiLi9Ob2RlSXBjXCI7XG5pbXBvcnQgeyBURGlzcGF0Y2hlciB9IGZyb20gXCIuL0Rpc3BhdGNoZXJcIjtcbmltcG9ydCB7IElzV2luZG93VGlsZWQsIFB1Ymxpc2ggfSBmcm9tIFwiLi9UcmVlXCI7XG5cbmV4cG9ydCBjb25zdCBXaW5FdmVudDogVERpc3BhdGNoZXI8dW5kZWZpbmVkPiA9IG5ldyBURGlzcGF0Y2hlcjx1bmRlZmluZWQ+KCk7XG5cbkluaXRpYWxpemVXaW5FdmVudHMoKTtcblxuY29uc3QgV2luZG93SW5pdGlhbFJlY3Q6IE1hcDxzdHJpbmcsIEZCb3g+ID0gbmV3IE1hcDxzdHJpbmcsIEZCb3g+KCk7XG5cblN1YnNjcmliZShcIldpbkV2ZW50XCIsICguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IHsgRXZlbnQsIEhhbmRsZSwgSWRPYmplY3QgfTogRldpbkV2ZW50UGF5bG9hZCA9IEFyZ3VtZW50c1swXSBhcyBGV2luRXZlbnRQYXlsb2FkO1xuICAgIGNvbnN0IFJlc2l6ZUV2ZW50OiBudW1iZXIgPSAzMjc3MjtcbiAgICBjb25zdCBNb3VzZU1vdmVFdmVudDogbnVtYmVyID0gMzI3Nzk7XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgIC8qIChGb3Igbm93KSBwcmV2ZW50IHdpbmRvd3MgZnJvbSBiZWluZyBtb3ZlZCBieSBkcmFnZ2luZyB0aGUgY3Vyc29yIGJ5IG1vdmluZyB0aWxlZCB3aW5kb3dzIGJhY2sgdG8gd2hlcmUgdGhleSBcInNob3VsZFwiIGJlIHVuZGVyIFNvcnJlbGxXbS4gKi9cbiAgICBjb25zdCBJc1dpbmRvd0V2ZW50OiBib29sZWFuID0gSWRPYmplY3QgPT09IDAgJiYgSGFuZGxlICE9PSB1bmRlZmluZWQgJiYgSXNXaW5kb3dUaWxlZChIYW5kbGUpO1xuICAgIGlmIChJc1dpbmRvd0V2ZW50KVxuICAgIHtcbiAgICAgICAgY29uc3QgSW5pdGlhbEJvdW5kczogRkJveCA9IEdldFdpbmRvd0xvY2F0aW9uQW5kU2l6ZShIYW5kbGUpO1xuICAgICAgICBpZiAoRXZlbnQgPT09IDEwKSAvLyBNb3ZlU2l6ZVN0YXJ0XG4gICAgICAgIHtcbiAgICAgICAgICAgIFdpbmRvd0luaXRpYWxSZWN0LnNldChIYW5kbGUuSGFuZGxlLCBJbml0aWFsQm91bmRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChFdmVudCA9PT0gMTEpIC8vIE1vdmVTaXplRW5kXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEluaXRpYWxCb3VuZHM6IEZCb3ggfCB1bmRlZmluZWQgPSBXaW5kb3dJbml0aWFsUmVjdC5nZXQoSGFuZGxlLkhhbmRsZSk7XG4gICAgICAgICAgICBpZiAoSW5pdGlhbEJvdW5kcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IEZpbmFsQm91bmRzOiBGQm94ID0gR2V0V2luZG93TG9jYXRpb25BbmRTaXplKEhhbmRsZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgV2luZG93V2FzUmVzaXplZEJ5RHJhZ2dpbmc6IGJvb2xlYW4gPVxuICAgICAgICAgICAgICAgICAgICBJbml0aWFsQm91bmRzLkhlaWdodCA9PT0gRmluYWxCb3VuZHMuSGVpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgIEluaXRpYWxCb3VuZHMuV2lkdGggPT09IEZpbmFsQm91bmRzLldpZHRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKFdpbmRvd1dhc1Jlc2l6ZWRCeURyYWdnaW5nKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTG9nKFwiISEgV2luZG93IFdhcyBSZXNpemVkIEJ5IERyYWdnaW5nICEhXCIpO1xuICAgICAgICAgICAgICAgICAgICBQdWJsaXNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKEV2ZW50ICE9PSBNb3VzZU1vdmVFdmVudClcbiAgICAvLyB7XG4gICAgLy8gICAgIExvZyhgV2luRXZlbnQgRXZlbnQgdmFsdWUgaXMgJHsgRXZlbnQgfS5gKTtcbiAgICAvLyB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==