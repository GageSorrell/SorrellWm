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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7QUNOQTs7O0dBR0c7QUFFSCxvQkFBb0I7QUFFeUQ7QUFJN0UsTUFBTSxlQUFlLEdBQ3JCO0lBQ0ksV0FBVyxFQUNYO1FBQ0ksRUFBRSxDQUFDLE9BQWUsRUFBRSxRQUFrRDtZQUVsRSxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQXdCLEVBQUUsR0FBRyxJQUFvQixFQUFFLEVBQUU7Z0JBRXZFLE9BQU8sUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDO1lBRUYsaURBQVcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXRDLE9BQU8sR0FBRyxFQUFFO2dCQUVSLGlEQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUM7UUFDTixDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQWUsRUFBRSxRQUFrRDtZQUVwRSxpREFBVyxDQUFDLElBQUksQ0FDWixPQUFPLEVBQ1AsQ0FBQyxNQUFzQixFQUFFLEdBQUcsVUFBMEIsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQ3JGLENBQUM7UUFDTixDQUFDO1FBQ0QsY0FBYyxDQUFDLE9BQWUsRUFBRSxRQUFrRDtZQUU5RSxpREFBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELFdBQVcsQ0FBQyxPQUFlLEVBQUUsR0FBRyxTQUF5QjtZQUVyRCxpREFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQ0o7SUFDRCxnQkFBZ0IsRUFBRSxLQUFLLElBQXNCLEVBQUUsQ0FBQyxpREFBVyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztJQUN0RixjQUFjLEVBQUUsS0FBSyxJQUFzQixFQUFFLENBQUMsaURBQVcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDbEYsYUFBYSxFQUFFLEtBQUssSUFBd0IsRUFBRSxDQUFDLGlEQUFXLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztDQUNyRixDQUFDO0FBRUYsbURBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9QcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogRmlsZTogICAgUHJlbG9hZC50c1xuICogQXV0aG9yOiAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5pbXBvcnQgeyB0eXBlIElwY1JlbmRlcmVyRXZlbnQsIGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBIV2luZG93LCBGSGV4Q29sb3IgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cblxuY29uc3QgRWxlY3Ryb25IYW5kbGVyID1cbntcbiAgICBpcGNSZW5kZXJlcjpcbiAgICB7XG4gICAgICAgIE9uKENoYW5uZWw6IHN0cmluZywgTGlzdGVuZXI6ICgoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT4gdm9pZCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IEFycmF5PHVua25vd24+KSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBMaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLm9uKENoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgICAgICAgIHJldHVybiAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKENoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBPbmNlKENoYW5uZWw6IHN0cmluZywgTGlzdGVuZXI6ICgoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT4gdm9pZCkpOiB2b2lkXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLm9uY2UoXG4gICAgICAgICAgICAgICAgQ2hhbm5lbCxcbiAgICAgICAgICAgICAgICAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+IExpc3RlbmVyKC4uLl9Bcmd1bWVudHMpXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBSZW1vdmVMaXN0ZW5lcihDaGFubmVsOiBzdHJpbmcsIExpc3RlbmVyOiAoKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+IHZvaWQpKTogdm9pZFxuICAgICAgICB7XG4gICAgICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihDaGFubmVsLCBMaXN0ZW5lcik7XG4gICAgICAgIH0sXG4gICAgICAgIFNlbmRNZXNzYWdlKENoYW5uZWw6IHN0cmluZywgLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPilcbiAgICAgICAge1xuICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChDaGFubmVsLCAuLi5Bcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBHZXRGb2N1c2VkV2luZG93OiBhc3luYyAoKTogUHJvbWlzZTxIV2luZG93PiA9PiBpcGNSZW5kZXJlci5pbnZva2UoXCJHZXRGb2N1c2VkV2luZG93XCIpLFxuICAgIEdldElzTGlnaHRNb2RlOiBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiBpcGNSZW5kZXJlci5pbnZva2UoXCJHZXRJc0xpZ2h0TW9kZVwiKSxcbiAgICBHZXRUaGVtZUNvbG9yOiBhc3luYyAoKTogUHJvbWlzZTxGSGV4Q29sb3I+ID0+IGlwY1JlbmRlcmVyLmludm9rZShcIkdldFRoZW1lQ29sb3JcIilcbn07XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoXCJlbGVjdHJvblwiLCBFbGVjdHJvbkhhbmRsZXIpO1xuXG5leHBvcnQgdHlwZSBGRWxlY3Ryb25IYW5kbGVyID0gdHlwZW9mIEVsZWN0cm9uSGFuZGxlcjtcblxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=