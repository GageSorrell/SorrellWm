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
/******/ 	var __webpack_modules__ = ({

/***/ "./Windows/node_modules/bindings/bindings.js":
/*!***************************************************!*\
  !*** ./Windows/node_modules/bindings/bindings.js ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var fs = __webpack_require__(/*! fs */ "fs"),
  path = __webpack_require__(/*! path */ "path"),
  fileURLToPath = __webpack_require__(/*! file-uri-to-path */ "./Windows/node_modules/file-uri-to-path/index.js"),
  join = path.join,
  dirname = path.dirname,
  exists =
    (fs.accessSync &&
      function(path) {
        try {
          fs.accessSync(path);
        } catch (e) {
          return false;
        }
        return true;
      }) ||
    fs.existsSync ||
    path.existsSync,
  defaults = {
    arrow: process.env.NODE_BINDINGS_ARROW || ' → ',
    compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled',
    platform: process.platform,
    arch: process.arch,
    nodePreGyp:
      'node-v' +
      process.versions.modules +
      '-' +
      process.platform +
      '-' +
      process.arch,
    version: process.versions.node,
    bindings: 'bindings.node',
    try: [
      // node-gyp's linked version in the "build" dir
      ['module_root', 'build', 'bindings'],
      // node-waf and gyp_addon (a.k.a node-gyp)
      ['module_root', 'build', 'Debug', 'bindings'],
      ['module_root', 'build', 'Release', 'bindings'],
      // Debug files, for development (legacy behavior, remove for node v0.9)
      ['module_root', 'out', 'Debug', 'bindings'],
      ['module_root', 'Debug', 'bindings'],
      // Release files, but manually compiled (legacy behavior, remove for node v0.9)
      ['module_root', 'out', 'Release', 'bindings'],
      ['module_root', 'Release', 'bindings'],
      // Legacy from node-waf, node <= 0.4.x
      ['module_root', 'build', 'default', 'bindings'],
      // Production "Release" buildtype binary (meh...)
      ['module_root', 'compiled', 'version', 'platform', 'arch', 'bindings'],
      // node-qbs builds
      ['module_root', 'addon-build', 'release', 'install-root', 'bindings'],
      ['module_root', 'addon-build', 'debug', 'install-root', 'bindings'],
      ['module_root', 'addon-build', 'default', 'install-root', 'bindings'],
      // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
      ['module_root', 'lib', 'binding', 'nodePreGyp', 'bindings']
    ]
  };

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings(opts) {
  // Argument surgery
  if (typeof opts == 'string') {
    opts = { bindings: opts };
  } else if (!opts) {
    opts = {};
  }

  // maps `defaults` onto `opts` object
  Object.keys(defaults).map(function(i) {
    if (!(i in opts)) opts[i] = defaults[i];
  });

  // Get the module root
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName());
  }

  // Ensure the given bindings name ends with .node
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node';
  }

  // https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
  var requireFunc =
     true
      ? require
      : 0;

  var tries = [],
    i = 0,
    l = opts.try.length,
    n,
    b,
    err;

  for (; i < l; i++) {
    n = join.apply(
      null,
      opts.try[i].map(function(p) {
        return opts[p] || p;
      })
    );
    tries.push(n);
    try {
      b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
      if (!opts.path) {
        b.path = n;
      }
      return b;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND' &&
          e.code !== 'QUALIFIED_PATH_RESOLUTION_FAILED' &&
          !/not find/i.test(e.message)) {
        throw e;
      }
    }
  }

  err = new Error(
    'Could not locate the bindings file. Tried:\n' +
      tries
        .map(function(a) {
          return opts.arrow + a;
        })
        .join('\n')
  );
  err.tries = tries;
  throw err;
}
module.exports = exports = bindings;

/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName(calling_file) {
  var origPST = Error.prepareStackTrace,
    origSTL = Error.stackTraceLimit,
    dummy = {},
    fileName;

  Error.stackTraceLimit = 10;

  Error.prepareStackTrace = function(e, st) {
    for (var i = 0, l = st.length; i < l; i++) {
      fileName = st[i].getFileName();
      if (fileName !== __filename) {
        if (calling_file) {
          if (fileName !== calling_file) {
            return;
          }
        } else {
          return;
        }
      }
    }
  };

  // run the 'prepareStackTrace' function above
  Error.captureStackTrace(dummy);
  dummy.stack;

  // cleanup
  Error.prepareStackTrace = origPST;
  Error.stackTraceLimit = origSTL;

  // handle filename that starts with "file://"
  var fileSchema = 'file://';
  if (fileName.indexOf(fileSchema) === 0) {
    fileName = fileURLToPath(fileName);
  }

  return fileName;
};

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot(file) {
  var dir = dirname(file),
    prev;
  while (true) {
    if (dir === '.') {
      // Avoids an infinite loop in rare cases, like the REPL
      dir = process.cwd();
    }
    if (
      exists(join(dir, 'package.json')) ||
      exists(join(dir, 'node_modules'))
    ) {
      // Found the 'package.json' file or 'node_modules' dir; we're done
      return dir;
    }
    if (prev === dir) {
      // Got to the top
      throw new Error(
        'Could not find module root given file: "' +
          file +
          '". Do you have a `package.json` file? '
      );
    }
    // Try the parent dir next
    prev = dir;
    dir = join(dir, '..');
  }
};


/***/ }),

/***/ "./Windows/node_modules/file-uri-to-path/index.js":
/*!********************************************************!*\
  !*** ./Windows/node_modules/file-uri-to-path/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var sep = (__webpack_require__(/*! path */ "path").sep) || '/';

/**
 * Module exports.
 */

module.exports = fileUriToPath;

/**
 * File URI to Path function.
 *
 * @param {String} uri
 * @return {String} path
 * @api public
 */

function fileUriToPath (uri) {
  if ('string' != typeof uri ||
      uri.length <= 7 ||
      'file://' != uri.substring(0, 7)) {
    throw new TypeError('must pass in a file:// URI to convert to a file path');
  }

  var rest = decodeURI(uri.substring(7));
  var firstSlash = rest.indexOf('/');
  var host = rest.substring(0, firstSlash);
  var path = rest.substring(firstSlash + 1);

  // 2.  Scheme Definition
  // As a special case, <host> can be the string "localhost" or the empty
  // string; this is interpreted as "the machine from which the URL is
  // being interpreted".
  if ('localhost' == host) host = '';

  if (host) {
    host = sep + sep + host;
  }

  // 3.2  Drives, drive letters, mount points, file system root
  // Drive letters are mapped into the top of a file URI in various ways,
  // depending on the implementation; some applications substitute
  // vertical bar ("|") for the colon after the drive letter, yielding
  // "file:///c|/tmp/test.txt".  In some cases, the colon is left
  // unchanged, as in "file:///c:/tmp/test.txt".  In other cases, the
  // colon is simply omitted, as in "file:///c/tmp/test.txt".
  path = path.replace(/^(.+)\|/, '$1:');

  // for Windows, we need to invert the path separators from what a URI uses
  if (sep == '\\') {
    path = path.replace(/\//g, '\\');
  }

  if (/^.+\:/.test(path)) {
    // has Windows drive at beginning of path
  } else {
    // unix path…
    path = sep + path;
  }

  return host + path;
}


/***/ }),

/***/ "./Source/Main/Core/SideEffects.ts":
/*!*****************************************!*\
  !*** ./Source/Main/Core/SideEffects.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MessageLoop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../MessageLoop */ "./Source/Main/MessageLoop.ts");
/* harmony import */ var _Hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Hook */ "./Source/Main/Hook.ts");
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _Monitor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Monitor */ "./Source/Main/Monitor.ts");
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Tree */ "./Source/Main/Tree.ts");
/* File:      SideEffects.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */






setTimeout(() => {
    __webpack_require__.e(/*! import() */ "Source_Main_MainWindow_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../MainWindow */ "./Source/Main/MainWindow.ts"));
    __webpack_require__.e(/*! import() */ "Source_Main_RendererFunctions_Generated_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../RendererFunctions.Generated */ "./Source/Main/RendererFunctions.Generated.ts"));
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-debug_index_js-node_modules_electron-devtools-installer_dist_in-77df03"), __webpack_require__.e("node_modules_electron-debug_sync_recursive-Source_Main_Core_Initialization_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./Initialization */ "./Source/Main/Core/Initialization.ts"));
    __webpack_require__.e(/*! import() */ "Source_Main_Core_Tray_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./Tray */ "./Source/Main/Core/Tray.ts"));
});


/***/ }),

/***/ "./Source/Main/Core/Utility.ts":
/*!*************************************!*\
  !*** ./Source/Main/Core/Utility.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AreHandlesEqual: () => (/* binding */ AreHandlesEqual),
/* harmony export */   ResolveHtmlPath: () => (/* binding */ ResolveHtmlPath)
/* harmony export */ });
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* File:    util.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */


function ResolveHtmlPath(HtmlFileName, Component) {
    if (true) {
        const Port = process.env.PORT || 1212;
        const Url = new url__WEBPACK_IMPORTED_MODULE_0__.URL(`http://localhost:${Port}`);
        Url.pathname = HtmlFileName;
        return Url.href;
    }
    const BasePath = `file://${path__WEBPACK_IMPORTED_MODULE_1___default().resolve(__dirname, "../Renderer/", HtmlFileName)}`;
    if (Component !== undefined) {
        const ComponentArgument = `?Component=${Component}`;
        return BasePath + ComponentArgument;
    }
    else {
        return BasePath;
    }
}
const AreHandlesEqual = (A, B) => {
    return A.Handle === B.Handle;
};


/***/ }),

/***/ "./Source/Main/Dispatcher.ts":
/*!***********************************!*\
  !*** ./Source/Main/Dispatcher.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TDispatcher: () => (/* binding */ TDispatcher),
/* harmony export */   TDispatcher_DEPRECATED: () => (/* binding */ TDispatcher_DEPRECATED)
/* harmony export */ });
/* File:      Dispatcher.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */
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
;
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
;


/***/ }),

/***/ "./Source/Main/Hook.ts":
/*!*****************************!*\
  !*** ./Source/Main/Hook.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);

(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeHooks)();


/***/ }),

/***/ "./Source/Main/Keyboard.ts":
/*!*********************************!*\
  !*** ./Source/Main/Keyboard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Keyboard: () => (/* binding */ Keyboard)
/* harmony export */ });
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Domain/Common/Component/Keyboard/Keyboard */ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dispatcher */ "./Source/Main/Dispatcher.ts");
/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */



class FKeyboard extends _Dispatcher__WEBPACK_IMPORTED_MODULE_2__.TDispatcher_DEPRECATED {
    constructor() {
        super();
    }
    IsKeyDown = false;
    /** Returns true if the `OnKey` should continue. */
    Debounce = (State) => {
        if (State === "Down") {
            if (!this.IsKeyDown) {
                this.IsKeyDown = true;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            this.IsKeyDown = false;
            return true;
        }
    };
    OnKey = (...Data) => {
        const Event = Data[0];
        const IsDebounced = this.Debounce(Event.State);
        if (IsDebounced && (0,_Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_1__.IsVirtualKey)(Event.VkCode)) {
            this.Dispatch(Event);
        }
    };
}
const Keyboard = new FKeyboard();
(0,_NodeIpc__WEBPACK_IMPORTED_MODULE_0__.Subscribe)("Keyboard", Keyboard.OnKey);


/***/ }),

/***/ "./Source/Main/Main.ts":
/*!*****************************!*\
  !*** ./Source/Main/Main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Core_SideEffects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Core/SideEffects */ "./Source/Main/Core/SideEffects.ts");
/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */



/***/ }),

/***/ "./Source/Main/MessageLoop.ts":
/*!************************************!*\
  !*** ./Source/Main/MessageLoop.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* File:      MessageLoop.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
/** This file must be side-effect imported by `Main`. */

const RunInitializeMessageLoop = () => {
    (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeMessageLoop)(() => { });
};
RunInitializeMessageLoop();


/***/ }),

