"use strict";
exports.id = "Source_Main_Monitor_ts";
exports.ids = ["Source_Main_Monitor_ts"];
exports.modules = {

/***/ "./Source/Main/Event/Dispatcher.ts"
/*!*****************************************!*\
  !*** ./Source/Main/Event/Dispatcher.ts ***!
  \*****************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Dispatcher.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TDispatcher_DEPRECATED = exports.TDispatcher = void 0;
class TDispatcher {
    NextListenerId = 0;
    Listeners = new Map();
    GetHandle = () => {
        const Subscribe = (Callback) => {
            const Id = this.NextListenerId++;
            this.Listeners.set(Id, Callback);
            return Id;
        };
        const Unsubscribe = (Id) => {
            this.Listeners.delete(Id);
        };
        return {
            Subscribe,
            Unsubscribe
        };
    };
    Dispatch = (Message) => {
        if (this.Listeners.size > 0) {
            this.Listeners.forEach((Callback) => {
                Callback(Message);
            });
        }
    };
}
exports.TDispatcher = TDispatcher;
/* eslint-disable-next-line @typescript-eslint/naming-convention */
class TDispatcher_DEPRECATED {
    NextListenerId = 0;
    Listeners = new Map();
    Subscribe(Callback) {
        const Id = this.NextListenerId++;
        this.Listeners.set(Id, Callback);
        return Id;
    }
    Unsubscribe(Id) {
        this.Listeners.delete(Id);
    }
    Dispatch = (Message) => {
        if (this.Listeners.size > 0) {
            this.Listeners.forEach((Callback) => {
                Callback(Message);
            });
        }
    };
}
exports.TDispatcher_DEPRECATED = TDispatcher_DEPRECATED;


/***/ },

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


/***/ },

/***/ "./Source/Main/Monitor.ts"
/*!********************************!*\
  !*** ./Source/Main/Monitor.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Monitor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitorsHandle = exports.GetMonitors = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Dispatcher_1 = __webpack_require__(/*! #/Event/Dispatcher */ "./Source/Main/Event/Dispatcher.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const NodeIpc_1 = __webpack_require__(/*! #/Event/NodeIpc */ "./Source/Main/Event/NodeIpc.ts");
