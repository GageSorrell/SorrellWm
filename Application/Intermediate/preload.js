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
        On(Channel, Listener) {
            const subscription = (_event, ...args) => {
                return Listener(...args);
            };
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(Channel, subscription);
            return () => {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(Channel, subscription);
            };
        },
        Once(Channel, Listener) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.once(Channel, (_Event, ..._Arguments) => Listener(..._Arguments));
        },
        RemoveListener(Channel, Listener) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(Channel, Listener);
        },
        SendMessage(Channel, ...Arguments) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7QUNOQTs7O0dBR0c7QUFFSCxvQkFBb0I7QUFFeUQ7QUFJN0UsTUFBTSxlQUFlLEdBQ3JCO0lBQ0ksV0FBVyxFQUNYO1FBQ0ksRUFBRSxDQUFDLE9BQW9CLEVBQUUsUUFBa0Q7WUFFdkUsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUF3QixFQUFFLEdBQUcsSUFBb0IsRUFBRSxFQUFFO2dCQUV2RSxPQUFPLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztZQUVGLGlEQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUV0QyxPQUFPLEdBQUcsRUFBRTtnQkFFUixpREFBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUNELElBQUksQ0FBQyxPQUFvQixFQUFFLFFBQWtEO1lBRXpFLGlEQUFXLENBQUMsSUFBSSxDQUNaLE9BQU8sRUFDUCxDQUFDLE1BQXNCLEVBQUUsR0FBRyxVQUEwQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FDckYsQ0FBQztRQUNOLENBQUM7UUFDRCxjQUFjLENBQUMsT0FBb0IsRUFBRSxRQUFrRDtZQUVuRixpREFBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELFdBQVcsQ0FBQyxPQUFvQixFQUFFLEdBQUcsU0FBeUI7WUFFMUQsaURBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUNKO0lBQ0QsZ0JBQWdCLEVBQUUsS0FBSyxJQUFzQixFQUFFLENBQUMsaURBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7SUFDdEYsY0FBYyxFQUFFLEtBQUssSUFBc0IsRUFBRSxDQUFDLGlEQUFXLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQ2xGLGFBQWEsRUFBRSxLQUFLLElBQXdCLEVBQUUsQ0FBQyxpREFBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7Q0FDckYsQ0FBQztBQUVGLG1EQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvUHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIEZpbGU6ICAgIFByZWxvYWQudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IHsgdHlwZSBJcGNSZW5kZXJlckV2ZW50LCBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgSFdpbmRvdywgRkhleENvbG9yIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHR5cGUgeyBGSXBjQ2hhbm5lbCB9IGZyb20gXCIjL0V2ZW50LlR5cGVzXCI7XG5cbmNvbnN0IEVsZWN0cm9uSGFuZGxlciA9XG57XG4gICAgaXBjUmVuZGVyZXI6XG4gICAge1xuICAgICAgICBPbihDaGFubmVsOiBGSXBjQ2hhbm5lbCwgTGlzdGVuZXI6ICgoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT4gdm9pZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IEFycmF5PHVua25vd24+KSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBMaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLm9uKENoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgICAgICAgIHJldHVybiAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKENoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBPbmNlKENoYW5uZWw6IEZJcGNDaGFubmVsLCBMaXN0ZW5lcjogKCguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiB2b2lkKSk6IHZvaWRcbiAgICAgICAge1xuICAgICAgICAgICAgaXBjUmVuZGVyZXIub25jZShcbiAgICAgICAgICAgICAgICBDaGFubmVsLFxuICAgICAgICAgICAgICAgIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT4gTGlzdGVuZXIoLi4uX0FyZ3VtZW50cylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIFJlbW92ZUxpc3RlbmVyKENoYW5uZWw6IEZJcGNDaGFubmVsLCBMaXN0ZW5lcjogKCguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiB2b2lkKSk6IHZvaWRcbiAgICAgICAge1xuICAgICAgICAgICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoQ2hhbm5lbCwgTGlzdGVuZXIpO1xuICAgICAgICB9LFxuICAgICAgICBTZW5kTWVzc2FnZShDaGFubmVsOiBGSXBjQ2hhbm5lbCwgLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPilcbiAgICAgICAge1xuICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChDaGFubmVsLCAuLi5Bcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBHZXRGb2N1c2VkV2luZG93OiBhc3luYyAoKTogUHJvbWlzZTxIV2luZG93PiA9PiBpcGNSZW5kZXJlci5pbnZva2UoXCJHZXRGb2N1c2VkV2luZG93XCIpLFxuICAgIEdldElzTGlnaHRNb2RlOiBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiBpcGNSZW5kZXJlci5pbnZva2UoXCJHZXRJc0xpZ2h0TW9kZVwiKSxcbiAgICBHZXRUaGVtZUNvbG9yOiBhc3luYyAoKTogUHJvbWlzZTxGSGV4Q29sb3I+ID0+IGlwY1JlbmRlcmVyLmludm9rZShcIkdldFRoZW1lQ29sb3JcIilcbn07XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoXCJlbGVjdHJvblwiLCBFbGVjdHJvbkhhbmRsZXIpO1xuXG5leHBvcnQgdHlwZSBGRWxlY3Ryb25IYW5kbGVyID0gdHlwZW9mIEVsZWN0cm9uSGFuZGxlcjtcblxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=