/***/ "./Source/Main/Monitor.ts":
/*!********************************!*\
  !*** ./Source/Main/Monitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetMonitors: () => (/* binding */ GetMonitors),
/* harmony export */   MonitorsHandle: () => (/* binding */ MonitorsHandle)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dispatcher */ "./Source/Main/Dispatcher.ts");
/* File:      Monitor.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



const Monitors = [];
const GetMonitors = () => {
    return [...Monitors];
};
const MonitorsDispatcher = new _Dispatcher__WEBPACK_IMPORTED_MODULE_2__.TDispatcher();
const MonitorsHandle = MonitorsDispatcher.GetHandle();
const OnMonitorsChanged = (...Data) => {
    const NewMonitors = Data[0];
    Monitors.length = 0;
    Monitors.push(...NewMonitors);
    MonitorsDispatcher.Dispatch(NewMonitors);
};
const InitializeMonitorTracking = () => {
    Monitors.push(...(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeMonitors)());
    (0,_NodeIpc__WEBPACK_IMPORTED_MODULE_1__.Subscribe)("Monitors", OnMonitorsChanged);
};
InitializeMonitorTracking();


/***/ }),

/***/ "./Source/Main/NodeIpc.ts":
/*!********************************!*\
  !*** ./Source/Main/NodeIpc.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subscribe: () => (/* binding */ Subscribe),
/* harmony export */   Unsubscribe: () => (/* binding */ Unsubscribe)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* File:      NodeIpc.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

let NextListenerId = 0;
const Listeners = new Map();
const Subscribe = (Channel, Callback) => {
    const Id = NextListenerId++;
    Listeners.set(Id, { Callback, Channel });
    return Id;
};
const Unsubscribe = (Id) => {
    Listeners.delete(Id);
};
function OnMessage(Channel, Message) {
    Listeners.forEach((Callback) => {
        if (Callback.Channel === Channel) {
            Callback.Callback(Message);
        }
    });
}
(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeIpc)(OnMessage);


/***/ }),

/***/ "./Source/Main/Tree.ts":
/*!*****************************!*\
  !*** ./Source/Main/Tree.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Exists: () => (/* binding */ Exists),
/* harmony export */   ExistsExactlyOne: () => (/* binding */ ExistsExactlyOne),
/* harmony export */   ForAll: () => (/* binding */ ForAll),
/* harmony export */   GetForest: () => (/* binding */ GetForest),
/* harmony export */   IsWindowTiled: () => (/* binding */ IsWindowTiled),
/* harmony export */   Traverse: () => (/* binding */ Traverse),
/* harmony export */   UpdateForest: () => (/* binding */ UpdateForest)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Monitor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Monitor */ "./Source/Main/Monitor.ts");
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* File:      Tree.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



const Forest = [];
const GetForest = () => {
    return [...Forest];
};
const Cell = (Handle) => {
    return {
        Handle,
        Size: { Height: 0, Width: 0, X: 0, Y: 0 },
        ZOrder: 0
    };
};
const UpdateForest = (UpdateFunction) => {
    const NewForest = UpdateFunction([...Forest]);
    Forest.length = 0;
    Forest.push(...NewForest);
    // @TODO Move and resize, and sort ZOrder of all windows being tiled by SorrellWm.
};
const InitializeTree = () => {
    const Monitors = (0,_Monitor__WEBPACK_IMPORTED_MODULE_1__.GetMonitors)();
    console.log(Monitors);
    Forest.push(...Monitors.map((Monitor) => {
        console.log(`Here, MonitorHandle is ${Monitor.Handle}.`);
        return {
            Children: [],
            MonitorId: Monitor.Handle,
            Size: Monitor.Size,
            Type: "Horizontal",
            ZOrder: 0
        };
    }));
    console.log(Forest);
    const TileableWindows = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetTileableWindows)();
    console.log(`Found ${TileableWindows.length} tileable windows.`);
    TileableWindows.forEach((Handle) => {
        const Monitor = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetMonitorFromWindow)(Handle);
        const RootPanel = Forest.find((Panel) => {
            console.log(`Monitor is ${JSON.stringify(Monitor)} and Panel.MonitorId is ${JSON.stringify(Panel.MonitorId)}.`);
            const Info = Monitors.find((Foo) => {
                return Foo.Handle.Handle === Panel.MonitorId?.Handle;
            });
            console.log(`Size ${JSON.stringify(Info?.Size)} WorkSize ${JSON.stringify(Info?.WorkSize)}.`);
            return Panel.MonitorId?.Handle === Monitor.Handle;
        });
        if (RootPanel === undefined) {
            // @TODO
            console.log("💡💡💡💡 RootPanel was undefined.");
        }
        else {
            RootPanel.Children.push(Cell(Handle));
        }
    });
    Forest.forEach((Panel) => {
        const MonitorInfo = Monitors.find((InMonitor) => InMonitor.Handle === Panel.MonitorId);
        if (MonitorInfo === undefined) {
            // @TODO
        }
        else {
            Panel.Children = Panel.Children.map((Child, Index) => {
                const UniformWidth = MonitorInfo.WorkSize.Width / Panel.Children.length;
                const OutChild = { ...Child };
                OutChild.Size =
                    {
                        ...MonitorInfo.WorkSize,
                        Width: UniformWidth,
                        X: UniformWidth * Index + MonitorInfo.WorkSize.X
                    };
                return OutChild;
            });
        }
    });
    const Cells = GetAllCells(Forest);
    Cells.forEach((Cell) => {
        console.log(`Setting position of ${(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetWindowTitle)(Cell.Handle)} to ${JSON.stringify(Cell.Size)}.`);
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.SetWindowPosition)(Cell.Handle, Cell.Size);
    });
    console.log(`Called SetWindowPosition for ${Cells.length} windows.`);
};
const IsCell = (Vertex) => {
    return "Handle" in Vertex;
};
/**
 * Run a function for each vertex until the function returns `false` for
 * an iteration.
 */
const Traverse = (InFunction) => {
    let Continues = true;
    const Recurrence = (Vertex) => {
        if (Continues) {
            Continues = InFunction(Vertex);
            if (Continues && "Children" in Vertex) {
                for (const Child of Vertex.Children) {
                    Recurrence(Child);
                }
            }
        }
    };
    for (const Panel of Forest) {
        for (const Child of Panel.Children) {
            Recurrence(Child);
        }
    }
};
const GetAllCells = (Panels) => {
    const Result = [];
    function Traverse(Vertex) {
        if ("Handle" in Vertex) {
            Result.push(Vertex);
        }
        else if ("Children" in Vertex) {
            for (const Child of Vertex.Children) {
                Traverse(Child);
            }
        }
    }
    for (const Panel of Panels) {
        for (const Child of Panel.Children) {
            Traverse(Child);
        }
    }
    return Result;
};
const Exists = (Predicate) => {
    return false;
};
/** @TODO */
const ExistsExactlyOne = (Predicate) => {
    return false;
};
const ForAll = (Predicate) => {
    return false;
};
const IsWindowTiled = (Handle) => {
    let FoundWindow = false;
    return Exists((Vertex) => {
        if (!FoundWindow) {
            if (IsCell(Vertex)) {
                if ((0,_Core_Utility__WEBPACK_IMPORTED_MODULE_2__.AreHandlesEqual)(Vertex.Handle, Handle)) {
                    FoundWindow = true;
                }
            }
        }
        else {
            return false;
        }
        return true;
    });
};
InitializeTree();


/***/ }),

/***/ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts":
/*!**********************************************************************!*\
  !*** ./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetKeyName: () => (/* binding */ GetKeyName),
