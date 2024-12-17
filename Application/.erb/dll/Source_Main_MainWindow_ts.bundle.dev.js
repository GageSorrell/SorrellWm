"use strict";
exports.id = "Source_Main_MainWindow_ts";
exports.ids = ["Source_Main_MainWindow_ts"];
exports.modules = {

/***/ "./Source/Main/MainWindow.ts":
/*!***********************************!*\
  !*** ./Source/Main/MainWindow.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/Domain/Common/Component/Keyboard/Keyboard */ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./Source/Main/util.ts");
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */






let MainWindow = undefined;
const GetLeastInvisiblePosition = () => {
    const Displays = electron__WEBPACK_IMPORTED_MODULE_2__.screen.getAllDisplays();
    const MonitorBounds = Displays.map((display) => {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });
    MonitorBounds.sort((A, B) => A.left - B.left || A.top - B.top);
    const MaxRight = Math.max(...MonitorBounds.map((bounds) => bounds.right));
    const MaxBottom = Math.max(...MonitorBounds.map((bounds) => bounds.bottom));
    const InvisibleX = (MaxRight + 1) * 2;
    const InvisibleY = (MaxBottom + 1) * 2;
    return {
        x: InvisibleX,
        y: InvisibleY
    };
};
const LaunchMainWindow = async () => {
    console.log("Launching main window.");
    MainWindow = new electron__WEBPACK_IMPORTED_MODULE_2__.BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            devTools: false,
            // devTools: true,
            nodeIntegration: true,
            preload: electron__WEBPACK_IMPORTED_MODULE_2__.app.isPackaged
                ? path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "Preload.js")
                : path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });
    MainWindow.on("show", (_Event, _IsAlwaysOnTop) => {
        MainWindow?.webContents.send("Navigate", "Main");
    });
    MainWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
        // MainWindow?.webContents.openDevTools();
    });
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("Log", async (_Event, ...Arguments) => {
        const StringifiedArguments = Arguments
            .map((Argument) => {
            return typeof Argument === "string"
                ? Argument
                : JSON.stringify(Argument);
        })
            .join();
        const Birdie = "🐥 ";
        let OutString = Birdie;
        for (let Index = 0; Index < StringifiedArguments.length; Index++) {
            const Character = StringifiedArguments[Index];
            if (Character === "\n" && Index !== StringifiedArguments.length - 1) {
                OutString += Birdie + Character;
            }
            else {
                OutString += Character;
            }
        }
        console.log(OutString);
    });
    MainWindow.loadURL((0,_util__WEBPACK_IMPORTED_MODULE_5__.resolveHtmlPath)("index.html"));
};
function OnKey(Event) {
    const { State, VkCode } = Event;
    if (MainWindow === undefined) {
        return;
    }
    /** @TODO Make this a modifiable setting. */
    const ActivationKey = _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_4__.Vk["+"];
    if (VkCode === ActivationKey) {
        if (State === "Down") {
            // const { CoveringWindow, ThemeMode }: FBlurReturnType = MyBlur();
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.BlurBackground)();
        }
        else {
            // MainWindow?.webContents.send("TearDown");
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.UnblurBackground)();
            // ipcMain.on("TearDown", (): void =>
            // {
            //     TearDown();
            //     setTimeout((): void =>
            //     {
            //         const { x, y } = GetLeastInvisiblePosition();
            //         MainWindow?.setPosition(x, y, false);
            //     }, 100);
            // });
            // MainWindow?.webContents.send("TearDown");
            // MainWindow?.on("closed", (_: Electron.Event): void =>
            // {
            //     LaunchMainWindow();
            // });
            // MainWindow?.close();
            // TestFun();
        }
    }
    else {
        MainWindow.webContents.send("Keyboard", Event);
    }
}
electron__WEBPACK_IMPORTED_MODULE_2__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_3__.Keyboard.Subscribe(OnKey);


