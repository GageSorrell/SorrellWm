"use strict";
exports.id = "Source_Main_WinEvent_ts";
exports.ids = ["Source_Main_WinEvent_ts"];
exports.modules = {

/***/ "./Source/Main/WinEvent.ts"
/*!*********************************!*\
  !*** ./Source/Main/WinEvent.ts ***!
  \*********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      WinEvent.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WinEvent = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Tree_1 = __webpack_require__(/*! ./Tree */ "./Source/Main/Tree/index.ts");
const Initialize_1 = __webpack_require__(/*! ./Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const NodeIpc_1 = __webpack_require__(/*! ./Event/NodeIpc */ "./Source/Main/Event/NodeIpc.ts");
const Dispatcher_1 = __webpack_require__(/*! ./Event/Dispatcher */ "./Source/Main/Event/Dispatcher.ts");
// const Log: FLogger = GetLogger("WinEvent");
exports.WinEvent = new Dispatcher_1.TDispatcher();
async function InitializeWinEvents() {
    (0, wm_windows_1.InitializeWinEvents)();
    // const WindowInitialRect: TMap<string, FBox> = new Map<string, FBox>();
    (0, NodeIpc_1.Subscribe)("WinEvent", (...Arguments) => {
        // const { Event, Handle, IdObject }: FWinEventPayload = Arguments[0] as FWinEventPayload;
        const { Handle, IdObject } = Arguments[0];
        // const ResizeEvent: number = 32772;
        // const MouseMoveEvent: number = 32779;
        // const MoveSizeStartEvent: number = 10;
        // const MoveSizeEndEvent: number = 11;
        /* eslint-disable-next-line @stylistic/max-len */
        /* (For now) prevent windows from being moved by dragging the cursor by moving tiled windows back to where they "should" be under SorrellWm. */
        const IsWindowEvent = IdObject === 0 && Handle !== undefined && (0, Tree_1.IsWindowTiled)(Handle);
        if (IsWindowEvent) {
            // @TODO Temporary.
            return;
            // const InitialBounds: FBox = GetWindowLocationAndSize(Handle);
            // if (Event === MoveSizeStartEvent)
            // {
            //     WindowInitialRect.set(Handle.Handle, InitialBounds);
            // }
            // else if (Event === MoveSizeEndEvent)
            // {
            //     const InitialBounds: FBox | undefined = WindowInitialRect.get(Handle.Handle);
            //     if (InitialBounds !== undefined)
            //     {
            //         const FinalBounds: FBox = GetWindowLocationAndSize(Handle);
            //         const WindowWasResizedByDragging: boolean =
            //             InitialBounds.Height === FinalBounds.Height &&
            //             InitialBounds.Width === FinalBounds.Width;
            //         if (WindowWasResizedByDragging)
            //         {
            //             Log("!! Window Was Resized By Dragging !!");
            //             Publish();
            //         }
            //     }
            // }
        }
        // if (Event !== MouseMoveEvent)
        // {
        //     Log(`WinEvent Event value is ${ Event }.`);
        // }
    });
}
;
(0, Initialize_1.RegisterInitializationFunction)("WinEvent", InitializeWinEvents, ["NodeIpc"]);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luRXZlbnRfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7O0FBVUgsMkZBQXVGO0FBQ3ZGLGdGQUF1QztBQUN2QyxrSEFBeUU7QUFDekUsK0ZBQTRDO0FBQzVDLHdHQUFpRDtBQUVqRCw4Q0FBOEM7QUFFakMsZ0JBQVEsR0FBMkIsSUFBSSx3QkFBVyxFQUFhLENBQUM7QUFFN0UsS0FBSyxVQUFVLG1CQUFtQjtJQUU5QixvQ0FBeUIsR0FBRSxDQUFDO0lBRTVCLHlFQUF5RTtJQUV6RSx1QkFBUyxFQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsU0FBMEIsRUFBUSxFQUFFO1FBRTFELDBGQUEwRjtRQUMxRixNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFxQixTQUFTLENBQUMsQ0FBQyxDQUFxQixDQUFDO1FBQ2hGLHFDQUFxQztRQUNyQyx3Q0FBd0M7UUFDeEMseUNBQXlDO1FBQ3pDLHVDQUF1QztRQUN2QyxpREFBaUQ7UUFDakQsK0lBQStJO1FBQy9JLE1BQU0sYUFBYSxHQUFZLFFBQVEsS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSx3QkFBYSxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9GLElBQUksYUFBYSxFQUNqQixDQUFDO1lBQ0csbUJBQW1CO1lBQ25CLE9BQU87WUFDUCxnRUFBZ0U7WUFDaEUsb0NBQW9DO1lBQ3BDLElBQUk7WUFDSiwyREFBMkQ7WUFDM0QsSUFBSTtZQUNKLHVDQUF1QztZQUN2QyxJQUFJO1lBQ0osb0ZBQW9GO1lBQ3BGLHVDQUF1QztZQUN2QyxRQUFRO1lBQ1Isc0VBQXNFO1lBQ3RFLHNEQUFzRDtZQUN0RCw2REFBNkQ7WUFDN0QseURBQXlEO1lBRXpELDBDQUEwQztZQUMxQyxZQUFZO1lBQ1osMkRBQTJEO1lBQzNELHlCQUF5QjtZQUN6QixZQUFZO1lBQ1osUUFBUTtZQUNSLElBQUk7UUFDUixDQUFDO1FBRUQsZ0NBQWdDO1FBQ2hDLElBQUk7UUFDSixrREFBa0Q7UUFDbEQsSUFBSTtJQUNSLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUFBLENBQUM7QUFFRiwrQ0FBOEIsRUFBQyxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9XaW5FdmVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlICAgICAgV2luRXZlbnQudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG4vLyBpbXBvcnQgeyB0eXBlIEZCb3gsIEdldFdpbmRvd0xvY2F0aW9uQW5kU2l6ZSwgSW5pdGlhbGl6ZVdpbkV2ZW50cyB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG4vLyBpbXBvcnQgeyB0eXBlIEZMb2dnZXIsIEdldExvZ2dlciB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG4vLyBpbXBvcnQgeyBJc1dpbmRvd1RpbGVkLCBQdWJsaXNoIH0gZnJvbSBcIi4vVHJlZVwiO1xuLy8gaW1wb3J0IHR5cGUgeyBGV2luRXZlbnRQYXlsb2FkIH0gZnJvbSBcIi4vV2luRXZlbnQuVHlwZXNcIjtcbi8vIGltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbi8vIGltcG9ydCB7IFREaXNwYXRjaGVyIH0gZnJvbSBcIi4vQ29yZS9EaXNwYXRjaGVyXCI7XG5cbmltcG9ydCB0eXBlIHsgRldpbkV2ZW50UGF5bG9hZCB9IGZyb20gXCIuL1dpbkV2ZW50LlR5cGVzXCI7XG5pbXBvcnQgeyBJbml0aWFsaXplV2luRXZlbnRzIGFzIEluaXRpYWxpemVXaW5FdmVudHNOYXRpdmUgfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHsgSXNXaW5kb3dUaWxlZCB9IGZyb20gXCIuL1RyZWVcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIuL0luaXRpYWxpemUvSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgU3Vic2NyaWJlIH0gZnJvbSBcIi4vRXZlbnQvTm9kZUlwY1wiO1xuaW1wb3J0IHsgVERpc3BhdGNoZXIgfSBmcm9tIFwiLi9FdmVudC9EaXNwYXRjaGVyXCI7XG5cbi8vIGNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIldpbkV2ZW50XCIpO1xuXG5leHBvcnQgY29uc3QgV2luRXZlbnQ6IFREaXNwYXRjaGVyPHVuZGVmaW5lZD4gPSBuZXcgVERpc3BhdGNoZXI8dW5kZWZpbmVkPigpO1xuXG5hc3luYyBmdW5jdGlvbiBJbml0aWFsaXplV2luRXZlbnRzKCk6IFByb21pc2U8dm9pZD5cbntcbiAgICBJbml0aWFsaXplV2luRXZlbnRzTmF0aXZlKCk7XG5cbiAgICAvLyBjb25zdCBXaW5kb3dJbml0aWFsUmVjdDogVE1hcDxzdHJpbmcsIEZCb3g+ID0gbmV3IE1hcDxzdHJpbmcsIEZCb3g+KCk7XG5cbiAgICBTdWJzY3JpYmUoXCJXaW5FdmVudFwiLCAoLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICAvLyBjb25zdCB7IEV2ZW50LCBIYW5kbGUsIElkT2JqZWN0IH06IEZXaW5FdmVudFBheWxvYWQgPSBBcmd1bWVudHNbMF0gYXMgRldpbkV2ZW50UGF5bG9hZDtcbiAgICAgICAgY29uc3QgeyBIYW5kbGUsIElkT2JqZWN0IH06IEZXaW5FdmVudFBheWxvYWQgPSBBcmd1bWVudHNbMF0gYXMgRldpbkV2ZW50UGF5bG9hZDtcbiAgICAgICAgLy8gY29uc3QgUmVzaXplRXZlbnQ6IG51bWJlciA9IDMyNzcyO1xuICAgICAgICAvLyBjb25zdCBNb3VzZU1vdmVFdmVudDogbnVtYmVyID0gMzI3Nzk7XG4gICAgICAgIC8vIGNvbnN0IE1vdmVTaXplU3RhcnRFdmVudDogbnVtYmVyID0gMTA7XG4gICAgICAgIC8vIGNvbnN0IE1vdmVTaXplRW5kRXZlbnQ6IG51bWJlciA9IDExO1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgIC8qIChGb3Igbm93KSBwcmV2ZW50IHdpbmRvd3MgZnJvbSBiZWluZyBtb3ZlZCBieSBkcmFnZ2luZyB0aGUgY3Vyc29yIGJ5IG1vdmluZyB0aWxlZCB3aW5kb3dzIGJhY2sgdG8gd2hlcmUgdGhleSBcInNob3VsZFwiIGJlIHVuZGVyIFNvcnJlbGxXbS4gKi9cbiAgICAgICAgY29uc3QgSXNXaW5kb3dFdmVudDogYm9vbGVhbiA9IElkT2JqZWN0ID09PSAwICYmIEhhbmRsZSAhPT0gdW5kZWZpbmVkICYmIElzV2luZG93VGlsZWQoSGFuZGxlKTtcbiAgICAgICAgaWYgKElzV2luZG93RXZlbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEBUT0RPIFRlbXBvcmFyeS5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIGNvbnN0IEluaXRpYWxCb3VuZHM6IEZCb3ggPSBHZXRXaW5kb3dMb2NhdGlvbkFuZFNpemUoSGFuZGxlKTtcbiAgICAgICAgICAgIC8vIGlmIChFdmVudCA9PT0gTW92ZVNpemVTdGFydEV2ZW50KVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIFdpbmRvd0luaXRpYWxSZWN0LnNldChIYW5kbGUuSGFuZGxlLCBJbml0aWFsQm91bmRzKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKEV2ZW50ID09PSBNb3ZlU2l6ZUVuZEV2ZW50KVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbnN0IEluaXRpYWxCb3VuZHM6IEZCb3ggfCB1bmRlZmluZWQgPSBXaW5kb3dJbml0aWFsUmVjdC5nZXQoSGFuZGxlLkhhbmRsZSk7XG4gICAgICAgICAgICAvLyAgICAgaWYgKEluaXRpYWxCb3VuZHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IEZpbmFsQm91bmRzOiBGQm94ID0gR2V0V2luZG93TG9jYXRpb25BbmRTaXplKEhhbmRsZSk7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IFdpbmRvd1dhc1Jlc2l6ZWRCeURyYWdnaW5nOiBib29sZWFuID1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIEluaXRpYWxCb3VuZHMuSGVpZ2h0ID09PSBGaW5hbEJvdW5kcy5IZWlnaHQgJiZcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIEluaXRpYWxCb3VuZHMuV2lkdGggPT09IEZpbmFsQm91bmRzLldpZHRoO1xuXG4gICAgICAgICAgICAvLyAgICAgICAgIGlmIChXaW5kb3dXYXNSZXNpemVkQnlEcmFnZ2luZylcbiAgICAgICAgICAgIC8vICAgICAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgTG9nKFwiISEgV2luZG93IFdhcyBSZXNpemVkIEJ5IERyYWdnaW5nICEhXCIpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgUHVibGlzaCgpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKEV2ZW50ICE9PSBNb3VzZU1vdmVFdmVudClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTG9nKGBXaW5FdmVudCBFdmVudCB2YWx1ZSBpcyAkeyBFdmVudCB9LmApO1xuICAgICAgICAvLyB9XG4gICAgfSk7XG59O1xuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJXaW5FdmVudFwiLCBJbml0aWFsaXplV2luRXZlbnRzLCBbIFwiTm9kZUlwY1wiIF0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9