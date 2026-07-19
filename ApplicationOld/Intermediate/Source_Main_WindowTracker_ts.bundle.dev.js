"use strict";
exports.id = "Source_Main_WindowTracker_ts";
exports.ids = ["Source_Main_WindowTracker_ts"];
exports.modules = {

/***/ "./Source/Main/Initialize/Initialize.ts"
/*!**********************************************!*\
  !*** ./Source/Main/Initialize/Initialize.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Initialize.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterInitializationFunction = RegisterInitializationFunction;
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Log_1 = __webpack_require__(/*! #/Development/Log/Log */ "./Source/Main/Development/Log/Log.ts");
const InitializationFunctions = {};
let LoggedAppReady = false;
/**
 * For side effects `import`ed via `SideEffects.ts` that require `app.whenReady()` to be fulfilled.
 */
async function RegisterInitializationFunction(Name, Initializer, DependencyArray = []) {
    const Log = (0, Log_1.GetLogger)("Initialize");
    Log(`Going to register initializer with name ${Name}.`);
    // process.stdout.write(`Going to register initializer with name ${ Name }.\n`);
    await electron_1.app.whenReady();
    if (!LoggedAppReady) {
        LoggedAppReady = true;
        // Log("App is ready!");
        process.stdout.write("App is ready!");
    }
    const PartialInitializer = {
        DependencyArray,
        IsFulfilled: false
    };
    const WrappedInitializer = new Promise((Resolve, Reject) => {
        let TimerId = undefined;
        const TimeStarted = new Date().getTime();
        const TimeBetweenChecks = 250;
        const MaxDuration = 60 * 1000;
        let TimeOfLastCheck = TimeStarted;
        const Check = () => {
            const TimedOut = (TimeOfLastCheck - TimeStarted) >= MaxDuration;
            if (TimedOut && TimerId !== undefined) {
                /* eslint-disable @stylistic/max-len */
                // Log.Error(`Initializer ${ Name } could not be fulfilled.  Its dependencies are ${ DependencyArray.join(", ") }.`);
                clearInterval(TimerId);
                Reject(`Initializer ${Name} could not be fulfilled.  Its dependencies are ${DependencyArray.join(", ")}.`);
                /* eslint-enable @stylistic/max-len */
            }
            const AreDependenciesRegistered = DependencyArray.every((DependencyName) => {
                return DependencyName in InitializationFunctions;
            });
            if (!AreDependenciesRegistered) {
                TimeOfLastCheck = new Date().getTime();
                return;
            }
            const AreDependenciesFulfilled = DependencyArray.every((DependencyName) => {
                if (InitializationFunctions[DependencyName]) {
                    const { IsFulfilled } = InitializationFunctions[DependencyName];
                    return IsFulfilled;
                }
                else {
                    return false;
                }
            });
            if (AreDependenciesFulfilled) {
                if (TimerId !== undefined) {
                    clearInterval(TimerId);
                    Initializer().then(() => {
                        PartialInitializer.IsFulfilled = true;
                        Resolve();
                    });
                }
            }
            TimeOfLastCheck = new Date().getTime();
        };
        TimerId = setInterval(Check, TimeBetweenChecks);
    });
    if (Name in InitializationFunctions) {
        throw new Error(`Two initializer functions were registered with the same name, "${Name}".`);
    }
    PartialInitializer.Initializer = WrappedInitializer;
    InitializationFunctions[Name] = PartialInitializer;
}


/***/ },

/***/ "./Source/Main/Initialize/index.ts"
/*!*****************************************!*\
  !*** ./Source/Main/Initialize/index.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Initialize */ "./Source/Main/Initialize/Initialize.ts"), exports);


/***/ },

/***/ "./Source/Main/WindowTracker.ts"
/*!**************************************!*\
  !*** ./Source/Main/WindowTracker.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      WindowTracker.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Initialize_1 = __webpack_require__(/*! ./Initialize */ "./Source/Main/Initialize/index.ts");