/***/ })

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fTWFpbldpbmRvd190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUUwQjtBQUN5QztBQUNQO0FBR3pCO0FBQzJCO0FBQ3hCO0FBRXpDLElBQUksVUFBVSxHQUE4QixTQUFTLENBQUM7QUFFdEQsTUFBTSx5QkFBeUIsR0FBRyxHQUE2QixFQUFFO0lBRTdELE1BQU0sUUFBUSxHQUE0Qiw0Q0FBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBR2xFLE1BQU0sYUFBYSxHQUEwQixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBeUIsRUFBa0IsRUFBRTtRQUVwRyxPQUFPO1lBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTTtZQUNoRCxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDOUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QixDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFFSCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBaUIsRUFBRSxDQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFL0YsTUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFzQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNsRyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcs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QyIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL01haW5XaW5kb3cudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRmlsZTogICAgTWFpbldpbmRvdy50c1xuICogQXV0aG9yOiAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCbHVyQmFja2dyb3VuZCwgVW5ibHVyQmFja2dyb3VuZCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGFwcCwgaXBjTWFpbiwgc2NyZWVuIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZLZXlib2FyZEV2ZW50IH0gZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRlZpcnR1YWxLZXkgfSBmcm9tIFwiQC9Eb21haW4vQ29tbW9uL0NvbXBvbmVudC9LZXlib2FyZC9LZXlib2FyZC5UeXBlc1wiO1xuaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi9LZXlib2FyZFwiO1xuaW1wb3J0IHsgVmsgfSBmcm9tIFwiQC9Eb21haW4vQ29tbW9uL0NvbXBvbmVudC9LZXlib2FyZC9LZXlib2FyZFwiO1xuaW1wb3J0IHsgcmVzb2x2ZUh0bWxQYXRoIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5sZXQgTWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuY29uc3QgR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbiA9ICgpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPT5cbntcbiAgICBjb25zdCBEaXNwbGF5czogQXJyYXk8RWxlY3Ryb24uRGlzcGxheT4gPSBzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcblxuICAgIHR5cGUgRk1vbml0b3JCb3VuZHMgPSB7IGxlZnQ6IG51bWJlcjsgcmlnaHQ6IG51bWJlcjsgdG9wOiBudW1iZXI7IGJvdHRvbTogbnVtYmVyIH07XG4gICAgY29uc3QgTW9uaXRvckJvdW5kczogQXJyYXk8Rk1vbml0b3JCb3VuZHM+ID0gRGlzcGxheXMubWFwKChkaXNwbGF5OiBFbGVjdHJvbi5EaXNwbGF5KTogRk1vbml0b3JCb3VuZHMgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBib3R0b206IGRpc3BsYXkuYm91bmRzLnkgKyBkaXNwbGF5LmJvdW5kcy5oZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LmJvdW5kcy54LFxuICAgICAgICAgICAgcmlnaHQ6IGRpc3BsYXkuYm91bmRzLnggKyBkaXNwbGF5LmJvdW5kcy53aWR0aCxcbiAgICAgICAgICAgIHRvcDogZGlzcGxheS5ib3VuZHMueVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgTW9uaXRvckJvdW5kcy5zb3J0KChBOiBGTW9uaXRvckJvdW5kcywgQjogRk1vbml0b3JCb3VuZHMpID0+IEEubGVmdCAtIEIubGVmdCB8fCBBLnRvcCAtIEIudG9wKTtcblxuICAgIGNvbnN0IE1heFJpZ2h0OiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLnJpZ2h0KSk7XG4gICAgY29uc3QgTWF4Qm90dG9tOiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLmJvdHRvbSkpO1xuXG4gICAgY29uc3QgSW52aXNpYmxlWDogbnVtYmVyID0gKE1heFJpZ2h0ICsgMSkgKiAyO1xuICAgIGNvbnN0IEludmlzaWJsZVk6IG51bWJlciA9IChNYXhCb3R0b20gKyAxKSAqIDI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBJbnZpc2libGVYLFxuICAgICAgICB5OiBJbnZpc2libGVZXG4gICAgfTtcbn07XG5cbmNvbnN0IExhdW5jaE1haW5XaW5kb3cgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGNvbnNvbGUubG9nKFwiTGF1bmNoaW5nIG1haW4gd2luZG93LlwiKTtcbiAgICBNYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcbiAgICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgICBoZWlnaHQ6IDkwMCxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgc2tpcFRhc2tiYXI6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIlNvcnJlbGxXbSBNYWluIFdpbmRvd1wiLFxuICAgICAgICB0aXRsZUJhclN0eWxlOiBcImhpZGRlblwiLFxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGRldlRvb2xzOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIGRldlRvb2xzOiB0cnVlLFxuICAgICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgcHJlbG9hZDogYXBwLmlzUGFja2FnZWRcbiAgICAgICAgICAgICAgICA/IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiUHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgICAgIDogUGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi8uZXJiL2RsbC9wcmVsb2FkLmpzXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgIC4uLkdldExlYXN0SW52aXNpYmxlUG9zaXRpb24oKVxuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcInNob3dcIiwgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Jc0Fsd2F5c09uVG9wOiBib29sZWFuKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIk5hdmlnYXRlXCIsIFwiTWFpblwiKTtcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cub24oXG4gICAgICAgIFwicGFnZS10aXRsZS11cGRhdGVkXCIsXG4gICAgICAgIChFdmVudDogRWxlY3Ryb24uRXZlbnQsIF9UaXRsZTogc3RyaW5nLCBfRXhwbGljaXRTZXQ6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvLyBNYWluV2luZG93Py53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBpcGNNYWluLm9uKFwiTG9nXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgU3RyaW5naWZpZWRBcmd1bWVudHM6IHN0cmluZyA9IEFyZ3VtZW50c1xuICAgICAgICAgICAgLm1hcCgoQXJndW1lbnQ6IHVua25vd24pOiBzdHJpbmcgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIEFyZ3VtZW50ID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgID8gQXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgOiBKU09OLnN0cmluZ2lmeShBcmd1bWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oKTtcblxuICAgICAgICBjb25zdCBCaXJkaWU6IHN0cmluZyA9IFwi8J+QpSBcIjtcbiAgICAgICAgbGV0IE91dFN0cmluZzogc3RyaW5nID0gQmlyZGllO1xuICAgICAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGg7IEluZGV4KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gU3RyaW5naWZpZWRBcmd1bWVudHNbSW5kZXhdO1xuICAgICAgICAgICAgaWYgKENoYXJhY3RlciA9PT0gXCJcXG5cIiAmJiBJbmRleCAhPT0gU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQmlyZGllICsgQ2hhcmFjdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhPdXRTdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5sb2FkVVJMKHJlc29sdmVIdG1sUGF0aChcImluZGV4Lmh0bWxcIikpO1xufTtcblxuZnVuY3Rpb24gT25LZXkoRXZlbnQ6IEZLZXlib2FyZEV2ZW50KTogdm9pZFxue1xuICAgIGNvbnN0IHsgU3RhdGUsIFZrQ29kZSB9ID0gRXZlbnQ7XG4gICAgaWYgKE1haW5XaW5kb3cgPT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiogQFRPRE8gTWFrZSB0aGlzIGEgbW9kaWZpYWJsZSBzZXR0aW5nLiAqL1xuICAgIGNvbnN0IEFjdGl2YXRpb25LZXk6IEZWaXJ0dWFsS2V5ID0gVmtbXCIrXCJdO1xuXG4gICAgaWYgKFZrQ29kZSA9PT0gQWN0aXZhdGlvbktleSlcbiAgICB7XG4gICAgICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGNvbnN0IHsgQ292ZXJpbmdXaW5kb3csIFRoZW1lTW9kZSB9OiBGQmx1clJldHVyblR5cGUgPSBNeUJsdXIoKTtcbiAgICAgICAgICAgIEJsdXJCYWNrZ3JvdW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiVGVhckRvd25cIik7XG4gICAgICAgICAgICBVbmJsdXJCYWNrZ3JvdW5kKCk7XG4gICAgICAgICAgICAvLyBpcGNNYWluLm9uKFwiVGVhckRvd25cIiwgKCk6IHZvaWQgPT5cbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBUZWFyRG93bigpO1xuICAgICAgICAgICAgLy8gICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgLy8gICAgICAgICBNYWluV2luZG93Py5zZXRQb3NpdGlvbih4LCB5LCBmYWxzZSk7XG4gICAgICAgICAgICAvLyAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgLy8gTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIlRlYXJEb3duXCIpO1xuXG4gICAgICAgICAgICAvLyBNYWluV2luZG93Py5vbihcImNsb3NlZFwiLCAoXzogRWxlY3Ryb24uRXZlbnQpOiB2b2lkID0+XG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgTGF1bmNoTWFpbldpbmRvdygpO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAvLyBNYWluV2luZG93Py5jbG9zZSgpO1xuXG4gICAgICAgICAgICAvLyBUZXN0RnVuKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgTWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKFwiS2V5Ym9hcmRcIiwgRXZlbnQpO1xuICAgIH1cbn1cblxuYXBwLndoZW5SZWFkeSgpXG4gICAgLnRoZW4oTGF1bmNoTWFpbldpbmRvdylcbiAgICAuY2F0Y2goY29uc29sZS5sb2cpO1xuXG5LZXlib2FyZC5TdWJzY3JpYmUoT25LZXkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9