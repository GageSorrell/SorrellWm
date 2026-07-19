"use strict";
exports.id = "Source_Main_Initialize_Initialize_ts";
exports.ids = ["Source_Main_Initialize_Initialize_ts"];
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


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fSW5pdGlhbGl6ZV9Jbml0aWFsaXplX3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0dBS0c7O0FBZUgsd0VBc0dDO0FBakhELG1FQUFzQztBQUV0Qyx1R0FBa0Q7QUFFbEQsTUFBTSx1QkFBdUIsR0FBa0IsRUFBRyxDQUFDO0FBRW5ELElBQUksY0FBYyxHQUFZLEtBQUssQ0FBQztBQUVwQzs7R0FFRztBQUNJLEtBQUssVUFBVSw4QkFBOEIsQ0FDaEQsSUFBWSxFQUNaLFdBQWtDLEVBQ2xDLGtCQUFpQyxFQUFHO0lBR3BDLE1BQU0sR0FBRyxHQUFZLG1CQUFTLEVBQUMsWUFBWSxDQUFDLENBQUM7SUFDN0MsR0FBRyxDQUFDLDJDQUE0QyxJQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQzFELGdGQUFnRjtJQUNoRixNQUFNLGNBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUV0QixJQUFJLENBQUMsY0FBYyxFQUNuQixDQUFDO1FBQ0csY0FBYyxHQUFHLElBQUksQ0FBQztRQUN0Qix3QkFBd0I7UUFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sa0JBQWtCLEdBQ3BCO1FBQ0ksZUFBZTtRQUNmLFdBQVcsRUFBRSxLQUFLO0tBQ3JCLENBQUM7SUFFTixNQUFNLGtCQUFrQixHQUFrQixJQUFJLE9BQU8sQ0FBTyxDQUN4RCxPQUFvQixFQUNwQixNQUFlLEVBQ1gsRUFBRTtRQUVOLElBQUksT0FBTyxHQUErQixTQUFTLENBQUM7UUFDcEQsTUFBTSxXQUFXLEdBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqRCxNQUFNLGlCQUFpQixHQUFXLEdBQUcsQ0FBQztRQUN0QyxNQUFNLFdBQVcsR0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLElBQUksZUFBZSxHQUFXLFdBQVcsQ0FBQztRQUUxQyxNQUFNLEtBQUssR0FBRyxHQUFTLEVBQUU7WUFFckIsTUFBTSxRQUFRLEdBQVksQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLElBQUksV0FBVyxDQUFDO1lBQ3pFLElBQUksUUFBUSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQ3JDLENBQUM7Z0JBQ0csdUNBQXVDO2dCQUN2QyxxSEFBcUg7Z0JBQ3JILGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLGVBQWdCLElBQUssa0RBQW1ELGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMvRyxzQ0FBc0M7WUFDMUMsQ0FBQztZQUVELE1BQU0seUJBQXlCLEdBQVksZUFBZSxDQUFDLEtBQUssQ0FDNUQsQ0FBQyxjQUFzQixFQUFXLEVBQUU7Z0JBRWhDLE9BQU8sY0FBYyxJQUFJLHVCQUF1QixDQUFDO1lBQ3JELENBQUMsQ0FDSixDQUFDO1lBRUYsSUFBSSxDQUFDLHlCQUF5QixFQUM5QixDQUFDO2dCQUNHLGVBQWUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN2QyxPQUFPO1lBQ1gsQ0FBQztZQUVELE1BQU0sd0JBQXdCLEdBQVksZUFBZSxDQUFDLEtBQUssQ0FDM0QsQ0FBQyxjQUFzQixFQUFXLEVBQUU7Z0JBRWhDLElBQUksdUJBQXVCLENBQUMsY0FBYyxDQUFDLEVBQzNDLENBQUM7b0JBQ0csTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNoRSxPQUFPLFdBQVcsQ0FBQztnQkFDdkIsQ0FBQztxQkFFRCxDQUFDO29CQUNHLE9BQU8sS0FBSyxDQUFDO2dCQUNqQixDQUFDO1lBQ0wsQ0FBQyxDQUNKLENBQUM7WUFFRixJQUFJLHdCQUF3QixFQUM1QixDQUFDO2dCQUNHLElBQUksT0FBTyxLQUFLLFNBQVMsRUFDekIsQ0FBQztvQkFDRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3ZCLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFTLEVBQUU7d0JBRTFCLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ3RDLE9BQU8sRUFBRSxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDO1lBRUQsZUFBZSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFDO1FBRUYsT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxJQUFJLHVCQUF1QixFQUNuQyxDQUFDO1FBQ0csTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBbUUsSUFBSyxJQUFJLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQsa0JBQWtCLENBQUMsV0FBVyxHQUFHLGtCQUFrQixDQUFDO0lBRXBELHVCQUF1QixDQUFDLElBQUksQ0FBQyxHQUFHLGtCQUFrQyxDQUFDO0FBQ3ZFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0luaXRpYWxpemUvSW5pdGlhbGl6ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlICAgICAgSW5pdGlhbGl6ZS50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkluaXRpYWxpemVyLCBGSW5pdGlhbGl6ZXJzIH0gZnJvbSBcIi4vSW5pdGlhbGl6ZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBUUmVqZWN0LCBUVGhlbiB9IGZyb20gXCJAc29ycmVsbC91dGlsaXRpZXMvYXN5bmNcIjtcbmltcG9ydCB7IGFwcCBhcyBBcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCIjL0RldmVsb3BtZW50L0xvZy9Mb2dcIjtcblxuY29uc3QgSW5pdGlhbGl6YXRpb25GdW5jdGlvbnM6IEZJbml0aWFsaXplcnMgPSB7IH07XG5cbmxldCBMb2dnZWRBcHBSZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xuXG4vKipcbiAqIEZvciBzaWRlIGVmZmVjdHMgYGltcG9ydGBlZCB2aWEgYFNpZGVFZmZlY3RzLnRzYCB0aGF0IHJlcXVpcmUgYGFwcC53aGVuUmVhZHkoKWAgdG8gYmUgZnVsZmlsbGVkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFxuICAgIE5hbWU6IHN0cmluZyxcbiAgICBJbml0aWFsaXplcjogKCgpID0+IFByb21pc2U8dm9pZD4pLFxuICAgIERlcGVuZGVuY3lBcnJheTogQXJyYXk8c3RyaW5nPiA9IFsgXVxuKTogUHJvbWlzZTx2b2lkPlxue1xuICAgIGNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIkluaXRpYWxpemVcIik7XG4gICAgTG9nKGBHb2luZyB0byByZWdpc3RlciBpbml0aWFsaXplciB3aXRoIG5hbWUgJHsgTmFtZSB9LmApO1xuICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGBHb2luZyB0byByZWdpc3RlciBpbml0aWFsaXplciB3aXRoIG5hbWUgJHsgTmFtZSB9LlxcbmApO1xuICAgIGF3YWl0IEFwcC53aGVuUmVhZHkoKTtcblxuICAgIGlmICghTG9nZ2VkQXBwUmVhZHkpXG4gICAge1xuICAgICAgICBMb2dnZWRBcHBSZWFkeSA9IHRydWU7XG4gICAgICAgIC8vIExvZyhcIkFwcCBpcyByZWFkeSFcIik7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKFwiQXBwIGlzIHJlYWR5IVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBQYXJ0aWFsSW5pdGlhbGl6ZXI6IFBhcnRpYWw8RkluaXRpYWxpemVyPiA9XG4gICAgICAgIHtcbiAgICAgICAgICAgIERlcGVuZGVuY3lBcnJheSxcbiAgICAgICAgICAgIElzRnVsZmlsbGVkOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgY29uc3QgV3JhcHBlZEluaXRpYWxpemVyOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2U8dm9pZD4oKFxuICAgICAgICBSZXNvbHZlOiBUVGhlbjx2b2lkPixcbiAgICAgICAgUmVqZWN0OiBUUmVqZWN0XG4gICAgKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgbGV0IFRpbWVySWQ6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBUaW1lU3RhcnRlZDogbnVtYmVyID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IFRpbWVCZXR3ZWVuQ2hlY2tzOiBudW1iZXIgPSAyNTA7XG4gICAgICAgIGNvbnN0IE1heER1cmF0aW9uOiBudW1iZXIgPSA2MCAqIDEwMDA7XG4gICAgICAgIGxldCBUaW1lT2ZMYXN0Q2hlY2s6IG51bWJlciA9IFRpbWVTdGFydGVkO1xuXG4gICAgICAgIGNvbnN0IENoZWNrID0gKCk6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgVGltZWRPdXQ6IGJvb2xlYW4gPSAoVGltZU9mTGFzdENoZWNrIC0gVGltZVN0YXJ0ZWQpID49IE1heER1cmF0aW9uO1xuICAgICAgICAgICAgaWYgKFRpbWVkT3V0ICYmIFRpbWVySWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgICAgICAvLyBMb2cuRXJyb3IoYEluaXRpYWxpemVyICR7IE5hbWUgfSBjb3VsZCBub3QgYmUgZnVsZmlsbGVkLiAgSXRzIGRlcGVuZGVuY2llcyBhcmUgJHsgRGVwZW5kZW5jeUFycmF5LmpvaW4oXCIsIFwiKSB9LmApO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoVGltZXJJZCk7XG4gICAgICAgICAgICAgICAgUmVqZWN0KGBJbml0aWFsaXplciAkeyBOYW1lIH0gY291bGQgbm90IGJlIGZ1bGZpbGxlZC4gIEl0cyBkZXBlbmRlbmNpZXMgYXJlICR7IERlcGVuZGVuY3lBcnJheS5qb2luKFwiLCBcIikgfS5gKTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBBcmVEZXBlbmRlbmNpZXNSZWdpc3RlcmVkOiBib29sZWFuID0gRGVwZW5kZW5jeUFycmF5LmV2ZXJ5KFxuICAgICAgICAgICAgICAgIChEZXBlbmRlbmN5TmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlcGVuZGVuY3lOYW1lIGluIEluaXRpYWxpemF0aW9uRnVuY3Rpb25zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghQXJlRGVwZW5kZW5jaWVzUmVnaXN0ZXJlZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUaW1lT2ZMYXN0Q2hlY2sgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEFyZURlcGVuZGVuY2llc0Z1bGZpbGxlZDogYm9vbGVhbiA9IERlcGVuZGVuY3lBcnJheS5ldmVyeShcbiAgICAgICAgICAgICAgICAoRGVwZW5kZW5jeU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChJbml0aWFsaXphdGlvbkZ1bmN0aW9uc1tEZXBlbmRlbmN5TmFtZV0pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgSXNGdWxmaWxsZWQgfSA9IEluaXRpYWxpemF0aW9uRnVuY3Rpb25zW0RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJc0Z1bGZpbGxlZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChBcmVEZXBlbmRlbmNpZXNGdWxmaWxsZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKFRpbWVySWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoVGltZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIEluaXRpYWxpemVyKCkudGhlbigoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJ0aWFsSW5pdGlhbGl6ZXIuSXNGdWxmaWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFRpbWVPZkxhc3RDaGVjayA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFRpbWVySWQgPSBzZXRJbnRlcnZhbChDaGVjaywgVGltZUJldHdlZW5DaGVja3MpO1xuICAgIH0pO1xuXG4gICAgaWYgKE5hbWUgaW4gSW5pdGlhbGl6YXRpb25GdW5jdGlvbnMpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFR3byBpbml0aWFsaXplciBmdW5jdGlvbnMgd2VyZSByZWdpc3RlcmVkIHdpdGggdGhlIHNhbWUgbmFtZSwgXCIkeyBOYW1lIH1cIi5gKTtcbiAgICB9XG5cbiAgICBQYXJ0aWFsSW5pdGlhbGl6ZXIuSW5pdGlhbGl6ZXIgPSBXcmFwcGVkSW5pdGlhbGl6ZXI7XG5cbiAgICBJbml0aWFsaXphdGlvbkZ1bmN0aW9uc1tOYW1lXSA9IFBhcnRpYWxJbml0aWFsaXplciBhcyBGSW5pdGlhbGl6ZXI7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=