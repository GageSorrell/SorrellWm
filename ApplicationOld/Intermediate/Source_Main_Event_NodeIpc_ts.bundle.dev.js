"use strict";
exports.id = "Source_Main_Event_NodeIpc_ts";
exports.ids = ["Source_Main_Event_NodeIpc_ts"];
exports.modules = {

/***/ "./Source/Main/Event/NodeIpc.ts"
/*!**************************************!*\
  !*** ./Source/Main/Event/NodeIpc.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      NodeIpc.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Unsubscribe = exports.Subscribe = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Initialize_1 = __webpack_require__(/*! ../Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
let NextListenerId = 0;
const Listeners = new Map();
const Subscribe = (Channel, Callback) => {
    const Id = NextListenerId++;
    Listeners.set(Id, { Callback, Channel });
    return Id;
};
exports.Subscribe = Subscribe;
const Unsubscribe = (Id) => {
    Listeners.delete(Id);
};
exports.Unsubscribe = Unsubscribe;
function OnMessage(Channel, Message) {
    Listeners.forEach((Callback) => {
        if (Callback.Channel === Channel) {
            Callback.Callback(Message);
        }
    });
}
(0, wm_windows_1.InitializeIpc)(OnMessage);
async function InitializeNodeIpc() {
    return Promise.resolve();
}
(0, Initialize_1.RegisterInitializationFunction)("NodeIpc", InitializeNodeIpc);


/***/ },

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fRXZlbnRfTm9kZUlwY190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7OztHQUtHOzs7QUFHSCwyRkFBb0Q7QUFDcEQsbUhBQTBFO0FBRTFFLElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBeUMsSUFBSSxHQUFHLEVBQWtDLENBQUM7QUFFM0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFlLEVBQUUsUUFBc0IsRUFBVSxFQUFFO0lBRXpFLE1BQU0sRUFBRSxHQUFXLGNBQWMsRUFBRSxDQUFDO0lBQ3BDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDekMsT0FBTyxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUM7QUFMVyxpQkFBUyxhQUtwQjtBQUVLLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBVSxFQUFRLEVBQUU7SUFFNUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QixDQUFDLENBQUM7QUFIVyxtQkFBVyxlQUd0QjtBQUVGLFNBQVMsU0FBUyxDQUFDLE9BQWUsRUFBRSxPQUFnQjtJQUVoRCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBZ0MsRUFBUSxFQUFFO1FBRXpELElBQUksUUFBUSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQ2hDLENBQUM7WUFDRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCw4QkFBYSxFQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXpCLEtBQUssVUFBVSxpQkFBaUI7SUFFNUIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUVELCtDQUE4QixFQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUM1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QztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztZQUVELGVBQWUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNDLENBQUMsQ0FBQztRQUVGLE9BQU8sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLElBQUksSUFBSSx1QkFBdUIsRUFDbkMsQ0FBQztRQUNHLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQW1FLElBQUssSUFBSSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVELGtCQUFrQixDQUFDLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztJQUVwRCx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxrQkFBa0MsQ0FBQztBQUN2RSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9FdmVudC9Ob2RlSXBjLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9Jbml0aWFsaXplLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBOb2RlSXBjLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSXBjQ2FsbGJhY2ssIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQgfSBmcm9tIFwiLi9Ob2RlSXBjLlR5cGVzXCI7XG5pbXBvcnQgeyBJbml0aWFsaXplSXBjIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIuLi9Jbml0aWFsaXplL0luaXRpYWxpemVcIjtcblxubGV0IE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuY29uc3QgTGlzdGVuZXJzOiBUTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4gPSBuZXcgTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4oKTtcblxuZXhwb3J0IGNvbnN0IFN1YnNjcmliZSA9IChDaGFubmVsOiBzdHJpbmcsIENhbGxiYWNrOiBGSXBjQ2FsbGJhY2spOiBudW1iZXIgPT5cbntcbiAgICBjb25zdCBJZDogbnVtYmVyID0gTmV4dExpc3RlbmVySWQrKztcbiAgICBMaXN0ZW5lcnMuc2V0KElkLCB7IENhbGxiYWNrLCBDaGFubmVsIH0pO1xuICAgIHJldHVybiBJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9Plxue1xuICAgIExpc3RlbmVycy5kZWxldGUoSWQpO1xufTtcblxuZnVuY3Rpb24gT25NZXNzYWdlKENoYW5uZWw6IHN0cmluZywgTWVzc2FnZTogdW5rbm93bilcbntcbiAgICBMaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6IEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ2FsbGJhY2suQ2hhbm5lbCA9PT0gQ2hhbm5lbClcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2suQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuSW5pdGlhbGl6ZUlwYyhPbk1lc3NhZ2UpO1xuXG5hc3luYyBmdW5jdGlvbiBJbml0aWFsaXplTm9kZUlwYygpOiBQcm9taXNlPHZvaWQ+XG57XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJOb2RlSXBjXCIsIEluaXRpYWxpemVOb2RlSXBjKTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBJbml0aWFsaXplLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSW5pdGlhbGl6ZXIsIEZJbml0aWFsaXplcnMgfSBmcm9tIFwiLi9Jbml0aWFsaXplLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRSZWplY3QsIFRUaGVuIH0gZnJvbSBcIkBzb3JyZWxsL3V0aWxpdGllcy9hc3luY1wiO1xuaW1wb3J0IHsgYXBwIGFzIEFwcCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHR5cGUgeyBGTG9nZ2VyIH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgR2V0TG9nZ2VyIH0gZnJvbSBcIiMvRGV2ZWxvcG1lbnQvTG9nL0xvZ1wiO1xuXG5jb25zdCBJbml0aWFsaXphdGlvbkZ1bmN0aW9uczogRkluaXRpYWxpemVycyA9IHsgfTtcblxubGV0IExvZ2dlZEFwcFJlYWR5OiBib29sZWFuID0gZmFsc2U7XG5cbi8qKlxuICogRm9yIHNpZGUgZWZmZWN0cyBgaW1wb3J0YGVkIHZpYSBgU2lkZUVmZmVjdHMudHNgIHRoYXQgcmVxdWlyZSBgYXBwLndoZW5SZWFkeSgpYCB0byBiZSBmdWxmaWxsZWQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXG4gICAgTmFtZTogc3RyaW5nLFxuICAgIEluaXRpYWxpemVyOiAoKCkgPT4gUHJvbWlzZTx2b2lkPiksXG4gICAgRGVwZW5kZW5jeUFycmF5OiBBcnJheTxzdHJpbmc+ID0gWyBdXG4pOiBQcm9taXNlPHZvaWQ+XG57XG4gICAgY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiSW5pdGlhbGl6ZVwiKTtcbiAgICBMb2coYEdvaW5nIHRvIHJlZ2lzdGVyIGluaXRpYWxpemVyIHdpdGggbmFtZSAkeyBOYW1lIH0uYCk7XG4gICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoYEdvaW5nIHRvIHJlZ2lzdGVyIGluaXRpYWxpemVyIHdpdGggbmFtZSAkeyBOYW1lIH0uXFxuYCk7XG4gICAgYXdhaXQgQXBwLndoZW5SZWFkeSgpO1xuXG4gICAgaWYgKCFMb2dnZWRBcHBSZWFkeSlcbiAgICB7XG4gICAgICAgIExvZ2dlZEFwcFJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy8gTG9nKFwiQXBwIGlzIHJlYWR5IVwiKTtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoXCJBcHAgaXMgcmVhZHkhXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IFBhcnRpYWxJbml0aWFsaXplcjogUGFydGlhbDxGSW5pdGlhbGl6ZXI+ID1cbiAgICAgICAge1xuICAgICAgICAgICAgRGVwZW5kZW5jeUFycmF5LFxuICAgICAgICAgICAgSXNGdWxmaWxsZWQ6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICBjb25zdCBXcmFwcGVkSW5pdGlhbGl6ZXI6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZTx2b2lkPigoXG4gICAgICAgIFJlc29sdmU6IFRUaGVuPHZvaWQ+LFxuICAgICAgICBSZWplY3Q6IFRSZWplY3RcbiAgICApOiB2b2lkID0+XG4gICAge1xuICAgICAgICBsZXQgVGltZXJJZDogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IFRpbWVTdGFydGVkOiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgVGltZUJldHdlZW5DaGVja3M6IG51bWJlciA9IDI1MDtcbiAgICAgICAgY29uc3QgTWF4RHVyYXRpb246IG51bWJlciA9IDYwICogMTAwMDtcbiAgICAgICAgbGV0IFRpbWVPZkxhc3RDaGVjazogbnVtYmVyID0gVGltZVN0YXJ0ZWQ7XG5cbiAgICAgICAgY29uc3QgQ2hlY2sgPSAoKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBUaW1lZE91dDogYm9vbGVhbiA9IChUaW1lT2ZMYXN0Q2hlY2sgLSBUaW1lU3RhcnRlZCkgPj0gTWF4RHVyYXRpb247XG4gICAgICAgICAgICBpZiAoVGltZWRPdXQgJiYgVGltZXJJZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgICAgIC8vIExvZy5FcnJvcihgSW5pdGlhbGl6ZXIgJHsgTmFtZSB9IGNvdWxkIG5vdCBiZSBmdWxmaWxsZWQuICBJdHMgZGVwZW5kZW5jaWVzIGFyZSAkeyBEZXBlbmRlbmN5QXJyYXkuam9pbihcIiwgXCIpIH0uYCk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChUaW1lcklkKTtcbiAgICAgICAgICAgICAgICBSZWplY3QoYEluaXRpYWxpemVyICR7IE5hbWUgfSBjb3VsZCBub3QgYmUgZnVsZmlsbGVkLiAgSXRzIGRlcGVuZGVuY2llcyBhcmUgJHsgRGVwZW5kZW5jeUFycmF5LmpvaW4oXCIsIFwiKSB9LmApO1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEFyZURlcGVuZGVuY2llc1JlZ2lzdGVyZWQ6IGJvb2xlYW4gPSBEZXBlbmRlbmN5QXJyYXkuZXZlcnkoXG4gICAgICAgICAgICAgICAgKERlcGVuZGVuY3lOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGVwZW5kZW5jeU5hbWUgaW4gSW5pdGlhbGl6YXRpb25GdW5jdGlvbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFBcmVEZXBlbmRlbmNpZXNSZWdpc3RlcmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFRpbWVPZkxhc3RDaGVjayA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgQXJlRGVwZW5kZW5jaWVzRnVsZmlsbGVkOiBib29sZWFuID0gRGVwZW5kZW5jeUFycmF5LmV2ZXJ5KFxuICAgICAgICAgICAgICAgIChEZXBlbmRlbmN5TmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEluaXRpYWxpemF0aW9uRnVuY3Rpb25zW0RlcGVuZGVuY3lOYW1lXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBJc0Z1bGZpbGxlZCB9ID0gSW5pdGlhbGl6YXRpb25GdW5jdGlvbnNbRGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElzRnVsZmlsbGVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKEFyZURlcGVuZGVuY2llc0Z1bGZpbGxlZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoVGltZXJJZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChUaW1lcklkKTtcbiAgICAgICAgICAgICAgICAgICAgSW5pdGlhbGl6ZXIoKS50aGVuKCgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcnRpYWxJbml0aWFsaXplci5Jc0Z1bGZpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVGltZU9mTGFzdENoZWNrID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgVGltZXJJZCA9IHNldEludGVydmFsKENoZWNrLCBUaW1lQmV0d2VlbkNoZWNrcyk7XG4gICAgfSk7XG5cbiAgICBpZiAoTmFtZSBpbiBJbml0aWFsaXphdGlvbkZ1bmN0aW9ucylcbiAgICB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVHdvIGluaXRpYWxpemVyIGZ1bmN0aW9ucyB3ZXJlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgc2FtZSBuYW1lLCBcIiR7IE5hbWUgfVwiLmApO1xuICAgIH1cblxuICAgIFBhcnRpYWxJbml0aWFsaXplci5Jbml0aWFsaXplciA9IFdyYXBwZWRJbml0aWFsaXplcjtcblxuICAgIEluaXRpYWxpemF0aW9uRnVuY3Rpb25zW05hbWVdID0gUGFydGlhbEluaXRpYWxpemVyIGFzIEZJbml0aWFsaXplcjtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==