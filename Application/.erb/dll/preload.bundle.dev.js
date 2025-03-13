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

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./Source/Main/Core/Preload.ts ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */
/* eslint-disable */

const ElectronHandler = {
    ipcRenderer: {
        on(Channel, InFunction) {
            const subscription = (_event, ...args) => {
                return InFunction(...args);
            };
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(Channel, subscription);
            return () => {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(Channel, subscription);
            };
        },
        once(Channel, InFunction) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.once(Channel, (_Event, ..._Arguments) => InFunction(..._Arguments));
        },
        sendMessage(Channel, ...Arguments) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(Channel, ...Arguments);
        }
    },
    GetFocusedWindow: async () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("GetFocusedWindow"),
    GetIsLightMode: async () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("GetIsLightMode"),
    GetThemeColor: async () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("GetThemeColor")
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld("electron", ElectronHandler);

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVkE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7OztBQ05BOzs7R0FHRztBQUVILG9CQUFvQjtBQUV5RDtBQUk3RSxNQUFNLGVBQWUsR0FDckI7SUFDSSxXQUFXLEVBQ1g7UUFDSSxFQUFFLENBQUMsT0FBZSxFQUFFLFVBQW9EO1lBRXBFLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBd0IsRUFBRSxHQUFHLElBQW9CLEVBQUUsRUFBRTtnQkFFdkUsT0FBTyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUM7WUFFRixpREFBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFdEMsT0FBTyxHQUFHLEVBQUU7Z0JBRVIsaURBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQztRQUNOLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBZSxFQUFFLFVBQW9EO1lBRXRFLGlEQUFXLENBQUMsSUFBSSxDQUNaLE9BQU8sRUFDUCxDQUFDLE1BQXNCLEVBQUUsR0FBRyxVQUEwQixFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FDdkYsQ0FBQztRQUNOLENBQUM7UUFDRCxXQUFXLENBQUMsT0FBZSxFQUFFLEdBQUcsU0FBeUI7WUFFckQsaURBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUNKO0lBQ0QsZ0JBQWdCLEVBQUUsS0FBSyxJQUFzQixFQUFFLENBQUMsaURBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7SUFDMUYsY0FBYyxFQUFFLEtBQUssSUFBc0IsRUFBRSxDQUFDLGlEQUFXLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQ2xGLGFBQWEsRUFBRSxLQUFLLElBQXdCLEVBQUUsQ0FBQyxpREFBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7Q0FDakYsQ0FBQztBQUVGLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvUHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIEZpbGU6ICAgIFByZWxvYWQudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IHsgdHlwZSBJcGNSZW5kZXJlckV2ZW50LCBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgSFdpbmRvdywgRkhleENvbG9yIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5cbmNvbnN0IEVsZWN0cm9uSGFuZGxlciA9XG57XG4gICAgaXBjUmVuZGVyZXI6XG4gICAge1xuICAgICAgICBvbihDaGFubmVsOiBzdHJpbmcsIEluRnVuY3Rpb246ICgoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT4gdm9pZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IEFycmF5PHVua25vd24+KSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBJbkZ1bmN0aW9uKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaXBjUmVuZGVyZXIub24oQ2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoQ2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG9uY2UoQ2hhbm5lbDogc3RyaW5nLCBJbkZ1bmN0aW9uOiAoKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+IHZvaWQpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpcGNSZW5kZXJlci5vbmNlKFxuICAgICAgICAgICAgICAgIENoYW5uZWwsXG4gICAgICAgICAgICAgICAgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiBJbkZ1bmN0aW9uKC4uLl9Bcmd1bWVudHMpXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBzZW5kTWVzc2FnZShDaGFubmVsOiBzdHJpbmcsIC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoQ2hhbm5lbCwgLi4uQXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgR2V0Rm9jdXNlZFdpbmRvdzogYXN5bmMgKCk6IFByb21pc2U8SFdpbmRvdz4gPT4gaXBjUmVuZGVyZXIuaW52b2tlKFwiR2V0Rm9jdXNlZFdpbmRvd1wiKSxcbkdldElzTGlnaHRNb2RlOiBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiBpcGNSZW5kZXJlci5pbnZva2UoXCJHZXRJc0xpZ2h0TW9kZVwiKSxcbkdldFRoZW1lQ29sb3I6IGFzeW5jICgpOiBQcm9taXNlPEZIZXhDb2xvcj4gPT4gaXBjUmVuZGVyZXIuaW52b2tlKFwiR2V0VGhlbWVDb2xvclwiKVxufTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZChcImVsZWN0cm9uXCIsIEVsZWN0cm9uSGFuZGxlcik7XG5cbmV4cG9ydCB0eXBlIEZFbGVjdHJvbkhhbmRsZXIgPSB0eXBlb2YgRWxlY3Ryb25IYW5kbGVyO1xuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==