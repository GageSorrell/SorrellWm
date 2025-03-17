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

/***/ "./Source/Main/Development/Log.ts":
/*!****************************************!*\
  !*** ./Source/Main/Development/Log.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* binding */ Log)
/* harmony export */ });
/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */
/** @TODO */
/* eslint-disable-next-line @typescript-eslint/typedef */
const Log = console.log;


/***/ }),

/***/ "./Source/Main/Development/index.ts":
/*!******************************************!*\
  !*** ./Source/Main/Development/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* reexport safe */ _Log__WEBPACK_IMPORTED_MODULE_0__.Log)
/* harmony export */ });
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Log */ "./Source/Main/Development/Log.ts");
/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



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
/* harmony export */   Flatten: () => (/* binding */ Flatten),
/* harmony export */   ForAll: () => (/* binding */ ForAll),
/* harmony export */   GetForest: () => (/* binding */ GetForest),
/* harmony export */   GetPanels: () => (/* binding */ GetPanels),
/* harmony export */   IsWindowTiled: () => (/* binding */ IsWindowTiled),
/* harmony export */   LogForest: () => (/* binding */ LogForest),
/* harmony export */   Traverse: () => (/* binding */ Traverse),
/* harmony export */   UpdateForest: () => (/* binding */ UpdateForest)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Monitor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Monitor */ "./Source/Main/Monitor.ts");
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
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
const Flatten = () => {
    const OutArray = [];
    Traverse((Vertex) => {
        OutArray.push(Vertex);
        return true;
    });
    OutArray.push(...Forest);
    return OutArray;
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
const GetPanels = () => {
    const Vertices = Flatten();
    (0,_Development__WEBPACK_IMPORTED_MODULE_3__.Log)("In Flatten, vertices are ", Vertices);
    return Vertices.filter((Vertex) => !IsCell(Vertex));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxtQkFBTyxDQUFDLGNBQUk7QUFDckIsU0FBUyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3ZCLGtCQUFrQixtQkFBTyxDQUFDLGtFQUFrQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFDaEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksS0FBeUM7QUFDN0MsUUFBUSxPQUF1QjtBQUMvQixRQUFRLENBQU87O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsT0FBTztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7O0FBRUE7QUFDQSxtQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDM05BO0FBQ0E7QUFDQTs7QUFFQSxVQUFVLDZDQUFtQjs7QUFFN0I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pFQTs7OztHQUlHO0FBRXFCO0FBQ1A7QUFDRztBQUNDO0FBQ0Q7QUFDSDtBQUVqQixVQUFVLENBQUMsR0FBUyxFQUFFO0lBRWxCLDZQQUF1QixDQUFDO0lBQ3hCLDZOQUF3QyxDQUFDO0lBQ3pDLHVYQUEwQixDQUFDO0lBQzNCLGlLQUFnQixDQUFDO0FBQ3JCLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQkg7OztHQUdHO0FBRXVCO0FBQ0Y7QUFHakIsU0FBUyxlQUFlLENBQUMsWUFBb0IsRUFBRSxTQUFrQjtJQUVwRSxJQUFJLElBQXNDLEVBQzFDLENBQUM7UUFDRyxNQUFNLElBQUksR0FBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1FBQ3ZELE1BQU0sR0FBRyxHQUFRLElBQUksb0NBQUcsQ0FBQyxvQkFBcUIsSUFBSyxFQUFFLENBQUMsQ0FBQztRQUN2RCxHQUFHLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztRQUM1QixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUNELE1BQU0sUUFBUSxHQUFXLFVBQVUsbURBQVksQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxFQUFFLENBQUM7SUFDM0YsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUMzQixDQUFDO1FBQ0csTUFBTSxpQkFBaUIsR0FBVyxjQUFlLFNBQVUsRUFBRSxDQUFDO1FBQzlELE9BQU8sUUFBUSxHQUFHLGlCQUFpQixDQUFDO0lBQ3hDLENBQUM7U0FFRCxDQUFDO1FBQ0csT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztBQUNMLENBQUM7QUFFTSxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQVUsRUFBRSxDQUFVLEVBQVcsRUFBRTtJQUUvRCxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNqQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQ0Y7Ozs7R0FJRztBQUVILFlBQVk7QUFDWix5REFBeUQ7QUFDbEQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSL0I7Ozs7R0FJRztBQUVtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOdEI7Ozs7R0FJRztBQVFJLE1BQU0sV0FBVztJQUVaLGNBQWMsR0FBVyxDQUFDLENBQUM7SUFFM0IsU0FBUyxHQUF1QyxJQUFJLEdBQUcsRUFBaUMsQ0FBQztJQUUxRixTQUFTLEdBQUcsR0FBMkIsRUFBRTtRQUU1QyxNQUFNLFNBQVMsR0FBRyxDQUFDLFFBQWlDLEVBQVUsRUFBRTtZQUU1RCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFVLEVBQVEsRUFBRTtZQUVyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUM7UUFFRixPQUFPO1lBQ0gsU0FBUztZQUNULFdBQVc7U0FDZCxDQUFDO0lBQ04sQ0FBQztJQUVNLFFBQVEsR0FBRyxDQUFDLE9BQVUsRUFBUSxFQUFFO1FBRW5DLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUMzQixDQUFDO1lBQ0csSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFpQyxFQUFRLEVBQUU7Z0JBRS9ELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDLENBQUM7Q0FDTDtBQUFBLENBQUM7QUFFRixtRUFBbUU7QUFDNUQsTUFBTSxzQkFBc0I7SUFFdkIsY0FBYyxHQUFXLENBQUMsQ0FBQztJQUUzQixTQUFTLEdBQXVDLElBQUksR0FBRyxFQUFpQyxDQUFDO0lBRTFGLFNBQVMsQ0FBQyxRQUFpQztRQUU5QyxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFdBQVcsQ0FBQyxFQUFVO1FBRXpCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxRQUFRLEdBQUcsQ0FBQyxPQUFVLEVBQVEsRUFBRTtRQUVuQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsRUFDM0IsQ0FBQztZQUNHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBaUMsRUFBUSxFQUFFO2dCQUUvRCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0NBQ0w7QUFBQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUMvRW1EO0FBRXJELG1FQUFlLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZsQjs7OztHQUlHO0FBR21EO0FBQ3FCO0FBQ3JCO0FBRXRELE1BQU0sU0FBVSxTQUFRLCtEQUFzQztJQUUxRDtRQUVJLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVPLFNBQVMsR0FBWSxLQUFLLENBQUM7SUFFbkMsbURBQW1EO0lBQzNDLFFBQVEsR0FBRyxDQUFDLEtBQThCLEVBQVcsRUFBRTtRQUUzRCxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQ3BCLENBQUM7WUFDRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFDbkIsQ0FBQztnQkFDRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztpQkFFRCxDQUFDO2dCQUNHLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDO2FBRUQsQ0FBQztZQUNHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQW9CLEVBQVEsRUFBRTtRQUU3QyxNQUFNLEtBQUssR0FBbUIsSUFBSSxDQUFDLENBQUMsQ0FBbUIsQ0FBQztRQUN4RCxNQUFNLFdBQVcsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLFdBQVcsSUFBSSx3RkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDN0MsQ0FBQztZQUNHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUMsQ0FBQztDQUNMO0FBRU0sTUFBTSxRQUFRLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUNuRCxtREFBWSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdER6Qzs7OztHQUlHO0FBRXlCOzs7Ozs7Ozs7Ozs7Ozs7QUNONUI7Ozs7R0FJRztBQUVILHdEQUF3RDtBQUVHO0FBRTNELE1BQU0sd0JBQXdCLEdBQUcsR0FBUyxFQUFFO0lBRXhDLHlFQUFxQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLHdCQUF3QixFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2YzQjs7OztHQUlHO0FBRXdFO0FBQ3JDO0FBQytCO0FBRXJFLE1BQU0sUUFBUSxHQUF3QixFQUFHLENBQUM7QUFFbkMsTUFBTSxXQUFXLEdBQUcsR0FBd0IsRUFBRTtJQUVqRCxPQUFPLENBQUUsR0FBRyxRQUFRLENBQUUsQ0FBQztBQUMzQixDQUFDLENBQUM7QUFFRixNQUFNLGtCQUFrQixHQUFxQyxJQUFJLG9EQUFXLEVBQXVCLENBQUM7QUFDN0YsTUFBTSxjQUFjLEdBQTZDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRXZHLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxHQUFHLElBQW9CLEVBQVEsRUFBRTtJQUV4RCxNQUFNLFdBQVcsR0FBd0IsSUFBSSxDQUFDLENBQUMsQ0FBd0IsQ0FBQztJQUN4RSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7SUFDOUIsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLENBQUMsQ0FBQztBQUVGLE1BQU0seUJBQXlCLEdBQUcsR0FBUyxFQUFFO0lBRXpDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxzRUFBa0IsRUFBRSxDQUFDLENBQUM7SUFDdkMsbURBQVMsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUM7QUFFRix5QkFBeUIsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEM1Qjs7OztHQUlHO0FBR2dEO0FBRW5ELElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBd0MsSUFBSSxHQUFHLEVBQWtDLENBQUM7QUFFMUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFlLEVBQUUsUUFBc0IsRUFBVSxFQUFFO0lBRXpFLE1BQU0sRUFBRSxHQUFXLGNBQWMsRUFBRSxDQUFDO0lBQ3BDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDekMsT0FBTyxFQUFFLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFSyxNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQVUsRUFBUSxFQUFFO0lBRTVDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRUYsU0FBUyxTQUFTLENBQUMsT0FBZSxFQUFFLE9BQWdCO0lBRWhELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFnQyxFQUFRLEVBQUU7UUFFekQsSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFDaEMsQ0FBQztZQUNHLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELGlFQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25DekI7Ozs7R0FJRztBQW1Cc0M7QUFDRDtBQUNTO0FBRWI7QUFFcEMsTUFBTSxNQUFNLEdBQVksRUFBRyxDQUFDO0FBRXJCLE1BQU0sU0FBUyxHQUFHLEdBQVksRUFBRTtJQUVuQyxPQUFPLENBQUUsR0FBRyxNQUFNLENBQUUsQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRixZQUFZO0FBQ0wsTUFBTSxTQUFTLEdBQUcsR0FBUyxFQUFFO0FBRXBDLENBQUMsQ0FBQztBQUVGLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBZSxFQUFTLEVBQUU7SUFFcEMsT0FBTztRQUNILE1BQU07UUFDTixJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sRUFBRSxDQUFDO0tBQ1osQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVLLE1BQU0sWUFBWSxHQUFHLENBQUMsY0FBK0MsRUFBUSxFQUFFO0lBRWxGLE1BQU0sU0FBUyxHQUFZLGNBQWMsQ0FBQyxDQUFFLEdBQUcsTUFBTSxDQUFFLENBQUMsQ0FBQztJQUN6RCxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFFMUIsa0ZBQWtGO0FBQ3RGLENBQUMsQ0FBQztBQUVGLE1BQU0sY0FBYyxHQUFHLEdBQVMsRUFBRTtJQUU5QixNQUFNLFFBQVEsR0FBd0IscURBQVcsRUFBRSxDQUFDO0lBRXBELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFxQixFQUFvQixFQUFFO1FBRXBFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTJCLE9BQU8sQ0FBQyxNQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQzNELE9BQU87WUFDSCxRQUFRLEVBQUUsRUFBRztZQUNiLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN6QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsSUFBSSxFQUFFLFlBQVk7WUFDbEIsTUFBTSxFQUFFLENBQUM7U0FDWixDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVKLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEIsTUFBTSxlQUFlLEdBQW1CLHNFQUFrQixFQUFFLENBQUM7SUFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFVLGVBQWUsQ0FBQyxNQUFPLG9CQUFvQixDQUFDLENBQUM7SUFFbkUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQWUsRUFBUSxFQUFFO1FBRTlDLE1BQU0sT0FBTyxHQUFhLHdFQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sU0FBUyxHQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFpQixFQUFXLEVBQUU7WUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFFLDJCQUE0QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEgsTUFBTSxJQUFJLEdBQ04sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWlCLEVBQVcsRUFBRTtnQkFFekMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVQLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUUsYUFBYyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUUsR0FBRyxDQUFDLENBQUM7WUFFbEcsT0FBTyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO1FBRVAsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUMzQixDQUFDO1lBQ0csUUFBUTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBRUQsQ0FBQztZQUNHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFhLEVBQVEsRUFBRTtRQUVuQyxNQUFNLFdBQVcsR0FDYixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBdUIsRUFBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUYsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUM3QixDQUFDO1lBQ0csUUFBUTtRQUNaLENBQUM7YUFFRCxDQUFDO1lBQ0csS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQWMsRUFBRSxLQUFhLEVBQVcsRUFBRTtnQkFFM0UsTUFBTSxZQUFZLEdBQVcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hGLE1BQU0sUUFBUSxHQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLElBQUk7b0JBQ2I7d0JBQ0ksR0FBRyxXQUFXLENBQUMsUUFBUTt3QkFDdkIsS0FBSyxFQUFFLFlBQVk7d0JBQ25CLENBQUMsRUFBRSxZQUFZLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDbkQsQ0FBQztnQkFFRixPQUFPLFFBQVEsQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sS0FBSyxHQUFpQixXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFaEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVcsRUFBUSxFQUFFO1FBRWhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXdCLGtFQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBRSxPQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxHQUFHLENBQUMsQ0FBQztRQUN2RyxxRUFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxpREFBaUQ7UUFDakQsbURBQW1EO1FBQ25ELElBQUk7UUFDSixpREFBaUQ7UUFDakQsSUFBSTtJQUNSLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBaUMsS0FBSyxDQUFDLE1BQU8sV0FBVyxDQUFDLENBQUM7QUFDM0UsQ0FBQyxDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFlLEVBQW1CLEVBQUU7SUFFaEQsT0FBTyxRQUFRLElBQUksTUFBTSxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQUVLLE1BQU0sT0FBTyxHQUFHLEdBQW1CLEVBQUU7SUFFeEMsTUFBTSxRQUFRLEdBQW1CLEVBQUcsQ0FBQztJQUVyQyxRQUFRLENBQUMsQ0FBQyxNQUFlLEVBQVcsRUFBRTtRQUVsQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBRXpCLE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNJLE1BQU0sUUFBUSxHQUFHLENBQUMsVUFBd0MsRUFBUSxFQUFFO0lBRXZFLElBQUksU0FBUyxHQUFZLElBQUksQ0FBQztJQUM5QixNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQWUsRUFBUSxFQUFFO1FBRXpDLElBQUksU0FBUyxFQUNiLENBQUM7WUFDRyxTQUFTLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLElBQUksU0FBUyxJQUFJLFVBQVUsSUFBSSxNQUFNLEVBQ3JDLENBQUM7Z0JBQ0csS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsUUFBUSxFQUNuQyxDQUFDO29CQUNHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQzFCLENBQUM7UUFDRyxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQ2xDLENBQUM7WUFDRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLFdBQVcsR0FBRyxDQUFDLE1BQXFCLEVBQWdCLEVBQUU7SUFFeEQsTUFBTSxNQUFNLEdBQWlCLEVBQUcsQ0FBQztJQUVqQyxTQUFTLFFBQVEsQ0FBQyxNQUFlO1FBRTdCLElBQUksUUFBUSxJQUFJLE1BQU0sRUFDdEIsQ0FBQztZQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBZSxDQUFDLENBQUM7UUFDakMsQ0FBQzthQUNJLElBQUksVUFBVSxJQUFJLE1BQU0sRUFDN0IsQ0FBQztZQUNHLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLFFBQVEsRUFDbkMsQ0FBQztnQkFDRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQzFCLENBQUM7UUFDRyxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQ2xDLENBQUM7WUFDRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFSyxNQUFNLE1BQU0sR0FBRyxDQUFDLFNBQXVDLEVBQVcsRUFBRTtJQUV2RSxJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7SUFDL0IsUUFBUSxDQUFDLENBQUMsTUFBZSxFQUFXLEVBQUU7UUFFbEMsSUFBSSxDQUFDLFNBQVMsRUFDZCxDQUFDO1lBQ0csU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUMsQ0FBQztBQUVGLFlBQVk7QUFDTCxNQUFNLGdCQUFnQixHQUFHLENBQUMsU0FBdUMsRUFBVyxFQUFFO0lBRWpGLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVLLE1BQU0sTUFBTSxHQUFHLENBQUMsU0FBdUMsRUFBVyxFQUFFO0lBRXZFLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVLLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBZSxFQUFXLEVBQUU7SUFFdEQsT0FBTyxNQUFNLENBQUMsQ0FBQyxNQUFlLEVBQVcsRUFBRTtRQUV2QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSw4REFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFSyxNQUFNLFNBQVMsR0FBRyxHQUFrQixFQUFFO0lBRXpDLE1BQU0sUUFBUSxHQUFtQixPQUFPLEVBQUUsQ0FBQztJQUMzQyxpREFBRyxDQUFDLDJCQUEyQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQWUsRUFBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQWtCLENBQUM7QUFDM0YsQ0FBQyxDQUFDO0FBRUYsY0FBYyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0UmpCOzs7O0dBSUc7QUFJSCw4QkFBOEI7QUFFOUIsNkNBQTZDO0FBQzdDLE1BQU0sVUFBVSxHQUNoQjtJQUNJLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUUsWUFBWTtJQUNsQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxjQUFjO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsWUFBWTtJQUNsQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFB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LElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFlBQVksRUFBRSxJQUFJO0lBQ2xCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsUUFBUSxFQUFFLElBQUk7SUFDZCxHQUFHLEVBQUUsSUFBSTtJQUNULFFBQVEsRUFBRSxJQUFJO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFDaEIsU0FBUyxFQUFFLElBQUk7SUFDZixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLElBQUk7SUFDWCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixXQUFXLEVBQUUsSUFBSTtJQUNqQixjQUFjLEVBQUUsSUFBSTtJQUNwQixjQUFjLEVBQUUsSUFBSTtJQUNwQixXQUFXLEVBQUUsSUFBSTtJQUNqQixhQUFhLEVBQUUsSUFBSTtJQUNuQixnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFDbkIsU0FBUyxFQUFFLElBQUk7SUFDZixjQUFjLEVBQUUsSUFBSTtJQUNwQixTQUFTLEVBQUUsSUFBSTtJQUNmLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsbUJBQW1CLEVBQUUsSUFBSTtJQUN6QixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0NBQ0gsQ0FBQztBQUVKLE1BQU0sV0FBVyxHQUN4QjtJQUNJLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFD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V0FDSjtXQUNBOztXQUVBOztXQUVBOztXQUVBOzs7OztVRXJDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2JpbmRpbmdzL2JpbmRpbmdzLmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9maWxlLXVyaS10by1wYXRoL2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvU2lkZUVmZmVjdHMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9VdGlsaXR5LnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0RldmVsb3BtZW50L0xvZy50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9pbmRleC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9EaXNwYXRjaGVyLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0hvb2sudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbi50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NZXNzYWdlTG9vcC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Nb25pdG9yLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL05vZGVJcGMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vVHJlZS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvUmVuZGVyZXIvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vV2luZG93cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImFzc2VydFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiYnVmZmVyXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjaGlsZF9wcm9jZXNzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjb25zdGFudHNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImV2ZW50c1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJvc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicXVlcnlzdHJpbmdcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmVhbVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwic3RyaW5nX2RlY29kZXJcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInR0eVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidXJsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ6bGliXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9yZXF1aXJlIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKSxcbiAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAgZmlsZVVSTFRvUGF0aCA9IHJlcXVpcmUoJ2ZpbGUtdXJpLXRvLXBhdGgnKSxcbiAgam9pbiA9IHBhdGguam9pbixcbiAgZGlybmFtZSA9IHBhdGguZGlybmFtZSxcbiAgZXhpc3RzID1cbiAgICAoZnMuYWNjZXNzU3luYyAmJlxuICAgICAgZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLmFjY2Vzc1N5bmMocGF0aCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KSB8fFxuICAgIGZzLmV4aXN0c1N5bmMgfHxcbiAgICBwYXRoLmV4aXN0c1N5bmMsXG4gIGRlZmF1bHRzID0ge1xuICAgIGFycm93OiBwcm9jZXNzLmVudi5OT0RFX0JJTkRJTkdTX0FSUk9XIHx8ICcg4oaSICcsXG4gICAgY29tcGlsZWQ6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQ09NUElMRURfRElSIHx8ICdjb21waWxlZCcsXG4gICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgYXJjaDogcHJvY2Vzcy5hcmNoLFxuICAgIG5vZGVQcmVHeXA6XG4gICAgICAnbm9kZS12JyArXG4gICAgICBwcm9jZXNzLnZlcnNpb25zLm1vZHVsZXMgK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MucGxhdGZvcm0gK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MuYXJjaCxcbiAgICB2ZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25zLm5vZGUsXG4gICAgYmluZGluZ3M6ICdiaW5kaW5ncy5ub2RlJyxcbiAgICB0cnk6IFtcbiAgICAgIC8vIG5vZGUtZ3lwJ3MgbGlua2VkIHZlcnNpb24gaW4gdGhlIFwiYnVpbGRcIiBkaXJcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIG5vZGUtd2FmIGFuZCBneXBfYWRkb24gKGEuay5hIG5vZGUtZ3lwKVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBEZWJ1ZyBmaWxlcywgZm9yIGRldmVsb3BtZW50IChsZWdhY3kgYmVoYXZpb3IsIHJlbW92ZSBmb3Igbm9kZSB2MC45KVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdvdXQnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIFJlbGVhc2UgZmlsZXMsIGJ1dCBtYW51YWxseSBjb21waWxlZCAobGVnYWN5IGJlaGF2aW9yLCByZW1vdmUgZm9yIG5vZGUgdjAuOSlcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnb3V0JywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnUmVsZWFzZScsICdiaW5kaW5ncyddLFxuICAgICAgLy8gTGVnYWN5IGZyb20gbm9kZS13YWYsIG5vZGUgPD0gMC40LnhcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnZGVmYXVsdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gUHJvZHVjdGlvbiBcIlJlbGVhc2VcIiBidWlsZHR5cGUgYmluYXJ5IChtZWguLi4pXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2NvbXBpbGVkJywgJ3ZlcnNpb24nLCAncGxhdGZvcm0nLCAnYXJjaCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1xYnMgYnVpbGRzXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ3JlbGVhc2UnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ2RlYnVnJywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdhZGRvbi1idWlsZCcsICdkZWZhdWx0JywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1wcmUtZ3lwIHBhdGggLi9saWIvYmluZGluZy97bm9kZV9hYml9LXtwbGF0Zm9ybX0te2FyY2h9XG4gICAgICBbJ21vZHVsZV9yb290JywgJ2xpYicsICdiaW5kaW5nJywgJ25vZGVQcmVHeXAnLCAnYmluZGluZ3MnXVxuICAgIF1cbiAgfTtcblxuLyoqXG4gKiBUaGUgbWFpbiBgYmluZGluZ3MoKWAgZnVuY3Rpb24gbG9hZHMgdGhlIGNvbXBpbGVkIGJpbmRpbmdzIGZvciBhIGdpdmVuIG1vZHVsZS5cbiAqIEl0IHVzZXMgVjgncyBFcnJvciBBUEkgdG8gZGV0ZXJtaW5lIHRoZSBwYXJlbnQgZmlsZW5hbWUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBiZWluZyBpbnZva2VkIGZyb20sIHdoaWNoIGlzIHRoZW4gdXNlZCB0byBmaW5kIHRoZSByb290IGRpcmVjdG9yeS5cbiAqL1xuXG5mdW5jdGlvbiBiaW5kaW5ncyhvcHRzKSB7XG4gIC8vIEFyZ3VtZW50IHN1cmdlcnlcbiAgaWYgKHR5cGVvZiBvcHRzID09ICdzdHJpbmcnKSB7XG4gICAgb3B0cyA9IHsgYmluZGluZ3M6IG9wdHMgfTtcbiAgfSBlbHNlIGlmICghb3B0cykge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIC8vIG1hcHMgYGRlZmF1bHRzYCBvbnRvIGBvcHRzYCBvYmplY3RcbiAgT2JqZWN0LmtleXMoZGVmYXVsdHMpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgaWYgKCEoaSBpbiBvcHRzKSkgb3B0c1tpXSA9IGRlZmF1bHRzW2ldO1xuICB9KTtcblxuICAvLyBHZXQgdGhlIG1vZHVsZSByb290XG4gIGlmICghb3B0cy5tb2R1bGVfcm9vdCkge1xuICAgIG9wdHMubW9kdWxlX3Jvb3QgPSBleHBvcnRzLmdldFJvb3QoZXhwb3J0cy5nZXRGaWxlTmFtZSgpKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGUgZ2l2ZW4gYmluZGluZ3MgbmFtZSBlbmRzIHdpdGggLm5vZGVcbiAgaWYgKHBhdGguZXh0bmFtZShvcHRzLmJpbmRpbmdzKSAhPSAnLm5vZGUnKSB7XG4gICAgb3B0cy5iaW5kaW5ncyArPSAnLm5vZGUnO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2svd2VicGFjay9pc3N1ZXMvNDE3NSNpc3N1ZWNvbW1lbnQtMzQyOTMxMDM1XG4gIHZhciByZXF1aXJlRnVuYyA9XG4gICAgdHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gPT09ICdmdW5jdGlvbidcbiAgICAgID8gX19ub25fd2VicGFja19yZXF1aXJlX19cbiAgICAgIDogcmVxdWlyZTtcblxuICB2YXIgdHJpZXMgPSBbXSxcbiAgICBpID0gMCxcbiAgICBsID0gb3B0cy50cnkubGVuZ3RoLFxuICAgIG4sXG4gICAgYixcbiAgICBlcnI7XG5cbiAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICBuID0gam9pbi5hcHBseShcbiAgICAgIG51bGwsXG4gICAgICBvcHRzLnRyeVtpXS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgICByZXR1cm4gb3B0c1twXSB8fCBwO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRyaWVzLnB1c2gobik7XG4gICAgdHJ5IHtcbiAgICAgIGIgPSBvcHRzLnBhdGggPyByZXF1aXJlRnVuYy5yZXNvbHZlKG4pIDogcmVxdWlyZUZ1bmMobik7XG4gICAgICBpZiAoIW9wdHMucGF0aCkge1xuICAgICAgICBiLnBhdGggPSBuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnICYmXG4gICAgICAgICAgZS5jb2RlICE9PSAnUVVBTElGSUVEX1BBVEhfUkVTT0xVVElPTl9GQUlMRUQnICYmXG4gICAgICAgICAgIS9ub3QgZmluZC9pLnRlc3QoZS5tZXNzYWdlKSkge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVyciA9IG5ldyBFcnJvcihcbiAgICAnQ291bGQgbm90IGxvY2F0ZSB0aGUgYmluZGluZ3MgZmlsZS4gVHJpZWQ6XFxuJyArXG4gICAgICB0cmllc1xuICAgICAgICAubWFwKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICByZXR1cm4gb3B0cy5hcnJvdyArIGE7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICApO1xuICBlcnIudHJpZXMgPSB0cmllcztcbiAgdGhyb3cgZXJyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYmluZGluZ3M7XG5cbi8qKlxuICogR2V0cyB0aGUgZmlsZW5hbWUgb2YgdGhlIEphdmFTY3JpcHQgZmlsZSB0aGF0IGludm9rZXMgdGhpcyBmdW5jdGlvbi5cbiAqIFVzZWQgdG8gaGVscCBmaW5kIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZS5cbiAqIE9wdGlvbmFsbHkgYWNjZXB0cyBhbiBmaWxlbmFtZSBhcmd1bWVudCB0byBza2lwIHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgaW52b2tpbmcgZmlsZW5hbWVcbiAqL1xuXG5leHBvcnRzLmdldEZpbGVOYW1lID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUoY2FsbGluZ19maWxlKSB7XG4gIHZhciBvcmlnUFNUID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UsXG4gICAgb3JpZ1NUTCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdCxcbiAgICBkdW1teSA9IHt9LFxuICAgIGZpbGVOYW1lO1xuXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IDEwO1xuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24oZSwgc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZmlsZU5hbWUgPSBzdFtpXS5nZXRGaWxlTmFtZSgpO1xuICAgICAgaWYgKGZpbGVOYW1lICE9PSBfX2ZpbGVuYW1lKSB7XG4gICAgICAgIGlmIChjYWxsaW5nX2ZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZU5hbWUgIT09IGNhbGxpbmdfZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gcnVuIHRoZSAncHJlcGFyZVN0YWNrVHJhY2UnIGZ1bmN0aW9uIGFib3ZlXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KTtcbiAgZHVtbXkuc3RhY2s7XG5cbiAgLy8gY2xlYW51cFxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IG9yaWdQU1Q7XG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9yaWdTVEw7XG5cbiAgLy8gaGFuZGxlIGZpbGVuYW1lIHRoYXQgc3RhcnRzIHdpdGggXCJmaWxlOi8vXCJcbiAgdmFyIGZpbGVTY2hlbWEgPSAnZmlsZTovLyc7XG4gIGlmIChmaWxlTmFtZS5pbmRleE9mKGZpbGVTY2hlbWEpID09PSAwKSB7XG4gICAgZmlsZU5hbWUgPSBmaWxlVVJMVG9QYXRoKGZpbGVOYW1lKTtcbiAgfVxuXG4gIHJldHVybiBmaWxlTmFtZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgYSBtb2R1bGUsIGdpdmVuIGFuIGFyYml0cmFyeSBmaWxlbmFtZVxuICogc29tZXdoZXJlIGluIHRoZSBtb2R1bGUgdHJlZS4gVGhlIFwicm9vdCBkaXJlY3RvcnlcIiBpcyB0aGUgZGlyZWN0b3J5XG4gKiBjb250YWluaW5nIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLlxuICpcbiAqICAgSW46ICAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZS9saWIvaW5kZXguanNcbiAqICAgT3V0OiAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZVxuICovXG5cbmV4cG9ydHMuZ2V0Um9vdCA9IGZ1bmN0aW9uIGdldFJvb3QoZmlsZSkge1xuICB2YXIgZGlyID0gZGlybmFtZShmaWxlKSxcbiAgICBwcmV2O1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChkaXIgPT09ICcuJykge1xuICAgICAgLy8gQXZvaWRzIGFuIGluZmluaXRlIGxvb3AgaW4gcmFyZSBjYXNlcywgbGlrZSB0aGUgUkVQTFxuICAgICAgZGlyID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgZXhpc3RzKGpvaW4oZGlyLCAncGFja2FnZS5qc29uJykpIHx8XG4gICAgICBleGlzdHMoam9pbihkaXIsICdub2RlX21vZHVsZXMnKSlcbiAgICApIHtcbiAgICAgIC8vIEZvdW5kIHRoZSAncGFja2FnZS5qc29uJyBmaWxlIG9yICdub2RlX21vZHVsZXMnIGRpcjsgd2UncmUgZG9uZVxuICAgICAgcmV0dXJuIGRpcjtcbiAgICB9XG4gICAgaWYgKHByZXYgPT09IGRpcikge1xuICAgICAgLy8gR290IHRvIHRoZSB0b3BcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIG1vZHVsZSByb290IGdpdmVuIGZpbGU6IFwiJyArXG4gICAgICAgICAgZmlsZSArXG4gICAgICAgICAgJ1wiLiBEbyB5b3UgaGF2ZSBhIGBwYWNrYWdlLmpzb25gIGZpbGU/ICdcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIFRyeSB0aGUgcGFyZW50IGRpciBuZXh0XG4gICAgcHJldiA9IGRpcjtcbiAgICBkaXIgPSBqb2luKGRpciwgJy4uJyk7XG4gIH1cbn07XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgc2VwID0gcmVxdWlyZSgncGF0aCcpLnNlcCB8fCAnLyc7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXJpVG9QYXRoO1xuXG4vKipcbiAqIEZpbGUgVVJJIHRvIFBhdGggZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaVxuICogQHJldHVybiB7U3RyaW5nfSBwYXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZpbGVVcmlUb1BhdGggKHVyaSkge1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHVyaSB8fFxuICAgICAgdXJpLmxlbmd0aCA8PSA3IHx8XG4gICAgICAnZmlsZTovLycgIT0gdXJpLnN1YnN0cmluZygwLCA3KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3QgcGFzcyBpbiBhIGZpbGU6Ly8gVVJJIHRvIGNvbnZlcnQgdG8gYSBmaWxlIHBhdGgnKTtcbiAgfVxuXG4gIHZhciByZXN0ID0gZGVjb2RlVVJJKHVyaS5zdWJzdHJpbmcoNykpO1xuICB2YXIgZmlyc3RTbGFzaCA9IHJlc3QuaW5kZXhPZignLycpO1xuICB2YXIgaG9zdCA9IHJlc3Quc3Vic3RyaW5nKDAsIGZpcnN0U2xhc2gpO1xuICB2YXIgcGF0aCA9IHJlc3Quc3Vic3RyaW5nKGZpcnN0U2xhc2ggKyAxKTtcblxuICAvLyAyLiAgU2NoZW1lIERlZmluaXRpb25cbiAgLy8gQXMgYSBzcGVjaWFsIGNhc2UsIDxob3N0PiBjYW4gYmUgdGhlIHN0cmluZyBcImxvY2FsaG9zdFwiIG9yIHRoZSBlbXB0eVxuICAvLyBzdHJpbmc7IHRoaXMgaXMgaW50ZXJwcmV0ZWQgYXMgXCJ0aGUgbWFjaGluZSBmcm9tIHdoaWNoIHRoZSBVUkwgaXNcbiAgLy8gYmVpbmcgaW50ZXJwcmV0ZWRcIi5cbiAgaWYgKCdsb2NhbGhvc3QnID09IGhvc3QpIGhvc3QgPSAnJztcblxuICBpZiAoaG9zdCkge1xuICAgIGhvc3QgPSBzZXAgKyBzZXAgKyBob3N0O1xuICB9XG5cbiAgLy8gMy4yICBEcml2ZXMsIGRyaXZlIGxldHRlcnMsIG1vdW50IHBvaW50cywgZmlsZSBzeXN0ZW0gcm9vdFxuICAvLyBEcml2ZSBsZXR0ZXJzIGFyZSBtYXBwZWQgaW50byB0aGUgdG9wIG9mIGEgZmlsZSBVUkkgaW4gdmFyaW91cyB3YXlzLFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGltcGxlbWVudGF0aW9uOyBzb21lIGFwcGxpY2F0aW9ucyBzdWJzdGl0dXRlXG4gIC8vIHZlcnRpY2FsIGJhciAoXCJ8XCIpIGZvciB0aGUgY29sb24gYWZ0ZXIgdGhlIGRyaXZlIGxldHRlciwgeWllbGRpbmdcbiAgLy8gXCJmaWxlOi8vL2N8L3RtcC90ZXN0LnR4dFwiLiAgSW4gc29tZSBjYXNlcywgdGhlIGNvbG9uIGlzIGxlZnRcbiAgLy8gdW5jaGFuZ2VkLCBhcyBpbiBcImZpbGU6Ly8vYzovdG1wL3Rlc3QudHh0XCIuICBJbiBvdGhlciBjYXNlcywgdGhlXG4gIC8vIGNvbG9uIGlzIHNpbXBseSBvbWl0dGVkLCBhcyBpbiBcImZpbGU6Ly8vYy90bXAvdGVzdC50eHRcIi5cbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXiguKylcXHwvLCAnJDE6Jyk7XG5cbiAgLy8gZm9yIFdpbmRvd3MsIHdlIG5lZWQgdG8gaW52ZXJ0IHRoZSBwYXRoIHNlcGFyYXRvcnMgZnJvbSB3aGF0IGEgVVJJIHVzZXNcbiAgaWYgKHNlcCA9PSAnXFxcXCcpIHtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcbiAgfVxuXG4gIGlmICgvXi4rXFw6Ly50ZXN0KHBhdGgpKSB7XG4gICAgLy8gaGFzIFdpbmRvd3MgZHJpdmUgYXQgYmVnaW5uaW5nIG9mIHBhdGhcbiAgfSBlbHNlIHtcbiAgICAvLyB1bml4IHBhdGjigKZcbiAgICBwYXRoID0gc2VwICsgcGF0aDtcbiAgfVxuXG4gIHJldHVybiBob3N0ICsgcGF0aDtcbn1cbiIsIi8qIEZpbGU6ICAgICAgU2lkZUVmZmVjdHMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IFwiLi4vTWVzc2FnZUxvb3BcIjtcbmltcG9ydCBcIi4uL0hvb2tcIjtcbmltcG9ydCBcIi4uL05vZGVJcGNcIjtcbmltcG9ydCBcIi4uL0tleWJvYXJkXCI7XG5pbXBvcnQgXCIuLi9Nb25pdG9yXCI7XG5pbXBvcnQgXCIuLi9UcmVlXCI7XG5cbnNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbntcbiAgICBpbXBvcnQoXCIuLi9NYWluV2luZG93XCIpO1xuICAgIGltcG9ydChcIi4uL1JlbmRlcmVyRnVuY3Rpb25zLkdlbmVyYXRlZFwiKTtcbiAgICBpbXBvcnQoXCIuL0luaXRpYWxpemF0aW9uXCIpO1xuICAgIGltcG9ydChcIi4vVHJheVwiKTtcbn0pO1xuXG4iLCIvKiBGaWxlOiAgICB1dGlsLnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCB7IFVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IEhIYW5kbGUgfSBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNvbHZlSHRtbFBhdGgoSHRtbEZpbGVOYW1lOiBzdHJpbmcsIENvbXBvbmVudD86IHN0cmluZylcbntcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIilcbiAgICB7XG4gICAgICAgIGNvbnN0IFBvcnQ6IHN0cmluZyB8IG51bWJlciA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMTIxMjtcbiAgICAgICAgY29uc3QgVXJsOiBVUkwgPSBuZXcgVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7IFBvcnQgfWApO1xuICAgICAgICBVcmwucGF0aG5hbWUgPSBIdG1sRmlsZU5hbWU7XG4gICAgICAgIHJldHVybiBVcmwuaHJlZjtcbiAgICB9XG4gICAgY29uc3QgQmFzZVBhdGg6IHN0cmluZyA9IGBmaWxlOi8vJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL1JlbmRlcmVyL1wiLCBIdG1sRmlsZU5hbWUpfWA7XG4gICAgaWYgKENvbXBvbmVudCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50QXJndW1lbnQ6IHN0cmluZyA9IGA/Q29tcG9uZW50PSR7IENvbXBvbmVudCB9YDtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoICsgQ29tcG9uZW50QXJndW1lbnQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBCYXNlUGF0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBBcmVIYW5kbGVzRXF1YWwgPSAoQTogSEhhbmRsZSwgQjogSEhhbmRsZSk6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gQS5IYW5kbGUgPT09IEIuSGFuZGxlO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgTG9nLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbi8qKiBAVE9ETyAqL1xuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC90eXBlZGVmICovXG5leHBvcnQgY29uc3QgTG9nID0gY29uc29sZS5sb2c7XG4iLCIvKiBGaWxlOiAgICAgIGluZGV4LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0xvZ1wiO1xuIiwiLyogRmlsZTogICAgICBEaXNwYXRjaGVyLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGU8VD4gPVxue1xuICAgIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXI7XG4gICAgVW5zdWJzY3JpYmUoSWQ6IG51bWJlcik6IHZvaWQ7XG59O1xuXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXI8VD5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIEdldEhhbmRsZSA9ICgpOiBUU3Vic2NyaXB0aW9uSGFuZGxlPFQ+ID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdWJzY3JpYmUgPSAoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiBJZDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBTdWJzY3JpYmUsXG4gICAgICAgICAgICBVbnN1YnNjcmliZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uICovXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXJfREVQUkVDQVRFRDxUID0gdW5rbm93bj5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXJcbiAgICB7XG4gICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgIHRoaXMuTGlzdGVuZXJzLnNldChJZCwgQ2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gSWQ7XG4gICAgfVxuXG4gICAgcHVibGljIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiaW1wb3J0IHsgSW5pdGlhbGl6ZUhvb2tzIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5Jbml0aWFsaXplSG9va3MoKTtcbiIsIi8qIEZpbGU6ICAgICAgS2V5Ym9hcmQudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgYXMgSXBjU3Vic2NyaWJlIH0gZnJvbSBcIi4vTm9kZUlwY1wiO1xuaW1wb3J0IHsgSXNWaXJ0dWFsS2V5IH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmRcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyX0RFUFJFQ0FURUQgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNsYXNzIEZLZXlib2FyZCBleHRlbmRzIFREaXNwYXRjaGVyX0RFUFJFQ0FURUQ8RktleWJvYXJkRXZlbnQ+XG57XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBJc0tleURvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGBPbktleWAgc2hvdWxkIGNvbnRpbnVlLiAqL1xuICAgIHByaXZhdGUgRGVib3VuY2UgPSAoU3RhdGU6IEZLZXlib2FyZEV2ZW50W1wiU3RhdGVcIl0pOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuSXNLZXlEb3duKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuSXNLZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIE9uS2V5ID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgRXZlbnQ6IEZLZXlib2FyZEV2ZW50ID0gRGF0YVswXSBhcyBGS2V5Ym9hcmRFdmVudDtcbiAgICAgICAgY29uc3QgSXNEZWJvdW5jZWQ6IGJvb2xlYW4gPSB0aGlzLkRlYm91bmNlKEV2ZW50LlN0YXRlKTtcbiAgICAgICAgaWYgKElzRGVib3VuY2VkICYmIElzVmlydHVhbEtleShFdmVudC5Wa0NvZGUpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkRpc3BhdGNoKEV2ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCBLZXlib2FyZDogRktleWJvYXJkID0gbmV3IEZLZXlib2FyZCgpO1xuSXBjU3Vic2NyaWJlKFwiS2V5Ym9hcmRcIiwgS2V5Ym9hcmQuT25LZXkpO1xuIiwiLyogRmlsZTogICAgICBNYWluLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IFwiLi9Db3JlL1NpZGVFZmZlY3RzXCI7XG4iLCIvKiBGaWxlOiAgICAgIE1lc3NhZ2VMb29wLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuLyoqIFRoaXMgZmlsZSBtdXN0IGJlIHNpZGUtZWZmZWN0IGltcG9ydGVkIGJ5IGBNYWluYC4gKi9cblxuaW1wb3J0IHsgSW5pdGlhbGl6ZU1lc3NhZ2VMb29wIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5jb25zdCBSdW5Jbml0aWFsaXplTWVzc2FnZUxvb3AgPSAoKTogdm9pZCA9Plxue1xuICAgIEluaXRpYWxpemVNZXNzYWdlTG9vcCgoKSA9PiB7IH0pO1xufTtcblxuUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wKCk7XG4iLCIvKiBGaWxlOiAgICAgIE1vbml0b3IudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgdHlwZSBGTW9uaXRvckluZm8sIEluaXRpYWxpemVNb25pdG9ycyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyLCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGUgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNvbnN0IE1vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gWyBdO1xuXG5leHBvcnQgY29uc3QgR2V0TW9uaXRvcnMgPSAoKTogQXJyYXk8Rk1vbml0b3JJbmZvPiA9Plxue1xuICAgIHJldHVybiBbIC4uLk1vbml0b3JzIF07XG59O1xuXG5jb25zdCBNb25pdG9yc0Rpc3BhdGNoZXI6IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+ID0gbmV3IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+KCk7XG5leHBvcnQgY29uc3QgTW9uaXRvcnNIYW5kbGU6IFRTdWJzY3JpcHRpb25IYW5kbGU8QXJyYXk8Rk1vbml0b3JJbmZvPj4gPSBNb25pdG9yc0Rpc3BhdGNoZXIuR2V0SGFuZGxlKCk7XG5cbmNvbnN0IE9uTW9uaXRvcnNDaGFuZ2VkID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE5ld01vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gRGF0YVswXSBhcyBBcnJheTxGTW9uaXRvckluZm8+O1xuICAgIE1vbml0b3JzLmxlbmd0aCA9IDA7XG4gICAgTW9uaXRvcnMucHVzaCguLi5OZXdNb25pdG9ycyk7XG4gICAgTW9uaXRvcnNEaXNwYXRjaGVyLkRpc3BhdGNoKE5ld01vbml0b3JzKTtcbn07XG5cbmNvbnN0IEluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcgPSAoKTogdm9pZCA9Plxue1xuICAgIE1vbml0b3JzLnB1c2goLi4uSW5pdGlhbGl6ZU1vbml0b3JzKCkpO1xuICAgIFN1YnNjcmliZShcIk1vbml0b3JzXCIsIE9uTW9uaXRvcnNDaGFuZ2VkKTtcbn07XG5cbkluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcoKTtcbiIsIi8qIEZpbGU6ICAgICAgTm9kZUlwYy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZJcGNDYWxsYmFjaywgRklwY0NhbGxiYWNrU2VyaWFsaXplZCB9IGZyb20gXCIuL05vZGVJcGMuVHlwZXNcIjtcbmltcG9ydCB7IEluaXRpYWxpemVJcGMgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmxldCBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcbmNvbnN0IExpc3RlbmVyczogTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4gPSBuZXcgTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4oKTtcblxuZXhwb3J0IGNvbnN0IFN1YnNjcmliZSA9IChDaGFubmVsOiBzdHJpbmcsIENhbGxiYWNrOiBGSXBjQ2FsbGJhY2spOiBudW1iZXIgPT5cbntcbiAgICBjb25zdCBJZDogbnVtYmVyID0gTmV4dExpc3RlbmVySWQrKztcbiAgICBMaXN0ZW5lcnMuc2V0KElkLCB7IENhbGxiYWNrLCBDaGFubmVsIH0pO1xuICAgIHJldHVybiBJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9Plxue1xuICAgIExpc3RlbmVycy5kZWxldGUoSWQpO1xufTtcblxuZnVuY3Rpb24gT25NZXNzYWdlKENoYW5uZWw6IHN0cmluZywgTWVzc2FnZTogdW5rbm93bilcbntcbiAgICBMaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6IEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ2FsbGJhY2suQ2hhbm5lbCA9PT0gQ2hhbm5lbClcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2suQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuSW5pdGlhbGl6ZUlwYyhPbk1lc3NhZ2UpO1xuIiwiLyogRmlsZTogICAgICBUcmVlLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgICBGQ2VsbCxcbiAgICBGRm9yZXN0LFxuICAgIEZQYW5lbCxcbiAgICBGUGFuZWxCYXNlLFxuICAgIEZQYW5lbEhvcml6b250YWwsXG4gICAgRlZlcnRleCB9IGZyb20gXCIuL1RyZWUuVHlwZXNcIjtcbmltcG9ydCB7XG4gICAgdHlwZSBGTW9uaXRvckluZm8sXG4gICAgR2V0VGlsZWFibGVXaW5kb3dzLFxuICAgIEdldE1vbml0b3JGcm9tV2luZG93LFxuICAgIHR5cGUgSE1vbml0b3IsXG4gICAgdHlwZSBIV2luZG93LFxuICAgIFNldFdpbmRvd1Bvc2l0aW9uLFxuICAgIEdldFdpbmRvd0J5TmFtZSxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICBHZXRTY3JlZW5zaG90LFxuICAgIHR5cGUgRkJveH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHsgR2V0TW9uaXRvcnMgfSBmcm9tIFwiLi9Nb25pdG9yXCI7XG5pbXBvcnQgeyBBcmVIYW5kbGVzRXF1YWwgfSBmcm9tIFwiLi9Db3JlL1V0aWxpdHlcIjtcbmltcG9ydCB7IGlwY01haW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IExvZyB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG5cbmNvbnN0IEZvcmVzdDogRkZvcmVzdCA9IFsgXTtcblxuZXhwb3J0IGNvbnN0IEdldEZvcmVzdCA9ICgpOiBGRm9yZXN0ID0+XG57XG4gICAgcmV0dXJuIFsgLi4uRm9yZXN0IF07XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBMb2dGb3Jlc3QgPSAoKTogdm9pZCA9Plxue1xufTtcblxuY29uc3QgQ2VsbCA9IChIYW5kbGU6IEhXaW5kb3cpOiBGQ2VsbCA9Plxue1xuICAgIHJldHVybiB7XG4gICAgICAgIEhhbmRsZSxcbiAgICAgICAgU2l6ZTogeyBIZWlnaHQ6IDAsIFdpZHRoOiAwLCBYOiAwLCBZOiAwIH0sXG4gICAgICAgIFpPcmRlcjogMFxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgVXBkYXRlRm9yZXN0ID0gKFVwZGF0ZUZ1bmN0aW9uOiAoT2xkRm9yZXN0OiBGRm9yZXN0KSA9PiBGRm9yZXN0KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE5ld0ZvcmVzdDogRkZvcmVzdCA9IFVwZGF0ZUZ1bmN0aW9uKFsgLi4uRm9yZXN0IF0pO1xuICAgIEZvcmVzdC5sZW5ndGggPSAwO1xuICAgIEZvcmVzdC5wdXNoKC4uLk5ld0ZvcmVzdCk7XG5cbiAgICAvLyBAVE9ETyBNb3ZlIGFuZCByZXNpemUsIGFuZCBzb3J0IFpPcmRlciBvZiBhbGwgd2luZG93cyBiZWluZyB0aWxlZCBieSBTb3JyZWxsV20uXG59O1xuXG5jb25zdCBJbml0aWFsaXplVHJlZSA9ICgpOiB2b2lkID0+XG57XG4gICAgY29uc3QgTW9uaXRvcnM6IEFycmF5PEZNb25pdG9ySW5mbz4gPSBHZXRNb25pdG9ycygpO1xuXG4gICAgY29uc29sZS5sb2coTW9uaXRvcnMpO1xuXG4gICAgRm9yZXN0LnB1c2goLi4uTW9uaXRvcnMubWFwKChNb25pdG9yOiBGTW9uaXRvckluZm8pOiBGUGFuZWxIb3Jpem9udGFsID0+XG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhgSGVyZSwgTW9uaXRvckhhbmRsZSBpcyAkeyBNb25pdG9yLkhhbmRsZSB9LmApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgQ2hpbGRyZW46IFsgXSxcbiAgICAgICAgICAgIE1vbml0b3JJZDogTW9uaXRvci5IYW5kbGUsXG4gICAgICAgICAgICBTaXplOiBNb25pdG9yLlNpemUsXG4gICAgICAgICAgICBUeXBlOiBcIkhvcml6b250YWxcIixcbiAgICAgICAgICAgIFpPcmRlcjogMFxuICAgICAgICB9O1xuICAgIH0pKTtcblxuICAgIGNvbnNvbGUubG9nKEZvcmVzdCk7XG5cbiAgICBjb25zdCBUaWxlYWJsZVdpbmRvd3M6IEFycmF5PEhXaW5kb3c+ID0gR2V0VGlsZWFibGVXaW5kb3dzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhgRm91bmQgJHsgVGlsZWFibGVXaW5kb3dzLmxlbmd0aCB9IHRpbGVhYmxlIHdpbmRvd3MuYCk7XG5cbiAgICBUaWxlYWJsZVdpbmRvd3MuZm9yRWFjaCgoSGFuZGxlOiBIV2luZG93KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgTW9uaXRvcjogSE1vbml0b3IgPSBHZXRNb25pdG9yRnJvbVdpbmRvdyhIYW5kbGUpO1xuICAgICAgICBjb25zdCBSb290UGFuZWw6IEZQYW5lbEJhc2UgfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgRm9yZXN0LmZpbmQoKFBhbmVsOiBGUGFuZWxCYXNlKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBNb25pdG9yIGlzICR7IEpTT04uc3RyaW5naWZ5KE1vbml0b3IpIH0gYW5kIFBhbmVsLk1vbml0b3JJZCBpcyAkeyBKU09OLnN0cmluZ2lmeShQYW5lbC5Nb25pdG9ySWQpIH0uYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgSW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgICAgICAgICAgTW9uaXRvcnMuZmluZCgoRm9vOiBGTW9uaXRvckluZm8pOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBGb28uSGFuZGxlLkhhbmRsZSA9PT0gUGFuZWwuTW9uaXRvcklkPy5IYW5kbGU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFNpemUgJHsgSlNPTi5zdHJpbmdpZnkoSW5mbz8uU2l6ZSkgfSBXb3JrU2l6ZSAkeyBKU09OLnN0cmluZ2lmeShJbmZvPy5Xb3JrU2l6ZSkgfS5gKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBQYW5lbC5Nb25pdG9ySWQ/LkhhbmRsZSA9PT0gTW9uaXRvci5IYW5kbGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoUm9vdFBhbmVsID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEBUT0RPXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIvCfkqHwn5Kh8J+SofCfkqEgUm9vdFBhbmVsIHdhcyB1bmRlZmluZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgUm9vdFBhbmVsLkNoaWxkcmVuLnB1c2goQ2VsbChIYW5kbGUpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgRm9yZXN0LmZvckVhY2goKFBhbmVsOiBGUGFuZWwpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9ySW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIE1vbml0b3JzLmZpbmQoKEluTW9uaXRvcjogRk1vbml0b3JJbmZvKTogYm9vbGVhbiA9PiBJbk1vbml0b3IuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQpO1xuXG4gICAgICAgIGlmIChNb25pdG9ySW5mbyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBAVE9ET1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgUGFuZWwuQ2hpbGRyZW4gPSBQYW5lbC5DaGlsZHJlbi5tYXAoKENoaWxkOiBGVmVydGV4LCBJbmRleDogbnVtYmVyKTogRlZlcnRleCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFVuaWZvcm1XaWR0aDogbnVtYmVyID0gTW9uaXRvckluZm8uV29ya1NpemUuV2lkdGggLyBQYW5lbC5DaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgT3V0Q2hpbGQ6IEZWZXJ0ZXggPSB7IC4uLkNoaWxkIH07XG4gICAgICAgICAgICAgICAgT3V0Q2hpbGQuU2l6ZSA9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAuLi5Nb25pdG9ySW5mby5Xb3JrU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgV2lkdGg6IFVuaWZvcm1XaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgWDogVW5pZm9ybVdpZHRoICogSW5kZXggKyBNb25pdG9ySW5mby5Xb3JrU2l6ZS5YXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPdXRDaGlsZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBDZWxsczogQXJyYXk8RkNlbGw+ID0gR2V0QWxsQ2VsbHMoRm9yZXN0KTtcblxuICAgIENlbGxzLmZvckVhY2goKENlbGw6IEZDZWxsKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coYFNldHRpbmcgcG9zaXRpb24gb2YgJHsgR2V0V2luZG93VGl0bGUoQ2VsbC5IYW5kbGUpIH0gdG8gJHsgSlNPTi5zdHJpbmdpZnkoQ2VsbC5TaXplKSB9LmApO1xuICAgICAgICBTZXRXaW5kb3dQb3NpdGlvbihDZWxsLkhhbmRsZSwgQ2VsbC5TaXplKTtcbiAgICAgICAgLyogQXQgbGVhc3QgZm9yIG5vdywgaWdub3JlIFNvcnJlbGxXbSB3aW5kb3dzLiAqL1xuICAgICAgICAvLyBpZiAoR2V0V2luZG93VGl0bGUoQ2VsbC5IYW5kbGUpICE9PSBcIlNvcnJlbGxXbVwiKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBTZXRXaW5kb3dQb3NpdGlvbihDZWxsLkhhbmRsZSwgQ2VsbC5TaXplKTtcbiAgICAgICAgLy8gfVxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coYENhbGxlZCBTZXRXaW5kb3dQb3NpdGlvbiBmb3IgJHsgQ2VsbHMubGVuZ3RoIH0gd2luZG93cy5gKTtcbn07XG5cbmNvbnN0IElzQ2VsbCA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiBWZXJ0ZXggaXMgRkNlbGwgPT5cbntcbiAgICByZXR1cm4gXCJIYW5kbGVcIiBpbiBWZXJ0ZXg7XG59O1xuXG5leHBvcnQgY29uc3QgRmxhdHRlbiA9ICgpOiBBcnJheTxGVmVydGV4PiA9Plxue1xuICAgIGNvbnN0IE91dEFycmF5OiBBcnJheTxGVmVydGV4PiA9IFsgXTtcblxuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBPdXRBcnJheS5wdXNoKFZlcnRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgT3V0QXJyYXkucHVzaCguLi5Gb3Jlc3QpO1xuXG4gICAgcmV0dXJuIE91dEFycmF5O1xufTtcblxuLyoqXG4gKiBSdW4gYSBmdW5jdGlvbiBmb3IgZWFjaCB2ZXJ0ZXggdW50aWwgdGhlIGZ1bmN0aW9uIHJldHVybnMgYGZhbHNlYCBmb3JcbiAqIGFuIGl0ZXJhdGlvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IFRyYXZlcnNlID0gKEluRnVuY3Rpb246IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiB2b2lkID0+XG57XG4gICAgbGV0IENvbnRpbnVlczogYm9vbGVhbiA9IHRydWU7XG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ29udGludWVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250aW51ZXMgPSBJbkZ1bmN0aW9uKFZlcnRleCk7XG4gICAgICAgICAgICBpZiAoQ29udGludWVzICYmIFwiQ2hpbGRyZW5cIiBpbiBWZXJ0ZXgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWN1cnJlbmNlKENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBGb3Jlc3QpXG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFBhbmVsLkNoaWxkcmVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBSZWN1cnJlbmNlKENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IEdldEFsbENlbGxzID0gKFBhbmVsczogQXJyYXk8RlBhbmVsPik6IEFycmF5PEZDZWxsPiA9Plxue1xuICAgIGNvbnN0IFJlc3VsdDogQXJyYXk8RkNlbGw+ID0gWyBdO1xuXG4gICAgZnVuY3Rpb24gVHJhdmVyc2UoVmVydGV4OiBGVmVydGV4KTogdm9pZFxuICAgIHtcbiAgICAgICAgaWYgKFwiSGFuZGxlXCIgaW4gVmVydGV4KVxuICAgICAgICB7XG4gICAgICAgICAgICBSZXN1bHQucHVzaChWZXJ0ZXggYXMgRkNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFwiQ2hpbGRyZW5cIiBpbiBWZXJ0ZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgQ2hpbGQgb2YgVmVydGV4LkNoaWxkcmVuKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFRyYXZlcnNlKENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgUGFuZWwgb2YgUGFuZWxzKVxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBQYW5lbC5DaGlsZHJlbilcbiAgICAgICAge1xuICAgICAgICAgICAgVHJhdmVyc2UoQ2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlc3VsdDtcbn07XG5cbmV4cG9ydCBjb25zdCBFeGlzdHMgPSAoUHJlZGljYXRlOiAoVmVydGV4OiBGVmVydGV4KSA9PiBib29sZWFuKTogYm9vbGVhbiA9Plxue1xuICAgIGxldCBEb2VzRXhpc3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBUcmF2ZXJzZSgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKCFEb2VzRXhpc3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIERvZXNFeGlzdCA9IFByZWRpY2F0ZShWZXJ0ZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICFEb2VzRXhpc3Q7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gRG9lc0V4aXN0O1xufTtcblxuLyoqIEBUT0RPICovXG5leHBvcnQgY29uc3QgRXhpc3RzRXhhY3RseU9uZSA9IChQcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuID0+XG57XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IEZvckFsbCA9IChQcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuID0+XG57XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IElzV2luZG93VGlsZWQgPSAoSGFuZGxlOiBIV2luZG93KTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBFeGlzdHMoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBJc0NlbGwoVmVydGV4KSAmJiBBcmVIYW5kbGVzRXF1YWwoVmVydGV4LkhhbmRsZSwgSGFuZGxlKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRQYW5lbHMgPSAoKTogQXJyYXk8RlBhbmVsPiA9Plxue1xuICAgIGNvbnN0IFZlcnRpY2VzOiBBcnJheTxGVmVydGV4PiA9IEZsYXR0ZW4oKTtcbiAgICBMb2coXCJJbiBGbGF0dGVuLCB2ZXJ0aWNlcyBhcmUgXCIsIFZlcnRpY2VzKTtcbiAgICByZXR1cm4gVmVydGljZXMuZmlsdGVyKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+ICFJc0NlbGwoVmVydGV4KSkgYXMgQXJyYXk8RlBhbmVsPjtcbn07XG5cbkluaXRpYWxpemVUcmVlKCk7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleUlkLCBGVmlydHVhbEtleSB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmNvbnN0IEtleUlkc0J5SWQ6IFJlYWRvbmx5PFJlY29yZDxGVmlydHVhbEtleSwgRktleUlkPj4gPVxue1xuICAgIDB4MDU6IFwiTW91c2VYMVwiLFxuICAgIDB4MDY6IFwiTW91c2VYMlwiLFxuICAgIDB4MDg6IFwiQmFja3NwYWNlXCIsXG4gICAgMHgwOTogXCJUYWJcIixcbiAgICAweDBEOiBcIkVudGVyXCIsXG4gICAgMHgxMDogXCJTaGlmdFwiLFxuICAgIDB4MTE6IFwiQ3RybFwiLFxuICAgIDB4MTI6IFwiQWx0XCIsXG4gICAgMHgxMzogXCJQYXVzZVwiLFxuICAgIDB4MjA6IFwiU3BhY2VcIixcbiAgICAweDIxOiBcIlBnVXBcIixcbiAgICAweDIyOiBcIlBnRG93blwiLFxuICAgIDB4MjM6IFwiRW5kXCIsXG4gICAgMHgyNDogXCJIb21lXCIsXG4gICAgMHgyNTogXCJMZWZ0QXJyb3dcIixcbiAgICAweDI2OiBcIlVwQXJyb3dcIixcbiAgICAweDI3OiBcIlJpZ2h0QXJyb3dcIixcbiAgICAweDI4OiBcIkRvd25BcnJvd1wiLFxuICAgIDB4MkQ6IFwiSW5zXCIsXG4gICAgMHgyRTogXCJEZWxcIixcbiAgICAweDMwOiBcIjBcIixcbiAgICAweDMxOiBcIjFcIixcbiAgICAweDMyOiBcIjJcIixcbiAgICAweDMzOiBcIjNcIixcbiAgICAweDM0OiBcIjRcIixcbiAgICAweDM1OiBcIjVcIixcbiAgICAweDM2OiBcIjZcIixcbiAgICAweDM3OiBcIjdcIixcbiAgICAweDM4OiBcIjhcIixcbiAgICAweDM5OiBcIjlcIixcbiAgICAweDQxOiBcIkFcIixcbiAgICAweDQyOiBcIkJcIixcbiAgICAweDQzOiBcIkNcIixcbiAgICAweDQ0OiBcIkRcIixcbiAgICAweDQ1OiBcIkVcIixcbiAgICAweDQ2OiBcIkZcIixcbiAgICAweDQ3OiBcIkdcIixcbiAgICAweDQ4OiBcIkhcIixcbiAgICAweDQ5OiBcIklcIixcbiAgICAweDRBOiBcIkpcIixcbiAgICAweDRCOiBcIktcIixcbiAgICAweDRDOiBcIkxcIixcbiAgICAweDREOiBcIk1cIixcbiAgICAweDRFOiBcIk5cIixcbiAgICAweDRGOiBcIk9cIixcbiAgICAweDUwOiBcIlBcIixcbiAgICAweDUxOiBcIlFcIixcbiAgICAweDUyOiBcIlJcIixcbiAgICAweDUzOiBcIlNcIixcbiAgICAweDU0OiBcIlRcIixcbiAgICAweDU1OiBcIlVcIixcbiAgICAweDU2OiBcIlZcIixcbiAgICAweDU3OiBcIldcIixcbiAgICAweDU4OiBcIlhcIixcbiAgICAweDU5OiBcIllcIixcbiAgICAweDVBOiBcIlpcIixcbiAgICAweDVCOiBcIkxXaW5cIixcbiAgICAweDVDOiBcIlJXaW5cIixcbiAgICAweDVEOiBcIkFwcGxpY2F0aW9uc1wiLFxuICAgIDB4NjA6IFwiTnVtMFwiLFxuICAgIDB4NjE6IFwiTnVtMVwiLFxuICAgIDB4NjI6IFwiTnVtMlwiLFxuICAgIDB4NjM6IFwiTnVtM1wiLFxuICAgIDB4NjQ6IFwiTnVtNFwiLFxuICAgIDB4NjU6IFwiTnVtNVwiLFxuICAgIDB4NjY6IFwiTnVtNlwiLFxuICAgIDB4Njc6IFwiTnVtN1wiLFxuICAgIDB4Njg6IFwiTnVtOFwiLFxuICAgIDB4Njk6IFwiTnVtOVwiLFxuICAgIDB4NkE6IFwiTXVsdGlwbHlcIixcbiAgICAweDZCOiBcIkFkZFwiLFxuICAgIDB4NkQ6IFwiU3VidHJhY3RcIixcbiAgICAweDZFOiBcIk51bURlY2ltYWxcIixcbiAgICAweDZGOiBcIk51bURpdmlkZVwiLFxuICAgIDB4NzA6IFwiRjFcIixcbiAgICAweDcxOiBcIkYyXCIsXG4gICAgMHg3MjogXCJGM1wiLFxuICAgIDB4NzM6IFwiRjRcIixcbiAgICAweDc0OiBcIkY1XCIsXG4gICAgMHg3NTogXCJGNlwiLFxuICAgIDB4NzY6IFwiRjdcIixcbiAgICAweDc3OiBcIkY4XCIsXG4gICAgMHg3ODogXCJGOVwiLFxuICAgIDB4Nzk6IFwiRjEwXCIsXG4gICAgMHg3QTogXCJGMTFcIixcbiAgICAweDdCOiBcIkYxMlwiLFxuICAgIDB4N0M6IFwiRjEzXCIsXG4gICAgMHg3RDogXCJGMTRcIixcbiAgICAweDdFOiBcIkYxNVwiLFxuICAgIDB4N0Y6IFwiRjE2XCIsXG4gICAgMHg4MDogXCJGMTdcIixcbiAgICAweDgxOiBcIkYxOFwiLFxuICAgIDB4ODI6IFwiRjE5XCIsXG4gICAgMHg4MzogXCJGMjBcIixcbiAgICAweDg0OiBcIkYyMVwiLFxuICAgIDB4ODU6IFwiRjIyXCIsXG4gICAgMHg4NjogXCJGMjNcIixcbiAgICAweDg3OiBcIkYyNFwiLFxuICAgIDB4QTA6IFwiTFNoaWZ0XCIsXG4gICAgMHhBMTogXCJSU2hpZnRcIixcbiAgICAweEEyOiBcIkxDdHJsXCIsXG4gICAgMHhBMzogXCJSQ3RybFwiLFxuICAgIDB4QTQ6IFwiTEFsdFwiLFxuICAgIDB4QTU6IFwiUkFsdFwiLFxuICAgIDB4QTY6IFwiQnJvd3NlckJhY2tcIixcbiAgICAweEE3OiBcIkJyb3dzZXJGb3J3YXJkXCIsXG4gICAgMHhBODogXCJCcm93c2VyUmVmcmVzaFwiLFxuICAgIDB4QTk6IFwiQnJvd3NlclN0b3BcIixcbiAgICAweEFBOiBcIkJyb3dzZXJTZWFyY2hcIixcbiAgICAweEFCOiBcIkJyb3dzZXJGYXZvcml0ZXNcIixcbiAgICAweEFDOiBcIkJyb3dzZXJTdGFydFwiLFxuICAgIDB4QjA6IFwiTmV4dFRyYWNrXCIsXG4gICAgMHhCMTogXCJQcmV2aW91c1RyYWNrXCIsXG4gICAgMHhCMjogXCJTdG9wTWVkaWFcIixcbiAgICAweEIzOiBcIlBsYXlQYXVzZU1lZGlhXCIsXG4gICAgMHhCNDogXCJTdGFydE1haWxcIixcbiAgICAweEI1OiBcIlNlbGVjdE1lZGlhXCIsXG4gICAgMHhCNjogXCJTdGFydEFwcGxpY2F0aW9uT25lXCIsXG4gICAgMHhCNzogXCJTdGFydEFwcGxpY2F0aW9uVHdvXCIsXG4gICAgMHhCQTogXCI7XCIsXG4gICAgMHhCQjogXCIrXCIsXG4gICAgMHhCQzogXCIsXCIsXG4gICAgMHhCRDogXCItXCIsXG4gICAgMHhCRTogXCIuXCIsXG4gICAgMHhCRjogXCIvXCIsXG4gICAgMHhDMDogXCJgXCIsXG4gICAgMHhEQjogXCJbXCIsXG4gICAgMHhEQzogXCJcXFxcXCIsXG4gICAgMHhERDogXCJdXCIsXG4gICAgMHhERTogXCInXCJcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBHZXRLZXlOYW1lID0gKFZrQ29kZTogRlZpcnR1YWxLZXkpOiBGS2V5SWQgPT5cbntcbiAgICByZXR1cm4gS2V5SWRzQnlJZFtWa0NvZGVdO1xufTtcblxuLyoqIERldmVsb3Blci1mcmllbmRseSBuYW1lcyBvZiBrZXkgY29kZXMuICovXG5leHBvcnQgY29uc3QgVms6IFJlYWRvbmx5PFJlY29yZDxGS2V5SWQsIEZWaXJ0dWFsS2V5Pj4gPVxue1xuICAgIE1vdXNlWDE6IDB4MDUsXG4gICAgTW91c2VYMjogMHgwNixcbiAgICBCYWNrc3BhY2U6IDB4MDgsXG4gICAgVGFiOiAweDA5LFxuICAgIEVudGVyOiAweDBELFxuICAgIFNoaWZ0OiAweDEwLFxuICAgIEN0cmw6IDB4MTEsXG4gICAgQWx0OiAweDEyLFxuICAgIFBhdXNlOiAweDEzLFxuICAgIFNwYWNlOiAweDIwLFxuICAgIFBnVXA6IDB4MjEsXG4gICAgUGdEb3duOiAweDIyLFxuICAgIEVuZDogMHgyMyxcbiAgICBIb21lOiAweDI0LFxuICAgIExlZnRBcnJvdzogMHgyNSxcbiAgICBVcEFycm93OiAweDI2LFxuICAgIFJpZ2h0QXJyb3c6IDB4MjcsXG4gICAgRG93bkFycm93OiAweDI4LFxuICAgIEluczogMHgyRCxcbiAgICBEZWw6IDB4MkUsXG4gICAgMDogMHgzMCxcbiAgICAxOiAweDMxLFxuICAgIDI6IDB4MzIsXG4gICAgMzogMHgzMyxcbiAgICA0OiAweDM0LFxuICAgIDU6IDB4MzUsXG4gICAgNjogMHgzNixcbiAgICA3OiAweDM3LFxuICAgIDg6IDB4MzgsXG4gICAgOTogMHgzOSxcbiAgICBBOiAweDQxLFxuICAgIEI6IDB4NDIsXG4gICAgQzogMHg0MyxcbiAgICBEOiAweDQ0LFxuICAgIEU6IDB4NDUsXG4gICAgRjogMHg0NixcbiAgICBHOiAweDQ3LFxuICAgIEg6IDB4NDgsXG4gICAgSTogMHg0OSxcbiAgICBKOiAweDRBLFxuICAgIEs6IDB4NEIsXG4gICAgTDogMHg0QyxcbiAgICBNOiAweDRELFxuICAgIE46IDB4NEUsXG4gICAgTzogMHg0RixcbiAgICBQOiAweDUwLFxuICAgIFE6IDB4NTEsXG4gICAgUjogMHg1MixcbiAgICBTOiAweDUzLFxuICAgIFQ6IDB4NTQsXG4gICAgVTogMHg1NSxcbiAgICBWOiAweDU2LFxuICAgIFc6IDB4NTcsXG4gICAgWDogMHg1OCxcbiAgICBZOiAweDU5LFxuICAgIFo6IDB4NUEsXG4gICAgTFdpbjogMHg1QixcbiAgICBSV2luOiAweDVDLFxuICAgIEFwcGxpY2F0aW9uczogMHg1RCxcbiAgICBOdW0wOiAweDYwLFxuICAgIE51bTE6IDB4NjEsXG4gICAgTnVtMjogMHg2MixcbiAgICBOdW0zOiAweDYzLFxuICAgIE51bTQ6IDB4NjQsXG4gICAgTnVtNTogMHg2NSxcbiAgICBOdW02OiAweDY2LFxuICAgIE51bTc6IDB4NjcsXG4gICAgTnVtODogMHg2OCxcbiAgICBOdW05OiAweDY5LFxuICAgIE11bHRpcGx5OiAweDZBLFxuICAgIEFkZDogMHg2QixcbiAgICBTdWJ0cmFjdDogMHg2RCxcbiAgICBOdW1EZWNpbWFsOiAweDZFLFxuICAgIE51bURpdmlkZTogMHg2RixcbiAgICBGMTogMHg3MCxcbiAgICBGMjogMHg3MSxcbiAgICBGMzogMHg3MixcbiAgICBGNDogMHg3MyxcbiAgICBGNTogMHg3NCxcbiAgICBGNjogMHg3NSxcbiAgICBGNzogMHg3NixcbiAgICBGODogMHg3NyxcbiAgICBGOTogMHg3OCxcbiAgICBGMTA6IDB4NzksXG4gICAgRjExOiAweDdBLFxuICAgIEYxMjogMHg3QixcbiAgICBGMTM6IDB4N0MsXG4gICAgRjE0OiAweDdELFxuICAgIEYxNTogMHg3RSxcbiAgICBGMTY6IDB4N0YsXG4gICAgRjE3OiAweDgwLFxuICAgIEYxODogMHg4MSxcbiAgICBGMTk6IDB4ODIsXG4gICAgRjIwOiAweDgzLFxuICAgIEYyMTogMHg4NCxcbiAgICBGMjI6IDB4ODUsXG4gICAgRjIzOiAweDg2LFxuICAgIEYyNDogMHg4NyxcbiAgICBMU2hpZnQ6IDB4QTAsXG4gICAgUlNoaWZ0OiAweEExLFxuICAgIExDdHJsOiAweEEyLFxuICAgIFJDdHJsOiAweEEzLFxuICAgIExBbHQ6IDB4QTQsXG4gICAgUkFsdDogMHhBNSxcbiAgICBCcm93c2VyQmFjazogMHhBNixcbiAgICBCcm93c2VyRm9yd2FyZDogMHhBNyxcbiAgICBCcm93c2VyUmVmcmVzaDogMHhBOCxcbiAgICBCcm93c2VyU3RvcDogMHhBOSxcbiAgICBCcm93c2VyU2VhcmNoOiAweEFBLFxuICAgIEJyb3dzZXJGYXZvcml0ZXM6IDB4QUIsXG4gICAgQnJvd3NlclN0YXJ0OiAweEFDLFxuICAgIE5leHRUcmFjazogMHhCMCxcbiAgICBQcmV2aW91c1RyYWNrOiAweEIxLFxuICAgIFN0b3BNZWRpYTogMHhCMixcbiAgICBQbGF5UGF1c2VNZWRpYTogMHhCMyxcbiAgICBTdGFydE1haWw6IDB4QjQsXG4gICAgU2VsZWN0TWVkaWE6IDB4QjUsXG4gICAgU3RhcnRBcHBsaWNhdGlvbk9uZTogMHhCNixcbiAgICBTdGFydEFwcGxpY2F0aW9uVHdvOiAweEI3LFxuICAgIFwiO1wiOiAweEJBLFxuICAgIFwiK1wiOiAweEJCLFxuICAgIFwiLFwiOiAweEJDLFxuICAgIFwiLVwiOiAweEJELFxuICAgIFwiLlwiOiAweEJFLFxuICAgIFwiL1wiOiAweEJGLFxuICAgIFwiYFwiOiAweEMwLFxuICAgIFwiW1wiOiAweERCLFxuICAgIFwiXFxcXFwiOiAweERDLFxuICAgIFwiXVwiOiAweERELFxuICAgIFwiJ1wiOiAweERFXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgVmlydHVhbEtleXM6IFJlYWRvbmx5PEFycmF5PEZWaXJ0dWFsS2V5Pj4gPVxuW1xuICAgIDB4MDUsXG4gICAgMHgwNixcbiAgICAweDA4LFxuICAgIDB4MDksXG4gICAgMHgwRCxcbiAgICAweDEwLFxuICAgIDB4MTEsXG4gICAgMHgxMixcbiAgICAweDEzLFxuICAgIDB4MjAsXG4gICAgMHgyMSxcbiAgICAweDIyLFxuICAgIDB4MjMsXG4gICAgMHgyNCxcbiAgICAweDI1LFxuICAgIDB4MjYsXG4gICAgMHgyNyxcbiAgICAweDI4LFxuICAgIDB4MkQsXG4gICAgMHgyRSxcbiAgICAweDMwLFxuICAgIDB4MzEsXG4gICAgMHgzMixcbiAgICAweDMzLFxuICAgIDB4MzQsXG4gICAgMHgzNSxcbiAgICAweDM2LFxuICAgIDB4MzcsXG4gICAgMHgzOCxcbiAgICAweDM5LFxuICAgIDB4NDEsXG4gICAgMHg0MixcbiAgICAweDQzLFxuICAgIDB4NDQsXG4gICAgMHg0NSxcbiAgICAweDQ2LFxuICAgIDB4NDcsXG4gICAgMHg0OCxcbiAgICAweDQ5LFxuICAgIDB4NEEsXG4gICAgMHg0QixcbiAgICAweDRDLFxuICAgIDB4NEQsXG4gICAgMHg0RSxcbiAgICAweDRGLFxuICAgIDB4NTAsXG4gICAgMHg1MSxcbiAgICAweDUyLFxuICAgIDB4NTMsXG4gICAgMHg1NCxcbiAgICAweDU1LFxuICAgIDB4NTYsXG4gICAgMHg1NyxcbiAgICAweDU4LFxuICAgIDB4NTksXG4gICAgMHg1QSxcbiAgICAweDVCLFxuICAgIDB4NUMsXG4gICAgMHg1RCxcbiAgICAweDYwLFxuICAgIDB4NjEsXG4gICAgMHg2MixcbiAgICAweDYzLFxuICAgIDB4NjQsXG4gICAgMHg2NSxcbiAgICAweDY2LFxuICAgIDB4NjcsXG4gICAgMHg2OCxcbiAgICAweDY5LFxuICAgIDB4NkEsXG4gICAgMHg2QixcbiAgICAweDZELFxuICAgIDB4NkUsXG4gICAgMHg2RixcbiAgICAweDcwLFxuICAgIDB4NzEsXG4gICAgMHg3MixcbiAgICAweDczLFxuICAgIDB4NzQsXG4gICAgMHg3NSxcbiAgICAweDc2LFxuICAgIDB4NzcsXG4gICAgMHg3OCxcbiAgICAweDc5LFxuICAgIDB4N0EsXG4gICAgMHg3QixcbiAgICAweDdDLFxuICAgIDB4N0QsXG4gICAgMHg3RSxcbiAgICAweDdGLFxuICAgIDB4ODAsXG4gICAgMHg4MSxcbiAgICAweDgyLFxuICAgIDB4ODMsXG4gICAgMHg4NCxcbiAgICAweDg1LFxuICAgIDB4ODYsXG4gICAgMHg4NyxcbiAgICAweEEwLFxuICAgIDB4QTEsXG4gICAgMHhBMixcbiAgICAweEEzLFxuICAgIDB4QTQsXG4gICAgMHhBNSxcbiAgICAweEE2LFxuICAgIDB4QTcsXG4gICAgMHhBOCxcbiAgICAweEE5LFxuICAgIDB4QUEsXG4gICAgMHhBQixcbiAgICAweEFDLFxuICAgIDB4QjAsXG4gICAgMHhCMSxcbiAgICAweEIyLFxuICAgIDB4QjMsXG4gICAgMHhCNCxcbiAgICAweEI1LFxuICAgIDB4QjYsXG4gICAgMHhCNyxcbiAgICAweEJBLFxuICAgIDB4QkIsXG4gICAgMHhCQyxcbiAgICAweEJELFxuICAgIDB4QkUsXG4gICAgMHhCRixcbiAgICAweEMwLFxuICAgIDB4REIsXG4gICAgMHhEQyxcbiAgICAweERELFxuICAgIDB4REVcbl0gYXMgY29uc3Q7XG5cbi8qIGVzbGludC1lbmFibGUgc29ydC1rZXlzICovXG5cbi8qKiBJcyB0aGUgYEtleUNvZGVgIGEgVksgQ29kZSAqKnRoYXQgdGhpcyBhcHAgdXNlcyoqLiAqL1xuZXhwb3J0IGNvbnN0IElzVmlydHVhbEtleSA9IChLZXlDb2RlOiBudW1iZXIpOiBLZXlDb2RlIGlzIEZWaXJ0dWFsS2V5ID0+XG57XG4gICAgcmV0dXJuIFZpcnR1YWxLZXlzLmluY2x1ZGVzKEtleUNvZGUgYXMgRlZpcnR1YWxLZXkpO1xufTtcbiIsInZhciBteU1vZHVsZSA9IHJlcXVpcmUoXCJiaW5kaW5nc1wiKShcImhlbGxvXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBteU1vZHVsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJidWZmZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb25zdGFudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3RyZWFtXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmluZ19kZWNvZGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ6bGliXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuX193ZWJwYWNrX3JlcXVpcmVfXy5jID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi5idW5kbGUuZGV2LmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJsb2FkZWRcIiwgb3RoZXJ3aXNlIG5vdCBsb2FkZWQgeWV0XG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMVxufTtcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG52YXIgaW5zdGFsbENodW5rID0gKGNodW5rKSA9PiB7XG5cdHZhciBtb3JlTW9kdWxlcyA9IGNodW5rLm1vZHVsZXMsIGNodW5rSWRzID0gY2h1bmsuaWRzLCBydW50aW1lID0gY2h1bmsucnVudGltZTtcblx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspXG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDE7XG5cbn07XG5cbi8vIHJlcXVpcmUoKSBjaHVuayBsb2FkaW5nIGZvciBqYXZhc2NyaXB0XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYucmVxdWlyZSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbnN0YWxsQ2h1bmsocmVxdWlyZShcIi4vXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLnUoY2h1bmtJZCkpKTtcblx0XHR9IGVsc2UgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMTtcblx0fVxufTtcblxuLy8gbm8gZXh0ZXJuYWwgaW5zdGFsbCBjaHVua1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwiIiwiLy8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vU291cmNlL01haW4vTWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==