"use strict";
exports.id = "Source_Main_Development_DummyWindows_ts";
exports.ids = ["Source_Main_Development_DummyWindows_ts"];
exports.modules = {

/***/ "./Source/Main/Development/DummyWindows.ts"
/*!*************************************************!*\
  !*** ./Source/Main/Development/DummyWindows.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      DummyWindows.ts
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
const Path = __importStar(__webpack_require__(/*! path */ "path"));
const Tree_1 = __webpack_require__(/*! #/Tree/Tree */ "./Source/Main/Tree/Tree.ts");
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const BrowserWindow_1 = __webpack_require__(/*! #/Window/BrowserWindow */ "./Source/Main/Window/BrowserWindow/index.ts");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const DevSettings_1 = __webpack_require__(/*! ./DevSettings */ "./Source/Main/Development/DevSettings.ts");
const Log_1 = __webpack_require__(/*! ./Log/Log */ "./Source/Main/Development/Log/Log.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const Event_1 = __webpack_require__(/*! #/Event */ "./Source/Main/Event/index.ts");
const Log = (0, Log_1.GetLogger)("DummyWindows");
async function CreateDummyWindows() {
    const { CreateDummyWindows } = (0, DevSettings_1.GetDevSettings)();
    if (!CreateDummyWindows.Enabled) {
        return;
    }
    const ImportPath = Path.resolve("./Configuration/Development/", CreateDummyWindows.ConfigurationPath);
    const ConfigurationString = await fs_1.promises.readFile(ImportPath, { encoding: "utf-8" });
    const { Configurations } = JSON.parse(ConfigurationString);
    const GetChildWindowTitle = ({ Depth, Index }) => {
        return `DummyWindow-${Depth}-${Index}`;
    };
    const GetChildHandle = ({ Depth, Index }) => {
        return (0, wm_windows_1.GetWindowByName)(GetChildWindowTitle({ Depth, Index }));
    };
    const AppendConfiguration = (Configuration) => {
        const Root = {
            ...Configuration,
            Depth: 0,
            Panel: undefined,
            Parent: undefined,
            ParentPanel: undefined
        };
        const AppendChildren = (ChildConfiguration) => {
            if (ChildConfiguration.Panels !== undefined && ChildConfiguration.Panels.length > 0) {
                ChildConfiguration.Panels.forEach((ChildPanel) => {
                    if (ChildPanel === undefined) {
                        Log("CHILD PANEL WAS UNDEFINED");
                    }
                    ChildPanel.Depth =
                        ChildConfiguration.Depth + 1;
                    ChildPanel.Parent = ChildConfiguration;
                    ChildPanel.ParentPanel = undefined;
                    AppendChildren(ChildPanel);
                });
            }
        };
        AppendChildren(Root);
        return Root;
    };
    const SortChildren = (Configuration) => {
        if (Configuration.Panels !== undefined) {
            Configuration.Panels.sort((A, B) => {
                return A.Index < B.Index
                    ? -1
                    : 1;
            });
            Configuration.Panels.forEach(SortChildren);
        }
        return Configuration;
    };
    const CreateWindow = async ({ Depth, Index }) => {
        Log(`CreateWindow was called with Depth == ${Depth} and Index == ${Index}.`);
        // const { LoadFrontend, Window } =
        const { LoadFrontend, Window } = await (0, BrowserWindow_1.CreateBrowserWindow)({ title: GetChildWindowTitle({ Depth, Index }) });
        // const Show: Promise<void> = new Promise<void>((
        //     Resolve: TPromiseThenFunction<void>,
        //     _Reject: FRejectFunction
        // ): void =>
        // {
        //     Window.on("show", (): void =>
        //     {
        //         Log(`CreateWindow.Show(${ Depth }, ${ Index }) is resolved!`);
        //         Resolve();
        //     });
        // });
        try {
            await LoadFrontend();
            // await Show;
            (0, Event_1.RegisterIpcCallback)(Window, "GetIsDummyWindow", async () => {
                return {
                    Data: {
                        IsDummyWindow: true
                    },
                    Error: undefined
                };
            });
        }
        catch (Error) {
            Log.Error("CreateWindow: ", Error);
        }
    };
    const HandleConfiguration = (Configuration) => {
        const { Depth, Direction, FloatingWindows = [], NumChildren } = Configuration;
        Log("HandleConfiguration Argument:", Configuration);
        const PanelIndices = (Configuration.Panels || []).map(({ Index }) => {
            return Index;
        });
        // if (Configuration.ParentPanel === undefined)
        // {
        //     const OutParentPanel: FPanel | undefined = GetForest()[Index];
        //     Log("OutParentPanel: ", OutParentPanel);
        //     Log("Forest: ", GetForest());
        //     Log("TIME CALLING GET FOREST", new Date().getTime());
        //     Configuration.ParentPanel = GetForest()[Index];
        // }
        if (Configuration.Panel === undefined) {
            Log("SETTING CONFIGURATION PANEL");
            const NewPanel = (0, Tree_1.GetForest)().find((Tree) => {
                return Tree.Size.Height === 1_380;
            });
            if (NewPanel !== undefined) {
                Log("ULTRAWIDE MONITOR WAS FOUND");
                Configuration.Panel = NewPanel;
                Configuration.Panel.Type = Direction;
            }
            // {
            //     Children: [ ],
            //     Size: { Height: 100, Width: 100, X: 0, Y: 0 },
            //     Type: Direction,
            //     ZOrder: 1
            // };
            // Configuration.ParentPanel.Children.push(Configuration.Panel);
            // Log("HANDLE CONFIGURATION MAKE SIZES UNIFORM");
            // MakeSizesUniform(Configuration.Panel);
            // Publish();
        }
        else {
            /* eslint-disable-next-line @stylistic/max-len */
            Log(`DID NOT SET CONFIGURATION PANEL,\n\t(Configuration.Panel === undefined) == ${Configuration.Panel}\n\t(Configuration.ParentPanel !== undefined) == ${Configuration.ParentPanel !== undefined}`);
        }
        Log(`NumChildren == ${NumChildren}.`);
        for (let ChildIndex = 0; ChildIndex < NumChildren; ChildIndex++) {
            const IsChildPanel = PanelIndices.includes(ChildIndex);
            Log(`ChildIndex == ${ChildIndex}\tIsChildPanel == ${IsChildPanel}`);
            if (IsChildPanel) {
                const ChildPanel = (Configuration.Panels || [])[ChildIndex];
                if (ChildPanel !== undefined) {
                    ChildPanel.ParentPanel = Configuration.Panel;
                    const OutPanel = {
                        Children: [],
                        Size: { Height: 100, Width: 100, X: 0, Y: 0 },
                        Type: ChildPanel.Direction,
                        ZOrder: 1
                    };
                    Configuration.Panel.Children[ChildIndex] = OutPanel;
                    Log("MAKE SIZES UNIFORM LINE 184");
                    (0, Tree_1.MakeSizesUniform)(Configuration.Panel);
                    (0, Tree_1.Publish)();
                }
            }
            else {
                const WindowData = { Depth, Index: ChildIndex };
                const Handle = GetChildHandle(WindowData);
                /* eslint-disable-next-line @stylistic/max-len */
                Log(`Handle at ChildIndex == ${ChildIndex} is ${Handle !== undefined ? "DEFINED" : "NOT DEFINED"}`);
                if (Configuration.Panel !== undefined && Handle !== undefined) {
                    Log("BRINGING INTO PANEL");
                    (0, Tree_1.BringIntoPanel)(Configuration.Panel, Handle);
                    // const Cell: FCell | undefined = BringIntoPanel(Configuration.Panel, Handle);
                    // if (Cell !== undefined)
                    // {
                    //     Configuration.Panel.Children[ChildIndex] = Cell;
                    // }
                }
            }
        }
        if (FloatingWindows.length > 0) {
            throw new Error("FloatingWindows.length > 0, but FloatingWindows have not been implemented yet.");
        }
        if (Configuration.Panels !== undefined && Configuration.Panels.length > 0) {
            Configuration.Panels =
                Configuration.Panels.map(HandleConfiguration);
        }
        return Configuration;
    };
    const Intermediate = Configurations
        .map(AppendConfiguration)
        .map(SortChildren);
    const GetCreateWindowPromise = (Configuration) => {
        const Out = [];
        const PanelIndices = Array.isArray(Configuration.Panels)
            ? Configuration.Panels.map(({ Index }) => {
                return Index;
            })
            : [];
        for (let ChildIndex = 0; ChildIndex < Configuration.NumChildren; ChildIndex++) {
            const IsChildWindow = !PanelIndices.includes(ChildIndex);
            if (IsChildWindow) {
                const Argument = {
                    Depth: Configuration.Depth,
                    Index: ChildIndex
                };
                Out.push(CreateWindow(Argument));
            }
            else if (Configuration.Panels !== undefined) {
                const ChildPanel = Configuration.Panels[ChildIndex];
                if (ChildPanel !== undefined) {
                    Out.push(GetCreateWindowPromise(ChildPanel));
                }
            }
        }
        return Promise.allSettled(Out);
    };
    await Promise.allSettled(Intermediate.map(GetCreateWindowPromise));
    const Handled = Intermediate.map(HandleConfiguration);
    Log(Handled);
    (0, Tree_1.MakeSizesUniform)(Handled[0]?.Panel);
    await (0, Tree_1.Publish)();
}
(0, Initialize_1.RegisterInitializationFunction)("DummyWindows", CreateDummyWindows, ["Tree"]);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fRGV2ZWxvcG1lbnRfRHVtbXlXaW5kb3dzX3RzLmJ1bmRsZS5kZXYuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsbUVBQTZCO0FBQzdCLG9GQUFtRjtBQUduRiwyRkFBb0U7QUFDcEUseUhBQTZEO0FBQzdELGlEQUFvQztBQUNwQywyR0FBK0M7QUFDL0MsMkZBQXNDO0FBQ3RDLGtIQUF5RTtBQUN6RSxtRkFBOEM7QUFLOUMsTUFBTSxHQUFHLEdBQVksbUJBQVMsRUFBQyxjQUFjLENBQUMsQ0FBQztBQUUvQyxLQUFLLFVBQVUsa0JBQWtCO0lBRTdCLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLGdDQUFjLEdBQUUsQ0FBQztJQUVoRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUMvQixDQUFDO1FBQ0csT0FBTztJQUNYLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUNuQyw4QkFBOEIsRUFDOUIsa0JBQWtCLENBQUMsaUJBQWlCLENBQ3ZDLENBQUM7SUFFRixNQUFNLG1CQUFtQixHQUFXLE1BQU0sYUFBRSxDQUFDLFFBQVEsQ0FDakQsVUFBVSxFQUNWLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUN4QixDQUFDO0lBRUYsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQThCLENBQUM7SUFrQnhGLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQW9CLEVBQVUsRUFBRTtRQUV2RSxPQUFPLGVBQWdCLEtBQU0sSUFBSyxLQUFNLEVBQUUsQ0FBQztJQUMvQyxDQUFDLENBQUM7SUFFRixNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBb0IsRUFBdUIsRUFBRTtRQUUvRSxPQUFPLGdDQUFlLEVBQUMs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LENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDakQsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQztJQUVGLE1BQU0sT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztJQUNuRSxNQUFNLE9BQU8sR0FDVCxZQUFZLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFtQyxDQUFDO0lBRTVFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUViLDJCQUFnQixFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFlLENBQUMsQ0FBQztJQUM5QyxNQUFNLGtCQUFPLEdBQUUsQ0FBQztBQUNwQixDQUFDO0FBRUQsK0NBQThCLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFFLENBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvRHVtbXlXaW5kb3dzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBEdW1teVdpbmRvd3MudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBCcmluZ0ludG9QYW5lbCwgR2V0Rm9yZXN0LCBNYWtlU2l6ZXNVbmlmb3JtLCBQdWJsaXNoIH0gZnJvbSBcIiMvVHJlZS9UcmVlXCI7XG5pbXBvcnQgdHlwZSB7IEZEdW1teUNvbmZpZ3VyYXRpb24sIEZEdW1teUNvbmZpZ3VyYXRpb25TY2hlbWEsIEZEdW1teVBhbmVsIH0gZnJvbSBcIi4vRGV2U2V0dGluZ3MuVHlwZXNcIjtcbmltcG9ydCB7IHR5cGUgRkxvZ2dlciwgdHlwZSBGUGFuZWwgfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBHZXRXaW5kb3dCeU5hbWUsIHR5cGUgSFdpbmRvdyB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQgeyBDcmVhdGVCcm93c2VyV2luZG93IH0gZnJvbSBcIiMvV2luZG93L0Jyb3dzZXJXaW5kb3dcIjtcbmltcG9ydCB7IHByb21pc2VzIGFzIEZzIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBHZXREZXZTZXR0aW5ncyB9IGZyb20gXCIuL0RldlNldHRpbmdzXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiLi9Mb2cvTG9nXCI7XG5pbXBvcnQgeyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiIy9Jbml0aWFsaXplL0luaXRpYWxpemVcIjtcbmltcG9ydCB7IFJlZ2lzdGVySXBjQ2FsbGJhY2sgfSBmcm9tIFwiIy9FdmVudFwiO1xuXG4vLyBAVE9ETyBUZW1wb3JhcnkuXG50eXBlIFRFdmVudENhbGxiYWNrPFR5cGU+ID0gKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+IFByb21pc2U8YW55PjtcblxuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiRHVtbXlXaW5kb3dzXCIpO1xuXG5hc3luYyBmdW5jdGlvbiBDcmVhdGVEdW1teVdpbmRvd3MoKTogUHJvbWlzZTx2b2lkPlxue1xuICAgIGNvbnN0IHsgQ3JlYXRlRHVtbXlXaW5kb3dzIH0gPSBHZXREZXZTZXR0aW5ncygpO1xuXG4gICAgaWYgKCFDcmVhdGVEdW1teVdpbmRvd3MuRW5hYmxlZClcbiAgICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBJbXBvcnRQYXRoOiBzdHJpbmcgPSBQYXRoLnJlc29sdmUoXG4gICAgICAgIFwiLi9Db25maWd1cmF0aW9uL0RldmVsb3BtZW50L1wiLFxuICAgICAgICBDcmVhdGVEdW1teVdpbmRvd3MuQ29uZmlndXJhdGlvblBhdGhcbiAgICApO1xuXG4gICAgY29uc3QgQ29uZmlndXJhdGlvblN0cmluZzogc3RyaW5nID0gYXdhaXQgRnMucmVhZEZpbGUoXG4gICAgICAgIEltcG9ydFBhdGgsXG4gICAgICAgIHsgZW5jb2Rpbmc6IFwidXRmLThcIiB9XG4gICAgKTtcblxuICAgIGNvbnN0IHsgQ29uZmlndXJhdGlvbnMgfSA9IEpTT04ucGFyc2UoQ29uZmlndXJhdGlvblN0cmluZykgYXMgRkR1bW15Q29uZmlndXJhdGlvblNjaGVtYTtcblxuICAgIHR5cGUgRkR1bW15Q29uZmlndXJhdGlvbk5vZGUgPVxuICAgICAgICBGRHVtbXlDb25maWd1cmF0aW9uICZcbiAgICAgICAge1xuICAgICAgICAgICAgRGVwdGg6IG51bWJlcjtcbiAgICAgICAgICAgIFBhbmVsOiBGUGFuZWw7XG4gICAgICAgICAgICBQYXJlbnRQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgUGFyZW50OlxuICAgICAgICAgICAgICAgIHwgRkR1bW15Q29uZmlndXJhdGlvblxuICAgICAgICAgICAgICAgIHwgRkR1bW15Q29uZmlndXJhdGlvbk5vZGVcbiAgICAgICAgICAgICAgICB8IHVuZGVmaW5lZDtcbiAgICAgICAgfTtcblxuICAgIHR5cGUgRkNoaWxkV2luZG93RGF0YSA9XG4gICAgICAgIFBhcnRpYWw8T21pdDxGRHVtbXlDb25maWd1cmF0aW9uTm9kZSwgXCJEZXB0aFwiIHwgXCJJbmRleFwiPj4gJlxuICAgICAgICBQaWNrPEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlLCBcIkRlcHRoXCIgfCBcIkluZGV4XCI+O1xuXG4gICAgY29uc3QgR2V0Q2hpbGRXaW5kb3dUaXRsZSA9ICh7IERlcHRoLCBJbmRleCB9OiBGQ2hpbGRXaW5kb3dEYXRhKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICByZXR1cm4gYER1bW15V2luZG93LSR7IERlcHRoIH0tJHsgSW5kZXggfWA7XG4gICAgfTtcblxuICAgIGNvbnN0IEdldENoaWxkSGFuZGxlID0gKHsgRGVwdGgsIEluZGV4IH06IEZDaGlsZFdpbmRvd0RhdGEpOiBIV2luZG93IHwgdW5kZWZpbmVkID0+XG4gICAge1xuICAgICAgICByZXR1cm4gR2V0V2luZG93QnlOYW1lKEdldENoaWxkV2luZG93VGl0bGUoeyBEZXB0aCwgSW5kZXggfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBBcHBlbmRDb25maWd1cmF0aW9uID0gKENvbmZpZ3VyYXRpb246IEZEdW1teUNvbmZpZ3VyYXRpb24pOiBGRHVtbXlDb25maWd1cmF0aW9uTm9kZSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgUm9vdDogRkR1bW15Q29uZmlndXJhdGlvbk5vZGUgPVxuICAgICAgICB7XG4gICAgICAgICAgICAuLi5Db25maWd1cmF0aW9uLFxuICAgICAgICAgICAgRGVwdGg6IDAsXG4gICAgICAgICAgICBQYW5lbDogdW5kZWZpbmVkIGFzIHVua25vd24gYXMgRlBhbmVsLFxuICAgICAgICAgICAgUGFyZW50OiB1bmRlZmluZWQsXG4gICAgICAgICAgICBQYXJlbnRQYW5lbDogdW5kZWZpbmVkXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgQXBwZW5kQ2hpbGRyZW4gPSAoQ2hpbGRDb25maWd1cmF0aW9uOiBGRHVtbXlDb25maWd1cmF0aW9uIHwgRkR1bW15Q29uZmlndXJhdGlvbk5vZGUpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChDaGlsZENvbmZpZ3VyYXRpb24uUGFuZWxzICE9PSB1bmRlZmluZWQgJiYgQ2hpbGRDb25maWd1cmF0aW9uLlBhbmVscy5sZW5ndGggPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENoaWxkQ29uZmlndXJhdGlvbi5QYW5lbHMuZm9yRWFjaCgoQ2hpbGRQYW5lbDogRkR1bW15UGFuZWwpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ2hpbGRQYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2coXCJDSElMRCBQQU5FTCBXQVMgVU5ERUZJTkVEXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIChDaGlsZFBhbmVsIGFzIEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlKS5EZXB0aCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAoQ2hpbGRDb25maWd1cmF0aW9uIGFzIEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlKS5EZXB0aCArIDE7XG4gICAgICAgICAgICAgICAgICAgIChDaGlsZFBhbmVsIGFzIEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlKS5QYXJlbnQgPSBDaGlsZENvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIChDaGlsZFBhbmVsIGFzIEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlKS5QYXJlbnRQYW5lbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgQXBwZW5kQ2hpbGRyZW4oQ2hpbGRQYW5lbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgQXBwZW5kQ2hpbGRyZW4oUm9vdCk7XG5cbiAgICAgICAgcmV0dXJuIFJvb3Q7XG4gICAgfTtcblxuICAgIGNvbnN0IFNvcnRDaGlsZHJlbiA9IChDb25maWd1cmF0aW9uOiBGRHVtbXlDb25maWd1cmF0aW9uTm9kZSB8IEZEdW1teVBhbmVsKTogRkR1bW15Q29uZmlndXJhdGlvbk5vZGUgPT5cbiAgICB7XG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLlBhbmVscyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLlBhbmVscy5zb3J0KChBOiBGRHVtbXlQYW5lbCwgQjogRkR1bW15Q29uZmlndXJhdGlvbik6IG51bWJlciA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBBLkluZGV4IDwgQi5JbmRleFxuICAgICAgICAgICAgICAgICAgICA/IC0xXG4gICAgICAgICAgICAgICAgICAgIDogMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLlBhbmVscy5mb3JFYWNoKFNvcnRDaGlsZHJlbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uZmlndXJhdGlvbiBhcyBGRHVtbXlDb25maWd1cmF0aW9uTm9kZTtcbiAgICB9O1xuXG4gICAgdHlwZSBGQ3JlYXRlV2luZG93QXJndW1lbnQgPSBQaWNrPEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlLCBcIkRlcHRoXCIgfCBcIkluZGV4XCI+O1xuICAgIGNvbnN0IENyZWF0ZVdpbmRvdyA9IGFzeW5jICh7IERlcHRoLCBJbmRleCB9OiBGQ3JlYXRlV2luZG93QXJndW1lbnQpOiBQcm9taXNlPHZvaWQ+ID0+XG4gICAge1xuICAgICAgICBMb2coYENyZWF0ZVdpbmRvdyB3YXMgY2FsbGVkIHdpdGggRGVwdGggPT0gJHsgRGVwdGggfSBhbmQgSW5kZXggPT0gJHsgSW5kZXggfS5gKTtcbiAgICAgICAgLy8gY29uc3QgeyBMb2FkRnJvbnRlbmQsIFdpbmRvdyB9ID1cbiAgICAgICAgY29uc3QgeyBMb2FkRnJvbnRlbmQsIFdpbmRvdyB9ID1cbiAgICAgICAgICAgIGF3YWl0IENyZWF0ZUJyb3dzZXJXaW5kb3coeyB0aXRsZTogR2V0Q2hpbGRXaW5kb3dUaXRsZSh7IERlcHRoLCBJbmRleCB9KSB9KTtcblxuICAgICAgICAvLyBjb25zdCBTaG93OiBQcm9taXNlPHZvaWQ+ID0gbmV3IFByb21pc2U8dm9pZD4oKFxuICAgICAgICAvLyAgICAgUmVzb2x2ZTogVFByb21pc2VUaGVuRnVuY3Rpb248dm9pZD4sXG4gICAgICAgIC8vICAgICBfUmVqZWN0OiBGUmVqZWN0RnVuY3Rpb25cbiAgICAgICAgLy8gKTogdm9pZCA9PlxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXaW5kb3cub24oXCJzaG93XCIsICgpOiB2b2lkID0+XG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgICAgTG9nKGBDcmVhdGVXaW5kb3cuU2hvdygkeyBEZXB0aCB9LCAkeyBJbmRleCB9KSBpcyByZXNvbHZlZCFgKTtcbiAgICAgICAgLy8gICAgICAgICBSZXNvbHZlKCk7XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgdHJ5XG4gICAgICAgIHtcbiAgICAgICAgICAgIGF3YWl0IExvYWRGcm9udGVuZCgpO1xuICAgICAgICAgICAgLy8gYXdhaXQgU2hvdztcbiAgICAgICAgICAgIFJlZ2lzdGVySXBjQ2FsbGJhY2soXG4gICAgICAgICAgICAgICAgV2luZG93LFxuICAgICAgICAgICAgICAgIFwiR2V0SXNEdW1teVdpbmRvd1wiLFxuICAgICAgICAgICAgICAgIGFzeW5jICgpOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiR2V0SXNEdW1teVdpbmRvd1wiPj4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIElzRHVtbXlXaW5kb3c6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoRXJyb3I6IHVua25vd24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIExvZy5FcnJvcihcIkNyZWF0ZVdpbmRvdzogXCIsIEVycm9yKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBIYW5kbGVDb25maWd1cmF0aW9uID0gKENvbmZpZ3VyYXRpb246IEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlKTogRkR1bW15Q29uZmlndXJhdGlvbk5vZGUgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIERlcHRoLFxuICAgICAgICAgICAgRGlyZWN0aW9uLFxuICAgICAgICAgICAgRmxvYXRpbmdXaW5kb3dzID0gWyBdLFxuICAgICAgICAgICAgTnVtQ2hpbGRyZW5cbiAgICAgICAgfTogRkR1bW15Q29uZmlndXJhdGlvbk5vZGUgPSBDb25maWd1cmF0aW9uO1xuXG4gICAgICAgIExvZyhcIkhhbmRsZUNvbmZpZ3VyYXRpb24gQXJndW1lbnQ6XCIsIENvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIGNvbnN0IFBhbmVsSW5kaWNlczogQXJyYXk8bnVtYmVyPiA9IChDb25maWd1cmF0aW9uLlBhbmVscyB8fCBbIF0pLm1hcCgoXG4gICAgICAgICAgICB7IEluZGV4IH06IEZEdW1teVBhbmVsXG4gICAgICAgICk6IG51bWJlciA9PlxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gSW5kZXg7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIChDb25maWd1cmF0aW9uLlBhcmVudFBhbmVsID09PSB1bmRlZmluZWQpXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IE91dFBhcmVudFBhbmVsOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRGb3Jlc3QoKVtJbmRleF07XG4gICAgICAgIC8vICAgICBMb2coXCJPdXRQYXJlbnRQYW5lbDogXCIsIE91dFBhcmVudFBhbmVsKTtcbiAgICAgICAgLy8gICAgIExvZyhcIkZvcmVzdDogXCIsIEdldEZvcmVzdCgpKTtcbiAgICAgICAgLy8gICAgIExvZyhcIlRJTUUgQ0FMTElORyBHRVQgRk9SRVNUXCIsIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgLy8gICAgIENvbmZpZ3VyYXRpb24uUGFyZW50UGFuZWwgPSBHZXRGb3Jlc3QoKVtJbmRleF07XG4gICAgICAgIC8vIH1cblxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5QYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2coXCJTRVRUSU5HIENPTkZJR1VSQVRJT04gUEFORUxcIik7XG4gICAgICAgICAgICBjb25zdCBOZXdQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0Rm9yZXN0KCkuZmluZCgoVHJlZTogRlBhbmVsKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBUcmVlLlNpemUuSGVpZ2h0ID09PSAxXzM4MDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoTmV3UGFuZWwgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBMb2coXCJVTFRSQVdJREUgTU9OSVRPUiBXQVMgRk9VTkRcIik7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5QYW5lbCA9IE5ld1BhbmVsO1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uUGFuZWwuVHlwZSA9IERpcmVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBDaGlsZHJlbjogWyBdLFxuICAgICAgICAgICAgLy8gICAgIFNpemU6IHsgSGVpZ2h0OiAxMDAsIFdpZHRoOiAxMDAsIFg6IDAsIFk6IDAgfSxcbiAgICAgICAgICAgIC8vICAgICBUeXBlOiBEaXJlY3Rpb24sXG4gICAgICAgICAgICAvLyAgICAgWk9yZGVyOiAxXG4gICAgICAgICAgICAvLyB9O1xuXG4gICAgICAgICAgICAvLyBDb25maWd1cmF0aW9uLlBhcmVudFBhbmVsLkNoaWxkcmVuLnB1c2goQ29uZmlndXJhdGlvbi5QYW5lbCk7XG4gICAgICAgICAgICAvLyBMb2coXCJIQU5ETEUgQ09ORklHVVJBVElPTiBNQUtFIFNJWkVTIFVOSUZPUk1cIik7XG4gICAgICAgICAgICAvLyBNYWtlU2l6ZXNVbmlmb3JtKENvbmZpZ3VyYXRpb24uUGFuZWwpO1xuICAgICAgICAgICAgLy8gUHVibGlzaCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgTG9nKGBESUQgTk9UIFNFVCBDT05GSUdVUkFUSU9OIFBBTkVMLFxcblxcdChDb25maWd1cmF0aW9uLlBhbmVsID09PSB1bmRlZmluZWQpID09ICR7IENvbmZpZ3VyYXRpb24uUGFuZWwgfVxcblxcdChDb25maWd1cmF0aW9uLlBhcmVudFBhbmVsICE9PSB1bmRlZmluZWQpID09ICR7IENvbmZpZ3VyYXRpb24uUGFyZW50UGFuZWwgIT09IHVuZGVmaW5lZCB9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBMb2coYE51bUNoaWxkcmVuID09ICR7IE51bUNoaWxkcmVuIH0uYCk7XG4gICAgICAgIGZvciAobGV0IENoaWxkSW5kZXg6IG51bWJlciA9IDA7IENoaWxkSW5kZXggPCBOdW1DaGlsZHJlbjsgQ2hpbGRJbmRleCsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBJc0NoaWxkUGFuZWw6IGJvb2xlYW4gPSBQYW5lbEluZGljZXMuaW5jbHVkZXMoQ2hpbGRJbmRleCk7XG4gICAgICAgICAgICBMb2coYENoaWxkSW5kZXggPT0gJHsgQ2hpbGRJbmRleCB9XFx0SXNDaGlsZFBhbmVsID09ICR7IElzQ2hpbGRQYW5lbCB9YCk7XG4gICAgICAgICAgICBpZiAoSXNDaGlsZFBhbmVsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IENoaWxkUGFuZWw6IEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgICAgICAgICAgKENvbmZpZ3VyYXRpb24uUGFuZWxzIGFzIEFycmF5PEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlPiB8fCBbIF0pW0NoaWxkSW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgaWYgKENoaWxkUGFuZWwgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENoaWxkUGFuZWwuUGFyZW50UGFuZWwgPSBDb25maWd1cmF0aW9uLlBhbmVsO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBPdXRQYW5lbDogRlBhbmVsID1cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2hpbGRyZW46IFsgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFNpemU6IHsgSGVpZ2h0OiAxMDAsIFdpZHRoOiAxMDAsIFg6IDAsIFk6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFR5cGU6IENoaWxkUGFuZWwuRGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgWk9yZGVyOiAxXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5QYW5lbC5DaGlsZHJlbltDaGlsZEluZGV4XSA9IE91dFBhbmVsO1xuICAgICAgICAgICAgICAgICAgICBMb2coXCJNQUtFIFNJWkVTIFVOSUZPUk0gTElORSAxODRcIik7XG4gICAgICAgICAgICAgICAgICAgIE1ha2VTaXplc1VuaWZvcm0oQ29uZmlndXJhdGlvbi5QYW5lbCk7XG4gICAgICAgICAgICAgICAgICAgIFB1Ymxpc2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgV2luZG93RGF0YTogRkNoaWxkV2luZG93RGF0YSA9IHsgRGVwdGgsIEluZGV4OiBDaGlsZEluZGV4IH07XG4gICAgICAgICAgICAgICAgY29uc3QgSGFuZGxlOiBIV2luZG93IHwgdW5kZWZpbmVkID0gR2V0Q2hpbGRIYW5kbGUoV2luZG93RGF0YSk7XG5cbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICAgICAgTG9nKGBIYW5kbGUgYXQgQ2hpbGRJbmRleCA9PSAkeyBDaGlsZEluZGV4IH0gaXMgJHsgSGFuZGxlICE9PSB1bmRlZmluZWQgPyBcIkRFRklORURcIiA6IFwiTk9UIERFRklORURcIiB9YCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5QYW5lbCAhPT0gdW5kZWZpbmVkICYmIEhhbmRsZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTG9nKFwiQlJJTkdJTkcgSU5UTyBQQU5FTFwiKTtcbiAgICAgICAgICAgICAgICAgICAgQnJpbmdJbnRvUGFuZWwoQ29uZmlndXJhdGlvbi5QYW5lbCwgSGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgQ2VsbDogRkNlbGwgfCB1bmRlZmluZWQgPSBCcmluZ0ludG9QYW5lbChDb25maWd1cmF0aW9uLlBhbmVsLCBIYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoQ2VsbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBDb25maWd1cmF0aW9uLlBhbmVsLkNoaWxkcmVuW0NoaWxkSW5kZXhdID0gQ2VsbDtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChGbG9hdGluZ1dpbmRvd3MubGVuZ3RoID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmxvYXRpbmdXaW5kb3dzLmxlbmd0aCA+IDAsIGJ1dCBGbG9hdGluZ1dpbmRvd3MgaGF2ZSBub3QgYmVlbiBpbXBsZW1lbnRlZCB5ZXQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24uUGFuZWxzICE9PSB1bmRlZmluZWQgJiYgQ29uZmlndXJhdGlvbi5QYW5lbHMubGVuZ3RoID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5QYW5lbHMgPVxuICAgICAgICAgICAgICAgIChDb25maWd1cmF0aW9uLlBhbmVscyBhcyBBcnJheTxGRHVtbXlDb25maWd1cmF0aW9uTm9kZT4pLm1hcChIYW5kbGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDb25maWd1cmF0aW9uO1xuICAgIH07XG5cbiAgICBjb25zdCBJbnRlcm1lZGlhdGU6IEFycmF5PEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlPiA9XG4gICAgICAgIENvbmZpZ3VyYXRpb25zXG4gICAgICAgICAgICAubWFwKEFwcGVuZENvbmZpZ3VyYXRpb24pXG4gICAgICAgICAgICAubWFwKFNvcnRDaGlsZHJlbik7XG5cbiAgICBjb25zdCBHZXRDcmVhdGVXaW5kb3dQcm9taXNlID0gKENvbmZpZ3VyYXRpb246IEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlKTogUHJvbWlzZTx1bmtub3duPiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgT3V0OiBBcnJheTxQcm9taXNlPHVua25vd24+PiA9IFsgXTtcbiAgICAgICAgY29uc3QgUGFuZWxJbmRpY2VzOiBBcnJheTxudW1iZXI+ID0gQXJyYXkuaXNBcnJheShDb25maWd1cmF0aW9uLlBhbmVscylcbiAgICAgICAgICAgID8gQ29uZmlndXJhdGlvbi5QYW5lbHMubWFwKCh7IEluZGV4IH06IEZEdW1teVBhbmVsKTogbnVtYmVyID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluZGV4O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogWyBdO1xuXG4gICAgICAgIGZvciAobGV0IENoaWxkSW5kZXg6IG51bWJlciA9IDA7IENoaWxkSW5kZXggPCBDb25maWd1cmF0aW9uLk51bUNoaWxkcmVuOyBDaGlsZEluZGV4KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElzQ2hpbGRXaW5kb3c6IGJvb2xlYW4gPSAhUGFuZWxJbmRpY2VzLmluY2x1ZGVzKENoaWxkSW5kZXgpO1xuICAgICAgICAgICAgaWYgKElzQ2hpbGRXaW5kb3cpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgQXJndW1lbnQ6IEZDcmVhdGVXaW5kb3dBcmd1bWVudCA9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBEZXB0aDogQ29uZmlndXJhdGlvbi5EZXB0aCxcbiAgICAgICAgICAgICAgICAgICAgSW5kZXg6IENoaWxkSW5kZXhcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgT3V0LnB1c2goQ3JlYXRlV2luZG93KEFyZ3VtZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChDb25maWd1cmF0aW9uLlBhbmVscyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IENoaWxkUGFuZWw6IEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5QYW5lbHNbQ2hpbGRJbmRleF0gYXMgRkR1bW15Q29uZmlndXJhdGlvbk5vZGUgfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKENoaWxkUGFuZWwgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIE91dC5wdXNoKEdldENyZWF0ZVdpbmRvd1Byb21pc2UoQ2hpbGRQYW5lbCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbFNldHRsZWQoT3V0KTtcbiAgICB9O1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGxTZXR0bGVkKEludGVybWVkaWF0ZS5tYXAoR2V0Q3JlYXRlV2luZG93UHJvbWlzZSkpO1xuICAgIGNvbnN0IEhhbmRsZWQ6IEFycmF5PEZEdW1teUNvbmZpZ3VyYXRpb25Ob2RlPiA9XG4gICAgICAgIEludGVybWVkaWF0ZS5tYXAoSGFuZGxlQ29uZmlndXJhdGlvbikgYXMgQXJyYXk8RkR1bW15Q29uZmlndXJhdGlvbk5vZGU+O1xuXG4gICAgTG9nKEhhbmRsZWQpO1xuXG4gICAgTWFrZVNpemVzVW5pZm9ybShIYW5kbGVkWzBdPy5QYW5lbCBhcyBGUGFuZWwpO1xuICAgIGF3YWl0IFB1Ymxpc2goKTtcbn1cblxuUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFwiRHVtbXlXaW5kb3dzXCIsIENyZWF0ZUR1bW15V2luZG93cywgWyBcIlRyZWVcIiBdKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==