/* harmony export */   IsVirtualKey: () => (/* binding */ IsVirtualKey),
/* harmony export */   VirtualKeys: () => (/* binding */ VirtualKeys),
/* harmony export */   Vk: () => (/* binding */ Vk)
/* harmony export */ });
/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */
/* eslint-disable sort-keys */
/** Developer-friendly names of key codes. */
const KeyIdsById = {
    0x05: "MouseX1",
    0x06: "MouseX2",
    0x08: "Backspace",
    0x09: "Tab",
    0x0D: "Enter",
    0x10: "Shift",
    0x11: "Ctrl",
    0x12: "Alt",
    0x13: "Pause",
    0x20: "Space",
    0x21: "PgUp",
    0x22: "PgDown",
    0x23: "End",
    0x24: "Home",
    0x25: "LeftArrow",
    0x26: "UpArrow",
    0x27: "RightArrow",
    0x28: "DownArrow",
    0x2D: "Ins",
    0x2E: "Del",
    0x30: "0",
    0x31: "1",
    0x32: "2",
    0x33: "3",
    0x34: "4",
    0x35: "5",
    0x36: "6",
    0x37: "7",
    0x38: "8",
    0x39: "9",
    0x41: "A",
    0x42: "B",
    0x43: "C",
    0x44: "D",
    0x45: "E",
    0x46: "F",
    0x47: "G",
    0x48: "H",
    0x49: "I",
    0x4A: "J",
    0x4B: "K",
    0x4C: "L",
    0x4D: "M",
    0x4E: "N",
    0x4F: "O",
    0x50: "P",
    0x51: "Q",
    0x52: "R",
    0x53: "S",
    0x54: "T",
    0x55: "U",
    0x56: "V",
    0x57: "W",
    0x58: "X",
    0x59: "Y",
    0x5A: "Z",
    0x5B: "LWin",
    0x5C: "RWin",
    0x5D: "Applications",
    0x60: "Num0",
    0x61: "Num1",
    0x62: "Num2",
    0x63: "Num3",
    0x64: "Num4",
    0x65: "Num5",
    0x66: "Num6",
    0x67: "Num7",
    0x68: "Num8",
    0x69: "Num9",
    0x6A: "Multiply",
    0x6B: "Add",
    0x6D: "Subtract",
    0x6E: "NumDecimal",
    0x6F: "NumDivide",
    0x70: "F1",
    0x71: "F2",
    0x72: "F3",
    0x73: "F4",
    0x74: "F5",
    0x75: "F6",
    0x76: "F7",
    0x77: "F8",
    0x78: "F9",
    0x79: "F10",
    0x7A: "F11",
    0x7B: "F12",
    0x7C: "F13",
    0x7D: "F14",
    0x7E: "F15",
    0x7F: "F16",
    0x80: "F17",
    0x81: "F18",
    0x82: "F19",
    0x83: "F20",
    0x84: "F21",
    0x85: "F22",
    0x86: "F23",
    0x87: "F24",
    0xA0: "LShift",
    0xA1: "RShift",
    0xA2: "LCtrl",
    0xA3: "RCtrl",
    0xA4: "LAlt",
    0xA5: "RAlt",
    0xA6: "BrowserBack",
    0xA7: "BrowserForward",
    0xA8: "BrowserRefresh",
    0xA9: "BrowserStop",
    0xAA: "BrowserSearch",
    0xAB: "BrowserFavorites",
    0xAC: "BrowserStart",
    0xB0: "NextTrack",
    0xB1: "PreviousTrack",
    0xB2: "StopMedia",
    0xB3: "PlayPauseMedia",
    0xB4: "StartMail",
    0xB5: "SelectMedia",
    0xB6: "StartApplicationOne",
    0xB7: "StartApplicationTwo",
    0xBA: ";",
    0xBB: "+",
    0xBC: ",",
    0xBD: "-",
    0xBE: ".",
    0xBF: "/",
    0xC0: "`",
    0xDB: "[",
    0xDC: "\\",
    0xDD: "]",
    0xDE: "'"
};
const GetKeyName = (VkCode) => {
    return KeyIdsById[VkCode];
};
/** Developer-friendly names of key codes. */
const Vk = {
    MouseX1: 0x05,
    MouseX2: 0x06,
    Backspace: 0x08,
    Tab: 0x09,
    Enter: 0x0D,
    Shift: 0x10,
    Ctrl: 0x11,
    Alt: 0x12,
    Pause: 0x13,
    Space: 0x20,
    PgUp: 0x21,
    PgDown: 0x22,
    End: 0x23,
    Home: 0x24,
    LeftArrow: 0x25,
    UpArrow: 0x26,
    RightArrow: 0x27,
    DownArrow: 0x28,
    Ins: 0x2D,
    Del: 0x2E,
    0: 0x30,
    1: 0x31,
    2: 0x32,
    3: 0x33,
    4: 0x34,
    5: 0x35,
    6: 0x36,
    7: 0x37,
    8: 0x38,
    9: 0x39,
    A: 0x41,
    B: 0x42,
    C: 0x43,
    D: 0x44,
    E: 0x45,
    F: 0x46,
    G: 0x47,
    H: 0x48,
    I: 0x49,
    J: 0x4A,
    K: 0x4B,
    L: 0x4C,
    M: 0x4D,
    N: 0x4E,
    O: 0x4F,
    P: 0x50,
    Q: 0x51,
    R: 0x52,
    S: 0x53,
    T: 0x54,
    U: 0x55,
    V: 0x56,
    W: 0x57,
    X: 0x58,
    Y: 0x59,
    Z: 0x5A,
    LWin: 0x5B,
    RWin: 0x5C,
    Applications: 0x5D,
    Num0: 0x60,
    Num1: 0x61,
    Num2: 0x62,
    Num3: 0x63,
    Num4: 0x64,
    Num5: 0x65,
    Num6: 0x66,
    Num7: 0x67,
    Num8: 0x68,
    Num9: 0x69,
    Multiply: 0x6A,
    Add: 0x6B,
    Subtract: 0x6D,
    NumDecimal: 0x6E,
    NumDivide: 0x6F,
    F1: 0x70,
    F2: 0x71,
    F3: 0x72,
    F4: 0x73,
    F5: 0x74,
    F6: 0x75,
    F7: 0x76,
    F8: 0x77,
    F9: 0x78,
    F10: 0x79,
    F11: 0x7A,
    F12: 0x7B,
    F13: 0x7C,
    F14: 0x7D,
    F15: 0x7E,
    F16: 0x7F,
    F17: 0x80,
    F18: 0x81,
    F19: 0x82,
    F20: 0x83,
    F21: 0x84,
    F22: 0x85,
    F23: 0x86,
    F24: 0x87,
    LShift: 0xA0,
    RShift: 0xA1,
    LCtrl: 0xA2,
    RCtrl: 0xA3,
    LAlt: 0xA4,
    RAlt: 0xA5,
    BrowserBack: 0xA6,
    BrowserForward: 0xA7,
    BrowserRefresh: 0xA8,
    BrowserStop: 0xA9,
    BrowserSearch: 0xAA,
    BrowserFavorites: 0xAB,
    BrowserStart: 0xAC,
    NextTrack: 0xB0,
    PreviousTrack: 0xB1,
    StopMedia: 0xB2,
    PlayPauseMedia: 0xB3,
    StartMail: 0xB4,
    SelectMedia: 0xB5,
    StartApplicationOne: 0xB6,
    StartApplicationTwo: 0xB7,
    ";": 0xBA,
    "+": 0xBB,
    ",": 0xBC,
    "-": 0xBD,
    ".": 0xBE,
    "/": 0xBF,
    "`": 0xC0,
    "[": 0xDB,
    "\\": 0xDC,
    "]": 0xDD,
    "'": 0xDE
};
const VirtualKeys = [
    0x05,
    0x06,
    0x08,
    0x09,
    0x0D,
    0x10,
    0x11,
    0x12,
    0x13,
    0x20,
    0x21,
    0x22,
    0x23,
    0x24,
    0x25,
    0x26,
    0x27,
    0x28,
    0x2D,
    0x2E,
    0x30,
    0x31,
    0x32,
    0x33,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x41,
    0x42,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4A,
    0x4B,
    0x4C,
    0x4D,
    0x4E,
    0x4F,
    0x50,
    0x51,
    0x52,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5A,
    0x5B,
    0x5C,
    0x5D,
    0x60,
    0x61,
    0x62,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6A,
    0x6B,
    0x6D,
    0x6E,
    0x6F,
    0x70,
    0x71,
    0x72,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7A,
    0x7B,
    0x7C,
    0x7D,
    0x7E,
    0x7F,
    0x80,
    0x81,
    0x82,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0xA0,
    0xA1,
    0xA2,
    0xA3,
    0xA4,
    0xA5,
    0xA6,
    0xA7,
    0xA8,
    0xA9,
    0xAA,
    0xAB,
    0xAC,
    0xB0,
    0xB1,
    0xB2,
    0xB3,
    0xB4,
    0xB5,
    0xB6,
    0xB7,
    0xBA,
    0xBB,
    0xBC,
    0xBD,
    0xBE,
    0xBF,
    0xC0,
    0xDB,
    0xDC,
    0xDD,
    0xDE
];
/* eslint-enable sort-keys */
/** Is the `KeyCode` a VK Code **that this app uses**. */
const IsVirtualKey = (KeyCode) => {
    return VirtualKeys.includes(KeyCode);
};


/***/ }),

/***/ "./Windows/index.js":
/*!**************************!*\
  !*** ./Windows/index.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var myModule = __webpack_require__(/*! bindings */ "./Windows/node_modules/bindings/bindings.js")("hello");
