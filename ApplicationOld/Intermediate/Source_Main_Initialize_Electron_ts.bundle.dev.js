"use strict";
exports.id = "Source_Main_Initialize_Electron_ts";
exports.ids = ["Source_Main_Initialize_Electron_ts"];
exports.modules = {

/***/ "./Source/Main/Initialize/Electron.ts"
/*!********************************************!*\
  !*** ./Source/Main/Initialize/Electron.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Initialization.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable-next-line @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/typedef */
const electron_1 = __webpack_require__(/*! electron */ "electron");
const BrowserWindow_1 = __webpack_require__(/*! #/Window/BrowserWindow */ "./Source/Main/Window/BrowserWindow/index.ts");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Initialize_1 = __webpack_require__(/*! ./Initialize */ "./Source/Main/Initialize/Initialize.ts");
const electron_updater_1 = __webpack_require__(/*! electron-updater */ "../node_modules/electron-updater/out/main.js");
const electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "../node_modules/electron-log/src/index.js"));
const Log = (0, Development_1.GetLogger)("Electron");
const Initialize = async () => {
    let MainWindow = null;
    if (false) // removed by dead control flow
{}
    const IsDebug = ( true ||
        0);
    if (IsDebug) {
        const Installer = __webpack_require__(/*! electron-devtools-installer */ "../node_modules/electron-devtools-installer/dist/index.js");
        const ForceDownload = !!process.env.UPGRADE_EXTENSIONS;
        const Extensions = ["REACT_DEVELOPER_TOOLS"];
        Installer
            .default(Extensions.map((Name) => Installer[Name]), ForceDownload)
            .catch(Log.Error);
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const CreateWindow = async () => {
        if (IsDebug) {
            // await InstallExtensions();
        }
        const { Window, LoadFrontend } = await (0, BrowserWindow_1.CreateBrowserWindow)({
            height: 728,
            width: 1024,
            show: false,
            webPreferences: {
                devTools: true
            }
        });
        MainWindow = Window;
        await LoadFrontend();
        // MainWindow.on("show", (_Event: Electron.Event, _IsAlwaysOnTop: boolean): void =>
        // {
        //     setTimeout((): void =>
        //     {
        //         MainWindow?.webContents.send("Navigate", "TestWindow");
        //     }, 2000);
        // });
        MainWindow.on("ready-to-show", () => {
            if (!MainWindow) {
                throw new Error("\"MainWindow\" is not defined");
            }
            if (process.env.START_MINIMIZED) {
                MainWindow.minimize();
            }
            else {
                MainWindow.setMenuBarVisibility(false);
                MainWindow.show();
            }
        });
        MainWindow.on("closed", () => {
            MainWindow = null;
        });
        MainWindow.webContents.setWindowOpenHandler((Edata) => {
            electron_1.shell.openExternal(Edata.url);
            return { action: "deny" };
        });
        electron_log_1.default.transports.file.level = "info";
        electron_updater_1.autoUpdater.logger = electron_log_1.default;
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    };
};
electron_1.app.setAppUserModelId("gagesorrell.sorrellwm");
electron_1.app.setToastActivatorCLSID("{87654321-4321-4321-1234-1234567890AB}");
const InitializeElectron = async () => {
    electron_1.app.on("activate", Initialize);
};
(0, Initialize_1.RegisterInitializationFunction)("Electron", InitializeElectron, ["BrowserWindow"]);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fSW5pdGlhbGl6ZV9FbGVjdHJvbl90cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7OztHQUtHOzs7OztBQUVILGlEQUFpRDtBQUNqRCwwSEFBMEg7QUFFMUgsbUVBQTBEO0FBQzFELHlIQUE2RDtBQUU3RCxxR0FBMEM7QUFDMUMsdUdBQThEO0FBQzlELHVIQUErQztBQUMvQyw2SEFBK0I7QUFFL0IsTUFBTSxHQUFHLEdBQVksMkJBQVMsRUFBQyxVQUFVLENBQUMsQ0FBQztBQUUzQyxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQW1CLEVBQUU7SUFFekMsSUFBSSxVQUFVLEdBQXlCLElBQUksQ0FBQztJQUU1QyxJQUFJLEtBQXFDLEVBQ3pDO0FBQUEsRUFHQztJQUVELE1BQU0sT0FBTyxHQUFZLENBQ3JCLEtBQXNDO1FBQ3RDLENBQWlDLENBQ3BDLENBQUM7SUFFRixJQUFJLE9BQU8sRUFDWCxDQUFDO1FBQ0csTUFBTSxTQUFTLEdBQVEsbUJBQU8sQ0FBQyw4RkFBNkIsQ0FBQyxDQUFDO1FBQzlELE1BQU0sYUFBYSxHQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO1FBQ2hFLE1BQU0sVUFBVSxHQUFtQixDQUFFLHVCQUF1QixDQUFFLENBQUM7UUFFL0QsU0FBUzthQUNKLE9BQU8sQ0FDSixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDakQsYUFBYSxDQUNoQjthQUNBLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELGdFQUFnRTtJQUNoRSxNQUFNLFlBQVksR0FBRyxLQUFLLElBQW1CLEVBQUU7UUFFM0MsSUFBSSxPQUFPLEVBQ1gsQ0FBQztZQUNHLDZCQUE2QjtRQUNqQyxDQUFDO1FBRUQsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLHVDQUFtQixFQUFDO1lBQ3ZELE1BQU0sRUFBRSxHQUFHO1lBQ1gsS0FBSyxFQUFFLElBQUk7WUFFWCxJQUFJLEVBQUUsS0FBSztZQUNYLGNBQWMsRUFDZDtnQkFDSSxRQUFRLEVBQUUsSUFBSTthQUNqQjtTQUNKLENBQUMsQ0FBQztRQUVILFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDcEIsTUFBTSxZQUFZLEVBQUUsQ0FBQztRQUVyQixtRkFBbUY7UUFDbkYsSUFBSTtRQUNKLDZCQUE2QjtRQUM3QixRQUFRO1FBQ1Isa0VBQWtFO1FBQ2xFLGdCQUFnQjtRQUNoQixNQUFNO1FBRU4sVUFBVSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1lBRWhDLElBQUksQ0FBQyxVQUFVLEVBQ2YsQ0FBQztnQkFDRyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDckQsQ0FBQztZQUNELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQy9CLENBQUM7Z0JBQ0csVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzFCLENBQUM7aUJBRUQsQ0FBQztnQkFDRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFFekIsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUE4QixFQUFFLEVBQUU7WUFFM0UsZ0JBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxzQkFBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNuQyw4QkFBVyxDQUFDLE1BQU0sR0FBRyxzQkFBRyxDQUFDO1FBQ3pCLDhCQUFXLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUMzQyxDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRixjQUFHLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMvQyxjQUFHLENBQUMsc0JBQXNCLENBQUMsd0NBQXdDLENBQUMsQ0FBQztBQUVyRSxNQUFNLGtCQUFrQixHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUVqRCxjQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFFRiwrQ0FBOEIsRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsQ0FBRSxlQUFlLENBQUUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9Jbml0aWFsaXplL0VsZWN0cm9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBJbml0aWFsaXphdGlvbi50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnksIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMsIEB0eXBlc2NyaXB0LWVzbGludC90eXBlZGVmICovXG5cbmltcG9ydCB7IHR5cGUgQnJvd3NlcldpbmRvdywgYXBwLCBzaGVsbCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgQ3JlYXRlQnJvd3NlcldpbmRvdyB9IGZyb20gXCIjL1dpbmRvdy9Ccm93c2VyV2luZG93XCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIgfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiIy9EZXZlbG9wbWVudFwiO1xuaW1wb3J0IHsgUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uIH0gZnJvbSBcIi4vSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgYXV0b1VwZGF0ZXIgfSBmcm9tIFwiZWxlY3Ryb24tdXBkYXRlclwiO1xuaW1wb3J0IGxvZyBmcm9tIFwiZWxlY3Ryb24tbG9nXCI7XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIkVsZWN0cm9uXCIpO1xuXG5jb25zdCBJbml0aWFsaXplID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBsZXQgTWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIilcbiAgICB7XG4gICAgICAgIGNvbnN0IFNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0XCIpO1xuICAgICAgICBTb3VyY2VNYXBTdXBwb3J0Lmluc3RhbGwoKTtcbiAgICB9XG5cbiAgICBjb25zdCBJc0RlYnVnOiBib29sZWFuID0gKFxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiIHx8XG4gICAgICAgIHByb2Nlc3MuZW52LkRFQlVHX1BST0QgPT09IFwidHJ1ZVwiXG4gICAgKTtcblxuICAgIGlmIChJc0RlYnVnKVxuICAgIHtcbiAgICAgICAgY29uc3QgSW5zdGFsbGVyOiBhbnkgPSByZXF1aXJlKFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCIpO1xuICAgICAgICBjb25zdCBGb3JjZURvd25sb2FkOiBib29sZWFuID0gISFwcm9jZXNzLmVudi5VUEdSQURFX0VYVEVOU0lPTlM7XG4gICAgICAgIGNvbnN0IEV4dGVuc2lvbnM6IFRBcnJheTxzdHJpbmc+ID0gWyBcIlJFQUNUX0RFVkVMT1BFUl9UT09MU1wiIF07XG5cbiAgICAgICAgSW5zdGFsbGVyXG4gICAgICAgICAgICAuZGVmYXVsdChcbiAgICAgICAgICAgICAgICBFeHRlbnNpb25zLm1hcCgoTmFtZTogc3RyaW5nKSA9PiBJbnN0YWxsZXJbTmFtZV0pLFxuICAgICAgICAgICAgICAgIEZvcmNlRG93bmxvYWRcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5jYXRjaChMb2cuRXJyb3IpO1xuICAgIH1cblxuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCBDcmVhdGVXaW5kb3cgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PlxuICAgIHtcbiAgICAgICAgaWYgKElzRGVidWcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGF3YWl0IEluc3RhbGxFeHRlbnNpb25zKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IFdpbmRvdywgTG9hZEZyb250ZW5kIH0gPSBhd2FpdCBDcmVhdGVCcm93c2VyV2luZG93KHtcbiAgICAgICAgICAgIGhlaWdodDogNzI4LFxuICAgICAgICAgICAgd2lkdGg6IDEwMjQsXG5cbiAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGV2VG9vbHM6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgTWFpbldpbmRvdyA9IFdpbmRvdztcbiAgICAgICAgYXdhaXQgTG9hZEZyb250ZW5kKCk7XG5cbiAgICAgICAgLy8gTWFpbldpbmRvdy5vbihcInNob3dcIiwgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Jc0Fsd2F5c09uVG9wOiBib29sZWFuKTogdm9pZCA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+XG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIk5hdmlnYXRlXCIsIFwiVGVzdFdpbmRvd1wiKTtcbiAgICAgICAgLy8gICAgIH0sIDIwMDApO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICBNYWluV2luZG93Lm9uKFwicmVhZHktdG8tc2hvd1wiLCAoKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIU1haW5XaW5kb3cpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcIk1haW5XaW5kb3dcXFwiIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52LlNUQVJUX01JTklNSVpFRClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBNYWluV2luZG93Lm1pbmltaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTWFpbldpbmRvdy5zZXRNZW51QmFyVmlzaWJpbGl0eShmYWxzZSk7XG4gICAgICAgICAgICAgICAgTWFpbldpbmRvdy5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgTWFpbldpbmRvdyA9IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1haW5XaW5kb3cud2ViQ29udGVudHMuc2V0V2luZG93T3BlbkhhbmRsZXIoKEVkYXRhOiBFbGVjdHJvbi5IYW5kbGVyRGV0YWlscykgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKEVkYXRhLnVybCk7XG4gICAgICAgICAgICByZXR1cm4geyBhY3Rpb246IFwiZGVueVwiIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxvZy50cmFuc3BvcnRzLmZpbGUubGV2ZWwgPSBcImluZm9cIjtcbiAgICAgICAgYXV0b1VwZGF0ZXIubG9nZ2VyID0gbG9nO1xuICAgICAgICBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXNBbmROb3RpZnkoKTtcbiAgICB9O1xufTtcblxuYXBwLnNldEFwcFVzZXJNb2RlbElkKFwiZ2FnZXNvcnJlbGwuc29ycmVsbHdtXCIpO1xuYXBwLnNldFRvYXN0QWN0aXZhdG9yQ0xTSUQoXCJ7ODc2NTQzMjEtNDMyMS00MzIxLTEyMzQtMTIzNDU2Nzg5MEFCfVwiKTtcblxuY29uc3QgSW5pdGlhbGl6ZUVsZWN0cm9uID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBhcHAub24oXCJhY3RpdmF0ZVwiLCBJbml0aWFsaXplKTtcbn07XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcIkVsZWN0cm9uXCIsIEluaXRpYWxpemVFbGVjdHJvbiwgWyBcIkJyb3dzZXJXaW5kb3dcIiBdKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==