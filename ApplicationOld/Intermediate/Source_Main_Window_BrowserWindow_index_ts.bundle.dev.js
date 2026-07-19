"use strict";
exports.id = "Source_Main_Window_BrowserWindow_index_ts";
exports.ids = ["Source_Main_Window_BrowserWindow_index_ts"];
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

/***/ "./Source/Main/Window/BrowserWindow/BrowserWindow.Types.ts"
/*!*****************************************************************!*\
  !*** ./Source/Main/Window/BrowserWindow/BrowserWindow.Types.ts ***!
  \*****************************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      BrowserWindow.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


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


/***/ },

/***/ "./Source/Main/Window/BrowserWindow/index.ts"
/*!***************************************************!*\
  !*** ./Source/Main/Window/BrowserWindow/index.ts ***!
  \***************************************************/
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
__exportStar(__webpack_require__(/*! ./BrowserWindow */ "./Source/Main/Window/BrowserWindow/BrowserWindow.ts"), exports);
__exportStar(__webpack_require__(/*! ./BrowserWindow.Types */ "./Source/Main/Window/BrowserWindow/BrowserWindow.Types.ts"), exports);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luZG93X0Jyb3dzZXJXaW5kb3dfaW5kZXhfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7Ozs7Ozs7Ozs7OztBQ0xIOzs7OztHQUtHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxtRUFBNkI7QUFFN0IsbUVBQXNFO0FBQ3RFLHdGQUFpQztBQUUxQixNQUFNLFdBQVcsR0FBRyxDQUFDLElBQVcsRUFBRSxZQUE0QixLQUFLLEVBQVUsRUFBRTtJQUVsRixNQUFNLGFBQWEsR0FBcUIsc0JBQVcsQ0FBQyxtQkFBbUI7UUFDbkUsQ0FBQyxDQUFDLE1BQU07UUFDUixDQUFDLENBQUMsT0FBTyxDQUFDO0lBRWQsTUFBTSxZQUFZLEdBQVcsSUFBSSxHQUFHLGFBQWEsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRWxGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBTyxFQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDekUsQ0FBQyxDQUFDO0FBVFcsbUJBQVcsZUFTdEI7QUFFSyxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQVcsRUFBRSxZQUE0QixLQUFLLEVBQWUsRUFBRTtJQUVuRixPQUFPLHNCQUFXLENBQUMsY0FBYyxDQUFDLHVCQUFXLEVBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQyxDQUFDO0FBSFcsZUFBTyxXQUdsQjs7Ozs7Ozs7Ozs7O0FDMUJGOzs7OztHQUtHOzs7Ozs7Ozs7Ozs7O0FDTEg7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILG1FQUE2QjtBQUd0QixNQUFNLE9BQU8sR0FBRyxDQUFDLFNBQXFCLEVBQVUsRUFBRTtJQUVyRCxNQUFNLEtBQUssR0FDWDtRQUNJLFFBQVEsRUFBRSxJQUFJ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QTRGO0FBQzVGLCtCQUErQjtBQUMvQixZQUFZO0FBQ1osK0RBQStEO0FBQy9ELGdDQUFnQztBQUNoQyxZQUFZO0FBQ1osZUFBZTtBQUNmLFlBQVk7QUFDWixtRkFBbUY7QUFDbkYsZ0NBQWdDO0FBQ2hDLFlBQVk7QUFDWixVQUFVO0FBQ1YsS0FBSztBQUVMLDRFQUE0RTs7Ozs7Ozs7Ozs7O0FDdEg1RTs7Ozs7R0FLRzs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHlIQUFnQztBQUNoQyxxSUFBc0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01pc2NlbGxhbmVvdXMvSWNvbi5UeXBlcy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01pc2NlbGxhbmVvdXMvSWNvbi50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01pc2NlbGxhbmVvdXMvUGF0aC5UeXBlcy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01pc2NlbGxhbmVvdXMvUGF0aC50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01pc2NlbGxhbmVvdXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9XaW5kb3cvQnJvd3NlcldpbmRvdy9Ccm93c2VyV2luZG93LlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vV2luZG93L0Jyb3dzZXJXaW5kb3cvQnJvd3NlcldpbmRvdy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1dpbmRvdy9Ccm93c2VyV2luZG93L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBJY29uLlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgRkljb24gPVxuICAgIHwgXCJCcmFuZFwiXG4gICAgfCBcIlNldHRpbmdzXCJcbiAgICB8IFwiVHJheVwiO1xuXG5leHBvcnQgdHlwZSBGSWNvbkV4dGVuc2lvbiA9XG4gICAgfCBcIklDT1wiXG4gICAgfCBcIlBOR1wiO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIEljb24udHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEZJY29uLCBGSWNvbkV4dGVuc2lvbiB9IGZyb20gXCIuL0ljb24uVHlwZXNcIjtcbmltcG9ydCB7IHR5cGUgTmF0aXZlSW1hZ2UsIG5hdGl2ZUltYWdlLCBuYXRpdmVUaGVtZSB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgR2V0UGF0aCB9IGZyb20gXCIuL1BhdGhcIjtcblxuZXhwb3J0IGNvbnN0IEdldEljb25QYXRoID0gKEljb246IEZJY29uLCBFeHRlbnNpb246IEZJY29uRXh0ZW5zaW9uID0gXCJQTkdcIik6IHN0cmluZyA9Plxue1xuICAgIGNvbnN0IExpZ2h0RGFya01vZGU6IFwiTGlnaHRcIiB8IFwiRGFya1wiID0gbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9yc1xuICAgICAgICA/IFwiRGFya1wiXG4gICAgICAgIDogXCJMaWdodFwiO1xuXG4gICAgY29uc3QgSWNvbkZpbGVOYW1lOiBzdHJpbmcgPSBJY29uICsgTGlnaHREYXJrTW9kZSArIFwiLlwiICsgRXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG5cbiAgICByZXR1cm4gUGF0aC5yZXNvbHZlKEdldFBhdGgoXCJSZXNvdXJjZVwiKSwgXCJJY29uXCIsIEljb24sIEljb25GaWxlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3QgR2V0SWNvbiA9IChJY29uOiBGSWNvbiwgRXh0ZW5zaW9uOiBGSWNvbkV4dGVuc2lvbiA9IFwiUE5HXCIpOiBOYXRpdmVJbWFnZSA9Plxue1xuICAgIHJldHVybiBuYXRpdmVJbWFnZS5jcmVhdGVGcm9tUGF0aChHZXRJY29uUGF0aChJY29uLCBFeHRlbnNpb24pKTtcbn07XG5cbiIsIi8qKlxuICogQGZpbGUgICAgICBQYXRocy5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZEaXJlY3RvcnkgPVxuICAgIHwgXCJSZXNvdXJjZVwiO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFBhdGhzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgUGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBGRGlyZWN0b3J5IH0gZnJvbSBcIi4vUGF0aC5UeXBlc1wiO1xuXG5leHBvcnQgY29uc3QgR2V0UGF0aCA9IChEaXJlY3Rvcnk6IEZEaXJlY3RvcnkpOiBzdHJpbmcgPT5cbntcbiAgICBjb25zdCBQYXRoczogVFJlY29yZDxGRGlyZWN0b3J5LCBzdHJpbmc+ID1cbiAgICB7XG4gICAgICAgIFJlc291cmNlOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL1Jlc291cmNlXCIpXG4gICAgfTtcblxuICAgIHJldHVybiBQYXRoc1tEaXJlY3RvcnldO1xufTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBpbmRleC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0ljb25cIjtcbmV4cG9ydCAqIGZyb20gXCIuL0ljb24uVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1BhdGhcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1BhdGguVHlwZXNcIjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBCcm93c2VyV2luZG93LlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBCcm93c2VyV2luZG93IH0gZnJvbSBcImVsZWN0cm9uXCI7XG5cbmV4cG9ydCB0eXBlIEZDcmVhdGVCcm93c2VyV2luZG93UmV0dXJuVHlwZSA9XG57XG4gICAgTG9hZEZyb250ZW5kOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAgIFdpbmRvdzogQnJvd3NlcldpbmRvdztcbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgQnJvd3NlcldpbmRvdy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7XG4gICAgYXBwIGFzIEFwcCxcbiAgICBCcm93c2VyV2luZG93LFxuICAgIHR5cGUgQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyxcbiAgICB0eXBlIE5hdGl2ZUltYWdlLFxuICAgIHR5cGUgV2ViUHJlZmVyZW5jZXMgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB0eXBlIHsgRkNyZWF0ZUJyb3dzZXJXaW5kb3dSZXR1cm5UeXBlIH0gZnJvbSBcIi4vQnJvd3NlcldpbmRvdy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGTG9nZ2VyIH0gZnJvbSBcIi4uLy4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgR2V0SWNvbiB9IGZyb20gXCIuLi8uLi9NaXNjZWxsYW5lb3VzXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiLi4vLi4vRGV2ZWxvcG1lbnRcIjtcblxuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiQnJvd3NlcldpbmRvd1wiKTtcblxuY29uc3QgUmVzb2x2ZUh0bWxQYXRoID0gKEh0bWxGaWxlTmFtZTogc3RyaW5nLCBDb21wb25lbnQ/OiBzdHJpbmcpOiBzdHJpbmcgPT5cbntcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIilcbiAgICB7XG4gICAgICAgIGNvbnN0IFBvcnQ6IHN0cmluZyB8IG51bWJlciA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMTIxMjtcbiAgICAgICAgY29uc3QgVXJsOiBVUkwgPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7IFBvcnQgfWApO1xuICAgICAgICBVcmwucGF0aG5hbWUgPSBIdG1sRmlsZU5hbWU7XG4gICAgICAgIHJldHVybiBVcmwuaHJlZjtcbiAgICB9XG4gICAgY29uc3QgQmFzZVBhdGg6IHN0cmluZyA9IGBmaWxlOi8vJHsgUGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9SZW5kZXJlci9cIiwgSHRtbEZpbGVOYW1lKSB9YDtcbiAgICBpZiAoQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBjb25zdCBDb21wb25lbnRBcmd1bWVudDogc3RyaW5nID0gYD9Db21wb25lbnQ9JHsgQ29tcG9uZW50IH1gO1xuICAgICAgICByZXR1cm4gQmFzZVBhdGggKyBDb21wb25lbnRBcmd1bWVudDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoO1xuICAgIH1cbn07XG5cbi8qKiBGYWN0b3J5IGZ1bmN0aW9uIGZvciBgQnJvd3NlcldpbmRvd2AuICBQcm92aWRlcyBzb21lIGRlZmF1bHRzLCBwYXJ0aWN1bGFybHkgKndydCogYHdlYlByZWZlcmVuY2VzYC4gKi9cbmV4cG9ydCBjb25zdCBDcmVhdGVCcm93c2VyV2luZG93ID0gYXN5bmMgKFxuICAgIE9wdGlvbnM6IEJyb3dzZXJXaW5kb3dDb25zdHJ1Y3Rvck9wdGlvbnNcbik6IFByb21pc2U8RkNyZWF0ZUJyb3dzZXJXaW5kb3dSZXR1cm5UeXBlPiA9Plxue1xuICAgIGNvbnN0IEJhc2VXZWJQcmVmZXJlbmNlczogV2ViUHJlZmVyZW5jZXMgPVxuICAgIHtcbiAgICAgICAgLy8gZGV2VG9vbHM6IGZhbHNlLFxuICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgIHByZWxvYWQ6IEFwcC5pc1BhY2thZ2VkXG4gICAgICAgICAgICA/IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiUHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgOiBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL0ludGVybWVkaWF0ZS9QcmVsb2FkLmpzXCIpXG4gICAgfTtcblxuICAgIGNvbnN0IHsgd2ViUHJlZmVyZW5jZXMsIC4uLlJlc3QgfSA9IE9wdGlvbnM7XG5cbiAgICBjb25zdCBpY29uOiBOYXRpdmVJbWFnZSA9IEdldEljb24oXCJCcmFuZFwiLCBcIlBOR1wiKTtcblxuICAgIGNvbnN0IFdpbmRvdzogQnJvd3NlcldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgaGVpZ2h0OiA5MDAsXG4gICAgICAgIGljb24sXG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgICAuLi53ZWJQcmVmZXJlbmNlcyxcbiAgICAgICAgICAgIC4uLkJhc2VXZWJQcmVmZXJlbmNlc1xuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAuLi5SZXN0XG4gICAgfSk7XG5cbiAgICBXaW5kb3cub24oXG4gICAgICAgIFwicGFnZS10aXRsZS11cGRhdGVkXCIsXG4gICAgICAgIGFzeW5jIChFdmVudDogRWxlY3Ryb24uRXZlbnQsIF9UaXRsZTogc3RyaW5nLCBfRXhwbGljaXRTZXQ6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+ID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgTG9hZEZyb250ZW5kID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbiAgICB7XG4gICAgICAgIHRyeVxuICAgICAgICB7XG4gICAgICAgICAgICBhd2FpdCBXaW5kb3cubG9hZFVSTChSZXNvbHZlSHRtbFBhdGgoXCJpbmRleC5odG1sXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoRXJyb3I6IHVua25vd24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIExvZy5FcnJvcihcIkxvYWRGcm9udGVuZCB0aHJldyB0aGUgZm9sbG93aW5nIGVycm9yXCIsIEVycm9yKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBMb2FkRnJvbnRlbmQsXG4gICAgICAgIFdpbmRvd1xuICAgIH07XG59O1xuXG4vLyBjb25zdCBJbml0aWFsaXplQnJvd3NlcldpbmRvdyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG4vLyB7XG4vLyAgICAgaXBjTWFpbi5oYW5kbGUoXCJHZXRJZFwiLCAoRXZlbnQ6IElwY01haW5JbnZva2VFdmVudCk6IG51bWJlciB8IHVuZGVmaW5lZCA9PlxuLy8gICAgIHtcbi8vICAgICAgICAgTG9nKFwiUmVjZWl2ZWQgR2V0SWQgY2FsbCBmcm9tIHRoZSByZW5kZXJlci5cIik7XG4vLyAgICAgICAgIGNvbnN0IFdpbmRvdzogQnJvd3NlcldpbmRvdyB8IG51bGwgPSBCcm93c2VyV2luZG93LmZyb21XZWJDb250ZW50cyhFdmVudC5zZW5kZXIpO1xuLy8gICAgICAgICBpZiAoV2luZG93ID09PSBudWxsKVxuLy8gICAgICAgICB7XG4vLyAgICAgICAgICAgICBMb2cuRXJyb3IoXCJObyBCcm93c2VyV2luZG93IGZvdW5kIGZvciBzZW5kZXIuXCIpO1xuLy8gICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBlbHNlXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIExvZyhgUmVjZWl2ZWQgR2V0SWQgY2FsbCBmcm9tIHRoZSByZW5kZXJlcjogSWQgaXMgJHsgV2luZG93LmlkIH0uYCk7XG4vLyAgICAgICAgICAgICByZXR1cm4gV2luZG93LmlkO1xuLy8gICAgICAgICB9XG4vLyAgICAgfSk7XG4vLyB9O1xuXG4vLyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJCcm93c2VyV2luZG93XCIsIEluaXRpYWxpemVCcm93c2VyV2luZG93KTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBpbmRleC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0Jyb3dzZXJXaW5kb3dcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0Jyb3dzZXJXaW5kb3cuVHlwZXNcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==