module.exports = myModule;


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("constants");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.dev.js";
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./Source/Main/Main.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxjQUFjO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsWUFBWTtJQUNsQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsYUFBYTtJQUNuQixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QixJQUFJLEVBQUUsY0FBYztJQUNwQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsZUFBZTtJQUNyQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxhQUFhO0lBQ25CLElBQUksRUFBRSxxQkFBcUI7SUFDM0IsSUFBSSxFQUFFLHFCQUFxQjtJQUMzQixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0NBQ0gsQ0FBQztBQUVKLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBbUIsRUFBVSxFQUFFO0lBRXRELE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQUVGLDZDQUE2QztBQUN0QyxNQUFNLEVBQUUsR0FDZjtJQUNJLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixTQUFTLEVBQUUsSUFBSTtJQUNmLEdBQUcsRUFBRSxJQUFJO0lBQ1QsS0FBSyxFQUFFLElBQUk7SUFDWCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLElBQUk7SUFDVCxLQUFLLEVBQUUsSUFBSTtJQUNYLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsSUFBSTtJQUNaLEdBQUcsRUFBRSxJQUFJO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixTQUFTLEVBQUUsSUFBSTtJQUNmLE9BQU8sRUFBRSxJQUFJO0lBQ2IsVUFBVSxFQUFFLElBQUk7SUFDaEIsU0FBUyxFQUFFLElBQUk7SUFDZixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFlBQVksRUFBRSxJQUFJO0lBQ2xCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJ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O0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7Q0FDRSxDQUFDO0FBRVgsNkJBQTZCO0FBRTdCLHlEQUF5RDtBQUNsRCxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQWUsRUFBMEIsRUFBRTtJQUVwRSxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBc0IsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3phRixJQUFJLFFBQVEsR0FBRyxtQkFBTyxDQUFDLDZEQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7O0FDRDFCOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOzs7OztXQy9CQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOzs7OztXQ1JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0JBQWdCLHFCQUFxQjtXQUNyQzs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGFBQWE7V0FDYjtXQUNBLElBQUk7V0FDSjtXQUNBOztXQUVBOztXQUVBOztXQUVBOzs7OztVRXJDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vV2luZG93cy9ub2RlX21vZHVsZXMvYmluZGluZ3MvYmluZGluZ3MuanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vV2luZG93cy9ub2RlX21vZHVsZXMvZmlsZS11cmktdG8tcGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Db3JlL1NpZGVFZmZlY3RzLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvVXRpbGl0eS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9EaXNwYXRjaGVyLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0hvb2sudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbi50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NZXNzYWdlTG9vcC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Nb25pdG9yLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL05vZGVJcGMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vVHJlZS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvUmVuZGVyZXIvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vV2luZG93cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImFzc2VydFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiYnVmZmVyXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjaGlsZF9wcm9jZXNzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjb25zdGFudHNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImV2ZW50c1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJvc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicXVlcnlzdHJpbmdcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmVhbVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwic3RyaW5nX2RlY29kZXJcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInR0eVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidXJsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ6bGliXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9yZXF1aXJlIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKSxcbiAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAgZmlsZVVSTFRvUGF0aCA9IHJlcXVpcmUoJ2ZpbGUtdXJpLXRvLXBhdGgnKSxcbiAgam9pbiA9IHBhdGguam9pbixcbiAgZGlybmFtZSA9IHBhdGguZGlybmFtZSxcbiAgZXhpc3RzID1cbiAgICAoZnMuYWNjZXNzU3luYyAmJlxuICAgICAgZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLmFjY2Vzc1N5bmMocGF0aCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KSB8fFxuICAgIGZzLmV4aXN0c1N5bmMgfHxcbiAgICBwYXRoLmV4aXN0c1N5bmMsXG4gIGRlZmF1bHRzID0ge1xuICAgIGFycm93OiBwcm9jZXNzLmVudi5OT0RFX0JJTkRJTkdTX0FSUk9XIHx8ICcg4oaSICcsXG4gICAgY29tcGlsZWQ6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQ09NUElMRURfRElSIHx8ICdjb21waWxlZCcsXG4gICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgYXJjaDogcHJvY2Vzcy5hcmNoLFxuICAgIG5vZGVQcmVHeXA6XG4gICAgICAnbm9kZS12JyArXG4gICAgICBwcm9jZXNzLnZlcnNpb25zLm1vZHVsZXMgK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MucGxhdGZvcm0gK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MuYXJjaCxcbiAgICB2ZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25zLm5vZGUsXG4gICAgYmluZGluZ3M6ICdiaW5kaW5ncy5ub2RlJyxcbiAgICB0cnk6IFtcbiAgICAgIC8vIG5vZGUtZ3lwJ3MgbGlua2VkIHZlcnNpb24gaW4gdGhlIFwiYnVpbGRcIiBkaXJcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIG5vZGUtd2FmIGFuZCBneXBfYWRkb24gKGEuay5hIG5vZGUtZ3lwKVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBEZWJ1ZyBmaWxlcywgZm9yIGRldmVsb3BtZW50IChsZWdhY3kgYmVoYXZpb3IsIHJlbW92ZSBmb3Igbm9kZSB2MC45KVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdvdXQnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIFJlbGVhc2UgZmlsZXMsIGJ1dCBtYW51YWxseSBjb21waWxlZCAobGVnYWN5IGJlaGF2aW9yLCByZW1vdmUgZm9yIG5vZGUgdjAuOSlcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnb3V0JywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnUmVsZWFzZScsICdiaW5kaW5ncyddLFxuICAgICAgLy8gTGVnYWN5IGZyb20gbm9kZS13YWYsIG5vZGUgPD0gMC40LnhcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnZGVmYXVsdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gUHJvZHVjdGlvbiBcIlJlbGVhc2VcIiBidWlsZHR5cGUgYmluYXJ5IChtZWguLi4pXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2NvbXBpbGVkJywgJ3ZlcnNpb24nLCAncGxhdGZvcm0nLCAnYXJjaCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1xYnMgYnVpbGRzXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ3JlbGVhc2UnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ2RlYnVnJywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdhZGRvbi1idWlsZCcsICdkZWZhdWx0JywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1wcmUtZ3lwIHBhdGggLi9saWIvYmluZGluZy97bm9kZV9hYml9LXtwbGF0Zm9ybX0te2FyY2h9XG4gICAgICBbJ21vZHVsZV9yb290JywgJ2xpYicsICdiaW5kaW5nJywgJ25vZGVQcmVHeXAnLCAnYmluZGluZ3MnXVxuICAgIF1cbiAgfTtcblxuLyoqXG4gKiBUaGUgbWFpbiBgYmluZGluZ3MoKWAgZnVuY3Rpb24gbG9hZHMgdGhlIGNvbXBpbGVkIGJpbmRpbmdzIGZvciBhIGdpdmVuIG1vZHVsZS5cbiAqIEl0IHVzZXMgVjgncyBFcnJvciBBUEkgdG8gZGV0ZXJtaW5lIHRoZSBwYXJlbnQgZmlsZW5hbWUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBiZWluZyBpbnZva2VkIGZyb20sIHdoaWNoIGlzIHRoZW4gdXNlZCB0byBmaW5kIHRoZSByb290IGRpcmVjdG9yeS5cbiAqL1xuXG5mdW5jdGlvbiBiaW5kaW5ncyhvcHRzKSB7XG4gIC8vIEFyZ3VtZW50IHN1cmdlcnlcbiAgaWYgKHR5cGVvZiBvcHRzID09ICdzdHJpbmcnKSB7XG4gICAgb3B0cyA9IHsgYmluZGluZ3M6IG9wdHMgfTtcbiAgfSBlbHNlIGlmICghb3B0cykge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIC8vIG1hcHMgYGRlZmF1bHRzYCBvbnRvIGBvcHRzYCBvYmplY3RcbiAgT2JqZWN0LmtleXMoZGVmYXVsdHMpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgaWYgKCEoaSBpbiBvcHRzKSkgb3B0c1tpXSA9IGRlZmF1bHRzW2ldO1xuICB9KTtcblxuICAvLyBHZXQgdGhlIG1vZHVsZSByb290XG4gIGlmICghb3B0cy5tb2R1bGVfcm9vdCkge1xuICAgIG9wdHMubW9kdWxlX3Jvb3QgPSBleHBvcnRzLmdldFJvb3QoZXhwb3J0cy5nZXRGaWxlTmFtZSgpKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGUgZ2l2ZW4gYmluZGluZ3MgbmFtZSBlbmRzIHdpdGggLm5vZGVcbiAgaWYgKHBhdGguZXh0bmFtZShvcHRzLmJpbmRpbmdzKSAhPSAnLm5vZGUnKSB7XG4gICAgb3B0cy5iaW5kaW5ncyArPSAnLm5vZGUnO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2svd2VicGFjay9pc3N1ZXMvNDE3NSNpc3N1ZWNvbW1lbnQtMzQyOTMxMDM1XG4gIHZhciByZXF1aXJlRnVuYyA9XG4gICAgdHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gPT09ICdmdW5jdGlvbidcbiAgICAgID8gX19ub25fd2VicGFja19yZXF1aXJlX19cbiAgICAgIDogcmVxdWlyZTtcblxuICB2YXIgdHJpZXMgPSBbXSxcbiAgICBpID0gMCxcbiAgICBsID0gb3B0cy50cnkubGVuZ3RoLFxuICAgIG4sXG4gICAgYixcbiAgICBlcnI7XG5cbiAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICBuID0gam9pbi5hcHBseShcbiAgICAgIG51bGwsXG4gICAgICBvcHRzLnRyeVtpXS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgICByZXR1cm4gb3B0c1twXSB8fCBwO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRyaWVzLnB1c2gobik7XG4gICAgdHJ5IHtcbiAgICAgIGIgPSBvcHRzLnBhdGggPyByZXF1aXJlRnVuYy5yZXNvbHZlKG4pIDogcmVxdWlyZUZ1bmMobik7XG4gICAgICBpZiAoIW9wdHMucGF0aCkge1xuICAgICAgICBiLnBhdGggPSBuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnICYmXG4gICAgICAgICAgZS5jb2RlICE9PSAnUVVBTElGSUVEX1BBVEhfUkVTT0xVVElPTl9GQUlMRUQnICYmXG4gICAgICAgICAgIS9ub3QgZmluZC9pLnRlc3QoZS5tZXNzYWdlKSkge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVyciA9IG5ldyBFcnJvcihcbiAgICAnQ291bGQgbm90IGxvY2F0ZSB0aGUgYmluZGluZ3MgZmlsZS4gVHJpZWQ6XFxuJyArXG4gICAgICB0cmllc1xuICAgICAgICAubWFwKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICByZXR1cm4gb3B0cy5hcnJvdyArIGE7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICApO1xuICBlcnIudHJpZXMgPSB0cmllcztcbiAgdGhyb3cgZXJyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYmluZGluZ3M7XG5cbi8qKlxuICogR2V0cyB0aGUgZmlsZW5hbWUgb2YgdGhlIEphdmFTY3JpcHQgZmlsZSB0aGF0IGludm9rZXMgdGhpcyBmdW5jdGlvbi5cbiAqIFVzZWQgdG8gaGVscCBmaW5kIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZS5cbiAqIE9wdGlvbmFsbHkgYWNjZXB0cyBhbiBmaWxlbmFtZSBhcmd1bWVudCB0byBza2lwIHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgaW52b2tpbmcgZmlsZW5hbWVcbiAqL1xuXG5leHBvcnRzLmdldEZpbGVOYW1lID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUoY2FsbGluZ19maWxlKSB7XG4gIHZhciBvcmlnUFNUID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UsXG4gICAgb3JpZ1NUTCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdCxcbiAgICBkdW1teSA9IHt9LFxuICAgIGZpbGVOYW1lO1xuXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IDEwO1xuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24oZSwgc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZmlsZU5hbWUgPSBzdFtpXS5nZXRGaWxlTmFtZSgpO1xuICAgICAgaWYgKGZpbGVOYW1lICE9PSBfX2ZpbGVuYW1lKSB7XG4gICAgICAgIGlmIChjYWxsaW5nX2ZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZU5hbWUgIT09IGNhbGxpbmdfZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gcnVuIHRoZSAncHJlcGFyZVN0YWNrVHJhY2UnIGZ1bmN0aW9uIGFib3ZlXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KTtcbiAgZHVtbXkuc3RhY2s7XG5cbiAgLy8gY2xlYW51cFxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IG9yaWdQU1Q7XG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9yaWdTVEw7XG5cbiAgLy8gaGFuZGxlIGZpbGVuYW1lIHRoYXQgc3RhcnRzIHdpdGggXCJmaWxlOi8vXCJcbiAgdmFyIGZpbGVTY2hlbWEgPSAnZmlsZTovLyc7XG4gIGlmIChmaWxlTmFtZS5pbmRleE9mKGZpbGVTY2hlbWEpID09PSAwKSB7XG4gICAgZmlsZU5hbWUgPSBmaWxlVVJMVG9QYXRoKGZpbGVOYW1lKTtcbiAgfVxuXG4gIHJldHVybiBmaWxlTmFtZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgYSBtb2R1bGUsIGdpdmVuIGFuIGFyYml0cmFyeSBmaWxlbmFtZVxuICogc29tZXdoZXJlIGluIHRoZSBtb2R1bGUgdHJlZS4gVGhlIFwicm9vdCBkaXJlY3RvcnlcIiBpcyB0aGUgZGlyZWN0b3J5XG4gKiBjb250YWluaW5nIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLlxuICpcbiAqICAgSW46ICAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZS9saWIvaW5kZXguanNcbiAqICAgT3V0OiAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZVxuICovXG5cbmV4cG9ydHMuZ2V0Um9vdCA9IGZ1bmN0aW9uIGdldFJvb3QoZmlsZSkge1xuICB2YXIgZGlyID0gZGlybmFtZShmaWxlKSxcbiAgICBwcmV2O1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChkaXIgPT09ICcuJykge1xuICAgICAgLy8gQXZvaWRzIGFuIGluZmluaXRlIGxvb3AgaW4gcmFyZSBjYXNlcywgbGlrZSB0aGUgUkVQTFxuICAgICAgZGlyID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgZXhpc3RzKGpvaW4oZGlyLCAncGFja2FnZS5qc29uJykpIHx8XG4gICAgICBleGlzdHMoam9pbihkaXIsICdub2RlX21vZHVsZXMnKSlcbiAgICApIHtcbiAgICAgIC8vIEZvdW5kIHRoZSAncGFja2FnZS5qc29uJyBmaWxlIG9yICdub2RlX21vZHVsZXMnIGRpcjsgd2UncmUgZG9uZVxuICAgICAgcmV0dXJuIGRpcjtcbiAgICB9XG4gICAgaWYgKHByZXYgPT09IGRpcikge1xuICAgICAgLy8gR290IHRvIHRoZSB0b3BcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIG1vZHVsZSByb290IGdpdmVuIGZpbGU6IFwiJyArXG4gICAgICAgICAgZmlsZSArXG4gICAgICAgICAgJ1wiLiBEbyB5b3UgaGF2ZSBhIGBwYWNrYWdlLmpzb25gIGZpbGU/ICdcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIFRyeSB0aGUgcGFyZW50IGRpciBuZXh0XG4gICAgcHJldiA9IGRpcjtcbiAgICBkaXIgPSBqb2luKGRpciwgJy4uJyk7XG4gIH1cbn07XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgc2VwID0gcmVxdWlyZSgncGF0aCcpLnNlcCB8fCAnLyc7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXJpVG9QYXRoO1xuXG4vKipcbiAqIEZpbGUgVVJJIHRvIFBhdGggZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaVxuICogQHJldHVybiB7U3RyaW5nfSBwYXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZpbGVVcmlUb1BhdGggKHVyaSkge1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHVyaSB8fFxuICAgICAgdXJpLmxlbmd0aCA8PSA3IHx8XG4gICAgICAnZmlsZTovLycgIT0gdXJpLnN1YnN0cmluZygwLCA3KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3QgcGFzcyBpbiBhIGZpbGU6Ly8gVVJJIHRvIGNvbnZlcnQgdG8gYSBmaWxlIHBhdGgnKTtcbiAgfVxuXG4gIHZhciByZXN0ID0gZGVjb2RlVVJJKHVyaS5zdWJzdHJpbmcoNykpO1xuICB2YXIgZmlyc3RTbGFzaCA9IHJlc3QuaW5kZXhPZignLycpO1xuICB2YXIgaG9zdCA9IHJlc3Quc3Vic3RyaW5nKDAsIGZpcnN0U2xhc2gpO1xuICB2YXIgcGF0aCA9IHJlc3Quc3Vic3RyaW5nKGZpcnN0U2xhc2ggKyAxKTtcblxuICAvLyAyLiAgU2NoZW1lIERlZmluaXRpb25cbiAgLy8gQXMgYSBzcGVjaWFsIGNhc2UsIDxob3N0PiBjYW4gYmUgdGhlIHN0cmluZyBcImxvY2FsaG9zdFwiIG9yIHRoZSBlbXB0eVxuICAvLyBzdHJpbmc7IHRoaXMgaXMgaW50ZXJwcmV0ZWQgYXMgXCJ0aGUgbWFjaGluZSBmcm9tIHdoaWNoIHRoZSBVUkwgaXNcbiAgLy8gYmVpbmcgaW50ZXJwcmV0ZWRcIi5cbiAgaWYgKCdsb2NhbGhvc3QnID09IGhvc3QpIGhvc3QgPSAnJztcblxuICBpZiAoaG9zdCkge1xuICAgIGhvc3QgPSBzZXAgKyBzZXAgKyBob3N0O1xuICB9XG5cbiAgLy8gMy4yICBEcml2ZXMsIGRyaXZlIGxldHRlcnMsIG1vdW50IHBvaW50cywgZmlsZSBzeXN0ZW0gcm9vdFxuICAvLyBEcml2ZSBsZXR0ZXJzIGFyZSBtYXBwZWQgaW50byB0aGUgdG9wIG9mIGEgZmlsZSBVUkkgaW4gdmFyaW91cyB3YXlzLFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGltcGxlbWVudGF0aW9uOyBzb21lIGFwcGxpY2F0aW9ucyBzdWJzdGl0dXRlXG4gIC8vIHZlcnRpY2FsIGJhciAoXCJ8XCIpIGZvciB0aGUgY29sb24gYWZ0ZXIgdGhlIGRyaXZlIGxldHRlciwgeWllbGRpbmdcbiAgLy8gXCJmaWxlOi8vL2N8L3RtcC90ZXN0LnR4dFwiLiAgSW4gc29tZSBjYXNlcywgdGhlIGNvbG9uIGlzIGxlZnRcbiAgLy8gdW5jaGFuZ2VkLCBhcyBpbiBcImZpbGU6Ly8vYzovdG1wL3Rlc3QudHh0XCIuICBJbiBvdGhlciBjYXNlcywgdGhlXG4gIC8vIGNvbG9uIGlzIHNpbXBseSBvbWl0dGVkLCBhcyBpbiBcImZpbGU6Ly8vYy90bXAvdGVzdC50eHRcIi5cbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXiguKylcXHwvLCAnJDE6Jyk7XG5cbiAgLy8gZm9yIFdpbmRvd3MsIHdlIG5lZWQgdG8gaW52ZXJ0IHRoZSBwYXRoIHNlcGFyYXRvcnMgZnJvbSB3aGF0IGEgVVJJIHVzZXNcbiAgaWYgKHNlcCA9PSAnXFxcXCcpIHtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcbiAgfVxuXG4gIGlmICgvXi4rXFw6Ly50ZXN0KHBhdGgpKSB7XG4gICAgLy8gaGFzIFdpbmRvd3MgZHJpdmUgYXQgYmVnaW5uaW5nIG9mIHBhdGhcbiAgfSBlbHNlIHtcbiAgICAvLyB1bml4IHBhdGjigKZcbiAgICBwYXRoID0gc2VwICsgcGF0aDtcbiAgfVxuXG4gIHJldHVybiBob3N0ICsgcGF0aDtcbn1cbiIsIi8qIEZpbGU6ICAgICAgU2lkZUVmZmVjdHMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IFwiLi4vTWVzc2FnZUxvb3BcIjtcbmltcG9ydCBcIi4uL0hvb2tcIjtcbmltcG9ydCBcIi4uL05vZGVJcGNcIjtcbmltcG9ydCBcIi4uL0tleWJvYXJkXCI7XG5pbXBvcnQgXCIuLi9Nb25pdG9yXCI7XG5pbXBvcnQgXCIuLi9UcmVlXCI7XG5cbnNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbntcbiAgICBpbXBvcnQoXCIuLi9NYWluV2luZG93XCIpO1xuICAgIGltcG9ydChcIi4uL1JlbmRlcmVyRnVuY3Rpb25zLkdlbmVyYXRlZFwiKTtcbiAgICBpbXBvcnQoXCIuL0luaXRpYWxpemF0aW9uXCIpO1xuICAgIGltcG9ydChcIi4vVHJheVwiKTtcbn0pO1xuXG4iLCIvKiBGaWxlOiAgICB1dGlsLnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCB7IFVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEhIYW5kbGUgfSBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNvbHZlSHRtbFBhdGgoSHRtbEZpbGVOYW1lOiBzdHJpbmcsIENvbXBvbmVudD86IHN0cmluZylcbntcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIilcbiAgICB7XG4gICAgICAgIGNvbnN0IFBvcnQ6IHN0cmluZyB8IG51bWJlciA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMTIxMjtcbiAgICAgICAgY29uc3QgVXJsOiBVUkwgPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7IFBvcnQgfWApO1xuICAgICAgICBVcmwucGF0aG5hbWUgPSBIdG1sRmlsZU5hbWU7XG4gICAgICAgIHJldHVybiBVcmwuaHJlZjtcbiAgICB9XG4gICAgY29uc3QgQmFzZVBhdGg6IHN0cmluZyA9IGBmaWxlOi8vJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL1JlbmRlcmVyL1wiLCBIdG1sRmlsZU5hbWUpfWA7XG4gICAgaWYgKENvbXBvbmVudCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50QXJndW1lbnQ6IHN0cmluZyA9IGA/Q29tcG9uZW50PSR7IENvbXBvbmVudCB9YDtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoICsgQ29tcG9uZW50QXJndW1lbnQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBCYXNlUGF0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBBcmVIYW5kbGVzRXF1YWwgPSAoQTogSEhhbmRsZSwgQjogSEhhbmRsZSk6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gQS5IYW5kbGUgPT09IEIuSGFuZGxlO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgRGlzcGF0Y2hlci50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBUU3Vic2NyaXB0aW9uSGFuZGxlPFQ+ID1cbntcbiAgICBTdWJzY3JpYmUoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyO1xuICAgIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkO1xufTtcblxuZXhwb3J0IGNsYXNzIFREaXNwYXRjaGVyPFQ+XG57XG4gICAgcHJpdmF0ZSBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgTGlzdGVuZXJzOiBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFQpID0+IHZvaWQ+ID0gbmV3IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4oKTtcblxuICAgIHB1YmxpYyBHZXRIYW5kbGUgPSAoKTogVFN1YnNjcmlwdGlvbkhhbmRsZTxUPiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgU3Vic2NyaWJlID0gKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUKSA9PiB2b2lkKSk6IG51bWJlciA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBJZDogbnVtYmVyID0gdGhpcy5OZXh0TGlzdGVuZXJJZCsrO1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuc2V0KElkLCBDYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gSWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgVW5zdWJzY3JpYmUgPSAoSWQ6IG51bWJlcik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZGVsZXRlKElkKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgU3Vic2NyaWJlLFxuICAgICAgICAgICAgVW5zdWJzY3JpYmVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgRGlzcGF0Y2ggPSAoTWVzc2FnZTogVCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmICh0aGlzLkxpc3RlbmVycy5zaXplID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuZXhwb3J0IGNsYXNzIFREaXNwYXRjaGVyX0RFUFJFQ0FURUQ8VCA9IHVua25vd24+XG57XG4gICAgcHJpdmF0ZSBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgTGlzdGVuZXJzOiBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFQpID0+IHZvaWQ+ID0gbmV3IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4oKTtcblxuICAgIHB1YmxpYyBTdWJzY3JpYmUoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyXG4gICAge1xuICAgICAgICBjb25zdCBJZDogbnVtYmVyID0gdGhpcy5OZXh0TGlzdGVuZXJJZCsrO1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIElkO1xuICAgIH1cblxuICAgIHB1YmxpYyBVbnN1YnNjcmliZShJZDogbnVtYmVyKTogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZGVsZXRlKElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgRGlzcGF0Y2ggPSAoTWVzc2FnZTogVCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmICh0aGlzLkxpc3RlbmVycy5zaXplID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsImltcG9ydCB7IEluaXRpYWxpemVIb29rcyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcblxuSW5pdGlhbGl6ZUhvb2tzKCk7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleWJvYXJkRXZlbnQgfSBmcm9tIFwiLi9LZXlib2FyZC5UeXBlc1wiO1xuaW1wb3J0IHsgU3Vic2NyaWJlIGFzIElwY1N1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IElzVmlydHVhbEtleSB9IGZyb20gXCJAL0RvbWFpbi9Db21tb24vQ29tcG9uZW50L0tleWJvYXJkL0tleWJvYXJkXCI7XG5pbXBvcnQgeyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEIH0gZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuXG5jbGFzcyBGS2V5Ym9hcmQgZXh0ZW5kcyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEPEZLZXlib2FyZEV2ZW50Plxue1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgSXNLZXlEb3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBgT25LZXlgIHNob3VsZCBjb250aW51ZS4gKi9cbiAgICBwcml2YXRlIERlYm91bmNlID0gKFN0YXRlOiBGS2V5Ym9hcmRFdmVudFtcIlN0YXRlXCJdKTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKFN0YXRlID09PSBcIkRvd25cIilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLklzS2V5RG93bilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5Jc0tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBPbktleSA9ICguLi5EYXRhOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEV2ZW50OiBGS2V5Ym9hcmRFdmVudCA9IERhdGFbMF0gYXMgRktleWJvYXJkRXZlbnQ7XG4gICAgICAgIGNvbnN0IElzRGVib3VuY2VkOiBib29sZWFuID0gdGhpcy5EZWJvdW5jZShFdmVudC5TdGF0ZSk7XG4gICAgICAgIGlmIChJc0RlYm91bmNlZCAmJiBJc1ZpcnR1YWxLZXkoRXZlbnQuVmtDb2RlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5EaXNwYXRjaChFdmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgY29uc3QgS2V5Ym9hcmQ6IEZLZXlib2FyZCA9IG5ldyBGS2V5Ym9hcmQoKTtcbklwY1N1YnNjcmliZShcIktleWJvYXJkXCIsIEtleWJvYXJkLk9uS2V5KTtcbiIsIi8qIEZpbGU6ICAgICAgTWFpbi50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCBcIi4vQ29yZS9TaWRlRWZmZWN0c1wiO1xuIiwiLyogRmlsZTogICAgICBNZXNzYWdlTG9vcC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbi8qKiBUaGlzIGZpbGUgbXVzdCBiZSBzaWRlLWVmZmVjdCBpbXBvcnRlZCBieSBgTWFpbmAuICovXG5cbmltcG9ydCB7IEluaXRpYWxpemVNZXNzYWdlTG9vcCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcblxuY29uc3QgUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wID0gKCk6IHZvaWQgPT5cbntcbiAgICBJbml0aWFsaXplTWVzc2FnZUxvb3AoKCkgPT4geyB9KTtcbn07XG5cblJ1bkluaXRpYWxpemVNZXNzYWdlTG9vcCgpO1xuIiwiLyogRmlsZTogICAgICBNb25pdG9yLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB7IHR5cGUgRk1vbml0b3JJbmZvLCBJbml0aWFsaXplTW9uaXRvcnMgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgfSBmcm9tIFwiLi9Ob2RlSXBjXCI7XG5pbXBvcnQgeyBURGlzcGF0Y2hlciwgdHlwZSBUU3Vic2NyaXB0aW9uSGFuZGxlIH0gZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuXG5jb25zdCBNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IFsgXTtcblxuZXhwb3J0IGNvbnN0IEdldE1vbml0b3JzID0gKCk6IEFycmF5PEZNb25pdG9ySW5mbz4gPT5cbntcbiAgICByZXR1cm4gWyAuLi5Nb25pdG9ycyBdO1xufTtcblxuY29uc3QgTW9uaXRvcnNEaXNwYXRjaGVyOiBURGlzcGF0Y2hlcjxBcnJheTxGTW9uaXRvckluZm8+PiA9IG5ldyBURGlzcGF0Y2hlcjxBcnJheTxGTW9uaXRvckluZm8+PigpO1xuZXhwb3J0IGNvbnN0IE1vbml0b3JzSGFuZGxlOiBUU3Vic2NyaXB0aW9uSGFuZGxlPEFycmF5PEZNb25pdG9ySW5mbz4+ID0gTW9uaXRvcnNEaXNwYXRjaGVyLkdldEhhbmRsZSgpO1xuXG5jb25zdCBPbk1vbml0b3JzQ2hhbmdlZCA9ICguLi5EYXRhOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbntcbiAgICBjb25zdCBOZXdNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IERhdGFbMF0gYXMgQXJyYXk8Rk1vbml0b3JJbmZvPjtcbiAgICBNb25pdG9ycy5sZW5ndGggPSAwO1xuICAgIE1vbml0b3JzLnB1c2goLi4uTmV3TW9uaXRvcnMpO1xuICAgIE1vbml0b3JzRGlzcGF0Y2hlci5EaXNwYXRjaChOZXdNb25pdG9ycyk7XG59O1xuXG5jb25zdCBJbml0aWFsaXplTW9uaXRvclRyYWNraW5nID0gKCk6IHZvaWQgPT5cbntcbiAgICBNb25pdG9ycy5wdXNoKC4uLkluaXRpYWxpemVNb25pdG9ycygpKTtcbiAgICBTdWJzY3JpYmUoXCJNb25pdG9yc1wiLCBPbk1vbml0b3JzQ2hhbmdlZCk7XG59O1xuXG5Jbml0aWFsaXplTW9uaXRvclRyYWNraW5nKCk7XG4iLCIvKiBGaWxlOiAgICAgIE5vZGVJcGMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSXBjQ2FsbGJhY2ssIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQgfSBmcm9tIFwiLi9Ob2RlSXBjLlR5cGVzXCI7XG5pbXBvcnQgeyBJbml0aWFsaXplSXBjIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5sZXQgTmV4dExpc3RlbmVySWQ6IG51bWJlciA9IDA7XG5jb25zdCBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQ+ID0gbmV3IE1hcDxudW1iZXIsIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQ+KCk7XG5cbmV4cG9ydCBjb25zdCBTdWJzY3JpYmUgPSAoQ2hhbm5lbDogc3RyaW5nLCBDYWxsYmFjazogRklwY0NhbGxiYWNrKTogbnVtYmVyID0+XG57XG4gICAgY29uc3QgSWQ6IG51bWJlciA9IE5leHRMaXN0ZW5lcklkKys7XG4gICAgTGlzdGVuZXJzLnNldChJZCwgeyBDYWxsYmFjaywgQ2hhbm5lbCB9KTtcbiAgICByZXR1cm4gSWQ7XG59O1xuXG5leHBvcnQgY29uc3QgVW5zdWJzY3JpYmUgPSAoSWQ6IG51bWJlcik6IHZvaWQgPT5cbntcbiAgICBMaXN0ZW5lcnMuZGVsZXRlKElkKTtcbn07XG5cbmZ1bmN0aW9uIE9uTWVzc2FnZShDaGFubmVsOiBzdHJpbmcsIE1lc3NhZ2U6IHVua25vd24pXG57XG4gICAgTGlzdGVuZXJzLmZvckVhY2goKENhbGxiYWNrOiBGSXBjQ2FsbGJhY2tTZXJpYWxpemVkKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKENhbGxiYWNrLkNoYW5uZWwgPT09IENoYW5uZWwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrLkNhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbkluaXRpYWxpemVJcGMoT25NZXNzYWdlKTtcbiIsIi8qIEZpbGU6ICAgICAgVHJlZS50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gICAgRkNlbGwsXG4gICAgRkZvcmVzdCxcbiAgICBGUGFuZWwsXG4gICAgRlBhbmVsQmFzZSxcbiAgICBGUGFuZWxIb3Jpem9udGFsLFxuICAgIEZWZXJ0ZXggfSBmcm9tIFwiLi9UcmVlLlR5cGVzXCI7XG5pbXBvcnQge1xuICAgIHR5cGUgRk1vbml0b3JJbmZvLFxuICAgIEdldFRpbGVhYmxlV2luZG93cyxcbiAgICBHZXRNb25pdG9yRnJvbVdpbmRvdyxcbiAgICB0eXBlIEhNb25pdG9yLFxuICAgIHR5cGUgSFdpbmRvdyxcbiAgICBTZXRXaW5kb3dQb3NpdGlvbixcbiAgICBHZXRXaW5kb3dCeU5hbWUsXG4gICAgR2V0V2luZG93VGl0bGV9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEdldE1vbml0b3JzIH0gZnJvbSBcIi4vTW9uaXRvclwiO1xuaW1wb3J0IHsgQXJlSGFuZGxlc0VxdWFsIH0gZnJvbSBcIi4vQ29yZS9VdGlsaXR5XCI7XG5cbmNvbnN0IEZvcmVzdDogRkZvcmVzdCA9IFsgXTtcblxuZXhwb3J0IGNvbnN0IEdldEZvcmVzdCA9ICgpOiBGRm9yZXN0ID0+XG57XG4gICAgcmV0dXJuIFsgLi4uRm9yZXN0IF07XG59O1xuXG5jb25zdCBDZWxsID0gKEhhbmRsZTogSFdpbmRvdyk6IEZDZWxsID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSGFuZGxlLFxuICAgICAgICBTaXplOiB7IEhlaWdodDogMCwgV2lkdGg6IDAsIFg6IDAsIFk6IDAgfSxcbiAgICAgICAgWk9yZGVyOiAwXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBVcGRhdGVGb3Jlc3QgPSAoVXBkYXRlRnVuY3Rpb246IChPbGRGb3Jlc3Q6IEZGb3Jlc3QpID0+IEZGb3Jlc3QpOiB2b2lkID0+XG57XG4gICAgY29uc3QgTmV3Rm9yZXN0OiBGRm9yZXN0ID0gVXBkYXRlRnVuY3Rpb24oWyAuLi5Gb3Jlc3QgXSk7XG4gICAgRm9yZXN0Lmxlbmd0aCA9IDA7XG4gICAgRm9yZXN0LnB1c2goLi4uTmV3Rm9yZXN0KTtcblxuICAgIC8vIEBUT0RPIE1vdmUgYW5kIHJlc2l6ZSwgYW5kIHNvcnQgWk9yZGVyIG9mIGFsbCB3aW5kb3dzIGJlaW5nIHRpbGVkIGJ5IFNvcnJlbGxXbS5cbn07XG5cbmNvbnN0IEluaXRpYWxpemVUcmVlID0gKCk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IEdldE1vbml0b3JzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhNb25pdG9ycyk7XG5cbiAgICBGb3Jlc3QucHVzaCguLi5Nb25pdG9ycy5tYXAoKE1vbml0b3I6IEZNb25pdG9ySW5mbyk6IEZQYW5lbEhvcml6b250YWwgPT5cbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBIZXJlLCBNb25pdG9ySGFuZGxlIGlzICR7IE1vbml0b3IuSGFuZGxlIH0uYCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBDaGlsZHJlbjogWyBdLFxuICAgICAgICAgICAgTW9uaXRvcklkOiBNb25pdG9yLkhhbmRsZSxcbiAgICAgICAgICAgIFNpemU6IE1vbml0b3IuU2l6ZSxcbiAgICAgICAgICAgIFR5cGU6IFwiSG9yaXpvbnRhbFwiLFxuICAgICAgICAgICAgWk9yZGVyOiAwXG4gICAgICAgIH07XG4gICAgfSkpO1xuXG4gICAgY29uc29sZS5sb2coRm9yZXN0KTtcblxuICAgIGNvbnN0IFRpbGVhYmxlV2luZG93czogQXJyYXk8SFdpbmRvdz4gPSBHZXRUaWxlYWJsZVdpbmRvd3MoKTtcblxuICAgIGNvbnNvbGUubG9nKGBGb3VuZCAkeyBUaWxlYWJsZVdpbmRvd3MubGVuZ3RoIH0gdGlsZWFibGUgd2luZG93cy5gKTtcblxuICAgIFRpbGVhYmxlV2luZG93cy5mb3JFYWNoKChIYW5kbGU6IEhXaW5kb3cpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9yOiBITW9uaXRvciA9IEdldE1vbml0b3JGcm9tV2luZG93KEhhbmRsZSk7XG4gICAgICAgIGNvbnN0IFJvb3RQYW5lbDogRlBhbmVsQmFzZSB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICBGb3Jlc3QuZmluZCgoUGFuZWw6IEZQYW5lbEJhc2UpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE1vbml0b3IgaXMgJHsgSlNPTi5zdHJpbmdpZnkoTW9uaXRvcikgfSBhbmQgUGFuZWwuTW9uaXRvcklkIGlzICR7IEpTT04uc3RyaW5naWZ5KFBhbmVsLk1vbml0b3JJZCkgfS5gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBJbmZvOiBGTW9uaXRvckluZm8gfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgICAgICAgICBNb25pdG9ycy5maW5kKChGb286IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZvby5IYW5kbGUuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQ/LkhhbmRsZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU2l6ZSAkeyBKU09OLnN0cmluZ2lmeShJbmZvPy5TaXplKSB9IFdvcmtTaXplICR7IEpTT04uc3RyaW5naWZ5KEluZm8/LldvcmtTaXplKSB9LmApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhbmVsLk1vbml0b3JJZD8uSGFuZGxlID09PSBNb25pdG9yLkhhbmRsZTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgaWYgKFJvb3RQYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBAVE9ET1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLwn5Kh8J+SofCfkqHwn5KhIFJvb3RQYW5lbCB3YXMgdW5kZWZpbmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJvb3RQYW5lbC5DaGlsZHJlbi5wdXNoKENlbGwoSGFuZGxlKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIEZvcmVzdC5mb3JFYWNoKChQYW5lbDogRlBhbmVsKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgTW9uaXRvckluZm86IEZNb25pdG9ySW5mbyB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICBNb25pdG9ycy5maW5kKChJbk1vbml0b3I6IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT4gSW5Nb25pdG9yLkhhbmRsZSA9PT0gUGFuZWwuTW9uaXRvcklkKTtcblxuICAgICAgICBpZiAoTW9uaXRvckluZm8gPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQFRPRE9cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFBhbmVsLkNoaWxkcmVuID0gUGFuZWwuQ2hpbGRyZW4ubWFwKChDaGlsZDogRlZlcnRleCwgSW5kZXg6IG51bWJlcik6IEZWZXJ0ZXggPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBVbmlmb3JtV2lkdGg6IG51bWJlciA9IE1vbml0b3JJbmZvLldvcmtTaXplLldpZHRoIC8gUGFuZWwuQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IE91dENoaWxkOiBGVmVydGV4ID0geyAuLi5DaGlsZCB9O1xuICAgICAgICAgICAgICAgIE91dENoaWxkLlNpemUgPVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uTW9uaXRvckluZm8uV29ya1NpemUsXG4gICAgICAgICAgICAgICAgICAgIFdpZHRoOiBVbmlmb3JtV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIFg6IFVuaWZvcm1XaWR0aCAqIEluZGV4ICsgTW9uaXRvckluZm8uV29ya1NpemUuWFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT3V0Q2hpbGQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgQ2VsbHM6IEFycmF5PEZDZWxsPiA9IEdldEFsbENlbGxzKEZvcmVzdCk7XG5cbiAgICBDZWxscy5mb3JFYWNoKChDZWxsOiBGQ2VsbCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTZXR0aW5nIHBvc2l0aW9uIG9mICR7IEdldFdpbmRvd1RpdGxlKENlbGwuSGFuZGxlKSB9IHRvICR7IEpTT04uc3RyaW5naWZ5KENlbGwuU2l6ZSkgfS5gKTtcbiAgICAgICAgU2V0V2luZG93UG9zaXRpb24oQ2VsbC5IYW5kbGUsIENlbGwuU2l6ZSk7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhgQ2FsbGVkIFNldFdpbmRvd1Bvc2l0aW9uIGZvciAkeyBDZWxscy5sZW5ndGggfSB3aW5kb3dzLmApO1xufTtcblxuY29uc3QgSXNDZWxsID0gKFZlcnRleDogRlZlcnRleCk6IFZlcnRleCBpcyBGQ2VsbCA9Plxue1xuICAgIHJldHVybiBcIkhhbmRsZVwiIGluIFZlcnRleDtcbn07XG5cbi8qKlxuICogUnVuIGEgZnVuY3Rpb24gZm9yIGVhY2ggdmVydGV4IHVudGlsIHRoZSBmdW5jdGlvbiByZXR1cm5zIGBmYWxzZWAgZm9yXG4gKiBhbiBpdGVyYXRpb24uXG4gKi9cbmV4cG9ydCBjb25zdCBUcmF2ZXJzZSA9IChJbkZ1bmN0aW9uOiAoVmVydGV4OiBGVmVydGV4KSA9PiBib29sZWFuKTogdm9pZCA9Plxue1xuICAgIGxldCBDb250aW51ZXM6IGJvb2xlYW4gPSB0cnVlO1xuICAgIGNvbnN0IFJlY3VycmVuY2UgPSAoVmVydGV4OiBGVmVydGV4KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKENvbnRpbnVlcylcbiAgICAgICAge1xuICAgICAgICAgICAgQ29udGludWVzID0gSW5GdW5jdGlvbihWZXJ0ZXgpO1xuICAgICAgICAgICAgaWYgKENvbnRpbnVlcyAmJiBcIkNoaWxkcmVuXCIgaW4gVmVydGV4KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgQ2hpbGQgb2YgVmVydGV4LkNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVjdXJyZW5jZShDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgUGFuZWwgb2YgRm9yZXN0KVxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBQYW5lbC5DaGlsZHJlbilcbiAgICAgICAge1xuICAgICAgICAgICAgUmVjdXJyZW5jZShDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBHZXRBbGxDZWxscyA9IChQYW5lbHM6IEFycmF5PEZQYW5lbD4pOiBBcnJheTxGQ2VsbD4gPT5cbntcbiAgICBjb25zdCBSZXN1bHQ6IEFycmF5PEZDZWxsPiA9IFsgXTtcblxuICAgIGZ1bmN0aW9uIFRyYXZlcnNlKFZlcnRleDogRlZlcnRleCk6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmIChcIkhhbmRsZVwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgUmVzdWx0LnB1c2goVmVydGV4IGFzIEZDZWxsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcIkNoaWxkcmVuXCIgaW4gVmVydGV4KVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUcmF2ZXJzZShDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFBhbmVsIG9mIFBhbmVscylcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgQ2hpbGQgb2YgUGFuZWwuQ2hpbGRyZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIFRyYXZlcnNlKENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgRXhpc3RzID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBFeGlzdHNFeGFjdGx5T25lID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgRm9yQWxsID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgSXNXaW5kb3dUaWxlZCA9IChIYW5kbGU6IEhXaW5kb3cpOiBib29sZWFuID0+XG57XG4gICAgbGV0IEZvdW5kV2luZG93OiBib29sZWFuID0gZmFsc2U7XG4gICAgcmV0dXJuIEV4aXN0cygoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKCFGb3VuZFdpbmRvdylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKElzQ2VsbChWZXJ0ZXgpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChBcmVIYW5kbGVzRXF1YWwoVmVydGV4LkhhbmRsZSwgSGFuZGxlKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIEZvdW5kV2luZG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbn07XG5cbkluaXRpYWxpemVUcmVlKCk7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleUlkLCBGVmlydHVhbEtleSB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmNvbnN0IEtleUlkc0J5SWQ6IFJlYWRvbmx5PFJlY29yZDxGVmlydHVhbEtleSwgRktleUlkPj4gPVxue1xuICAgIDB4MDU6IFwiTW91c2VYMVwiLFxuICAgIDB4MDY6IFwiTW91c2VYMlwiLFxuICAgIDB4MDg6IFwiQmFja3NwYWNlXCIsXG4gICAgMHgwOTogXCJUYWJcIixcbiAgICAweDBEOiBcIkVudGVyXCIsXG4gICAgMHgxMDogXCJTaGlmdFwiLFxuICAgIDB4MTE6IFwiQ3RybFwiLFxuICAgIDB4MTI6IFwiQWx0XCIsXG4gICAgMHgxMzogXCJQYXVzZVwiLFxuICAgIDB4MjA6IFwiU3BhY2VcIixcbiAgICAweDIxOiBcIlBnVXBcIixcbiAgICAweDIyOiBcIlBnRG93blwiLFxuICAgIDB4MjM6IFwiRW5kXCIsXG4gICAgMHgyNDogXCJIb21lXCIsXG4gICAgMHgyNTogXCJMZWZ0QXJyb3dcIixcbiAgICAweDI2OiBcIlVwQXJyb3dcIixcbiAgICAweDI3OiBcIlJpZ2h0QXJyb3dcIixcbiAgICAweDI4OiBcIkRvd25BcnJvd1wiLFxuICAgIDB4MkQ6IFwiSW5zXCIsXG4gICAgMHgyRTogXCJEZWxcIixcbiAgICAweDMwOiBcIjBcIixcbiAgICAweDMxOiBcIjFcIixcbiAgICAweDMyOiBcIjJcIixcbiAgICAweDMzOiBcIjNcIixcbiAgICAweDM0OiBcIjRcIixcbiAgICAweDM1OiBcIjVcIixcbiAgICAweDM2OiBcIjZcIixcbiAgICAweDM3OiBcIjdcIixcbiAgICAweDM4OiBcIjhcIixcbiAgICAweDM5OiBcIjlcIixcbiAgICAweDQxOiBcIkFcIixcbiAgICAweDQyOiBcIkJcIixcbiAgICAweDQzOiBcIkNcIixcbiAgICAweDQ0OiBcIkRcIixcbiAgICAweDQ1OiBcIkVcIixcbiAgICAweDQ2OiBcIkZcIixcbiAgICAweDQ3OiBcIkdcIixcbiAgICAweDQ4OiBcIkhcIixcbiAgICAweDQ5OiBcIklcIixcbiAgICAweDRBOiBcIkpcIixcbiAgICAweDRCOiBcIktcIixcbiAgICAweDRDOiBcIkxcIixcbiAgICAweDREOiBcIk1cIixcbiAgICAweDRFOiBcIk5cIixcbiAgICAweDRGOiBcIk9cIixcbiAgICAweDUwOiBcIlBcIixcbiAgICAweDUxOiBcIlFcIixcbiAgICAweDUyOiBcIlJcIixcbiAgICAweDUzOiBcIlNcIixcbiAgICAweDU0OiBcIlRcIixcbiAgICAweDU1OiBcIlVcIixcbiAgICAweDU2OiBcIlZcIixcbiAgICAweDU3OiBcIldcIixcbiAgICAweDU4OiBcIlhcIixcbiAgICAweDU5OiBcIllcIixcbiAgICAweDVBOiBcIlpcIixcbiAgICAweDVCOiBcIkxXaW5cIixcbiAgICAweDVDOiBcIlJXaW5cIixcbiAgICAweDVEOiBcIkFwcGxpY2F0aW9uc1wiLFxuICAgIDB4NjA6IFwiTnVtMFwiLFxuICAgIDB4NjE6IFwiTnVtMVwiLFxuICAgIDB4NjI6IFwiTnVtMlwiLFxuICAgIDB4NjM6IFwiTnVtM1wiLFxuICAgIDB4NjQ6IFwiTnVtNFwiLFxuICAgIDB4NjU6IFwiTnVtNVwiLFxuICAgIDB4NjY6IFwiTnVtNlwiLFxuICAgIDB4Njc6IFwiTnVtN1wiLFxuICAgIDB4Njg6IFwiTnVtOFwiLFxuICAgIDB4Njk6IFwiTnVtOVwiLFxuICAgIDB4NkE6IFwiTXVsdGlwbHlcIixcbiAgICAweDZCOiBcIkFkZFwiLFxuICAgIDB4NkQ6IFwiU3VidHJhY3RcIixcbiAgICAweDZFOiBcIk51bURlY2ltYWxcIixcbiAgICAweDZGOiBcIk51bURpdmlkZVwiLFxuICAgIDB4NzA6IFwiRjFcIixcbiAgICAweDcxOiBcIkYyXCIsXG4gICAgMHg3MjogXCJGM1wiLFxuICAgIDB4NzM6IFwiRjRcIixcbiAgICAweDc0OiBcIkY1XCIsXG4gICAgMHg3NTogXCJGNlwiLFxuICAgIDB4NzY6IFwiRjdcIixcbiAgICAweDc3OiBcIkY4XCIsXG4gICAgMHg3ODogXCJGOVwiLFxuICAgIDB4Nzk6IFwiRjEwXCIsXG4gICAgMHg3QTogXCJGMTFcIixcbiAgICAweDdCOiBcIkYxMlwiLFxuICAgIDB4N0M6IFwiRjEzXCIsXG4gICAgMHg3RDogXCJGMTRcIixcbiAgICAweDdFOiBcIkYxNVwiLFxuICAgIDB4N0Y6IFwiRjE2XCIsXG4gICAgMHg4MDogXCJGMTdcIixcbiAgICAweDgxOiBcIkYxOFwiLFxuICAgIDB4ODI6IFwiRjE5XCIsXG4gICAgMHg4MzogXCJGMjBcIixcbiAgICAweDg0OiBcIkYyMVwiLFxuICAgIDB4ODU6IFwiRjIyXCIsXG4gICAgMHg4NjogXCJGMjNcIixcbiAgICAweDg3OiBcIkYyNFwiLFxuICAgIDB4QTA6IFwiTFNoaWZ0XCIsXG4gICAgMHhBMTogXCJSU2hpZnRcIixcbiAgICAweEEyOiBcIkxDdHJsXCIsXG4gICAgMHhBMzogXCJSQ3RybFwiLFxuICAgIDB4QTQ6IFwiTEFsdFwiLFxuICAgIDB4QTU6IFwiUkFsdFwiLFxuICAgIDB4QTY6IFwiQnJvd3NlckJhY2tcIixcbiAgICAweEE3OiBcIkJyb3dzZXJGb3J3YXJkXCIsXG4gICAgMHhBODogXCJCcm93c2VyUmVmcmVzaFwiLFxuICAgIDB4QTk6IFwiQnJvd3NlclN0b3BcIixcbiAgICAweEFBOiBcIkJyb3dzZXJTZWFyY2hcIixcbiAgICAweEFCOiBcIkJyb3dzZXJGYXZvcml0ZXNcIixcbiAgICAweEFDOiBcIkJyb3dzZXJTdGFydFwiLFxuICAgIDB4QjA6IFwiTmV4dFRyYWNrXCIsXG4gICAgMHhCMTogXCJQcmV2aW91c1RyYWNrXCIsXG4gICAgMHhCMjogXCJTdG9wTWVkaWFcIixcbiAgICAweEIzOiBcIlBsYXlQYXVzZU1lZGlhXCIsXG4gICAgMHhCNDogXCJTdGFydE1haWxcIixcbiAgICAweEI1OiBcIlNlbGVjdE1lZGlhXCIsXG4gICAgMHhCNjogXCJTdGFydEFwcGxpY2F0aW9uT25lXCIsXG4gICAgMHhCNzogXCJTdGFydEFwcGxpY2F0aW9uVHdvXCIsXG4gICAgMHhCQTogXCI7XCIsXG4gICAgMHhCQjogXCIrXCIsXG4gICAgMHhCQzogXCIsXCIsXG4gICAgMHhCRDogXCItXCIsXG4gICAgMHhCRTogXCIuXCIsXG4gICAgMHhCRjogXCIvXCIsXG4gICAgMHhDMDogXCJgXCIsXG4gICAgMHhEQjogXCJbXCIsXG4gICAgMHhEQzogXCJcXFxcXCIsXG4gICAgMHhERDogXCJdXCIsXG4gICAgMHhERTogXCInXCJcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBHZXRLZXlOYW1lID0gKFZrQ29kZTogRlZpcnR1YWxLZXkpOiBGS2V5SWQgPT5cbntcbiAgICByZXR1cm4gS2V5SWRzQnlJZFtWa0NvZGVdO1xufTtcblxuLyoqIERldmVsb3Blci1mcmllbmRseSBuYW1lcyBvZiBrZXkgY29kZXMuICovXG5leHBvcnQgY29uc3QgVms6IFJlYWRvbmx5PFJlY29yZDxGS2V5SWQsIEZWaXJ0dWFsS2V5Pj4gPVxue1xuICAgIE1vdXNlWDE6IDB4MDUsXG4gICAgTW91c2VYMjogMHgwNixcbiAgICBCYWNrc3BhY2U6IDB4MDgsXG4gICAgVGFiOiAweDA5LFxuICAgIEVudGVyOiAweDBELFxuICAgIFNoaWZ0OiAweDEwLFxuICAgIEN0cmw6IDB4MTEsXG4gICAgQWx0OiAweDEyLFxuICAgIFBhdXNlOiAweDEzLFxuICAgIFNwYWNlOiAweDIwLFxuICAgIFBnVXA6IDB4MjEsXG4gICAgUGdEb3duOiAweDIyLFxuICAgIEVuZDogMHgyMyxcbiAgICBIb21lOiAweDI0LFxuICAgIExlZnRBcnJvdzogMHgyNSxcbiAgICBVcEFycm93OiAweDI2LFxuICAgIFJpZ2h0QXJyb3c6IDB4MjcsXG4gICAgRG93bkFycm93OiAweDI4LFxuICAgIEluczogMHgyRCxcbiAgICBEZWw6IDB4MkUsXG4gICAgMDogMHgzMCxcbiAgICAxOiAweDMxLFxuICAgIDI6IDB4MzIsXG4gICAgMzogMHgzMyxcbiAgICA0OiAweDM0LFxuICAgIDU6IDB4MzUsXG4gICAgNjogMHgzNixcbiAgICA3OiAweDM3LFxuICAgIDg6IDB4MzgsXG4gICAgOTogMHgzOSxcbiAgICBBOiAweDQxLFxuICAgIEI6IDB4NDIsXG4gICAgQzogMHg0MyxcbiAgICBEOiAweDQ0LFxuICAgIEU6IDB4NDUsXG4gICAgRjogMHg0NixcbiAgICBHOiAweDQ3LFxuICAgIEg6IDB4NDgsXG4gICAgSTogMHg0OSxcbiAgICBKOiAweDRBLFxuICAgIEs6IDB4NEIsXG4gICAgTDogMHg0QyxcbiAgICBNOiAweDRELFxuICAgIE46IDB4NEUsXG4gICAgTzogMHg0RixcbiAgICBQOiAweDUwLFxuICAgIFE6IDB4NTEsXG4gICAgUjogMHg1MixcbiAgICBTOiAweDUzLFxuICAgIFQ6IDB4NTQsXG4gICAgVTogMHg1NSxcbiAgICBWOiAweDU2LFxuICAgIFc6IDB4NTcsXG4gICAgWDogMHg1OCxcbiAgICBZOiAweDU5LFxuICAgIFo6IDB4NUEsXG4gICAgTFdpbjogMHg1QixcbiAgICBSV2luOiAweDVDLFxuICAgIEFwcGxpY2F0aW9uczogMHg1RCxcbiAgICBOdW0wOiAweDYwLFxuICAgIE51bTE6IDB4NjEsXG4gICAgTnVtMjogMHg2MixcbiAgICBOdW0zOiAweDYzLFxuICAgIE51bTQ6IDB4NjQsXG4gICAgTnVtNTogMHg2NSxcbiAgICBOdW02OiAweDY2LFxuICAgIE51bTc6IDB4NjcsXG4gICAgTnVtODogMHg2OCxcbiAgICBOdW05OiAweDY5LFxuICAgIE11bHRpcGx5OiAweDZBLFxuICAgIEFkZDogMHg2QixcbiAgICBTdWJ0cmFjdDogMHg2RCxcbiAgICBOdW1EZWNpbWFsOiAweDZFLFxuICAgIE51bURpdmlkZTogMHg2RixcbiAgICBGMTogMHg3MCxcbiAgICBGMjogMHg3MSxcbiAgICBGMzogMHg3MixcbiAgICBGNDogMHg3MyxcbiAgICBGNTogMHg3NCxcbiAgICBGNjogMHg3NSxcbiAgICBGNzogMHg3NixcbiAgICBGODogMHg3NyxcbiAgICBGOTogMHg3OCxcbiAgICBGMTA6IDB4NzksXG4gICAgRjExOiAweDdBLFxuICAgIEYxMjogMHg3QixcbiAgICBGMTM6IDB4N0MsXG4gICAgRjE0OiAweDdELFxuICAgIEYxNTogMHg3RSxcbiAgICBGMTY6IDB4N0YsXG4gICAgRjE3OiAweDgwLFxuICAgIEYxODogMHg4MSxcbiAgICBGMTk6IDB4ODIsXG4gICAgRjIwOiAweDgzLFxuICAgIEYyMTogMHg4NCxcbiAgICBGMjI6IDB4ODUsXG4gICAgRjIzOiAweDg2LFxuICAgIEYyNDogMHg4NyxcbiAgICBMU2hpZnQ6IDB4QTAsXG4gICAgUlNoaWZ0OiAweEExLFxuICAgIExDdHJsOiAweEEyLFxuICAgIFJDdHJsOiAweEEzLFxuICAgIExBbHQ6IDB4QTQsXG4gICAgUkFsdDogMHhBNSxcbiAgICBCcm93c2VyQmFjazogMHhBNixcbiAgICBCcm93c2VyRm9yd2FyZDogMHhBNyxcbiAgICBCcm93c2VyUmVmcmVzaDogMHhBOCxcbiAgICBCcm93c2VyU3RvcDogMHhBOSxcbiAgICBCcm93c2VyU2VhcmNoOiAweEFBLFxuICAgIEJyb3dzZXJGYXZvcml0ZXM6IDB4QUIsXG4gICAgQnJvd3NlclN0YXJ0OiAweEFDLFxuICAgIE5leHRUcmFjazogMHhCMCxcbiAgICBQcmV2aW91c1RyYWNrOiAweEIxLFxuICAgIFN0b3BNZWRpYTogMHhCMixcbiAgICBQbGF5UGF1c2VNZWRpYTogMHhCMyxcbiAgICBTdGFydE1haWw6IDB4QjQsXG4gICAgU2VsZWN0TWVkaWE6IDB4QjUsXG4gICAgU3RhcnRBcHBsaWNhdGlvbk9uZTogMHhCNixcbiAgICBTdGFydEFwcGxpY2F0aW9uVHdvOiAweEI3LFxuICAgIFwiO1wiOiAweEJBLFxuICAgIFwiK1wiOiAweEJCLFxuICAgIFwiLFwiOiAweEJDLFxuICAgIFwiLVwiOiAweEJELFxuICAgIFwiLlwiOiAweEJFLFxuICAgIFwiL1wiOiAweEJGLFxuICAgIFwiYFwiOiAweEMwLFxuICAgIFwiW1wiOiAweERCLFxuICAgIFwiXFxcXFwiOiAweERDLFxuICAgIFwiXVwiOiAweERELFxuICAgIFwiJ1wiOiAweERFXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgVmlydHVhbEtleXM6IFJlYWRvbmx5PEFycmF5PEZWaXJ0dWFsS2V5Pj4gPVxuW1xuICAgIDB4MDUsXG4gICAgMHgwNixcbiAgICAweDA4LFxuICAgIDB4MDksXG4gICAgMHgwRCxcbiAgICAweDEwLFxuICAgIDB4MTEsXG4gICAgMHgxMixcbiAgICAweDEzLFxuICAgIDB4MjAsXG4gICAgMHgyMSxcbiAgICAweDIyLFxuICAgIDB4MjMsXG4gICAgMHgyNCxcbiAgICAweDI1LFxuICAgIDB4MjYsXG4gICAgMHgyNyxcbiAgICAweDI4LFxuICAgIDB4MkQsXG4gICAgMHgyRSxcbiAgICAweDMwLFxuICAgIDB4MzEsXG4gICAgMHgzMixcbiAgICAweDMzLFxuICAgIDB4MzQsXG4gICAgMHgzNSxcbiAgICAweDM2LFxuICAgIDB4MzcsXG4gICAgMHgzOCxcbiAgICAweDM5LFxuICAgIDB4NDEsXG4gICAgMHg0MixcbiAgICAweDQzLFxuICAgIDB4NDQsXG4gICAgMHg0NSxcbiAgICAweDQ2LFxuICAgIDB4NDcsXG4gICAgMHg0OCxcbiAgICAweDQ5LFxuICAgIDB4NEEsXG4gICAgMHg0QixcbiAgICAweDRDLFxuICAgIDB4NEQsXG4gICAgMHg0RSxcbiAgICAweDRGLFxuICAgIDB4NTAsXG4gICAgMHg1MSxcbiAgICAweDUyLFxuICAgIDB4NTMsXG4gICAgMHg1NCxcbiAgICAweDU1LFxuICAgIDB4NTYsXG4gICAgMHg1NyxcbiAgICAweDU4LFxuICAgIDB4NTksXG4gICAgMHg1QSxcbiAgICAweDVCLFxuICAgIDB4NUMsXG4gICAgMHg1RCxcbiAgICAweDYwLFxuICAgIDB4NjEsXG4gICAgMHg2MixcbiAgICAweDYzLFxuICAgIDB4NjQsXG4gICAgMHg2NSxcbiAgICAweDY2LFxuICAgIDB4NjcsXG4gICAgMHg2OCxcbiAgICAweDY5LFxuICAgIDB4NkEsXG4gICAgMHg2QixcbiAgICAweDZELFxuICAgIDB4NkUsXG4gICAgMHg2RixcbiAgICAweDcwLFxuICAgIDB4NzEsXG4gICAgMHg3MixcbiAgICAweDczLFxuICAgIDB4NzQsXG4gICAgMHg3NSxcbiAgICAweDc2LFxuICAgIDB4NzcsXG4gICAgMHg3OCxcbiAgICAweDc5LFxuICAgIDB4N0EsXG4gICAgMHg3QixcbiAgICAweDdDLFxuICAgIDB4N0QsXG4gICAgMHg3RSxcbiAgICAweDdGLFxuICAgIDB4ODAsXG4gICAgMHg4MSxcbiAgICAweDgyLFxuICAgIDB4ODMsXG4gICAgMHg4NCxcbiAgICAweDg1LFxuICAgIDB4ODYsXG4gICAgMHg4NyxcbiAgICAweEEwLFxuICAgIDB4QTEsXG4gICAgMHhBMixcbiAgICAweEEzLFxuICAgIDB4QTQsXG4gICAgMHhBNSxcbiAgICAweEE2LFxuICAgIDB4QTcsXG4gICAgMHhBOCxcbiAgICAweEE5LFxuICAgIDB4QUEsXG4gICAgMHhBQixcbiAgICAweEFDLFxuICAgIDB4QjAsXG4gICAgMHhCMSxcbiAgICAweEIyLFxuICAgIDB4QjMsXG4gICAgMHhCNCxcbiAgICAweEI1LFxuICAgIDB4QjYsXG4gICAgMHhCNyxcbiAgICAweEJBLFxuICAgIDB4QkIsXG4gICAgMHhCQyxcbiAgICAweEJELFxuICAgIDB4QkUsXG4gICAgMHhCRixcbiAgICAweEMwLFxuICAgIDB4REIsXG4gICAgMHhEQyxcbiAgICAweERELFxuICAgIDB4REVcbl0gYXMgY29uc3Q7XG5cbi8qIGVzbGludC1lbmFibGUgc29ydC1rZXlzICovXG5cbi8qKiBJcyB0aGUgYEtleUNvZGVgIGEgVksgQ29kZSAqKnRoYXQgdGhpcyBhcHAgdXNlcyoqLiAqL1xuZXhwb3J0IGNvbnN0IElzVmlydHVhbEtleSA9IChLZXlDb2RlOiBudW1iZXIpOiBLZXlDb2RlIGlzIEZWaXJ0dWFsS2V5ID0+XG57XG4gICAgcmV0dXJuIFZpcnR1YWxLZXlzLmluY2x1ZGVzKEtleUNvZGUgYXMgRlZpcnR1YWxLZXkpO1xufTtcbiIsInZhciBteU1vZHVsZSA9IHJlcXVpcmUoXCJiaW5kaW5nc1wiKShcImhlbGxvXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBteU1vZHVsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJidWZmZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb25zdGFudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3RyZWFtXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmluZ19kZWNvZGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ6bGliXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuX193ZWJwYWNrX3JlcXVpcmVfXy5jID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi5idW5kbGUuZGV2LmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJsb2FkZWRcIiwgb3RoZXJ3aXNlIG5vdCBsb2FkZWQgeWV0XG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMVxufTtcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG52YXIgaW5zdGFsbENodW5rID0gKGNodW5rKSA9PiB7XG5cdHZhciBtb3JlTW9kdWxlcyA9IGNodW5rLm1vZHVsZXMsIGNodW5rSWRzID0gY2h1bmsuaWRzLCBydW50aW1lID0gY2h1bmsucnVudGltZTtcblx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspXG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDE7XG5cbn07XG5cbi8vIHJlcXVpcmUoKSBjaHVuayBsb2FkaW5nIGZvciBqYXZhc2NyaXB0XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYucmVxdWlyZSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbnN0YWxsQ2h1bmsocmVxdWlyZShcIi4vXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLnUoY2h1bmtJZCkpKTtcblx0XHR9IGVsc2UgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMTtcblx0fVxufTtcblxuLy8gbm8gZXh0ZXJuYWwgaW5zdGFsbCBjaHVua1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwiIiwiLy8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vU291cmNlL01haW4vTWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==