const InitializeWindowTracker = async () => {
    (0, wm_windows_1.InitializeWindowTracker)();
};
(0, Initialize_1.RegisterInitializationFunction)("WindowTracker", InitializeWindowTracker, ["NodeIpc"]);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luZG93VHJhY2tlcl90cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7OztHQUtHOztBQWVILHdFQXNHQztBQWpIRCxtRUFBc0M7QUFFdEMsdUdBQWtEO0FBRWxELE1BQU0sdUJBQXVCLEdBQWtCLEVBQUcsQ0FBQztBQUVuRCxJQUFJLGNBQWMsR0FBWSxLQUFLLENBQUM7QUFFcEM7O0dBRUc7QUFDSSxLQUFLLFVBQVUsOEJBQThCLENBQ2hELElBQVksRUFDWixXQUFrQyxFQUNsQyxrQkFBaUMsRUFBRztJQUdwQyxNQUFNLEdBQUcsR0FBWSxtQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdDLEdBQUcsQ0FBQywyQ0FBNEMsSUFBSyxHQUFHLENBQUMsQ0FBQztJQUMxRCxnRkFBZ0Y7SUFDaEYsTUFBTSxjQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFdEIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsQ0FBQztRQUNHLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsd0JBQXdCO1FBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxNQUFNLGtCQUFrQixHQUNwQjtRQUNJLGVBQWU7UUFDZixXQUFXLEVBQUUsS0FBSztLQUNyQixDQUFDO0lBRU4sTUFBTSxrQkFBa0IsR0FBa0IsSUFBSSxPQUFPLENBQU8sQ0FDeEQsT0FBb0IsRUFDcEIsTUFBZSxFQUNYLEVBQUU7UUFFTixJQUFJLE9BQU8sR0FBK0IsU0FBUyxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFXLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakQsTUFBTSxpQkFBaUIsR0FBVyxHQUFHLENBQUM7UUFDdEMsTUFBTSxXQUFXLEdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN0QyxJQUFJLGVBQWUsR0FBVyxXQUFXLENBQUM7UUFFMUMsTUFBTSxLQUFLLEdBQUcsR0FBUyxFQUFFO1lBRXJCLE1BQU0sUUFBUSxHQUFZLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQztZQUN6RSxJQUFJLFFBQVEsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUNyQyxDQUFDO2dCQUNHLHVDQUF1QztnQkFDdkMscUhBQXFIO2dCQUNySCxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxlQUFnQixJQUFLLGtEQUFtRCxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0csc0NBQXNDO1lBQzFDLENBQUM7WUFFRCxNQUFNLHlCQUF5QixHQUFZLGVBQWUsQ0FBQyxLQUFLLENBQzVELENBQUMsY0FBc0IsRUFBVyxFQUFFO2dCQUVoQyxPQUFPLGNBQWMsSUFBSSx1QkFBdUIsQ0FBQztZQUNyRCxDQUFDLENBQ0osQ0FBQztZQUVGLElBQUksQ0FBQyx5QkFBeUIsRUFDOUIsQ0FBQztnQkFDRyxlQUFlLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDdkMsT0FBTztZQUNYLENBQUM7WUFFRCxNQUFNLHdCQUF3QixHQUFZLGVBQWUsQ0FBQyxLQUFLLENBQzNELENBQUMsY0FBc0IsRUFBVyxFQUFFO2dCQUVoQyxJQUFJLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxFQUMzQyxDQUFDO29CQUNHLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDaEUsT0FBTyxXQUFXLENBQUM7Z0JBQ3ZCLENBQUM7cUJBRUQsQ0FBQztvQkFDRyxPQUFPLEtBQUssQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUMsQ0FDSixDQUFDO1lBRUYsSUFBSSx3QkFBd0IsRUFDNUIsQ0FBQztnQkFDRyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQ3pCLENBQUM7b0JBQ0csYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QixXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBUyxFQUFFO3dCQUUxQixrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3dCQUN0QyxPQUFPLEVBQUUsQ0FBQztvQkFDZCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztZQUVELGVBQWUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQztRQUVGLE9BQU8sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLElBQUksSUFBSSx1QkFBdUIsRUFDbkMsQ0FBQztRQUNHLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQW1FLElBQUssSUFBSSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVELGtCQUFrQixDQUFDLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztJQUVwRCx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxrQkFBa0MsQ0FBQztBQUN2RSxDQUFDOzs7Ozs7Ozs7Ozs7QUMxSEQ7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCx5R0FBNkI7Ozs7Ozs7Ozs7OztBQ1A3Qjs7Ozs7R0FLRzs7QUFFSCwyRkFBK0Y7QUFDL0Ysa0dBQThEO0FBRTlELE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBRXRELHdDQUE2QixHQUFFLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsK0NBQThCLEVBQUMsZUFBZSxFQUFFLHVCQUF1QixFQUFFLENBQUUsU0FBUyxDQUFFLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9Jbml0aWFsaXplLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1dpbmRvd1RyYWNrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSAgICAgIEluaXRpYWxpemUudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZJbml0aWFsaXplciwgRkluaXRpYWxpemVycyB9IGZyb20gXCIuL0luaXRpYWxpemUuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgVFJlamVjdCwgVFRoZW4gfSBmcm9tIFwiQHNvcnJlbGwvdXRpbGl0aWVzL2FzeW5jXCI7XG5pbXBvcnQgeyBhcHAgYXMgQXBwIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIgfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiIy9EZXZlbG9wbWVudC9Mb2cvTG9nXCI7XG5cbmNvbnN0IEluaXRpYWxpemF0aW9uRnVuY3Rpb25zOiBGSW5pdGlhbGl6ZXJzID0geyB9O1xuXG5sZXQgTG9nZ2VkQXBwUmVhZHk6IGJvb2xlYW4gPSBmYWxzZTtcblxuLyoqXG4gKiBGb3Igc2lkZSBlZmZlY3RzIGBpbXBvcnRgZWQgdmlhIGBTaWRlRWZmZWN0cy50c2AgdGhhdCByZXF1aXJlIGBhcHAud2hlblJlYWR5KClgIHRvIGJlIGZ1bGZpbGxlZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcbiAgICBOYW1lOiBzdHJpbmcsXG4gICAgSW5pdGlhbGl6ZXI6ICgoKSA9PiBQcm9taXNlPHZvaWQ+KSxcbiAgICBEZXBlbmRlbmN5QXJyYXk6IEFycmF5PHN0cmluZz4gPSBbIF1cbik6IFByb21pc2U8dm9pZD5cbntcbiAgICBjb25zdCBMb2c6IEZMb2dnZXIgPSBHZXRMb2dnZXIoXCJJbml0aWFsaXplXCIpO1xuICAgIExvZyhgR29pbmcgdG8gcmVnaXN0ZXIgaW5pdGlhbGl6ZXIgd2l0aCBuYW1lICR7IE5hbWUgfS5gKTtcbiAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZShgR29pbmcgdG8gcmVnaXN0ZXIgaW5pdGlhbGl6ZXIgd2l0aCBuYW1lICR7IE5hbWUgfS5cXG5gKTtcbiAgICBhd2FpdCBBcHAud2hlblJlYWR5KCk7XG5cbiAgICBpZiAoIUxvZ2dlZEFwcFJlYWR5KVxuICAgIHtcbiAgICAgICAgTG9nZ2VkQXBwUmVhZHkgPSB0cnVlO1xuICAgICAgICAvLyBMb2coXCJBcHAgaXMgcmVhZHkhXCIpO1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShcIkFwcCBpcyByZWFkeSFcIik7XG4gICAgfVxuXG4gICAgY29uc3QgUGFydGlhbEluaXRpYWxpemVyOiBQYXJ0aWFsPEZJbml0aWFsaXplcj4gPVxuICAgICAgICB7XG4gICAgICAgICAgICBEZXBlbmRlbmN5QXJyYXksXG4gICAgICAgICAgICBJc0Z1bGZpbGxlZDogZmFsc2VcbiAgICAgICAgfTtcblxuICAgIGNvbnN0IFdyYXBwZWRJbml0aWFsaXplcjogUHJvbWlzZTx2b2lkPiA9IG5ldyBQcm9taXNlPHZvaWQ+KChcbiAgICAgICAgUmVzb2x2ZTogVFRoZW48dm9pZD4sXG4gICAgICAgIFJlamVjdDogVFJlamVjdFxuICAgICk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGxldCBUaW1lcklkOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgVGltZVN0YXJ0ZWQ6IG51bWJlciA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zdCBUaW1lQmV0d2VlbkNoZWNrczogbnVtYmVyID0gMjUwO1xuICAgICAgICBjb25zdCBNYXhEdXJhdGlvbjogbnVtYmVyID0gNjAgKiAxMDAwO1xuICAgICAgICBsZXQgVGltZU9mTGFzdENoZWNrOiBudW1iZXIgPSBUaW1lU3RhcnRlZDtcblxuICAgICAgICBjb25zdCBDaGVjayA9ICgpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IFRpbWVkT3V0OiBib29sZWFuID0gKFRpbWVPZkxhc3RDaGVjayAtIFRpbWVTdGFydGVkKSA+PSBNYXhEdXJhdGlvbjtcbiAgICAgICAgICAgIGlmIChUaW1lZE91dCAmJiBUaW1lcklkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICAgICAgLy8gTG9nLkVycm9yKGBJbml0aWFsaXplciAkeyBOYW1lIH0gY291bGQgbm90IGJlIGZ1bGZpbGxlZC4gIEl0cyBkZXBlbmRlbmNpZXMgYXJlICR7IERlcGVuZGVuY3lBcnJheS5qb2luKFwiLCBcIikgfS5gKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKFRpbWVySWQpO1xuICAgICAgICAgICAgICAgIFJlamVjdChgSW5pdGlhbGl6ZXIgJHsgTmFtZSB9IGNvdWxkIG5vdCBiZSBmdWxmaWxsZWQuICBJdHMgZGVwZW5kZW5jaWVzIGFyZSAkeyBEZXBlbmRlbmN5QXJyYXkuam9pbihcIiwgXCIpIH0uYCk7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgQXJlRGVwZW5kZW5jaWVzUmVnaXN0ZXJlZDogYm9vbGVhbiA9IERlcGVuZGVuY3lBcnJheS5ldmVyeShcbiAgICAgICAgICAgICAgICAoRGVwZW5kZW5jeU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBEZXBlbmRlbmN5TmFtZSBpbiBJbml0aWFsaXphdGlvbkZ1bmN0aW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoIUFyZURlcGVuZGVuY2llc1JlZ2lzdGVyZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVGltZU9mTGFzdENoZWNrID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBBcmVEZXBlbmRlbmNpZXNGdWxmaWxsZWQ6IGJvb2xlYW4gPSBEZXBlbmRlbmN5QXJyYXkuZXZlcnkoXG4gICAgICAgICAgICAgICAgKERlcGVuZGVuY3lOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoSW5pdGlhbGl6YXRpb25GdW5jdGlvbnNbRGVwZW5kZW5jeU5hbWVdKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IElzRnVsZmlsbGVkIH0gPSBJbml0aWFsaXphdGlvbkZ1bmN0aW9uc1tEZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSXNGdWxmaWxsZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoQXJlRGVwZW5kZW5jaWVzRnVsZmlsbGVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChUaW1lcklkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKFRpbWVySWQpO1xuICAgICAgICAgICAgICAgICAgICBJbml0aWFsaXplcigpLnRoZW4oKCk6IHZvaWQgPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUGFydGlhbEluaXRpYWxpemVyLklzRnVsZmlsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUaW1lT2ZMYXN0Q2hlY2sgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBUaW1lcklkID0gc2V0SW50ZXJ2YWwoQ2hlY2ssIFRpbWVCZXR3ZWVuQ2hlY2tzKTtcbiAgICB9KTtcblxuICAgIGlmIChOYW1lIGluIEluaXRpYWxpemF0aW9uRnVuY3Rpb25zKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUd28gaW5pdGlhbGl6ZXIgZnVuY3Rpb25zIHdlcmUgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzYW1lIG5hbWUsIFwiJHsgTmFtZSB9XCIuYCk7XG4gICAgfVxuXG4gICAgUGFydGlhbEluaXRpYWxpemVyLkluaXRpYWxpemVyID0gV3JhcHBlZEluaXRpYWxpemVyO1xuXG4gICAgSW5pdGlhbGl6YXRpb25GdW5jdGlvbnNbTmFtZV0gPSBQYXJ0aWFsSW5pdGlhbGl6ZXIgYXMgRkluaXRpYWxpemVyO1xufVxuIiwiLyoqXG4gKiBAZmlsZSAgICAgIGluZGV4LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vSW5pdGlhbGl6ZVwiO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFdpbmRvd1RyYWNrZXIudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBJbml0aWFsaXplV2luZG93VHJhY2tlciBhcyBJbml0aWFsaXplV2luZG93VHJhY2tlck5hdGl2ZSB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQgeyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiLi9Jbml0aWFsaXplXCI7XG5cbmNvbnN0IEluaXRpYWxpemVXaW5kb3dUcmFja2VyID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBJbml0aWFsaXplV2luZG93VHJhY2tlck5hdGl2ZSgpO1xufTtcblxuUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFwiV2luZG93VHJhY2tlclwiLCBJbml0aWFsaXplV2luZG93VHJhY2tlciwgWyBcIk5vZGVJcGNcIiBdKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==