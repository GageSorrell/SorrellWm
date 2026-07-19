"use strict";
exports.id = "Source_Main_Window_BrowserWindow_BrowserWindow_ts";
exports.ids = ["Source_Main_Window_BrowserWindow_BrowserWindow_ts"];
exports.modules = {

/***/ "./Source/Main/Miscellaneous/Icon.Types.ts"
/*!*************************************************!*\
  !*** ./Source/Main/Miscellaneous/Icon.Types.ts ***!
  \*************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Icon.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Miscellaneous/Icon.ts"
/*!*******************************************!*\
  !*** ./Source/Main/Miscellaneous/Icon.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Icon.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetIcon = exports.GetIconPath = void 0;
const Path = __importStar(__webpack_require__(/*! path */ "path"));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Path_1 = __webpack_require__(/*! ./Path */ "./Source/Main/Miscellaneous/Path.ts");
const GetIconPath = (Icon, Extension = "PNG") => {
    const LightDarkMode = electron_1.nativeTheme.shouldUseDarkColors
        ? "Dark"
        : "Light";
    const IconFileName = Icon + LightDarkMode + "." + Extension.toLowerCase();
    return Path.resolve((0, Path_1.GetPath)("Resource"), "Icon", Icon, IconFileName);
};
exports.GetIconPath = GetIconPath;
const GetIcon = (Icon, Extension = "PNG") => {
    return electron_1.nativeImage.createFromPath((0, exports.GetIconPath)(Icon, Extension));
};
exports.GetIcon = GetIcon;


/***/ },

/***/ "./Source/Main/Miscellaneous/Path.Types.ts"
/*!*************************************************!*\
  !*** ./Source/Main/Miscellaneous/Path.Types.ts ***!
  \*************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Paths.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Miscellaneous/Path.ts"
/*!*******************************************!*\
  !*** ./Source/Main/Miscellaneous/Path.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Paths.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetPath = void 0;
const Path = __importStar(__webpack_require__(/*! path */ "path"));
const GetPath = (Directory) => {
    const Paths = {
        Resource: Path.join(__dirname, "../Resource")
    };
    return Paths[Directory];
};
exports.GetPath = GetPath;


/***/ },