const Monitors = [];
const GetMonitors = () => {
    return [...Monitors];
};
exports.GetMonitors = GetMonitors;
const MonitorsDispatcher = new Dispatcher_1.TDispatcher();
exports.MonitorsHandle = MonitorsDispatcher.GetHandle();
const OnMonitorsChanged = (...Data) => {
    const NewMonitors = Data[0];
    Monitors.length = 0;
    Monitors.push(...NewMonitors);
    MonitorsDispatcher.Dispatch(NewMonitors);
};
const TrackMonitors = async () => {
    Monitors.push(...(0, wm_windows_1.InitializeMonitors)());
    (0, NodeIpc_1.Subscribe)("Monitors", OnMonitorsChanged);
};
(0, Initialize_1.RegisterInitializationFunction)("Monitor", TrackMonitors, ["NodeIpc"]);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVsRCxPQUFPLENBQUUsR0FBRyxRQUFRLENBQUUsQ0FBQztBQUMzQixDQUFDLENBQUM7QUFIVyxtQkFBVyxlQUd0QjtBQUVGLE1BQU0sa0JBQWtCLEdBQXNDLElBQUksd0JBQVcsRUFBd0IsQ0FBQztBQUN6RixzQkFBYyxHQUE4QyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUV4RyxNQUFNLGlCQUFpQixHQUFHLENBQUMsR0FBRyxJQUFxQixFQUFRLEVBQUU7SUFFekQsTUFBTSxXQUFXLEdBQXlCLElBQUksQ0FBQyxDQUFDLENBQXlCLENBQUM7SUFDMUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0lBQzlCLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRyxLQUFLLElBQW1CLEVBQUU7SUFFNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLG1DQUFrQixHQUFFLENBQUMsQ0FBQztJQUN2Qyx1QkFBUyxFQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzdDLENBQUMsQ0FBQztBQUVGLCtDQUE4QixFQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9FdmVudC9EaXNwYXRjaGVyLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRXZlbnQvTm9kZUlwYy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0luaXRpYWxpemUvSW5pdGlhbGl6ZS50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01vbml0b3IudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSAgICAgIERpc3BhdGNoZXIudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBUU3Vic2NyaXB0aW9uSGFuZGxlPFR5cGU+ID1cbntcbiAgICBTdWJzY3JpYmUoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQpKTogbnVtYmVyO1xuICAgIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkO1xufTtcblxuZXhwb3J0IGNsYXNzIFREaXNwYXRjaGVyPFR5cGU+XG57XG4gICAgcHJpdmF0ZSBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgTGlzdGVuZXJzOiBUTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUeXBlKSA9PiB2b2lkPiA9IG5ldyBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQ+KCk7XG5cbiAgICBwdWJsaWMgR2V0SGFuZGxlID0gKCk6IFRTdWJzY3JpcHRpb25IYW5kbGU8VHlwZT4gPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IFN1YnNjcmliZSA9IChDYWxsYmFjazogKChBcmd1bWVudDogVHlwZSkgPT4gdm9pZCkpOiBudW1iZXIgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgSWQ6IG51bWJlciA9IHRoaXMuTmV4dExpc3RlbmVySWQrKztcbiAgICAgICAgICAgIHRoaXMuTGlzdGVuZXJzLnNldChJZCwgQ2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIElkO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IFVuc3Vic2NyaWJlID0gKElkOiBudW1iZXIpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuTGlzdGVuZXJzLmRlbGV0ZShJZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFN1YnNjcmliZSxcbiAgICAgICAgICAgIFVuc3Vic2NyaWJlXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUeXBlKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVHlwZSkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb24gKi9cbmV4cG9ydCBjbGFzcyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEPFR5cGUgPSB1bmtub3duPlxue1xuICAgIHByaXZhdGUgTmV4dExpc3RlbmVySWQ6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIExpc3RlbmVyczogVE1hcDxudW1iZXIsIChBcmd1bWVudDogVHlwZSkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUeXBlKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVHlwZSkgPT4gdm9pZCkpOiBudW1iZXJcbiAgICB7XG4gICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgIHRoaXMuTGlzdGVuZXJzLnNldChJZCwgQ2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gSWQ7XG4gICAgfVxuXG4gICAgcHVibGljIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUeXBlKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVHlwZSkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTm9kZUlwYy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRklwY0NhbGxiYWNrLCBGSXBjQ2FsbGJhY2tTZXJpYWxpemVkIH0gZnJvbSBcIi4vTm9kZUlwYy5UeXBlc1wiO1xuaW1wb3J0IHsgSW5pdGlhbGl6ZUlwYyB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQgeyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiLi4vSW5pdGlhbGl6ZS9Jbml0aWFsaXplXCI7XG5cbmxldCBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcbmNvbnN0IExpc3RlbmVyczogVE1hcDxudW1iZXIsIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQ+ID0gbmV3IE1hcDxudW1iZXIsIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQ+KCk7XG5cbmV4cG9ydCBjb25zdCBTdWJzY3JpYmUgPSAoQ2hhbm5lbDogc3RyaW5nLCBDYWxsYmFjazogRklwY0NhbGxiYWNrKTogbnVtYmVyID0+XG57XG4gICAgY29uc3QgSWQ6IG51bWJlciA9IE5leHRMaXN0ZW5lcklkKys7XG4gICAgTGlzdGVuZXJzLnNldChJZCwgeyBDYWxsYmFjaywgQ2hhbm5lbCB9KTtcbiAgICByZXR1cm4gSWQ7XG59O1xuXG5leHBvcnQgY29uc3QgVW5zdWJzY3JpYmUgPSAoSWQ6IG51bWJlcik6IHZvaWQgPT5cbntcbiAgICBMaXN0ZW5lcnMuZGVsZXRlKElkKTtcbn07XG5cbmZ1bmN0aW9uIE9uTWVzc2FnZShDaGFubmVsOiBzdHJpbmcsIE1lc3NhZ2U6IHVua25vd24pXG57XG4gICAgTGlzdGVuZXJzLmZvckVhY2goKENhbGxiYWNrOiBGSXBjQ2FsbGJhY2tTZXJpYWxpemVkKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKENhbGxiYWNrLkNoYW5uZWwgPT09IENoYW5uZWwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrLkNhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbkluaXRpYWxpemVJcGMoT25NZXNzYWdlKTtcblxuYXN5bmMgZnVuY3Rpb24gSW5pdGlhbGl6ZU5vZGVJcGMoKTogUHJvbWlzZTx2b2lkPlxue1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn1cblxuUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFwiTm9kZUlwY1wiLCBJbml0aWFsaXplTm9kZUlwYyk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgSW5pdGlhbGl6ZS50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkluaXRpYWxpemVyLCBGSW5pdGlhbGl6ZXJzIH0gZnJvbSBcIi4vSW5pdGlhbGl6ZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBUUmVqZWN0LCBUVGhlbiB9IGZyb20gXCJAc29ycmVsbC91dGlsaXRpZXMvYXN5bmNcIjtcbmltcG9ydCB7IGFwcCBhcyBBcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCIjL0RldmVsb3BtZW50L0xvZy9Mb2dcIjtcblxuY29uc3QgSW5pdGlhbGl6YXRpb25GdW5jdGlvbnM6IEZJbml0aWFsaXplcnMgPSB7IH07XG5cbmxldCBMb2dnZWRBcHBSZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xuXG4vKipcbiAqIEZvciBzaWRlIGVmZmVjdHMgYGltcG9ydGBlZCB2aWEgYFNpZGVFZmZlY3RzLnRzYCB0aGF0IHJlcXVpcmUgYGFwcC53aGVuUmVhZHkoKWAgdG8gYmUgZnVsZmlsbGVkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFxuICAgIE5hbWU6IHN0cmluZyxcbiAgICBJbml0aWFsaXplcjogKCgpID0+IFByb21pc2U8dm9pZD4pLFxuICAgIERlcGVuZGVuY3lBcnJheTogQXJyYXk8c3RyaW5nPiA9IFsgXVxuKTogUHJvbWlzZTx2b2lkPlxue1xuICAgIGNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIkluaXRpYWxpemVcIik7XG4gICAgTG9nKGBHb2luZyB0byByZWdpc3RlciBpbml0aWFsaXplciB3aXRoIG5hbWUgJHsgTmFtZSB9LmApO1xuICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGBHb2luZyB0byByZWdpc3RlciBpbml0aWFsaXplciB3aXRoIG5hbWUgJHsgTmFtZSB9LlxcbmApO1xuICAgIGF3YWl0IEFwcC53aGVuUmVhZHkoKTtcblxuICAgIGlmICghTG9nZ2VkQXBwUmVhZHkpXG4gICAge1xuICAgICAgICBMb2dnZWRBcHBSZWFkeSA9IHRydWU7XG4gICAgICAgIC8vIExvZyhcIkFwcCBpcyByZWFkeSFcIik7XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKFwiQXBwIGlzIHJlYWR5IVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBQYXJ0aWFsSW5pdGlhbGl6ZXI6IFBhcnRpYWw8RkluaXRpYWxpemVyPiA9XG4gICAgICAgIHtcbiAgICAgICAgICAgIERlcGVuZGVuY3lBcnJheSxcbiAgICAgICAgICAgIElzRnVsZmlsbGVkOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgY29uc3QgV3JhcHBlZEluaXRpYWxpemVyOiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2U8dm9pZD4oKFxuICAgICAgICBSZXNvbHZlOiBUVGhlbjx2b2lkPixcbiAgICAgICAgUmVqZWN0OiBUUmVqZWN0XG4gICAgKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgbGV0IFRpbWVySWQ6IE5vZGVKUy5UaW1lb3V0IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBUaW1lU3RhcnRlZDogbnVtYmVyID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IFRpbWVCZXR3ZWVuQ2hlY2tzOiBudW1iZXIgPSAyNTA7XG4gICAgICAgIGNvbnN0IE1heER1cmF0aW9uOiBudW1iZXIgPSA2MCAqIDEwMDA7XG4gICAgICAgIGxldCBUaW1lT2ZMYXN0Q2hlY2s6IG51bWJlciA9IFRpbWVTdGFydGVkO1xuXG4gICAgICAgIGNvbnN0IENoZWNrID0gKCk6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgVGltZWRPdXQ6IGJvb2xlYW4gPSAoVGltZU9mTGFzdENoZWNrIC0gVGltZVN0YXJ0ZWQpID49IE1heER1cmF0aW9uO1xuICAgICAgICAgICAgaWYgKFRpbWVkT3V0ICYmIFRpbWVySWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgICAgICAvLyBMb2cuRXJyb3IoYEluaXRpYWxpemVyICR7IE5hbWUgfSBjb3VsZCBub3QgYmUgZnVsZmlsbGVkLiAgSXRzIGRlcGVuZGVuY2llcyBhcmUgJHsgRGVwZW5kZW5jeUFycmF5LmpvaW4oXCIsIFwiKSB9LmApO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoVGltZXJJZCk7XG4gICAgICAgICAgICAgICAgUmVqZWN0KGBJbml0aWFsaXplciAkeyBOYW1lIH0gY291bGQgbm90IGJlIGZ1bGZpbGxlZC4gIEl0cyBkZXBlbmRlbmNpZXMgYXJlICR7IERlcGVuZGVuY3lBcnJheS5qb2luKFwiLCBcIikgfS5gKTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBBcmVEZXBlbmRlbmNpZXNSZWdpc3RlcmVkOiBib29sZWFuID0gRGVwZW5kZW5jeUFycmF5LmV2ZXJ5KFxuICAgICAgICAgICAgICAgIChEZXBlbmRlbmN5TmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlcGVuZGVuY3lOYW1lIGluIEluaXRpYWxpemF0aW9uRnVuY3Rpb25zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghQXJlRGVwZW5kZW5jaWVzUmVnaXN0ZXJlZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUaW1lT2ZMYXN0Q2hlY2sgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEFyZURlcGVuZGVuY2llc0Z1bGZpbGxlZDogYm9vbGVhbiA9IERlcGVuZGVuY3lBcnJheS5ldmVyeShcbiAgICAgICAgICAgICAgICAoRGVwZW5kZW5jeU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChJbml0aWFsaXphdGlvbkZ1bmN0aW9uc1tEZXBlbmRlbmN5TmFtZV0pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgSXNGdWxmaWxsZWQgfSA9IEluaXRpYWxpemF0aW9uRnVuY3Rpb25zW0RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJc0Z1bGZpbGxlZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChBcmVEZXBlbmRlbmNpZXNGdWxmaWxsZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKFRpbWVySWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoVGltZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIEluaXRpYWxpemVyKCkudGhlbigoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJ0aWFsSW5pdGlhbGl6ZXIuSXNGdWxmaWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFRpbWVPZkxhc3RDaGVjayA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFRpbWVySWQgPSBzZXRJbnRlcnZhbChDaGVjaywgVGltZUJldHdlZW5DaGVja3MpO1xuICAgIH0pO1xuXG4gICAgaWYgKE5hbWUgaW4gSW5pdGlhbGl6YXRpb25GdW5jdGlvbnMpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFR3byBpbml0aWFsaXplciBmdW5jdGlvbnMgd2VyZSByZWdpc3RlcmVkIHdpdGggdGhlIHNhbWUgbmFtZSwgXCIkeyBOYW1lIH1cIi5gKTtcbiAgICB9XG5cbiAgICBQYXJ0aWFsSW5pdGlhbGl6ZXIuSW5pdGlhbGl6ZXIgPSBXcmFwcGVkSW5pdGlhbGl6ZXI7XG5cbiAgICBJbml0aWFsaXphdGlvbkZ1bmN0aW9uc1tOYW1lXSA9IFBhcnRpYWxJbml0aWFsaXplciBhcyBGSW5pdGlhbGl6ZXI7XG59XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTW9uaXRvci50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB7IHR5cGUgRk1vbml0b3JJbmZvLCBJbml0aWFsaXplTW9uaXRvcnMgfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHsgVERpc3BhdGNoZXIsIHR5cGUgVFN1YnNjcmlwdGlvbkhhbmRsZSB9IGZyb20gXCIjL0V2ZW50L0Rpc3BhdGNoZXJcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIjL0luaXRpYWxpemUvSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgU3Vic2NyaWJlIH0gZnJvbSBcIiMvRXZlbnQvTm9kZUlwY1wiO1xuXG5jb25zdCBNb25pdG9yczogVEFycmF5PEZNb25pdG9ySW5mbz4gPSBbIF07XG5cbmV4cG9ydCBjb25zdCBHZXRNb25pdG9ycyA9ICgpOiBUQXJyYXk8Rk1vbml0b3JJbmZvPiA9Plxue1xuICAgIHJldHVybiBbIC4uLk1vbml0b3JzIF07XG59O1xuXG5jb25zdCBNb25pdG9yc0Rpc3BhdGNoZXI6IFREaXNwYXRjaGVyPFRBcnJheTxGTW9uaXRvckluZm8+PiA9IG5ldyBURGlzcGF0Y2hlcjxUQXJyYXk8Rk1vbml0b3JJbmZvPj4oKTtcbmV4cG9ydCBjb25zdCBNb25pdG9yc0hhbmRsZTogVFN1YnNjcmlwdGlvbkhhbmRsZTxUQXJyYXk8Rk1vbml0b3JJbmZvPj4gPSBNb25pdG9yc0Rpc3BhdGNoZXIuR2V0SGFuZGxlKCk7XG5cbmNvbnN0IE9uTW9uaXRvcnNDaGFuZ2VkID0gKC4uLkRhdGE6IFRBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbntcbiAgICBjb25zdCBOZXdNb25pdG9yczogVEFycmF5PEZNb25pdG9ySW5mbz4gPSBEYXRhWzBdIGFzIFRBcnJheTxGTW9uaXRvckluZm8+O1xuICAgIE1vbml0b3JzLmxlbmd0aCA9IDA7XG4gICAgTW9uaXRvcnMucHVzaCguLi5OZXdNb25pdG9ycyk7XG4gICAgTW9uaXRvcnNEaXNwYXRjaGVyLkRpc3BhdGNoKE5ld01vbml0b3JzKTtcbn07XG5cbmNvbnN0IFRyYWNrTW9uaXRvcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIE1vbml0b3JzLnB1c2goLi4uSW5pdGlhbGl6ZU1vbml0b3JzKCkpO1xuICAgIFN1YnNjcmliZShcIk1vbml0b3JzXCIsIE9uTW9uaXRvcnNDaGFuZ2VkKTtcbn07XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcIk1vbml0b3JcIiwgVHJhY2tNb25pdG9ycywgWyBcIk5vZGVJcGNcIiBdKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==