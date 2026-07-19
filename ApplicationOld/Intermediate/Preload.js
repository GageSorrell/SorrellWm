(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

module.exports = require("electron");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*******************************************!*\
  !*** ./Source/Main/Initialize/Preload.ts ***!
  \*******************************************/

/**
 * @file      Preload.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable */
const electron_1 = __webpack_require__(/*! electron */ "electron");
const ElectronHandler = {
    // ...GetPreload(ipcRenderer),
    ipcRenderer: {
        GetId() {
            return electron_1.ipcRenderer.invoke("GetId");
        },
        Invoke(Channel, Payload) {
            return electron_1.ipcRenderer.invoke(Channel, Payload);
        },
        On(Channel, Listener) {
            const Clone = (In) => {
                const IsRecord = (In) => {
                    return typeof In === "object" && In !== null && !Array.isArray(In);
                };
                if (IsRecord(In)) {
                    const OutRecord = {};
                    Object.keys(In).forEach((Key) => {
                        OutRecord[Key] = Clone(In[Key]);
                    });
                    return OutRecord;
                }
                else if (Array.isArray(In)) {
                    return In.map(Clone);
                }
                else if (typeof In === "symbol") {
                    return In.toString();
                }
                else if (typeof In === "function") {
                    return "[ Function ]";
                }
                else // In extends string | number | null | undefined | boolean;
                 {
                    return In;
                }
            };
            electron_1.ipcRenderer.on(Channel, Listener);
            return () => {
                electron_1.ipcRenderer.removeListener(Channel, Listener);
            };
        },
        Once(Channel, Listener) {
            electron_1.ipcRenderer.removeAllListeners();
            electron_1.ipcRenderer.once(Channel, (_Event, ...ArgumentVector) => Listener(...ArgumentVector));
        },
        RemoveListener(Channel, Listener) {
            electron_1.ipcRenderer.removeListener(Channel, Listener);
        },
        Send(Channel, ...ArgumentVector) {
            electron_1.ipcRenderer.send(Channel, ...ArgumentVector);
        }
    }
};
electron_1.contextBridge.exposeInMainWorld("electron", ElectronHandler);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2xELENBQUM7UUFDRCxJQUFJLENBQUMsT0FBZSxFQUFFLEdBQUcsY0FBOEI7WUFFbkQsc0JBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUNKO0NBQ0osQ0FBQztBQUVGLHdCQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9QcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvKipcbiAqIEBmaWxlICAgICAgUHJlbG9hZC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbmltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XG4vLyBpbXBvcnQgeyBHZXRQcmVsb2FkIH0gZnJvbSBcImVsZWN0cm9uLXJlYWN0aXZlLWV2ZW50XCI7XG5cbi8vIEBUT0RPIFRlbXBvcmFyeS5cbnR5cGUgVEV2ZW50Q2FsbGJhY2s8VHlwZT4gPSAoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT4gUHJvbWlzZTxhbnk+O1xudHlwZSBGSXBjRnJvbnRlbmRDaGFubmVsID0gc3RyaW5nO1xudHlwZSBGSXBjQmFja2VuZENoYW5uZWwgPSBzdHJpbmc7XG5cbmNvbnN0IEVsZWN0cm9uSGFuZGxlciA9XG57XG4gICAgLy8gLi4uR2V0UHJlbG9hZChpcGNSZW5kZXJlciksXG4gICAgaXBjUmVuZGVyZXI6XG4gICAge1xuICAgICAgICBHZXRJZCgpOiBQcm9taXNlPHVua25vd24+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoXCJHZXRJZFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgSW52b2tlPENoYW5uZWxUeXBlIGV4dGVuZHMgRklwY0Zyb250ZW5kQ2hhbm5lbD4oQ2hhbm5lbDogQ2hhbm5lbFR5cGUsIFBheWxvYWQ6IHVua25vd24pOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPENoYW5uZWxUeXBlPj5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShDaGFubmVsLCBQYXlsb2FkKTtcbiAgICAgICAgfSxcbiAgICAgICAgT24oQ2hhbm5lbDogc3RyaW5nLCBMaXN0ZW5lcjogKCguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiB2b2lkKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZSBGUmVjb3JkID0gUmVjb3JkPFByb3BlcnR5S2V5LCB1bmtub3duPjtcbiAgICAgICAgICAgIGNvbnN0IENsb25lID0gKEluOiB1bmtub3duKTogdW5rbm93biA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IElzUmVjb3JkID0gKEluOiB1bmtub3duKTogSW4gaXMgRlJlY29yZCA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBJbiA9PT0gXCJvYmplY3RcIiAmJiBJbiAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShJbik7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChJc1JlY29yZChJbikpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBPdXRSZWNvcmQ6IEZSZWNvcmQgPSB7IH07XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKEluKS5mb3JFYWNoKChLZXk6IFByb3BlcnR5S2V5KTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPdXRSZWNvcmRbS2V5XSA9IENsb25lKEluW0tleV0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE91dFJlY29yZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShJbikpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW4ubWFwKENsb25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIEluID09PSBcInN5bWJvbFwiKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEluLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBJbiA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiWyBGdW5jdGlvbiBdXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgLy8gSW4gZXh0ZW5kcyBzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkIHwgYm9vbGVhbjtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpcGNSZW5kZXJlci5vbihDaGFubmVsLCBMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHJldHVybiAoKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKENoYW5uZWwsIExpc3RlbmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIE9uY2UoQ2hhbm5lbDogc3RyaW5nLCBMaXN0ZW5lcjogKCguLi5Bcmd1bWVudFZlY3RvcjogQXJyYXk8dW5rbm93bj4pID0+IHZvaWQpKTogdm9pZFxuICAgICAgICB7XG4gICAgICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxuICAgICAgICAgICAgaXBjUmVuZGVyZXIub25jZShcbiAgICAgICAgICAgICAgICBDaGFubmVsLFxuICAgICAgICAgICAgICAgIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudFZlY3RvcjogQXJyYXk8dW5rbm93bj4pID0+IExpc3RlbmVyKC4uLkFyZ3VtZW50VmVjdG9yKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgUmVtb3ZlTGlzdGVuZXIoQ2hhbm5lbDogc3RyaW5nLCBMaXN0ZW5lcjogKCguLi5Bcmd1bWVudFZlY3RvcjogQXJyYXk8dW5rbm93bj4pID0+IHZvaWQpKTogdm9pZFxuICAgICAgICB7XG4gICAgICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihDaGFubmVsLCBMaXN0ZW5lcik7XG4gICAgICAgIH0sXG4gICAgICAgIFNlbmQoQ2hhbm5lbDogc3RyaW5nLCAuLi5Bcmd1bWVudFZlY3RvcjogQXJyYXk8dW5rbm93bj4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoQ2hhbm5lbCwgLi4uQXJndW1lbnRWZWN0b3IpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZChcImVsZWN0cm9uXCIsIEVsZWN0cm9uSGFuZGxlcik7XG5cbmV4cG9ydCB0eXBlIEZFbGVjdHJvbkhhbmRsZXIgPSB0eXBlb2YgRWxlY3Ryb25IYW5kbGVyO1xuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=