/***/ "./Source/Main/Miscellaneous/index.ts"
/*!********************************************!*\
  !*** ./Source/Main/Miscellaneous/index.ts ***!
  \********************************************/
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
__exportStar(__webpack_require__(/*! ./Icon */ "./Source/Main/Miscellaneous/Icon.ts"), exports);
__exportStar(__webpack_require__(/*! ./Icon.Types */ "./Source/Main/Miscellaneous/Icon.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Path */ "./Source/Main/Miscellaneous/Path.ts"), exports);
__exportStar(__webpack_require__(/*! ./Path.Types */ "./Source/Main/Miscellaneous/Path.Types.ts"), exports);


/***/ },

/***/ "./Source/Main/Window/BrowserWindow/BrowserWindow.ts"
/*!***********************************************************!*\
  !*** ./Source/Main/Window/BrowserWindow/BrowserWindow.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      BrowserWindow.ts
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBrowserWindow = void 0;
const Path = __importStar(__webpack_require__(/*! path */ "path"));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Miscellaneous_1 = __webpack_require__(/*! ../../Miscellaneous */ "./Source/Main/Miscellaneous/index.ts");
const Development_1 = __webpack_require__(/*! ../../Development */ "./Source/Main/Development/index.ts");
const Log = (0, Development_1.GetLogger)("BrowserWindow");
const ResolveHtmlPath = (HtmlFileName, Component) => {
    if (true) {
        const Port = process.env.PORT || 1212;
        const Url = new URL(`http://localhost:${Port}`);
        Url.pathname = HtmlFileName;
        return Url.href;
    }
    // removed by dead control flow

    // removed by dead control flow

};
/** Factory function for `BrowserWindow`.  Provides some defaults, particularly *wrt* `webPreferences`. */
const CreateBrowserWindow = async (Options) => {
    const BaseWebPreferences = {
        // devTools: false,
        nodeIntegration: true,
        preload: electron_1.app.isPackaged
            ? Path.join(__dirname, "Preload.js")
            : Path.join(__dirname, "../Intermediate/Preload.js")
    };
    const { webPreferences, ...Rest } = Options;
    const icon = (0, Miscellaneous_1.GetIcon)("Brand", "PNG");
    const Window = new electron_1.BrowserWindow({
        height: 900,
        icon,
        show: true,
        webPreferences: {
            ...webPreferences,
            ...BaseWebPreferences
        },
        width: 900,
        ...Rest
    });
    Window.on("page-title-updated", async (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
    });
    const LoadFrontend = async () => {
        try {
            await Window.loadURL(ResolveHtmlPath("index.html"));
        }
        catch (Error) {
            Log.Error("LoadFrontend threw the following error", Error);
        }
    };
    return {
        LoadFrontend,
        Window
    };
};
exports.CreateBrowserWindow = CreateBrowserWindow;
// const InitializeBrowserWindow = async (): Promise<void> =>
// {
//     ipcMain.handle("GetId", (Event: IpcMainInvokeEvent): number | undefined =>
//     {
//         Log("Received GetId call from the renderer.");
//         const Window: BrowserWindow | null = BrowserWindow.fromWebContents(Event.sender);
//         if (Window === null)
//         {
//             Log.Error("No BrowserWindow found for sender.");
//             return undefined;
//         }
//         else
//         {
//             Log(`Received GetId call from the renderer: Id is ${ Window.id }.`);
//             return Window.id;
//         }
//     });
// };
// RegisterInitializationFunction("BrowserWindow", InitializeBrowserWindow);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luZG93X0Jyb3dzZXJXaW5kb3dfQnJvd3NlcldpbmRvd190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7OztHQUtHOzs7Ozs7Ozs7Ozs7O0FDTEg7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILG1FQUE2QjtBQUU3QixtRUFBc0U7QUFDdEUsd0ZBQWlDO0FBRTFCLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBVyxFQUFFLFlBQTRCLEtBQUssRUFBVSxFQUFFO0lBRWxGLE1BQU0sYUFBYSxHQUFxQixzQkFBVyxDQUFDLG1CQUFtQjtRQUNuRSxDQUFDLENBQUMsTUFBTTtRQUNSLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFFZCxNQUFNLFlBQVksR0FBVyxJQUFJLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFbEYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFPLEVBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN6RSxDQUFDLENBQUM7QUFUVyxtQkFBVyxlQVN0QjtBQUVLLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBVyxFQUFFLFlBQTRCLEtBQUssRUFBZSxFQUFFO0lBRW5GLE9BQU8sc0JBQVcsQ0FBQyxjQUFjLENBQUMsdUJBQVcsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNwRSxDQUFDLENBQUM7QUFIVyxlQUFPLFdBR2xCOzs7Ozs7Ozs7Ozs7QUMxQkY7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7QUNMSDs7Ozs7R0FLRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsbUVBQTZCO0FBR3RCLE1BQU0sT0FBTyxHQUFHLENBQUMsU0FBcUIsRUFBVSxFQUFFO0lBRXJELE1BQU0sS0FBSyxHQUNYO1FBQ0ksUUFBUSxF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QUMvQixZQUFZO0FBQ1osK0RBQStEO0FBQy9ELGdDQUFnQztBQUNoQyxZQUFZO0FBQ1osZUFBZTtBQUNmLFlBQVk7QUFDWixtRkFBbUY7QUFDbkYsZ0NBQWdDO0FBQ2hDLFlBQVk7QUFDWixVQUFVO0FBQ1YsS0FBSztBQUVMLDRFQUE0RSIsInNvdXJjZXMiOlsid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vTWlzY2VsbGFuZW91cy9JY29uLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vTWlzY2VsbGFuZW91cy9JY29uLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vTWlzY2VsbGFuZW91cy9QYXRoLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vTWlzY2VsbGFuZW91cy9QYXRoLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vTWlzY2VsbGFuZW91cy9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1dpbmRvdy9Ccm93c2VyV2luZG93L0Jyb3dzZXJXaW5kb3cudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSAgICAgIEljb24uVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBGSWNvbiA9XG4gICAgfCBcIkJyYW5kXCJcbiAgICB8IFwiU2V0dGluZ3NcIlxuICAgIHwgXCJUcmF5XCI7XG5cbmV4cG9ydCB0eXBlIEZJY29uRXh0ZW5zaW9uID1cbiAgICB8IFwiSUNPXCJcbiAgICB8IFwiUE5HXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgSWNvbi50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB0eXBlIHsgRkljb24sIEZJY29uRXh0ZW5zaW9uIH0gZnJvbSBcIi4vSWNvbi5UeXBlc1wiO1xuaW1wb3J0IHsgdHlwZSBOYXRpdmVJbWFnZSwgbmF0aXZlSW1hZ2UsIG5hdGl2ZVRoZW1lIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBHZXRQYXRoIH0gZnJvbSBcIi4vUGF0aFwiO1xuXG5leHBvcnQgY29uc3QgR2V0SWNvblBhdGggPSAoSWNvbjogRkljb24sIEV4dGVuc2lvbjogRkljb25FeHRlbnNpb24gPSBcIlBOR1wiKTogc3RyaW5nID0+XG57XG4gICAgY29uc3QgTGlnaHREYXJrTW9kZTogXCJMaWdodFwiIHwgXCJEYXJrXCIgPSBuYXRpdmVUaGVtZS5zaG91bGRVc2VEYXJrQ29sb3JzXG4gICAgICAgID8gXCJEYXJrXCJcbiAgICAgICAgOiBcIkxpZ2h0XCI7XG5cbiAgICBjb25zdCBJY29uRmlsZU5hbWU6IHN0cmluZyA9IEljb24gKyBMaWdodERhcmtNb2RlICsgXCIuXCIgKyBFeHRlbnNpb24udG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiBQYXRoLnJlc29sdmUoR2V0UGF0aChcIlJlc291cmNlXCIpLCBcIkljb25cIiwgSWNvbiwgSWNvbkZpbGVOYW1lKTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRJY29uID0gKEljb246IEZJY29uLCBFeHRlbnNpb246IEZJY29uRXh0ZW5zaW9uID0gXCJQTkdcIik6IE5hdGl2ZUltYWdlID0+XG57XG4gICAgcmV0dXJuIG5hdGl2ZUltYWdlLmNyZWF0ZUZyb21QYXRoKEdldEljb25QYXRoKEljb24sIEV4dGVuc2lvbikpO1xufTtcblxuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFBhdGhzLlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgRkRpcmVjdG9yeSA9XG4gICAgfCBcIlJlc291cmNlXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgUGF0aHMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEZEaXJlY3RvcnkgfSBmcm9tIFwiLi9QYXRoLlR5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBHZXRQYXRoID0gKERpcmVjdG9yeTogRkRpcmVjdG9yeSk6IHN0cmluZyA9Plxue1xuICAgIGNvbnN0IFBhdGhzOiBUUmVjb3JkPEZEaXJlY3RvcnksIHN0cmluZz4gPVxuICAgIHtcbiAgICAgICAgUmVzb3VyY2U6IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vUmVzb3VyY2VcIilcbiAgICB9O1xuXG4gICAgcmV0dXJuIFBhdGhzW0RpcmVjdG9yeV07XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIGluZGV4LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vSWNvblwiO1xuZXhwb3J0ICogZnJvbSBcIi4vSWNvbi5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vUGF0aFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vUGF0aC5UeXBlc1wiO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIEJyb3dzZXJXaW5kb3cudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge1xuICAgIGFwcCBhcyBBcHAsXG4gICAgQnJvd3NlcldpbmRvdyxcbiAgICB0eXBlIEJyb3dzZXJXaW5kb3dDb25zdHJ1Y3Rvck9wdGlvbnMsXG4gICAgdHlwZSBOYXRpdmVJbWFnZSxcbiAgICB0eXBlIFdlYlByZWZlcmVuY2VzIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZDcmVhdGVCcm93c2VyV2luZG93UmV0dXJuVHlwZSB9IGZyb20gXCIuL0Jyb3dzZXJXaW5kb3cuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldEljb24gfSBmcm9tIFwiLi4vLi4vTWlzY2VsbGFuZW91c1wiO1xuaW1wb3J0IHsgR2V0TG9nZ2VyIH0gZnJvbSBcIi4uLy4uL0RldmVsb3BtZW50XCI7XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIkJyb3dzZXJXaW5kb3dcIik7XG5cbmNvbnN0IFJlc29sdmVIdG1sUGF0aCA9IChIdG1sRmlsZU5hbWU6IHN0cmluZywgQ29tcG9uZW50Pzogc3RyaW5nKTogc3RyaW5nID0+XG57XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIpXG4gICAge1xuICAgICAgICBjb25zdCBQb3J0OiBzdHJpbmcgfCBudW1iZXIgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDEyMTI7XG4gICAgICAgIGNvbnN0IFVybDogVVJMID0gbmV3IFVSTChgaHR0cDovL2xvY2FsaG9zdDokeyBQb3J0IH1gKTtcbiAgICAgICAgVXJsLnBhdGhuYW1lID0gSHRtbEZpbGVOYW1lO1xuICAgICAgICByZXR1cm4gVXJsLmhyZWY7XG4gICAgfVxuICAgIGNvbnN0IEJhc2VQYXRoOiBzdHJpbmcgPSBgZmlsZTovLyR7IFBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vUmVuZGVyZXIvXCIsIEh0bWxGaWxlTmFtZSkgfWA7XG4gICAgaWYgKENvbXBvbmVudCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50QXJndW1lbnQ6IHN0cmluZyA9IGA/Q29tcG9uZW50PSR7IENvbXBvbmVudCB9YDtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoICsgQ29tcG9uZW50QXJndW1lbnQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBCYXNlUGF0aDtcbiAgICB9XG59O1xuXG4vKiogRmFjdG9yeSBmdW5jdGlvbiBmb3IgYEJyb3dzZXJXaW5kb3dgLiAgUHJvdmlkZXMgc29tZSBkZWZhdWx0cywgcGFydGljdWxhcmx5ICp3cnQqIGB3ZWJQcmVmZXJlbmNlc2AuICovXG5leHBvcnQgY29uc3QgQ3JlYXRlQnJvd3NlcldpbmRvdyA9IGFzeW5jIChcbiAgICBPcHRpb25zOiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zXG4pOiBQcm9taXNlPEZDcmVhdGVCcm93c2VyV2luZG93UmV0dXJuVHlwZT4gPT5cbntcbiAgICBjb25zdCBCYXNlV2ViUHJlZmVyZW5jZXM6IFdlYlByZWZlcmVuY2VzID1cbiAgICB7XG4gICAgICAgIC8vIGRldlRvb2xzOiBmYWxzZSxcbiAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICBwcmVsb2FkOiBBcHAuaXNQYWNrYWdlZFxuICAgICAgICAgICAgPyBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIlByZWxvYWQuanNcIilcbiAgICAgICAgICAgIDogUGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9JbnRlcm1lZGlhdGUvUHJlbG9hZC5qc1wiKVxuICAgIH07XG5cbiAgICBjb25zdCB7IHdlYlByZWZlcmVuY2VzLCAuLi5SZXN0IH0gPSBPcHRpb25zO1xuXG4gICAgY29uc3QgaWNvbjogTmF0aXZlSW1hZ2UgPSBHZXRJY29uKFwiQnJhbmRcIiwgXCJQTkdcIik7XG5cbiAgICBjb25zdCBXaW5kb3c6IEJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIGhlaWdodDogOTAwLFxuICAgICAgICBpY29uLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICB3ZWJQcmVmZXJlbmNlczpcbiAgICAgICAge1xuICAgICAgICAgICAgLi4ud2ViUHJlZmVyZW5jZXMsXG4gICAgICAgICAgICAuLi5CYXNlV2ViUHJlZmVyZW5jZXNcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgLi4uUmVzdFxuICAgIH0pO1xuXG4gICAgV2luZG93Lm9uKFxuICAgICAgICBcInBhZ2UtdGl0bGUtdXBkYXRlZFwiLFxuICAgICAgICBhc3luYyAoRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfVGl0bGU6IHN0cmluZywgX0V4cGxpY2l0U2V0OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IExvYWRGcm9udGVuZCA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG4gICAge1xuICAgICAgICB0cnlcbiAgICAgICAge1xuICAgICAgICAgICAgYXdhaXQgV2luZG93LmxvYWRVUkwoUmVzb2x2ZUh0bWxQYXRoKFwiaW5kZXguaHRtbFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKEVycm9yOiB1bmtub3duKVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2cuRXJyb3IoXCJMb2FkRnJvbnRlbmQgdGhyZXcgdGhlIGZvbGxvd2luZyBlcnJvclwiLCBFcnJvcik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgTG9hZEZyb250ZW5kLFxuICAgICAgICBXaW5kb3dcbiAgICB9O1xufTtcblxuLy8gY29uc3QgSW5pdGlhbGl6ZUJyb3dzZXJXaW5kb3cgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PlxuLy8ge1xuLy8gICAgIGlwY01haW4uaGFuZGxlKFwiR2V0SWRcIiwgKEV2ZW50OiBJcGNNYWluSW52b2tlRXZlbnQpOiBudW1iZXIgfCB1bmRlZmluZWQgPT5cbi8vICAgICB7XG4vLyAgICAgICAgIExvZyhcIlJlY2VpdmVkIEdldElkIGNhbGwgZnJvbSB0aGUgcmVuZGVyZXIuXCIpO1xuLy8gICAgICAgICBjb25zdCBXaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCBudWxsID0gQnJvd3NlcldpbmRvdy5mcm9tV2ViQ29udGVudHMoRXZlbnQuc2VuZGVyKTtcbi8vICAgICAgICAgaWYgKFdpbmRvdyA9PT0gbnVsbClcbi8vICAgICAgICAge1xuLy8gICAgICAgICAgICAgTG9nLkVycm9yKFwiTm8gQnJvd3NlcldpbmRvdyBmb3VuZCBmb3Igc2VuZGVyLlwiKTtcbi8vICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgZWxzZVxuLy8gICAgICAgICB7XG4vLyAgICAgICAgICAgICBMb2coYFJlY2VpdmVkIEdldElkIGNhbGwgZnJvbSB0aGUgcmVuZGVyZXI6IElkIGlzICR7IFdpbmRvdy5pZCB9LmApO1xuLy8gICAgICAgICAgICAgcmV0dXJuIFdpbmRvdy5pZDtcbi8vICAgICAgICAgfVxuLy8gICAgIH0pO1xuLy8gfTtcblxuLy8gUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFwiQnJvd3NlcldpbmRvd1wiLCBJbml0aWFsaXplQnJvd3NlcldpbmRvdyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=