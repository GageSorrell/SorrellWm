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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELElBQUksQ0FBQyxPQUFlLEVBQUUsR0FBRyxjQUE4QjtZQUVuRCxzQkFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDO0tBQ0o7Q0FDSixDQUFDO0FBRUYsd0JBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9Jbml0aWFsaXplL1ByZWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qKlxuICogQGZpbGUgICAgICBQcmVsb2FkLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbi8vIGltcG9ydCB7IEdldFByZWxvYWQgfSBmcm9tIFwiZWxlY3Ryb24tcmVhY3RpdmUtZXZlbnRcIjtcblxuLy8gQFRPRE8gVGVtcG9yYXJ5LlxudHlwZSBURXZlbnRDYWxsYmFjazxUeXBlPiA9ICguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiBQcm9taXNlPGFueT47XG50eXBlIEZJcGNGcm9udGVuZENoYW5uZWwgPSBzdHJpbmc7XG50eXBlIEZJcGNCYWNrZW5kQ2hhbm5lbCA9IHN0cmluZztcblxuY29uc3QgRWxlY3Ryb25IYW5kbGVyID1cbntcbiAgICAvLyAuLi5HZXRQcmVsb2FkKGlwY1JlbmRlcmVyKSxcbiAgICBpcGNSZW5kZXJlcjpcbiAgICB7XG4gICAgICAgIEdldElkKCk6IFByb21pc2U8dW5rbm93bj5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShcIkdldElkXCIpO1xuICAgICAgICB9LFxuICAgICAgICBJbnZva2U8Q2hhbm5lbFR5cGUgZXh0ZW5kcyBGSXBjRnJvbnRlbmRDaGFubmVsPihDaGFubmVsOiBDaGFubmVsVHlwZSwgUGF5bG9hZDogdW5rbm93bik6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8Q2hhbm5lbFR5cGU+PlxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKENoYW5uZWwsIFBheWxvYWQpO1xuICAgICAgICB9LFxuICAgICAgICBPbihDaGFubmVsOiBzdHJpbmcsIExpc3RlbmVyOiAoKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+IHZvaWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlIEZSZWNvcmQgPSBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+O1xuICAgICAgICAgICAgY29uc3QgQ2xvbmUgPSAoSW46IHVua25vd24pOiB1bmtub3duID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgSXNSZWNvcmQgPSAoSW46IHVua25vd24pOiBJbiBpcyBGUmVjb3JkID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIEluID09PSBcIm9iamVjdFwiICYmIEluICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KEluKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKElzUmVjb3JkKEluKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE91dFJlY29yZDogRlJlY29yZCA9IHsgfTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoSW4pLmZvckVhY2goKEtleTogUHJvcGVydHlLZXkpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE91dFJlY29yZFtLZXldID0gQ2xvbmUoSW5bS2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT3V0UmVjb3JkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KEluKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJbi5tYXAoQ2xvbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgSW4gPT09IFwic3ltYm9sXCIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW4udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIEluID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJbIEZ1bmN0aW9uIF1cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSAvLyBJbiBleHRlbmRzIHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQgfCBib29sZWFuO1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLm9uKENoYW5uZWwsIExpc3RlbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuICgpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoQ2hhbm5lbCwgTGlzdGVuZXIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgT25jZShDaGFubmVsOiBzdHJpbmcsIExpc3RlbmVyOiAoKC4uLkFyZ3VtZW50VmVjdG9yOiBBcnJheTx1bmtub3duPikgPT4gdm9pZCkpOiB2b2lkXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUFsbExpc3RlbmVycygpXG4gICAgICAgICAgICBpcGNSZW5kZXJlci5vbmNlKFxuICAgICAgICAgICAgICAgIENoYW5uZWwsXG4gICAgICAgICAgICAgICAgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50VmVjdG9yOiBBcnJheTx1bmtub3duPikgPT4gTGlzdGVuZXIoLi4uQXJndW1lbnRWZWN0b3IpXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBSZW1vdmVMaXN0ZW5lcihDaGFubmVsOiBzdHJpbmcsIExpc3RlbmVyOiAoKC4uLkFyZ3VtZW50VmVjdG9yOiBBcnJheTx1bmtub3duPikgPT4gdm9pZCkpOiB2b2lkXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKENoYW5uZWwsIExpc3RlbmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgU2VuZChDaGFubmVsOiBzdHJpbmcsIC4uLkFyZ3VtZW50VmVjdG9yOiBBcnJheTx1bmtub3duPilcbiAgICAgICAge1xuICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChDaGFubmVsLCAuLi5Bcmd1bWVudFZlY3Rvcik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwiZWxlY3Ryb25cIiwgRWxlY3Ryb25IYW5kbGVyKTtcblxuZXhwb3J0IHR5cGUgRkVsZWN0cm9uSGFuZGxlciA9IHR5cGVvZiBFbGVjdHJvbkhhbmRsZXI7XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==