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

/***/ "./node_modules/bindings/bindings.js":
/*!*******************************************!*\
  !*** ./node_modules/bindings/bindings.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var fs = __webpack_require__(/*! fs */ "fs"),
  path = __webpack_require__(/*! path */ "path"),
  fileURLToPath = __webpack_require__(/*! file-uri-to-path */ "./node_modules/file-uri-to-path/index.js"),
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

/***/ "./node_modules/file-uri-to-path/index.js":
/*!************************************************!*\
  !*** ./node_modules/file-uri-to-path/index.js ***!
  \************************************************/
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
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_chalk_source_index_js"), __webpack_require__.e("Source_Main_MainWindow_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../MainWindow */ "./Source/Main/MainWindow.ts"));
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
/* harmony export */   LogForest: () => (/* binding */ LogForest),
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
/** @TODO */
const LogForest = () => {
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
        /* At least for now, ignore SorrellWm windows. */
        // if (GetWindowTitle(Cell.Handle) !== "SorrellWm")
        // {
        //     SetWindowPosition(Cell.Handle, Cell.Size);
        // }
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
    let DoesExist = false;
    Traverse((Vertex) => {
        if (!DoesExist) {
            DoesExist = Predicate(Vertex);
        }
        return !DoesExist;
    });
    return DoesExist;
};
/** @TODO */
const ExistsExactlyOne = (Predicate) => {
    return false;
};
const ForAll = (Predicate) => {
    return false;
};
const IsWindowTiled = (Handle) => {
    return Exists((Vertex) => {
        return IsCell(Vertex) && (0,_Core_Utility__WEBPACK_IMPORTED_MODULE_2__.AreHandlesEqual)(Vertex.Handle, Handle);
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

var myModule = __webpack_require__(/*! bindings */ "./node_modules/bindings/bindings.js")("hello");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsY0FBYztJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lB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SUFBSTtJQUNiLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixZQUFZLEVBQUUsSUFBSTtJQUNsQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFFBQVEsRUFBRSxJQUFJO0lBQ2QsR0FBRyxFQUFFLElBQUk7SUFDVCxRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUNaLEtBQUssRUFBRSxJQUFJO0lBQ1gsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsV0FBVyxFQUFFLElBQUk7SUFDakIsY0FBYyxFQUFFLElBQUk7SUFDcEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsYUFBYSxFQUFFLElBQUk7SUFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixZQUFZLEVBQUUsSUFBSTtJQUNsQixTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFNBQVMsRUFBRSxJQUFJO0lBQ2YsY0FBYyxFQUFFLElBQUk7SUFDcEIsU0FBUyxFQUFFLElBQUk7SUFDZixXQUFXLEVBQUUsSUFBSTtJQUNqQixtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtDQUNILENBQUM7QUFFSixNQUFNLFdBQVcsR0FDeEI7SUFDSSxJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0NBQ0UsQ0FBQztBQUVYLDZCQUE2QjtBQUU3Qix5REFBeUQ7QUFDbEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUFlLEVBQTBCLEVBQUU7SUFFcEUsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQXNCLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN6YUYsSUFBSSxRQUFRLEdBQUcsbUJBQU8sQ0FBQyxxREFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7Ozs7Ozs7OztBQ0QxQjs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0MvQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjs7Ozs7V0NSQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdCQUFnQixxQkFBcUI7V0FDckM7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxhQUFhO1dBQ2I7V0FDQSxJQUFJO1dBQ0o7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7Ozs7VUVyQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9iaW5kaW5ncy9iaW5kaW5ncy5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9ub2RlX21vZHVsZXMvZmlsZS11cmktdG8tcGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Db3JlL1NpZGVFZmZlY3RzLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvVXRpbGl0eS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9EaXNwYXRjaGVyLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0hvb2sudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbi50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NZXNzYWdlTG9vcC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Nb25pdG9yLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL05vZGVJcGMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vVHJlZS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvUmVuZGVyZXIvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vV2luZG93cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImFzc2VydFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiYnVmZmVyXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjaGlsZF9wcm9jZXNzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjb25zdGFudHNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImV2ZW50c1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJvc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicXVlcnlzdHJpbmdcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmVhbVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwic3RyaW5nX2RlY29kZXJcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInR0eVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidXJsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ6bGliXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9yZXF1aXJlIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKSxcbiAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAgZmlsZVVSTFRvUGF0aCA9IHJlcXVpcmUoJ2ZpbGUtdXJpLXRvLXBhdGgnKSxcbiAgam9pbiA9IHBhdGguam9pbixcbiAgZGlybmFtZSA9IHBhdGguZGlybmFtZSxcbiAgZXhpc3RzID1cbiAgICAoZnMuYWNjZXNzU3luYyAmJlxuICAgICAgZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLmFjY2Vzc1N5bmMocGF0aCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KSB8fFxuICAgIGZzLmV4aXN0c1N5bmMgfHxcbiAgICBwYXRoLmV4aXN0c1N5bmMsXG4gIGRlZmF1bHRzID0ge1xuICAgIGFycm93OiBwcm9jZXNzLmVudi5OT0RFX0JJTkRJTkdTX0FSUk9XIHx8ICcg4oaSICcsXG4gICAgY29tcGlsZWQ6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQ09NUElMRURfRElSIHx8ICdjb21waWxlZCcsXG4gICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgYXJjaDogcHJvY2Vzcy5hcmNoLFxuICAgIG5vZGVQcmVHeXA6XG4gICAgICAnbm9kZS12JyArXG4gICAgICBwcm9jZXNzLnZlcnNpb25zLm1vZHVsZXMgK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MucGxhdGZvcm0gK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MuYXJjaCxcbiAgICB2ZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25zLm5vZGUsXG4gICAgYmluZGluZ3M6ICdiaW5kaW5ncy5ub2RlJyxcbiAgICB0cnk6IFtcbiAgICAgIC8vIG5vZGUtZ3lwJ3MgbGlua2VkIHZlcnNpb24gaW4gdGhlIFwiYnVpbGRcIiBkaXJcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIG5vZGUtd2FmIGFuZCBneXBfYWRkb24gKGEuay5hIG5vZGUtZ3lwKVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBEZWJ1ZyBmaWxlcywgZm9yIGRldmVsb3BtZW50IChsZWdhY3kgYmVoYXZpb3IsIHJlbW92ZSBmb3Igbm9kZSB2MC45KVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdvdXQnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIFJlbGVhc2UgZmlsZXMsIGJ1dCBtYW51YWxseSBjb21waWxlZCAobGVnYWN5IGJlaGF2aW9yLCByZW1vdmUgZm9yIG5vZGUgdjAuOSlcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnb3V0JywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnUmVsZWFzZScsICdiaW5kaW5ncyddLFxuICAgICAgLy8gTGVnYWN5IGZyb20gbm9kZS13YWYsIG5vZGUgPD0gMC40LnhcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnZGVmYXVsdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gUHJvZHVjdGlvbiBcIlJlbGVhc2VcIiBidWlsZHR5cGUgYmluYXJ5IChtZWguLi4pXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2NvbXBpbGVkJywgJ3ZlcnNpb24nLCAncGxhdGZvcm0nLCAnYXJjaCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1xYnMgYnVpbGRzXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ3JlbGVhc2UnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ2RlYnVnJywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdhZGRvbi1idWlsZCcsICdkZWZhdWx0JywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1wcmUtZ3lwIHBhdGggLi9saWIvYmluZGluZy97bm9kZV9hYml9LXtwbGF0Zm9ybX0te2FyY2h9XG4gICAgICBbJ21vZHVsZV9yb290JywgJ2xpYicsICdiaW5kaW5nJywgJ25vZGVQcmVHeXAnLCAnYmluZGluZ3MnXVxuICAgIF1cbiAgfTtcblxuLyoqXG4gKiBUaGUgbWFpbiBgYmluZGluZ3MoKWAgZnVuY3Rpb24gbG9hZHMgdGhlIGNvbXBpbGVkIGJpbmRpbmdzIGZvciBhIGdpdmVuIG1vZHVsZS5cbiAqIEl0IHVzZXMgVjgncyBFcnJvciBBUEkgdG8gZGV0ZXJtaW5lIHRoZSBwYXJlbnQgZmlsZW5hbWUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBiZWluZyBpbnZva2VkIGZyb20sIHdoaWNoIGlzIHRoZW4gdXNlZCB0byBmaW5kIHRoZSByb290IGRpcmVjdG9yeS5cbiAqL1xuXG5mdW5jdGlvbiBiaW5kaW5ncyhvcHRzKSB7XG4gIC8vIEFyZ3VtZW50IHN1cmdlcnlcbiAgaWYgKHR5cGVvZiBvcHRzID09ICdzdHJpbmcnKSB7XG4gICAgb3B0cyA9IHsgYmluZGluZ3M6IG9wdHMgfTtcbiAgfSBlbHNlIGlmICghb3B0cykge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIC8vIG1hcHMgYGRlZmF1bHRzYCBvbnRvIGBvcHRzYCBvYmplY3RcbiAgT2JqZWN0LmtleXMoZGVmYXVsdHMpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgaWYgKCEoaSBpbiBvcHRzKSkgb3B0c1tpXSA9IGRlZmF1bHRzW2ldO1xuICB9KTtcblxuICAvLyBHZXQgdGhlIG1vZHVsZSByb290XG4gIGlmICghb3B0cy5tb2R1bGVfcm9vdCkge1xuICAgIG9wdHMubW9kdWxlX3Jvb3QgPSBleHBvcnRzLmdldFJvb3QoZXhwb3J0cy5nZXRGaWxlTmFtZSgpKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGUgZ2l2ZW4gYmluZGluZ3MgbmFtZSBlbmRzIHdpdGggLm5vZGVcbiAgaWYgKHBhdGguZXh0bmFtZShvcHRzLmJpbmRpbmdzKSAhPSAnLm5vZGUnKSB7XG4gICAgb3B0cy5iaW5kaW5ncyArPSAnLm5vZGUnO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2svd2VicGFjay9pc3N1ZXMvNDE3NSNpc3N1ZWNvbW1lbnQtMzQyOTMxMDM1XG4gIHZhciByZXF1aXJlRnVuYyA9XG4gICAgdHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gPT09ICdmdW5jdGlvbidcbiAgICAgID8gX19ub25fd2VicGFja19yZXF1aXJlX19cbiAgICAgIDogcmVxdWlyZTtcblxuICB2YXIgdHJpZXMgPSBbXSxcbiAgICBpID0gMCxcbiAgICBsID0gb3B0cy50cnkubGVuZ3RoLFxuICAgIG4sXG4gICAgYixcbiAgICBlcnI7XG5cbiAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICBuID0gam9pbi5hcHBseShcbiAgICAgIG51bGwsXG4gICAgICBvcHRzLnRyeVtpXS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgICByZXR1cm4gb3B0c1twXSB8fCBwO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRyaWVzLnB1c2gobik7XG4gICAgdHJ5IHtcbiAgICAgIGIgPSBvcHRzLnBhdGggPyByZXF1aXJlRnVuYy5yZXNvbHZlKG4pIDogcmVxdWlyZUZ1bmMobik7XG4gICAgICBpZiAoIW9wdHMucGF0aCkge1xuICAgICAgICBiLnBhdGggPSBuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnICYmXG4gICAgICAgICAgZS5jb2RlICE9PSAnUVVBTElGSUVEX1BBVEhfUkVTT0xVVElPTl9GQUlMRUQnICYmXG4gICAgICAgICAgIS9ub3QgZmluZC9pLnRlc3QoZS5tZXNzYWdlKSkge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVyciA9IG5ldyBFcnJvcihcbiAgICAnQ291bGQgbm90IGxvY2F0ZSB0aGUgYmluZGluZ3MgZmlsZS4gVHJpZWQ6XFxuJyArXG4gICAgICB0cmllc1xuICAgICAgICAubWFwKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICByZXR1cm4gb3B0cy5hcnJvdyArIGE7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICApO1xuICBlcnIudHJpZXMgPSB0cmllcztcbiAgdGhyb3cgZXJyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYmluZGluZ3M7XG5cbi8qKlxuICogR2V0cyB0aGUgZmlsZW5hbWUgb2YgdGhlIEphdmFTY3JpcHQgZmlsZSB0aGF0IGludm9rZXMgdGhpcyBmdW5jdGlvbi5cbiAqIFVzZWQgdG8gaGVscCBmaW5kIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZS5cbiAqIE9wdGlvbmFsbHkgYWNjZXB0cyBhbiBmaWxlbmFtZSBhcmd1bWVudCB0byBza2lwIHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgaW52b2tpbmcgZmlsZW5hbWVcbiAqL1xuXG5leHBvcnRzLmdldEZpbGVOYW1lID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUoY2FsbGluZ19maWxlKSB7XG4gIHZhciBvcmlnUFNUID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UsXG4gICAgb3JpZ1NUTCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdCxcbiAgICBkdW1teSA9IHt9LFxuICAgIGZpbGVOYW1lO1xuXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IDEwO1xuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24oZSwgc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZmlsZU5hbWUgPSBzdFtpXS5nZXRGaWxlTmFtZSgpO1xuICAgICAgaWYgKGZpbGVOYW1lICE9PSBfX2ZpbGVuYW1lKSB7XG4gICAgICAgIGlmIChjYWxsaW5nX2ZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZU5hbWUgIT09IGNhbGxpbmdfZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gcnVuIHRoZSAncHJlcGFyZVN0YWNrVHJhY2UnIGZ1bmN0aW9uIGFib3ZlXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KTtcbiAgZHVtbXkuc3RhY2s7XG5cbiAgLy8gY2xlYW51cFxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IG9yaWdQU1Q7XG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9yaWdTVEw7XG5cbiAgLy8gaGFuZGxlIGZpbGVuYW1lIHRoYXQgc3RhcnRzIHdpdGggXCJmaWxlOi8vXCJcbiAgdmFyIGZpbGVTY2hlbWEgPSAnZmlsZTovLyc7XG4gIGlmIChmaWxlTmFtZS5pbmRleE9mKGZpbGVTY2hlbWEpID09PSAwKSB7XG4gICAgZmlsZU5hbWUgPSBmaWxlVVJMVG9QYXRoKGZpbGVOYW1lKTtcbiAgfVxuXG4gIHJldHVybiBmaWxlTmFtZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgYSBtb2R1bGUsIGdpdmVuIGFuIGFyYml0cmFyeSBmaWxlbmFtZVxuICogc29tZXdoZXJlIGluIHRoZSBtb2R1bGUgdHJlZS4gVGhlIFwicm9vdCBkaXJlY3RvcnlcIiBpcyB0aGUgZGlyZWN0b3J5XG4gKiBjb250YWluaW5nIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLlxuICpcbiAqICAgSW46ICAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZS9saWIvaW5kZXguanNcbiAqICAgT3V0OiAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZVxuICovXG5cbmV4cG9ydHMuZ2V0Um9vdCA9IGZ1bmN0aW9uIGdldFJvb3QoZmlsZSkge1xuICB2YXIgZGlyID0gZGlybmFtZShmaWxlKSxcbiAgICBwcmV2O1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChkaXIgPT09ICcuJykge1xuICAgICAgLy8gQXZvaWRzIGFuIGluZmluaXRlIGxvb3AgaW4gcmFyZSBjYXNlcywgbGlrZSB0aGUgUkVQTFxuICAgICAgZGlyID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgZXhpc3RzKGpvaW4oZGlyLCAncGFja2FnZS5qc29uJykpIHx8XG4gICAgICBleGlzdHMoam9pbihkaXIsICdub2RlX21vZHVsZXMnKSlcbiAgICApIHtcbiAgICAgIC8vIEZvdW5kIHRoZSAncGFja2FnZS5qc29uJyBmaWxlIG9yICdub2RlX21vZHVsZXMnIGRpcjsgd2UncmUgZG9uZVxuICAgICAgcmV0dXJuIGRpcjtcbiAgICB9XG4gICAgaWYgKHByZXYgPT09IGRpcikge1xuICAgICAgLy8gR290IHRvIHRoZSB0b3BcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIG1vZHVsZSByb290IGdpdmVuIGZpbGU6IFwiJyArXG4gICAgICAgICAgZmlsZSArXG4gICAgICAgICAgJ1wiLiBEbyB5b3UgaGF2ZSBhIGBwYWNrYWdlLmpzb25gIGZpbGU/ICdcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIFRyeSB0aGUgcGFyZW50IGRpciBuZXh0XG4gICAgcHJldiA9IGRpcjtcbiAgICBkaXIgPSBqb2luKGRpciwgJy4uJyk7XG4gIH1cbn07XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgc2VwID0gcmVxdWlyZSgncGF0aCcpLnNlcCB8fCAnLyc7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXJpVG9QYXRoO1xuXG4vKipcbiAqIEZpbGUgVVJJIHRvIFBhdGggZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaVxuICogQHJldHVybiB7U3RyaW5nfSBwYXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZpbGVVcmlUb1BhdGggKHVyaSkge1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHVyaSB8fFxuICAgICAgdXJpLmxlbmd0aCA8PSA3IHx8XG4gICAgICAnZmlsZTovLycgIT0gdXJpLnN1YnN0cmluZygwLCA3KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3QgcGFzcyBpbiBhIGZpbGU6Ly8gVVJJIHRvIGNvbnZlcnQgdG8gYSBmaWxlIHBhdGgnKTtcbiAgfVxuXG4gIHZhciByZXN0ID0gZGVjb2RlVVJJKHVyaS5zdWJzdHJpbmcoNykpO1xuICB2YXIgZmlyc3RTbGFzaCA9IHJlc3QuaW5kZXhPZignLycpO1xuICB2YXIgaG9zdCA9IHJlc3Quc3Vic3RyaW5nKDAsIGZpcnN0U2xhc2gpO1xuICB2YXIgcGF0aCA9IHJlc3Quc3Vic3RyaW5nKGZpcnN0U2xhc2ggKyAxKTtcblxuICAvLyAyLiAgU2NoZW1lIERlZmluaXRpb25cbiAgLy8gQXMgYSBzcGVjaWFsIGNhc2UsIDxob3N0PiBjYW4gYmUgdGhlIHN0cmluZyBcImxvY2FsaG9zdFwiIG9yIHRoZSBlbXB0eVxuICAvLyBzdHJpbmc7IHRoaXMgaXMgaW50ZXJwcmV0ZWQgYXMgXCJ0aGUgbWFjaGluZSBmcm9tIHdoaWNoIHRoZSBVUkwgaXNcbiAgLy8gYmVpbmcgaW50ZXJwcmV0ZWRcIi5cbiAgaWYgKCdsb2NhbGhvc3QnID09IGhvc3QpIGhvc3QgPSAnJztcblxuICBpZiAoaG9zdCkge1xuICAgIGhvc3QgPSBzZXAgKyBzZXAgKyBob3N0O1xuICB9XG5cbiAgLy8gMy4yICBEcml2ZXMsIGRyaXZlIGxldHRlcnMsIG1vdW50IHBvaW50cywgZmlsZSBzeXN0ZW0gcm9vdFxuICAvLyBEcml2ZSBsZXR0ZXJzIGFyZSBtYXBwZWQgaW50byB0aGUgdG9wIG9mIGEgZmlsZSBVUkkgaW4gdmFyaW91cyB3YXlzLFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGltcGxlbWVudGF0aW9uOyBzb21lIGFwcGxpY2F0aW9ucyBzdWJzdGl0dXRlXG4gIC8vIHZlcnRpY2FsIGJhciAoXCJ8XCIpIGZvciB0aGUgY29sb24gYWZ0ZXIgdGhlIGRyaXZlIGxldHRlciwgeWllbGRpbmdcbiAgLy8gXCJmaWxlOi8vL2N8L3RtcC90ZXN0LnR4dFwiLiAgSW4gc29tZSBjYXNlcywgdGhlIGNvbG9uIGlzIGxlZnRcbiAgLy8gdW5jaGFuZ2VkLCBhcyBpbiBcImZpbGU6Ly8vYzovdG1wL3Rlc3QudHh0XCIuICBJbiBvdGhlciBjYXNlcywgdGhlXG4gIC8vIGNvbG9uIGlzIHNpbXBseSBvbWl0dGVkLCBhcyBpbiBcImZpbGU6Ly8vYy90bXAvdGVzdC50eHRcIi5cbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXiguKylcXHwvLCAnJDE6Jyk7XG5cbiAgLy8gZm9yIFdpbmRvd3MsIHdlIG5lZWQgdG8gaW52ZXJ0IHRoZSBwYXRoIHNlcGFyYXRvcnMgZnJvbSB3aGF0IGEgVVJJIHVzZXNcbiAgaWYgKHNlcCA9PSAnXFxcXCcpIHtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcbiAgfVxuXG4gIGlmICgvXi4rXFw6Ly50ZXN0KHBhdGgpKSB7XG4gICAgLy8gaGFzIFdpbmRvd3MgZHJpdmUgYXQgYmVnaW5uaW5nIG9mIHBhdGhcbiAgfSBlbHNlIHtcbiAgICAvLyB1bml4IHBhdGjigKZcbiAgICBwYXRoID0gc2VwICsgcGF0aDtcbiAgfVxuXG4gIHJldHVybiBob3N0ICsgcGF0aDtcbn1cbiIsIi8qIEZpbGU6ICAgICAgU2lkZUVmZmVjdHMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IFwiLi4vTWVzc2FnZUxvb3BcIjtcbmltcG9ydCBcIi4uL0hvb2tcIjtcbmltcG9ydCBcIi4uL05vZGVJcGNcIjtcbmltcG9ydCBcIi4uL0tleWJvYXJkXCI7XG5pbXBvcnQgXCIuLi9Nb25pdG9yXCI7XG5pbXBvcnQgXCIuLi9UcmVlXCI7XG5cbnNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbntcbiAgICBpbXBvcnQoXCIuLi9NYWluV2luZG93XCIpO1xuICAgIGltcG9ydChcIi4uL1JlbmRlcmVyRnVuY3Rpb25zLkdlbmVyYXRlZFwiKTtcbiAgICBpbXBvcnQoXCIuL0luaXRpYWxpemF0aW9uXCIpO1xuICAgIGltcG9ydChcIi4vVHJheVwiKTtcbn0pO1xuXG4iLCIvKiBGaWxlOiAgICB1dGlsLnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCB7IFVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEhIYW5kbGUgfSBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNvbHZlSHRtbFBhdGgoSHRtbEZpbGVOYW1lOiBzdHJpbmcsIENvbXBvbmVudD86IHN0cmluZylcbntcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIilcbiAgICB7XG4gICAgICAgIGNvbnN0IFBvcnQ6IHN0cmluZyB8IG51bWJlciA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMTIxMjtcbiAgICAgICAgY29uc3QgVXJsOiBVUkwgPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7IFBvcnQgfWApO1xuICAgICAgICBVcmwucGF0aG5hbWUgPSBIdG1sRmlsZU5hbWU7XG4gICAgICAgIHJldHVybiBVcmwuaHJlZjtcbiAgICB9XG4gICAgY29uc3QgQmFzZVBhdGg6IHN0cmluZyA9IGBmaWxlOi8vJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL1JlbmRlcmVyL1wiLCBIdG1sRmlsZU5hbWUpfWA7XG4gICAgaWYgKENvbXBvbmVudCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50QXJndW1lbnQ6IHN0cmluZyA9IGA/Q29tcG9uZW50PSR7IENvbXBvbmVudCB9YDtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoICsgQ29tcG9uZW50QXJndW1lbnQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBCYXNlUGF0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBBcmVIYW5kbGVzRXF1YWwgPSAoQTogSEhhbmRsZSwgQjogSEhhbmRsZSk6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gQS5IYW5kbGUgPT09IEIuSGFuZGxlO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgRGlzcGF0Y2hlci50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBUU3Vic2NyaXB0aW9uSGFuZGxlPFQ+ID1cbntcbiAgICBTdWJzY3JpYmUoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyO1xuICAgIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkO1xufTtcblxuZXhwb3J0IGNsYXNzIFREaXNwYXRjaGVyPFQ+XG57XG4gICAgcHJpdmF0ZSBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgTGlzdGVuZXJzOiBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFQpID0+IHZvaWQ+ID0gbmV3IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4oKTtcblxuICAgIHB1YmxpYyBHZXRIYW5kbGUgPSAoKTogVFN1YnNjcmlwdGlvbkhhbmRsZTxUPiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgU3Vic2NyaWJlID0gKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUKSA9PiB2b2lkKSk6IG51bWJlciA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBJZDogbnVtYmVyID0gdGhpcy5OZXh0TGlzdGVuZXJJZCsrO1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuc2V0KElkLCBDYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gSWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgVW5zdWJzY3JpYmUgPSAoSWQ6IG51bWJlcik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZGVsZXRlKElkKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgU3Vic2NyaWJlLFxuICAgICAgICAgICAgVW5zdWJzY3JpYmVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgRGlzcGF0Y2ggPSAoTWVzc2FnZTogVCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmICh0aGlzLkxpc3RlbmVycy5zaXplID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuZXhwb3J0IGNsYXNzIFREaXNwYXRjaGVyX0RFUFJFQ0FURUQ8VCA9IHVua25vd24+XG57XG4gICAgcHJpdmF0ZSBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgTGlzdGVuZXJzOiBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFQpID0+IHZvaWQ+ID0gbmV3IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4oKTtcblxuICAgIHB1YmxpYyBTdWJzY3JpYmUoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyXG4gICAge1xuICAgICAgICBjb25zdCBJZDogbnVtYmVyID0gdGhpcy5OZXh0TGlzdGVuZXJJZCsrO1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIElkO1xuICAgIH1cblxuICAgIHB1YmxpYyBVbnN1YnNjcmliZShJZDogbnVtYmVyKTogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZGVsZXRlKElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgRGlzcGF0Y2ggPSAoTWVzc2FnZTogVCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmICh0aGlzLkxpc3RlbmVycy5zaXplID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsImltcG9ydCB7IEluaXRpYWxpemVIb29rcyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcblxuSW5pdGlhbGl6ZUhvb2tzKCk7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleWJvYXJkRXZlbnQgfSBmcm9tIFwiLi9LZXlib2FyZC5UeXBlc1wiO1xuaW1wb3J0IHsgU3Vic2NyaWJlIGFzIElwY1N1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IElzVmlydHVhbEtleSB9IGZyb20gXCJAL0RvbWFpbi9Db21tb24vQ29tcG9uZW50L0tleWJvYXJkL0tleWJvYXJkXCI7XG5pbXBvcnQgeyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEIH0gZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuXG5jbGFzcyBGS2V5Ym9hcmQgZXh0ZW5kcyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEPEZLZXlib2FyZEV2ZW50Plxue1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgSXNLZXlEb3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBgT25LZXlgIHNob3VsZCBjb250aW51ZS4gKi9cbiAgICBwcml2YXRlIERlYm91bmNlID0gKFN0YXRlOiBGS2V5Ym9hcmRFdmVudFtcIlN0YXRlXCJdKTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKFN0YXRlID09PSBcIkRvd25cIilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLklzS2V5RG93bilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5Jc0tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBPbktleSA9ICguLi5EYXRhOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEV2ZW50OiBGS2V5Ym9hcmRFdmVudCA9IERhdGFbMF0gYXMgRktleWJvYXJkRXZlbnQ7XG4gICAgICAgIGNvbnN0IElzRGVib3VuY2VkOiBib29sZWFuID0gdGhpcy5EZWJvdW5jZShFdmVudC5TdGF0ZSk7XG4gICAgICAgIGlmIChJc0RlYm91bmNlZCAmJiBJc1ZpcnR1YWxLZXkoRXZlbnQuVmtDb2RlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5EaXNwYXRjaChFdmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgY29uc3QgS2V5Ym9hcmQ6IEZLZXlib2FyZCA9IG5ldyBGS2V5Ym9hcmQoKTtcbklwY1N1YnNjcmliZShcIktleWJvYXJkXCIsIEtleWJvYXJkLk9uS2V5KTtcbiIsIi8qIEZpbGU6ICAgICAgTWFpbi50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCBcIi4vQ29yZS9TaWRlRWZmZWN0c1wiO1xuIiwiLyogRmlsZTogICAgICBNZXNzYWdlTG9vcC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbi8qKiBUaGlzIGZpbGUgbXVzdCBiZSBzaWRlLWVmZmVjdCBpbXBvcnRlZCBieSBgTWFpbmAuICovXG5cbmltcG9ydCB7IEluaXRpYWxpemVNZXNzYWdlTG9vcCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcblxuY29uc3QgUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wID0gKCk6IHZvaWQgPT5cbntcbiAgICBJbml0aWFsaXplTWVzc2FnZUxvb3AoKCkgPT4geyB9KTtcbn07XG5cblJ1bkluaXRpYWxpemVNZXNzYWdlTG9vcCgpO1xuIiwiLyogRmlsZTogICAgICBNb25pdG9yLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB7IHR5cGUgRk1vbml0b3JJbmZvLCBJbml0aWFsaXplTW9uaXRvcnMgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgfSBmcm9tIFwiLi9Ob2RlSXBjXCI7XG5pbXBvcnQgeyBURGlzcGF0Y2hlciwgdHlwZSBUU3Vic2NyaXB0aW9uSGFuZGxlIH0gZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuXG5jb25zdCBNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IFsgXTtcblxuZXhwb3J0IGNvbnN0IEdldE1vbml0b3JzID0gKCk6IEFycmF5PEZNb25pdG9ySW5mbz4gPT5cbntcbiAgICByZXR1cm4gWyAuLi5Nb25pdG9ycyBdO1xufTtcblxuY29uc3QgTW9uaXRvcnNEaXNwYXRjaGVyOiBURGlzcGF0Y2hlcjxBcnJheTxGTW9uaXRvckluZm8+PiA9IG5ldyBURGlzcGF0Y2hlcjxBcnJheTxGTW9uaXRvckluZm8+PigpO1xuZXhwb3J0IGNvbnN0IE1vbml0b3JzSGFuZGxlOiBUU3Vic2NyaXB0aW9uSGFuZGxlPEFycmF5PEZNb25pdG9ySW5mbz4+ID0gTW9uaXRvcnNEaXNwYXRjaGVyLkdldEhhbmRsZSgpO1xuXG5jb25zdCBPbk1vbml0b3JzQ2hhbmdlZCA9ICguLi5EYXRhOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbntcbiAgICBjb25zdCBOZXdNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IERhdGFbMF0gYXMgQXJyYXk8Rk1vbml0b3JJbmZvPjtcbiAgICBNb25pdG9ycy5sZW5ndGggPSAwO1xuICAgIE1vbml0b3JzLnB1c2goLi4uTmV3TW9uaXRvcnMpO1xuICAgIE1vbml0b3JzRGlzcGF0Y2hlci5EaXNwYXRjaChOZXdNb25pdG9ycyk7XG59O1xuXG5jb25zdCBJbml0aWFsaXplTW9uaXRvclRyYWNraW5nID0gKCk6IHZvaWQgPT5cbntcbiAgICBNb25pdG9ycy5wdXNoKC4uLkluaXRpYWxpemVNb25pdG9ycygpKTtcbiAgICBTdWJzY3JpYmUoXCJNb25pdG9yc1wiLCBPbk1vbml0b3JzQ2hhbmdlZCk7XG59O1xuXG5Jbml0aWFsaXplTW9uaXRvclRyYWNraW5nKCk7XG4iLCIvKiBGaWxlOiAgICAgIE5vZGVJcGMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSXBjQ2FsbGJhY2ssIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQgfSBmcm9tIFwiLi9Ob2RlSXBjLlR5cGVzXCI7XG5pbXBvcnQgeyBJbml0aWFsaXplSXBjIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5sZXQgTmV4dExpc3RlbmVySWQ6IG51bWJlciA9IDA7XG5jb25zdCBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQ+ID0gbmV3IE1hcDxudW1iZXIsIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQ+KCk7XG5cbmV4cG9ydCBjb25zdCBTdWJzY3JpYmUgPSAoQ2hhbm5lbDogc3RyaW5nLCBDYWxsYmFjazogRklwY0NhbGxiYWNrKTogbnVtYmVyID0+XG57XG4gICAgY29uc3QgSWQ6IG51bWJlciA9IE5leHRMaXN0ZW5lcklkKys7XG4gICAgTGlzdGVuZXJzLnNldChJZCwgeyBDYWxsYmFjaywgQ2hhbm5lbCB9KTtcbiAgICByZXR1cm4gSWQ7XG59O1xuXG5leHBvcnQgY29uc3QgVW5zdWJzY3JpYmUgPSAoSWQ6IG51bWJlcik6IHZvaWQgPT5cbntcbiAgICBMaXN0ZW5lcnMuZGVsZXRlKElkKTtcbn07XG5cbmZ1bmN0aW9uIE9uTWVzc2FnZShDaGFubmVsOiBzdHJpbmcsIE1lc3NhZ2U6IHVua25vd24pXG57XG4gICAgTGlzdGVuZXJzLmZvckVhY2goKENhbGxiYWNrOiBGSXBjQ2FsbGJhY2tTZXJpYWxpemVkKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKENhbGxiYWNrLkNoYW5uZWwgPT09IENoYW5uZWwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrLkNhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbkluaXRpYWxpemVJcGMoT25NZXNzYWdlKTtcbiIsIi8qIEZpbGU6ICAgICAgVHJlZS50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gICAgRkNlbGwsXG4gICAgRkZvcmVzdCxcbiAgICBGUGFuZWwsXG4gICAgRlBhbmVsQmFzZSxcbiAgICBGUGFuZWxIb3Jpem9udGFsLFxuICAgIEZWZXJ0ZXggfSBmcm9tIFwiLi9UcmVlLlR5cGVzXCI7XG5pbXBvcnQge1xuICAgIHR5cGUgRk1vbml0b3JJbmZvLFxuICAgIEdldFRpbGVhYmxlV2luZG93cyxcbiAgICBHZXRNb25pdG9yRnJvbVdpbmRvdyxcbiAgICB0eXBlIEhNb25pdG9yLFxuICAgIHR5cGUgSFdpbmRvdyxcbiAgICBTZXRXaW5kb3dQb3NpdGlvbixcbiAgICBHZXRXaW5kb3dCeU5hbWUsXG4gICAgR2V0V2luZG93VGl0bGV9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEdldE1vbml0b3JzIH0gZnJvbSBcIi4vTW9uaXRvclwiO1xuaW1wb3J0IHsgQXJlSGFuZGxlc0VxdWFsIH0gZnJvbSBcIi4vQ29yZS9VdGlsaXR5XCI7XG5cbmNvbnN0IEZvcmVzdDogRkZvcmVzdCA9IFsgXTtcblxuZXhwb3J0IGNvbnN0IEdldEZvcmVzdCA9ICgpOiBGRm9yZXN0ID0+XG57XG4gICAgcmV0dXJuIFsgLi4uRm9yZXN0IF07XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBMb2dGb3Jlc3QgPSAoKTogdm9pZCA9Plxue1xufTtcblxuY29uc3QgQ2VsbCA9IChIYW5kbGU6IEhXaW5kb3cpOiBGQ2VsbCA9Plxue1xuICAgIHJldHVybiB7XG4gICAgICAgIEhhbmRsZSxcbiAgICAgICAgU2l6ZTogeyBIZWlnaHQ6IDAsIFdpZHRoOiAwLCBYOiAwLCBZOiAwIH0sXG4gICAgICAgIFpPcmRlcjogMFxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgVXBkYXRlRm9yZXN0ID0gKFVwZGF0ZUZ1bmN0aW9uOiAoT2xkRm9yZXN0OiBGRm9yZXN0KSA9PiBGRm9yZXN0KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE5ld0ZvcmVzdDogRkZvcmVzdCA9IFVwZGF0ZUZ1bmN0aW9uKFsgLi4uRm9yZXN0IF0pO1xuICAgIEZvcmVzdC5sZW5ndGggPSAwO1xuICAgIEZvcmVzdC5wdXNoKC4uLk5ld0ZvcmVzdCk7XG5cbiAgICAvLyBAVE9ETyBNb3ZlIGFuZCByZXNpemUsIGFuZCBzb3J0IFpPcmRlciBvZiBhbGwgd2luZG93cyBiZWluZyB0aWxlZCBieSBTb3JyZWxsV20uXG59O1xuXG5jb25zdCBJbml0aWFsaXplVHJlZSA9ICgpOiB2b2lkID0+XG57XG4gICAgY29uc3QgTW9uaXRvcnM6IEFycmF5PEZNb25pdG9ySW5mbz4gPSBHZXRNb25pdG9ycygpO1xuXG4gICAgY29uc29sZS5sb2coTW9uaXRvcnMpO1xuXG4gICAgRm9yZXN0LnB1c2goLi4uTW9uaXRvcnMubWFwKChNb25pdG9yOiBGTW9uaXRvckluZm8pOiBGUGFuZWxIb3Jpem9udGFsID0+XG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhgSGVyZSwgTW9uaXRvckhhbmRsZSBpcyAkeyBNb25pdG9yLkhhbmRsZSB9LmApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgQ2hpbGRyZW46IFsgXSxcbiAgICAgICAgICAgIE1vbml0b3JJZDogTW9uaXRvci5IYW5kbGUsXG4gICAgICAgICAgICBTaXplOiBNb25pdG9yLlNpemUsXG4gICAgICAgICAgICBUeXBlOiBcIkhvcml6b250YWxcIixcbiAgICAgICAgICAgIFpPcmRlcjogMFxuICAgICAgICB9O1xuICAgIH0pKTtcblxuICAgIGNvbnNvbGUubG9nKEZvcmVzdCk7XG5cbiAgICBjb25zdCBUaWxlYWJsZVdpbmRvd3M6IEFycmF5PEhXaW5kb3c+ID0gR2V0VGlsZWFibGVXaW5kb3dzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhgRm91bmQgJHsgVGlsZWFibGVXaW5kb3dzLmxlbmd0aCB9IHRpbGVhYmxlIHdpbmRvd3MuYCk7XG5cbiAgICBUaWxlYWJsZVdpbmRvd3MuZm9yRWFjaCgoSGFuZGxlOiBIV2luZG93KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgTW9uaXRvcjogSE1vbml0b3IgPSBHZXRNb25pdG9yRnJvbVdpbmRvdyhIYW5kbGUpO1xuICAgICAgICBjb25zdCBSb290UGFuZWw6IEZQYW5lbEJhc2UgfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgRm9yZXN0LmZpbmQoKFBhbmVsOiBGUGFuZWxCYXNlKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBNb25pdG9yIGlzICR7IEpTT04uc3RyaW5naWZ5KE1vbml0b3IpIH0gYW5kIFBhbmVsLk1vbml0b3JJZCBpcyAkeyBKU09OLnN0cmluZ2lmeShQYW5lbC5Nb25pdG9ySWQpIH0uYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgSW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgICAgICAgICAgTW9uaXRvcnMuZmluZCgoRm9vOiBGTW9uaXRvckluZm8pOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBGb28uSGFuZGxlLkhhbmRsZSA9PT0gUGFuZWwuTW9uaXRvcklkPy5IYW5kbGU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFNpemUgJHsgSlNPTi5zdHJpbmdpZnkoSW5mbz8uU2l6ZSkgfSBXb3JrU2l6ZSAkeyBKU09OLnN0cmluZ2lmeShJbmZvPy5Xb3JrU2l6ZSkgfS5gKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBQYW5lbC5Nb25pdG9ySWQ/LkhhbmRsZSA9PT0gTW9uaXRvci5IYW5kbGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoUm9vdFBhbmVsID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEBUT0RPXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIvCfkqHwn5Kh8J+SofCfkqEgUm9vdFBhbmVsIHdhcyB1bmRlZmluZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgUm9vdFBhbmVsLkNoaWxkcmVuLnB1c2goQ2VsbChIYW5kbGUpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgRm9yZXN0LmZvckVhY2goKFBhbmVsOiBGUGFuZWwpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9ySW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIE1vbml0b3JzLmZpbmQoKEluTW9uaXRvcjogRk1vbml0b3JJbmZvKTogYm9vbGVhbiA9PiBJbk1vbml0b3IuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQpO1xuXG4gICAgICAgIGlmIChNb25pdG9ySW5mbyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBAVE9ET1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgUGFuZWwuQ2hpbGRyZW4gPSBQYW5lbC5DaGlsZHJlbi5tYXAoKENoaWxkOiBGVmVydGV4LCBJbmRleDogbnVtYmVyKTogRlZlcnRleCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFVuaWZvcm1XaWR0aDogbnVtYmVyID0gTW9uaXRvckluZm8uV29ya1NpemUuV2lkdGggLyBQYW5lbC5DaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgT3V0Q2hpbGQ6IEZWZXJ0ZXggPSB7IC4uLkNoaWxkIH07XG4gICAgICAgICAgICAgICAgT3V0Q2hpbGQuU2l6ZSA9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAuLi5Nb25pdG9ySW5mby5Xb3JrU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgV2lkdGg6IFVuaWZvcm1XaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgWDogVW5pZm9ybVdpZHRoICogSW5kZXggKyBNb25pdG9ySW5mby5Xb3JrU2l6ZS5YXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPdXRDaGlsZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBDZWxsczogQXJyYXk8RkNlbGw+ID0gR2V0QWxsQ2VsbHMoRm9yZXN0KTtcblxuICAgIENlbGxzLmZvckVhY2goKENlbGw6IEZDZWxsKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coYFNldHRpbmcgcG9zaXRpb24gb2YgJHsgR2V0V2luZG93VGl0bGUoQ2VsbC5IYW5kbGUpIH0gdG8gJHsgSlNPTi5zdHJpbmdpZnkoQ2VsbC5TaXplKSB9LmApO1xuICAgICAgICBTZXRXaW5kb3dQb3NpdGlvbihDZWxsLkhhbmRsZSwgQ2VsbC5TaXplKTtcbiAgICAgICAgLyogQXQgbGVhc3QgZm9yIG5vdywgaWdub3JlIFNvcnJlbGxXbSB3aW5kb3dzLiAqL1xuICAgICAgICAvLyBpZiAoR2V0V2luZG93VGl0bGUoQ2VsbC5IYW5kbGUpICE9PSBcIlNvcnJlbGxXbVwiKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBTZXRXaW5kb3dQb3NpdGlvbihDZWxsLkhhbmRsZSwgQ2VsbC5TaXplKTtcbiAgICAgICAgLy8gfVxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coYENhbGxlZCBTZXRXaW5kb3dQb3NpdGlvbiBmb3IgJHsgQ2VsbHMubGVuZ3RoIH0gd2luZG93cy5gKTtcbn07XG5cbmNvbnN0IElzQ2VsbCA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiBWZXJ0ZXggaXMgRkNlbGwgPT5cbntcbiAgICByZXR1cm4gXCJIYW5kbGVcIiBpbiBWZXJ0ZXg7XG59O1xuXG4vKipcbiAqIFJ1biBhIGZ1bmN0aW9uIGZvciBlYWNoIHZlcnRleCB1bnRpbCB0aGUgZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgIGZvclxuICogYW4gaXRlcmF0aW9uLlxuICovXG5leHBvcnQgY29uc3QgVHJhdmVyc2UgPSAoSW5GdW5jdGlvbjogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IHZvaWQgPT5cbntcbiAgICBsZXQgQ29udGludWVzOiBib29sZWFuID0gdHJ1ZTtcbiAgICBjb25zdCBSZWN1cnJlbmNlID0gKFZlcnRleDogRlZlcnRleCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmIChDb250aW51ZXMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENvbnRpbnVlcyA9IEluRnVuY3Rpb24oVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChDb250aW51ZXMgJiYgXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlY3VycmVuY2UoQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IFBhbmVsIG9mIEZvcmVzdClcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgQ2hpbGQgb2YgUGFuZWwuQ2hpbGRyZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlY3VycmVuY2UoQ2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuY29uc3QgR2V0QWxsQ2VsbHMgPSAoUGFuZWxzOiBBcnJheTxGUGFuZWw+KTogQXJyYXk8RkNlbGw+ID0+XG57XG4gICAgY29uc3QgUmVzdWx0OiBBcnJheTxGQ2VsbD4gPSBbIF07XG5cbiAgICBmdW5jdGlvbiBUcmF2ZXJzZShWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkXG4gICAge1xuICAgICAgICBpZiAoXCJIYW5kbGVcIiBpbiBWZXJ0ZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlc3VsdC5wdXNoKFZlcnRleCBhcyBGQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVHJhdmVyc2UoQ2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBQYW5lbHMpXG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFBhbmVsLkNoaWxkcmVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBUcmF2ZXJzZShDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IEV4aXN0cyA9IChQcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuID0+XG57XG4gICAgbGV0IERvZXNFeGlzdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoIURvZXNFeGlzdClcbiAgICAgICAge1xuICAgICAgICAgICAgRG9lc0V4aXN0ID0gUHJlZGljYXRlKFZlcnRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIURvZXNFeGlzdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBEb2VzRXhpc3Q7XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBFeGlzdHNFeGFjdGx5T25lID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgRm9yQWxsID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgSXNXaW5kb3dUaWxlZCA9IChIYW5kbGU6IEhXaW5kb3cpOiBib29sZWFuID0+XG57XG4gICAgcmV0dXJuIEV4aXN0cygoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIElzQ2VsbChWZXJ0ZXgpICYmIEFyZUhhbmRsZXNFcXVhbChWZXJ0ZXguSGFuZGxlLCBIYW5kbGUpO1xuICAgIH0pO1xufTtcblxuSW5pdGlhbGl6ZVRyZWUoKTtcbiIsIi8qIEZpbGU6ICAgICAgS2V5Ym9hcmQudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5SWQsIEZWaXJ0dWFsS2V5IH0gZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcblxuLyogZXNsaW50LWRpc2FibGUgc29ydC1rZXlzICovXG5cbi8qKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgb2Yga2V5IGNvZGVzLiAqL1xuY29uc3QgS2V5SWRzQnlJZDogUmVhZG9ubHk8UmVjb3JkPEZWaXJ0dWFsS2V5LCBGS2V5SWQ+PiA9XG57XG4gICAgMHgwNTogXCJNb3VzZVgxXCIsXG4gICAgMHgwNjogXCJNb3VzZVgyXCIsXG4gICAgMHgwODogXCJCYWNrc3BhY2VcIixcbiAgICAweDA5OiBcIlRhYlwiLFxuICAgIDB4MEQ6IFwiRW50ZXJcIixcbiAgICAweDEwOiBcIlNoaWZ0XCIsXG4gICAgMHgxMTogXCJDdHJsXCIsXG4gICAgMHgxMjogXCJBbHRcIixcbiAgICAweDEzOiBcIlBhdXNlXCIsXG4gICAgMHgyMDogXCJTcGFjZVwiLFxuICAgIDB4MjE6IFwiUGdVcFwiLFxuICAgIDB4MjI6IFwiUGdEb3duXCIsXG4gICAgMHgyMzogXCJFbmRcIixcbiAgICAweDI0OiBcIkhvbWVcIixcbiAgICAweDI1OiBcIkxlZnRBcnJvd1wiLFxuICAgIDB4MjY6IFwiVXBBcnJvd1wiLFxuICAgIDB4Mjc6IFwiUmlnaHRBcnJvd1wiLFxuICAgIDB4Mjg6IFwiRG93bkFycm93XCIsXG4gICAgMHgyRDogXCJJbnNcIixcbiAgICAweDJFOiBcIkRlbFwiLFxuICAgIDB4MzA6IFwiMFwiLFxuICAgIDB4MzE6IFwiMVwiLFxuICAgIDB4MzI6IFwiMlwiLFxuICAgIDB4MzM6IFwiM1wiLFxuICAgIDB4MzQ6IFwiNFwiLFxuICAgIDB4MzU6IFwiNVwiLFxuICAgIDB4MzY6IFwiNlwiLFxuICAgIDB4Mzc6IFwiN1wiLFxuICAgIDB4Mzg6IFwiOFwiLFxuICAgIDB4Mzk6IFwiOVwiLFxuICAgIDB4NDE6IFwiQVwiLFxuICAgIDB4NDI6IFwiQlwiLFxuICAgIDB4NDM6IFwiQ1wiLFxuICAgIDB4NDQ6IFwiRFwiLFxuICAgIDB4NDU6IFwiRVwiLFxuICAgIDB4NDY6IFwiRlwiLFxuICAgIDB4NDc6IFwiR1wiLFxuICAgIDB4NDg6IFwiSFwiLFxuICAgIDB4NDk6IFwiSVwiLFxuICAgIDB4NEE6IFwiSlwiLFxuICAgIDB4NEI6IFwiS1wiLFxuICAgIDB4NEM6IFwiTFwiLFxuICAgIDB4NEQ6IFwiTVwiLFxuICAgIDB4NEU6IFwiTlwiLFxuICAgIDB4NEY6IFwiT1wiLFxuICAgIDB4NTA6IFwiUFwiLFxuICAgIDB4NTE6IFwiUVwiLFxuICAgIDB4NTI6IFwiUlwiLFxuICAgIDB4NTM6IFwiU1wiLFxuICAgIDB4NTQ6IFwiVFwiLFxuICAgIDB4NTU6IFwiVVwiLFxuICAgIDB4NTY6IFwiVlwiLFxuICAgIDB4NTc6IFwiV1wiLFxuICAgIDB4NTg6IFwiWFwiLFxuICAgIDB4NTk6IFwiWVwiLFxuICAgIDB4NUE6IFwiWlwiLFxuICAgIDB4NUI6IFwiTFdpblwiLFxuICAgIDB4NUM6IFwiUldpblwiLFxuICAgIDB4NUQ6IFwiQXBwbGljYXRpb25zXCIsXG4gICAgMHg2MDogXCJOdW0wXCIsXG4gICAgMHg2MTogXCJOdW0xXCIsXG4gICAgMHg2MjogXCJOdW0yXCIsXG4gICAgMHg2MzogXCJOdW0zXCIsXG4gICAgMHg2NDogXCJOdW00XCIsXG4gICAgMHg2NTogXCJOdW01XCIsXG4gICAgMHg2NjogXCJOdW02XCIsXG4gICAgMHg2NzogXCJOdW03XCIsXG4gICAgMHg2ODogXCJOdW04XCIsXG4gICAgMHg2OTogXCJOdW05XCIsXG4gICAgMHg2QTogXCJNdWx0aXBseVwiLFxuICAgIDB4NkI6IFwiQWRkXCIsXG4gICAgMHg2RDogXCJTdWJ0cmFjdFwiLFxuICAgIDB4NkU6IFwiTnVtRGVjaW1hbFwiLFxuICAgIDB4NkY6IFwiTnVtRGl2aWRlXCIsXG4gICAgMHg3MDogXCJGMVwiLFxuICAgIDB4NzE6IFwiRjJcIixcbiAgICAweDcyOiBcIkYzXCIsXG4gICAgMHg3MzogXCJGNFwiLFxuICAgIDB4NzQ6IFwiRjVcIixcbiAgICAweDc1OiBcIkY2XCIsXG4gICAgMHg3NjogXCJGN1wiLFxuICAgIDB4Nzc6IFwiRjhcIixcbiAgICAweDc4OiBcIkY5XCIsXG4gICAgMHg3OTogXCJGMTBcIixcbiAgICAweDdBOiBcIkYxMVwiLFxuICAgIDB4N0I6IFwiRjEyXCIsXG4gICAgMHg3QzogXCJGMTNcIixcbiAgICAweDdEOiBcIkYxNFwiLFxuICAgIDB4N0U6IFwiRjE1XCIsXG4gICAgMHg3RjogXCJGMTZcIixcbiAgICAweDgwOiBcIkYxN1wiLFxuICAgIDB4ODE6IFwiRjE4XCIsXG4gICAgMHg4MjogXCJGMTlcIixcbiAgICAweDgzOiBcIkYyMFwiLFxuICAgIDB4ODQ6IFwiRjIxXCIsXG4gICAgMHg4NTogXCJGMjJcIixcbiAgICAweDg2OiBcIkYyM1wiLFxuICAgIDB4ODc6IFwiRjI0XCIsXG4gICAgMHhBMDogXCJMU2hpZnRcIixcbiAgICAweEExOiBcIlJTaGlmdFwiLFxuICAgIDB4QTI6IFwiTEN0cmxcIixcbiAgICAweEEzOiBcIlJDdHJsXCIsXG4gICAgMHhBNDogXCJMQWx0XCIsXG4gICAgMHhBNTogXCJSQWx0XCIsXG4gICAgMHhBNjogXCJCcm93c2VyQmFja1wiLFxuICAgIDB4QTc6IFwiQnJvd3NlckZvcndhcmRcIixcbiAgICAweEE4OiBcIkJyb3dzZXJSZWZyZXNoXCIsXG4gICAgMHhBOTogXCJCcm93c2VyU3RvcFwiLFxuICAgIDB4QUE6IFwiQnJvd3NlclNlYXJjaFwiLFxuICAgIDB4QUI6IFwiQnJvd3NlckZhdm9yaXRlc1wiLFxuICAgIDB4QUM6IFwiQnJvd3NlclN0YXJ0XCIsXG4gICAgMHhCMDogXCJOZXh0VHJhY2tcIixcbiAgICAweEIxOiBcIlByZXZpb3VzVHJhY2tcIixcbiAgICAweEIyOiBcIlN0b3BNZWRpYVwiLFxuICAgIDB4QjM6IFwiUGxheVBhdXNlTWVkaWFcIixcbiAgICAweEI0OiBcIlN0YXJ0TWFpbFwiLFxuICAgIDB4QjU6IFwiU2VsZWN0TWVkaWFcIixcbiAgICAweEI2OiBcIlN0YXJ0QXBwbGljYXRpb25PbmVcIixcbiAgICAweEI3OiBcIlN0YXJ0QXBwbGljYXRpb25Ud29cIixcbiAgICAweEJBOiBcIjtcIixcbiAgICAweEJCOiBcIitcIixcbiAgICAweEJDOiBcIixcIixcbiAgICAweEJEOiBcIi1cIixcbiAgICAweEJFOiBcIi5cIixcbiAgICAweEJGOiBcIi9cIixcbiAgICAweEMwOiBcImBcIixcbiAgICAweERCOiBcIltcIixcbiAgICAweERDOiBcIlxcXFxcIixcbiAgICAweEREOiBcIl1cIixcbiAgICAweERFOiBcIidcIlxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IEdldEtleU5hbWUgPSAoVmtDb2RlOiBGVmlydHVhbEtleSk6IEZLZXlJZCA9Plxue1xuICAgIHJldHVybiBLZXlJZHNCeUlkW1ZrQ29kZV07XG59O1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmV4cG9ydCBjb25zdCBWazogUmVhZG9ubHk8UmVjb3JkPEZLZXlJZCwgRlZpcnR1YWxLZXk+PiA9XG57XG4gICAgTW91c2VYMTogMHgwNSxcbiAgICBNb3VzZVgyOiAweDA2LFxuICAgIEJhY2tzcGFjZTogMHgwOCxcbiAgICBUYWI6IDB4MDksXG4gICAgRW50ZXI6IDB4MEQsXG4gICAgU2hpZnQ6IDB4MTAsXG4gICAgQ3RybDogMHgxMSxcbiAgICBBbHQ6IDB4MTIsXG4gICAgUGF1c2U6IDB4MTMsXG4gICAgU3BhY2U6IDB4MjAsXG4gICAgUGdVcDogMHgyMSxcbiAgICBQZ0Rvd246IDB4MjIsXG4gICAgRW5kOiAweDIzLFxuICAgIEhvbWU6IDB4MjQsXG4gICAgTGVmdEFycm93OiAweDI1LFxuICAgIFVwQXJyb3c6IDB4MjYsXG4gICAgUmlnaHRBcnJvdzogMHgyNyxcbiAgICBEb3duQXJyb3c6IDB4MjgsXG4gICAgSW5zOiAweDJELFxuICAgIERlbDogMHgyRSxcbiAgICAwOiAweDMwLFxuICAgIDE6IDB4MzEsXG4gICAgMjogMHgzMixcbiAgICAzOiAweDMzLFxuICAgIDQ6IDB4MzQsXG4gICAgNTogMHgzNSxcbiAgICA2OiAweDM2LFxuICAgIDc6IDB4MzcsXG4gICAgODogMHgzOCxcbiAgICA5OiAweDM5LFxuICAgIEE6IDB4NDEsXG4gICAgQjogMHg0MixcbiAgICBDOiAweDQzLFxuICAgIEQ6IDB4NDQsXG4gICAgRTogMHg0NSxcbiAgICBGOiAweDQ2LFxuICAgIEc6IDB4NDcsXG4gICAgSDogMHg0OCxcbiAgICBJOiAweDQ5LFxuICAgIEo6IDB4NEEsXG4gICAgSzogMHg0QixcbiAgICBMOiAweDRDLFxuICAgIE06IDB4NEQsXG4gICAgTjogMHg0RSxcbiAgICBPOiAweDRGLFxuICAgIFA6IDB4NTAsXG4gICAgUTogMHg1MSxcbiAgICBSOiAweDUyLFxuICAgIFM6IDB4NTMsXG4gICAgVDogMHg1NCxcbiAgICBVOiAweDU1LFxuICAgIFY6IDB4NTYsXG4gICAgVzogMHg1NyxcbiAgICBYOiAweDU4LFxuICAgIFk6IDB4NTksXG4gICAgWjogMHg1QSxcbiAgICBMV2luOiAweDVCLFxuICAgIFJXaW46IDB4NUMsXG4gICAgQXBwbGljYXRpb25zOiAweDVELFxuICAgIE51bTA6IDB4NjAsXG4gICAgTnVtMTogMHg2MSxcbiAgICBOdW0yOiAweDYyLFxuICAgIE51bTM6IDB4NjMsXG4gICAgTnVtNDogMHg2NCxcbiAgICBOdW01OiAweDY1LFxuICAgIE51bTY6IDB4NjYsXG4gICAgTnVtNzogMHg2NyxcbiAgICBOdW04OiAweDY4LFxuICAgIE51bTk6IDB4NjksXG4gICAgTXVsdGlwbHk6IDB4NkEsXG4gICAgQWRkOiAweDZCLFxuICAgIFN1YnRyYWN0OiAweDZELFxuICAgIE51bURlY2ltYWw6IDB4NkUsXG4gICAgTnVtRGl2aWRlOiAweDZGLFxuICAgIEYxOiAweDcwLFxuICAgIEYyOiAweDcxLFxuICAgIEYzOiAweDcyLFxuICAgIEY0OiAweDczLFxuICAgIEY1OiAweDc0LFxuICAgIEY2OiAweDc1LFxuICAgIEY3OiAweDc2LFxuICAgIEY4OiAweDc3LFxuICAgIEY5OiAweDc4LFxuICAgIEYxMDogMHg3OSxcbiAgICBGMTE6IDB4N0EsXG4gICAgRjEyOiAweDdCLFxuICAgIEYxMzogMHg3QyxcbiAgICBGMTQ6IDB4N0QsXG4gICAgRjE1OiAweDdFLFxuICAgIEYxNjogMHg3RixcbiAgICBGMTc6IDB4ODAsXG4gICAgRjE4OiAweDgxLFxuICAgIEYxOTogMHg4MixcbiAgICBGMjA6IDB4ODMsXG4gICAgRjIxOiAweDg0LFxuICAgIEYyMjogMHg4NSxcbiAgICBGMjM6IDB4ODYsXG4gICAgRjI0OiAweDg3LFxuICAgIExTaGlmdDogMHhBMCxcbiAgICBSU2hpZnQ6IDB4QTEsXG4gICAgTEN0cmw6IDB4QTIsXG4gICAgUkN0cmw6IDB4QTMsXG4gICAgTEFsdDogMHhBNCxcbiAgICBSQWx0OiAweEE1LFxuICAgIEJyb3dzZXJCYWNrOiAweEE2LFxuICAgIEJyb3dzZXJGb3J3YXJkOiAweEE3LFxuICAgIEJyb3dzZXJSZWZyZXNoOiAweEE4LFxuICAgIEJyb3dzZXJTdG9wOiAweEE5LFxuICAgIEJyb3dzZXJTZWFyY2g6IDB4QUEsXG4gICAgQnJvd3NlckZhdm9yaXRlczogMHhBQixcbiAgICBCcm93c2VyU3RhcnQ6IDB4QUMsXG4gICAgTmV4dFRyYWNrOiAweEIwLFxuICAgIFByZXZpb3VzVHJhY2s6IDB4QjEsXG4gICAgU3RvcE1lZGlhOiAweEIyLFxuICAgIFBsYXlQYXVzZU1lZGlhOiAweEIzLFxuICAgIFN0YXJ0TWFpbDogMHhCNCxcbiAgICBTZWxlY3RNZWRpYTogMHhCNSxcbiAgICBTdGFydEFwcGxpY2F0aW9uT25lOiAweEI2LFxuICAgIFN0YXJ0QXBwbGljYXRpb25Ud286IDB4QjcsXG4gICAgXCI7XCI6IDB4QkEsXG4gICAgXCIrXCI6IDB4QkIsXG4gICAgXCIsXCI6IDB4QkMsXG4gICAgXCItXCI6IDB4QkQsXG4gICAgXCIuXCI6IDB4QkUsXG4gICAgXCIvXCI6IDB4QkYsXG4gICAgXCJgXCI6IDB4QzAsXG4gICAgXCJbXCI6IDB4REIsXG4gICAgXCJcXFxcXCI6IDB4REMsXG4gICAgXCJdXCI6IDB4REQsXG4gICAgXCInXCI6IDB4REVcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBWaXJ0dWFsS2V5czogUmVhZG9ubHk8QXJyYXk8RlZpcnR1YWxLZXk+PiA9XG5bXG4gICAgMHgwNSxcbiAgICAweDA2LFxuICAgIDB4MDgsXG4gICAgMHgwOSxcbiAgICAweDBELFxuICAgIDB4MTAsXG4gICAgMHgxMSxcbiAgICAweDEyLFxuICAgIDB4MTMsXG4gICAgMHgyMCxcbiAgICAweDIxLFxuICAgIDB4MjIsXG4gICAgMHgyMyxcbiAgICAweDI0LFxuICAgIDB4MjUsXG4gICAgMHgyNixcbiAgICAweDI3LFxuICAgIDB4MjgsXG4gICAgMHgyRCxcbiAgICAweDJFLFxuICAgIDB4MzAsXG4gICAgMHgzMSxcbiAgICAweDMyLFxuICAgIDB4MzMsXG4gICAgMHgzNCxcbiAgICAweDM1LFxuICAgIDB4MzYsXG4gICAgMHgzNyxcbiAgICAweDM4LFxuICAgIDB4MzksXG4gICAgMHg0MSxcbiAgICAweDQyLFxuICAgIDB4NDMsXG4gICAgMHg0NCxcbiAgICAweDQ1LFxuICAgIDB4NDYsXG4gICAgMHg0NyxcbiAgICAweDQ4LFxuICAgIDB4NDksXG4gICAgMHg0QSxcbiAgICAweDRCLFxuICAgIDB4NEMsXG4gICAgMHg0RCxcbiAgICAweDRFLFxuICAgIDB4NEYsXG4gICAgMHg1MCxcbiAgICAweDUxLFxuICAgIDB4NTIsXG4gICAgMHg1MyxcbiAgICAweDU0LFxuICAgIDB4NTUsXG4gICAgMHg1NixcbiAgICAweDU3LFxuICAgIDB4NTgsXG4gICAgMHg1OSxcbiAgICAweDVBLFxuICAgIDB4NUIsXG4gICAgMHg1QyxcbiAgICAweDVELFxuICAgIDB4NjAsXG4gICAgMHg2MSxcbiAgICAweDYyLFxuICAgIDB4NjMsXG4gICAgMHg2NCxcbiAgICAweDY1LFxuICAgIDB4NjYsXG4gICAgMHg2NyxcbiAgICAweDY4LFxuICAgIDB4NjksXG4gICAgMHg2QSxcbiAgICAweDZCLFxuICAgIDB4NkQsXG4gICAgMHg2RSxcbiAgICAweDZGLFxuICAgIDB4NzAsXG4gICAgMHg3MSxcbiAgICAweDcyLFxuICAgIDB4NzMsXG4gICAgMHg3NCxcbiAgICAweDc1LFxuICAgIDB4NzYsXG4gICAgMHg3NyxcbiAgICAweDc4LFxuICAgIDB4NzksXG4gICAgMHg3QSxcbiAgICAweDdCLFxuICAgIDB4N0MsXG4gICAgMHg3RCxcbiAgICAweDdFLFxuICAgIDB4N0YsXG4gICAgMHg4MCxcbiAgICAweDgxLFxuICAgIDB4ODIsXG4gICAgMHg4MyxcbiAgICAweDg0LFxuICAgIDB4ODUsXG4gICAgMHg4NixcbiAgICAweDg3LFxuICAgIDB4QTAsXG4gICAgMHhBMSxcbiAgICAweEEyLFxuICAgIDB4QTMsXG4gICAgMHhBNCxcbiAgICAweEE1LFxuICAgIDB4QTYsXG4gICAgMHhBNyxcbiAgICAweEE4LFxuICAgIDB4QTksXG4gICAgMHhBQSxcbiAgICAweEFCLFxuICAgIDB4QUMsXG4gICAgMHhCMCxcbiAgICAweEIxLFxuICAgIDB4QjIsXG4gICAgMHhCMyxcbiAgICAweEI0LFxuICAgIDB4QjUsXG4gICAgMHhCNixcbiAgICAweEI3LFxuICAgIDB4QkEsXG4gICAgMHhCQixcbiAgICAweEJDLFxuICAgIDB4QkQsXG4gICAgMHhCRSxcbiAgICAweEJGLFxuICAgIDB4QzAsXG4gICAgMHhEQixcbiAgICAweERDLFxuICAgIDB4REQsXG4gICAgMHhERVxuXSBhcyBjb25zdDtcblxuLyogZXNsaW50LWVuYWJsZSBzb3J0LWtleXMgKi9cblxuLyoqIElzIHRoZSBgS2V5Q29kZWAgYSBWSyBDb2RlICoqdGhhdCB0aGlzIGFwcCB1c2VzKiouICovXG5leHBvcnQgY29uc3QgSXNWaXJ0dWFsS2V5ID0gKEtleUNvZGU6IG51bWJlcik6IEtleUNvZGUgaXMgRlZpcnR1YWxLZXkgPT5cbntcbiAgICByZXR1cm4gVmlydHVhbEtleXMuaW5jbHVkZXMoS2V5Q29kZSBhcyBGVmlydHVhbEtleSk7XG59O1xuIiwidmFyIG15TW9kdWxlID0gcmVxdWlyZShcImJpbmRpbmdzXCIpKFwiaGVsbG9cIik7XG5tb2R1bGUuZXhwb3J0cyA9IG15TW9kdWxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXNzZXJ0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJ1ZmZlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvbnN0YW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJxdWVyeXN0cmluZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJlYW1cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3RyaW5nX2RlY29kZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHR5XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInpsaWJcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5mID0ge307XG4vLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4vLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uZSA9IChjaHVua0lkKSA9PiB7XG5cdHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmYpLnJlZHVjZSgocHJvbWlzZXMsIGtleSkgPT4ge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uZltrZXldKGNodW5rSWQsIHByb21pc2VzKTtcblx0XHRyZXR1cm4gcHJvbWlzZXM7XG5cdH0sIFtdKSk7XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmJ1bmRsZS5kZXYuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImxvYWRlZFwiLCBvdGhlcndpc2Ugbm90IGxvYWRlZCB5ZXRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAxXG59O1xuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbnZhciBpbnN0YWxsQ2h1bmsgPSAoY2h1bmspID0+IHtcblx0dmFyIG1vcmVNb2R1bGVzID0gY2h1bmsubW9kdWxlcywgY2h1bmtJZHMgPSBjaHVuay5pZHMsIHJ1bnRpbWUgPSBjaHVuay5ydW50aW1lO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBjaHVua0lkcy5sZW5ndGg7IGkrKylcblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMTtcblxufTtcblxuLy8gcmVxdWlyZSgpIGNodW5rIGxvYWRpbmcgZm9yIGphdmFzY3JpcHRcbl9fd2VicGFja19yZXF1aXJlX18uZi5yZXF1aXJlID0gKGNodW5rSWQsIHByb21pc2VzKSA9PiB7XG5cdC8vIFwiMVwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuXHRpZighaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0aWYodHJ1ZSkgeyAvLyBhbGwgY2h1bmtzIGhhdmUgSlNcblx0XHRcdGluc3RhbGxDaHVuayhyZXF1aXJlKFwiLi9cIiArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSkpO1xuXHRcdH0gZWxzZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAxO1xuXHR9XG59O1xuXG4vLyBubyBleHRlcm5hbCBpbnN0YWxsIGNodW5rXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3QiLCIiLCIvLyBtb2R1bGUgY2FjaGUgYXJlIHVzZWQgc28gZW50cnkgaW5saW5pbmcgaXMgZGlzYWJsZWRcbi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9Tb3VyY2UvTWFpbi9NYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9