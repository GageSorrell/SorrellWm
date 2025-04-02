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
 * Copyright: (c) 2025 Gage Sorrell
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luRXZlbnRfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBR3lHO0FBQ3hFO0FBQ0U7QUFDSztBQUNLO0FBRXpDLE1BQU0sUUFBUSxHQUEyQixJQUFJLG9EQUFXLEVBQWEsQ0FBQztBQUU3RSx1RUFBbUIsRUFBRSxDQUFDO0FBRXRCLE1BQU0saUJBQWlCLEdBQXNCLElBQUksR0FBRyxFQUFnQixDQUFDO0FBRXJFLG1EQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxTQUF5QixFQUFRLEVBQUU7SUFFekQsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQXFCLFNBQVMsQ0FBQyxDQUFDLENBQXFCLENBQUM7SUFDdkYsTUFBTSxXQUFXLEdBQVcsS0FBSyxDQUFDO0lBQ2xDLE1BQU0sY0FBYyxHQUFXLEtBQUssQ0FBQztJQUNyQyxpREFBaUQ7SUFDakQsK0lBQStJO0lBQy9JLE1BQU0sYUFBYSxHQUFZLFFBQVEsS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxvREFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9GLElBQUksYUFBYSxFQUNqQixDQUFDO1FBQ0csTUFBTSxhQUFhLEdBQVMsNEVBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLGdCQUFnQjtTQUNsQyxDQUFDO1lBQ0csaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDeEQsQ0FBQzthQUNJLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRSxjQUFjO1NBQ3JDLENBQUM7WUFDRyxNQUFNLGFBQWEsR0FBcUIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3RSxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQy9CLENBQUM7Z0JBQ0csTUFBTSxXQUFXLEdBQVMsNEVBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzNELE1BQU0sMEJBQTBCLEdBQzVCLGFBQWEsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLE1BQU07b0JBQzNDLGFBQWEsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLEtBQUssQ0FBQztnQkFFOUMsSUFBSSwwQkFBMEIsRUFDOUIsQ0FBQztvQkFDRyxpREFBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7b0JBQzVDLDhDQUFPLEVBQUUsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLElBQUk7SUFDSixrREFBa0Q7SUFDbEQsSUFBSTtBQUNSLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vV2luRXZlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRmlsZTogICAgICBXaW5FdmVudC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRldpbkV2ZW50UGF5bG9hZCB9IGZyb20gXCIuL1dpbkV2ZW50LlR5cGVzXCI7XG5pbXBvcnQgeyBHZXRXaW5kb3dMb2NhdGlvbkFuZFNpemUsIEluaXRpYWxpemVXaW5FdmVudHMsIHR5cGUgRkJveCwgdHlwZSBIV2luZG93IH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcIi4vRGV2ZWxvcG1lbnRcIjtcbmltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyIH0gZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuaW1wb3J0IHsgSXNXaW5kb3dUaWxlZCwgUHVibGlzaCB9IGZyb20gXCIuL1RyZWVcIjtcblxuZXhwb3J0IGNvbnN0IFdpbkV2ZW50OiBURGlzcGF0Y2hlcjx1bmRlZmluZWQ+ID0gbmV3IFREaXNwYXRjaGVyPHVuZGVmaW5lZD4oKTtcblxuSW5pdGlhbGl6ZVdpbkV2ZW50cygpO1xuXG5jb25zdCBXaW5kb3dJbml0aWFsUmVjdDogTWFwPHN0cmluZywgRkJveD4gPSBuZXcgTWFwPHN0cmluZywgRkJveD4oKTtcblxuU3Vic2NyaWJlKFwiV2luRXZlbnRcIiwgKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG57XG4gICAgY29uc3QgeyBFdmVudCwgSGFuZGxlLCBJZE9iamVjdCB9OiBGV2luRXZlbnRQYXlsb2FkID0gQXJndW1lbnRzWzBdIGFzIEZXaW5FdmVudFBheWxvYWQ7XG4gICAgY29uc3QgUmVzaXplRXZlbnQ6IG51bWJlciA9IDMyNzcyO1xuICAgIGNvbnN0IE1vdXNlTW92ZUV2ZW50OiBudW1iZXIgPSAzMjc3OTtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgLyogKEZvciBub3cpIHByZXZlbnQgd2luZG93cyBmcm9tIGJlaW5nIG1vdmVkIGJ5IGRyYWdnaW5nIHRoZSBjdXJzb3IgYnkgbW92aW5nIHRpbGVkIHdpbmRvd3MgYmFjayB0byB3aGVyZSB0aGV5IFwic2hvdWxkXCIgYmUgdW5kZXIgU29ycmVsbFdtLiAqL1xuICAgIGNvbnN0IElzV2luZG93RXZlbnQ6IGJvb2xlYW4gPSBJZE9iamVjdCA9PT0gMCAmJiBIYW5kbGUgIT09IHVuZGVmaW5lZCAmJiBJc1dpbmRvd1RpbGVkKEhhbmRsZSk7XG4gICAgaWYgKElzV2luZG93RXZlbnQpXG4gICAge1xuICAgICAgICBjb25zdCBJbml0aWFsQm91bmRzOiBGQm94ID0gR2V0V2luZG93TG9jYXRpb25BbmRTaXplKEhhbmRsZSk7XG4gICAgICAgIGlmIChFdmVudCA9PT0gMTApIC8vIE1vdmVTaXplU3RhcnRcbiAgICAgICAge1xuICAgICAgICAgICAgV2luZG93SW5pdGlhbFJlY3Quc2V0KEhhbmRsZS5IYW5kbGUsIEluaXRpYWxCb3VuZHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEV2ZW50ID09PSAxMSkgLy8gTW92ZVNpemVFbmRcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgSW5pdGlhbEJvdW5kczogRkJveCB8IHVuZGVmaW5lZCA9IFdpbmRvd0luaXRpYWxSZWN0LmdldChIYW5kbGUuSGFuZGxlKTtcbiAgICAgICAgICAgIGlmIChJbml0aWFsQm91bmRzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgRmluYWxCb3VuZHM6IEZCb3ggPSBHZXRXaW5kb3dMb2NhdGlvbkFuZFNpemUoSGFuZGxlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBXaW5kb3dXYXNSZXNpemVkQnlEcmFnZ2luZzogYm9vbGVhbiA9XG4gICAgICAgICAgICAgICAgICAgIEluaXRpYWxCb3VuZHMuSGVpZ2h0ID09PSBGaW5hbEJvdW5kcy5IZWlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgSW5pdGlhbEJvdW5kcy5XaWR0aCA9PT0gRmluYWxCb3VuZHMuV2lkdGg7XG5cbiAgICAgICAgICAgICAgICBpZiAoV2luZG93V2FzUmVzaXplZEJ5RHJhZ2dpbmcpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBMb2coXCIhISBXaW5kb3cgV2FzIFJlc2l6ZWQgQnkgRHJhZ2dpbmcgISFcIik7XG4gICAgICAgICAgICAgICAgICAgIFB1Ymxpc2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiAoRXZlbnQgIT09IE1vdXNlTW92ZUV2ZW50KVxuICAgIC8vIHtcbiAgICAvLyAgICAgTG9nKGBXaW5FdmVudCBFdmVudCB2YWx1ZSBpcyAkeyBFdmVudCB9LmApO1xuICAgIC8vIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9