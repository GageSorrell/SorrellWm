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
/* harmony export */   AnnotatePanel: () => (/* binding */ AnnotatePanel),
/* harmony export */   Exists: () => (/* binding */ Exists),
/* harmony export */   ExistsExactlyOne: () => (/* binding */ ExistsExactlyOne),
/* harmony export */   Flatten: () => (/* binding */ Flatten),
/* harmony export */   ForAll: () => (/* binding */ ForAll),
/* harmony export */   GetForest: () => (/* binding */ GetForest),
/* harmony export */   GetPanels: () => (/* binding */ GetPanels),
/* harmony export */   GetRootPanel: () => (/* binding */ GetRootPanel),
/* harmony export */   IsWindowTiled: () => (/* binding */ IsWindowTiled),
/* harmony export */   LogForest: () => (/* binding */ LogForest),
/* harmony export */   Traverse: () => (/* binding */ Traverse),
/* harmony export */   UpdateForest: () => (/* binding */ UpdateForest)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Monitor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Monitor */ "./Source/Main/Monitor.ts");
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
    const Monitors = (0,_Monitor__WEBPACK_IMPORTED_MODULE_3__.GetMonitors)();
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
const Traverse = (InFunction, Entry) => {
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
    if (Entry) {
        Recurrence(Entry);
    }
    else {
        for (const Panel of Forest) {
            for (const Child of Panel.Children) {
                Recurrence(Child);
            }
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
        return IsCell(Vertex) && (0,_Core_Utility__WEBPACK_IMPORTED_MODULE_1__.AreHandlesEqual)(Vertex.Handle, Handle);
    });
};
const GetPanels = () => {
    const Vertices = Flatten();
    return Vertices.filter((Vertex) => !IsCell(Vertex));
};
function PanelContainsVertex(currentVertex, targetVertex) {
    if (currentVertex === targetVertex) {
        return true;
    }
    // If this is a panel, check its children recursively
    if ("Children" in currentVertex) {
        for (const child of currentVertex.Children) {
            if (PanelContainsVertex(child, targetVertex)) {
                return true;
            }
        }
    }
    return false;
}
const GetRootPanel = (Vertex) => {
    for (const Panel of Forest) {
        if (PanelContainsVertex(Panel, Vertex)) {
            return Panel;
        }
    }
    return undefined;
};
const GetPanelApplicationNames = (Panel) => {
    const ResultNames = [];
    Traverse((Vertex) => {
        if ("Handle" in Vertex) {
            const FriendlyName = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetApplicationFriendlyName)(Vertex.Handle);
            if (FriendlyName !== undefined) {
                ResultNames.push(FriendlyName);
            }
            if (ResultNames.length >= 3) {
                return false;
            }
        }
        return true;
    }, Panel);
    return ResultNames;
};
const AnnotatePanel = async (Panel) => {
    const ScreenshotBuffer = await fs__WEBPACK_IMPORTED_MODULE_2__.promises.readFile((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.CaptureScreenSectionToTempPngFile)(Panel.Size));
    const RootPanel = GetRootPanel(Panel);
    if (RootPanel !== undefined && RootPanel.MonitorId !== undefined) {
        const ApplicationNames = GetPanelApplicationNames(Panel);
        const IsRoot = RootPanel === Panel;
        const Monitor = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetMonitorFriendlyName)(RootPanel.MonitorId) || "";
        const Screenshot = "data:image/png;base64," + ScreenshotBuffer.toString("base64");
        return {
            ...Panel,
            ApplicationNames,
            IsRoot,
            Monitor,
            Screenshot
        };
    }
    return undefined;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxjQUFjO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsWUFBWTtJQUNsQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsYUFBYTtJQUNuQixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QixJQUFJLEVBQUUsY0FBYztJQUNwQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsZUFBZTtJQUNyQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxhQUFhO0lBQ25CLElBQUksRUFBRSxxQkFBcUI7SUFDM0IsSUFBSSxFQUFFLHFCQUFxQjtJQUMzQixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0NBQ0gsQ0FBQztBQUVKLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBbUIsRUFBVSxFQUFFO0lBRXRELE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQUVGLDZDQUE2QztBQUN0QyxNQUFNLEVBQUUsR0FDZjtJQUNJLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixTQUFTLEVBQUUsSUFBSTtJQUNmLEdBQUcsRUFBRSxJQUFJO0lBQ1QsS0FBSyxFQUFFLElBQUk7SUFDWCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLElBQUk7SUFDVCxLQUFLLEVBQUUsSUFBSTtJQUNYLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsSUFBSTtJQUNaLEdBQUcsRUFBRSxJQUFJO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixTQUFTLEVBQUUsSUFBSTtJQUNmLE9BQU8sRUFBRSxJQUFJO0lBQ2IsVUFBVSxFQUFFLElBQUk7SUFDaEIsU0FBUyxFQUFFLElBQUk7SUFDZixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFlBQVksRUFBRSxJQUFJO0lBQ2xCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsUUFBUSxFQUFFLElBQUk7SUFDZCxHQUFHLEVBQUUsSUFBSTtJQUNULFFBQVEsRUFBRSxJQUFJO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFDaEIsU0FBUyxFQUFFLElBQUk7SUFDZixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLElBQUk7SUFDWCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixXQUFXLEVBQUUsSUFBSTtJQUNqQixjQUFjLEVBQUUsSUFBSTtJQUNwQixjQUFjLEVBQUUsSUFBSTtJQUNwQixXQUFXLEVBQUUsSUFBSTtJQUNqQixhQUFhLEVBQUUsSUFBSTtJQUNuQixnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFDbkIsU0FBUyxFQUFFLElBQUk7SUFDZixjQUFjLEVBQUUsSUFBSTtJQUNwQixTQUFTLEVBQUUsSUFBSTtJQUNmLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsbUJBQW1CLEVBQUUsSUFBSTtJQUN6QixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0NBQ0gsQ0FBQztBQUVKLE1BQU0sV0FBVyxHQUN4QjtJQUNJLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7Q0FDRSxDQUFDO0FBRVgsNkJBQTZCO0FBRTdCLHlEQUF5RDtBQUNsRCxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQWUsRUFBMEIsRUFBRTtJQUVwRSxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBc0IsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3phRixJQUFJLFFBQVEsR0FBRyxtQkFBTyxDQUFDLHFEQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7O0FDRDFCOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOzs7OztXQy9CQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOzs7OztXQ1JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0JBQWdCLHFCQUFxQjtXQUNyQzs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGFBQWE7V0FDYjtXQUNBLElBQUk7V0FDSjtXQUNBOztXQUVBOztXQUVBOztXQUVBOzs7OztVRXJDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2JpbmRpbmdzL2JpbmRpbmdzLmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9maWxlLXVyaS10by1wYXRoL2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvU2lkZUVmZmVjdHMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9VdGlsaXR5LnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0Rpc3BhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vSG9vay50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9LZXlib2FyZC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NYWluLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL01lc3NhZ2VMb29wLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL01vbml0b3IudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTm9kZUlwYy50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9UcmVlLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9SZW5kZXJlci9Eb21haW4vQ29tbW9uL0NvbXBvbmVudC9LZXlib2FyZC9LZXlib2FyZC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9XaW5kb3dzL2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiYXNzZXJ0XCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJidWZmZXJcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNoaWxkX3Byb2Nlc3NcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNvbnN0YW50c1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZXZlbnRzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiaHR0cFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiaHR0cHNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcIm9zXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJxdWVyeXN0cmluZ1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwic3RyZWFtXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJzdHJpbmdfZGVjb2RlclwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidHR5XCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ1cmxcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInV0aWxcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInpsaWJcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL3JlcXVpcmUgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpLFxuICBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxuICBmaWxlVVJMVG9QYXRoID0gcmVxdWlyZSgnZmlsZS11cmktdG8tcGF0aCcpLFxuICBqb2luID0gcGF0aC5qb2luLFxuICBkaXJuYW1lID0gcGF0aC5kaXJuYW1lLFxuICBleGlzdHMgPVxuICAgIChmcy5hY2Nlc3NTeW5jICYmXG4gICAgICBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZnMuYWNjZXNzU3luYyhwYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pIHx8XG4gICAgZnMuZXhpc3RzU3luYyB8fFxuICAgIHBhdGguZXhpc3RzU3luYyxcbiAgZGVmYXVsdHMgPSB7XG4gICAgYXJyb3c6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQVJST1cgfHwgJyDihpIgJyxcbiAgICBjb21waWxlZDogcHJvY2Vzcy5lbnYuTk9ERV9CSU5ESU5HU19DT01QSUxFRF9ESVIgfHwgJ2NvbXBpbGVkJyxcbiAgICBwbGF0Zm9ybTogcHJvY2Vzcy5wbGF0Zm9ybSxcbiAgICBhcmNoOiBwcm9jZXNzLmFyY2gsXG4gICAgbm9kZVByZUd5cDpcbiAgICAgICdub2RlLXYnICtcbiAgICAgIHByb2Nlc3MudmVyc2lvbnMubW9kdWxlcyArXG4gICAgICAnLScgK1xuICAgICAgcHJvY2Vzcy5wbGF0Zm9ybSArXG4gICAgICAnLScgK1xuICAgICAgcHJvY2Vzcy5hcmNoLFxuICAgIHZlcnNpb246IHByb2Nlc3MudmVyc2lvbnMubm9kZSxcbiAgICBiaW5kaW5nczogJ2JpbmRpbmdzLm5vZGUnLFxuICAgIHRyeTogW1xuICAgICAgLy8gbm9kZS1neXAncyBsaW5rZWQgdmVyc2lvbiBpbiB0aGUgXCJidWlsZFwiIGRpclxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS13YWYgYW5kIGd5cF9hZGRvbiAoYS5rLmEgbm9kZS1neXApXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2J1aWxkJywgJ0RlYnVnJywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIERlYnVnIGZpbGVzLCBmb3IgZGV2ZWxvcG1lbnQgKGxlZ2FjeSBiZWhhdmlvciwgcmVtb3ZlIGZvciBub2RlIHYwLjkpXG4gICAgICBbJ21vZHVsZV9yb290JywgJ291dCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgLy8gUmVsZWFzZSBmaWxlcywgYnV0IG1hbnVhbGx5IGNvbXBpbGVkIChsZWdhY3kgYmVoYXZpb3IsIHJlbW92ZSBmb3Igbm9kZSB2MC45KVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdvdXQnLCAnUmVsZWFzZScsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBMZWdhY3kgZnJvbSBub2RlLXdhZiwgbm9kZSA8PSAwLjQueFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdkZWZhdWx0JywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBQcm9kdWN0aW9uIFwiUmVsZWFzZVwiIGJ1aWxkdHlwZSBiaW5hcnkgKG1laC4uLilcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnY29tcGlsZWQnLCAndmVyc2lvbicsICdwbGF0Zm9ybScsICdhcmNoJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBub2RlLXFicyBidWlsZHNcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYWRkb24tYnVpbGQnLCAncmVsZWFzZScsICdpbnN0YWxsLXJvb3QnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYWRkb24tYnVpbGQnLCAnZGVidWcnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ2RlZmF1bHQnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBub2RlLXByZS1neXAgcGF0aCAuL2xpYi9iaW5kaW5nL3tub2RlX2FiaX0te3BsYXRmb3JtfS17YXJjaH1cbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnbGliJywgJ2JpbmRpbmcnLCAnbm9kZVByZUd5cCcsICdiaW5kaW5ncyddXG4gICAgXVxuICB9O1xuXG4vKipcbiAqIFRoZSBtYWluIGBiaW5kaW5ncygpYCBmdW5jdGlvbiBsb2FkcyB0aGUgY29tcGlsZWQgYmluZGluZ3MgZm9yIGEgZ2l2ZW4gbW9kdWxlLlxuICogSXQgdXNlcyBWOCdzIEVycm9yIEFQSSB0byBkZXRlcm1pbmUgdGhlIHBhcmVudCBmaWxlbmFtZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXNcbiAqIGJlaW5nIGludm9rZWQgZnJvbSwgd2hpY2ggaXMgdGhlbiB1c2VkIHRvIGZpbmQgdGhlIHJvb3QgZGlyZWN0b3J5LlxuICovXG5cbmZ1bmN0aW9uIGJpbmRpbmdzKG9wdHMpIHtcbiAgLy8gQXJndW1lbnQgc3VyZ2VyeVxuICBpZiAodHlwZW9mIG9wdHMgPT0gJ3N0cmluZycpIHtcbiAgICBvcHRzID0geyBiaW5kaW5nczogb3B0cyB9O1xuICB9IGVsc2UgaWYgKCFvcHRzKSB7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgLy8gbWFwcyBgZGVmYXVsdHNgIG9udG8gYG9wdHNgIG9iamVjdFxuICBPYmplY3Qua2V5cyhkZWZhdWx0cykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICBpZiAoIShpIGluIG9wdHMpKSBvcHRzW2ldID0gZGVmYXVsdHNbaV07XG4gIH0pO1xuXG4gIC8vIEdldCB0aGUgbW9kdWxlIHJvb3RcbiAgaWYgKCFvcHRzLm1vZHVsZV9yb290KSB7XG4gICAgb3B0cy5tb2R1bGVfcm9vdCA9IGV4cG9ydHMuZ2V0Um9vdChleHBvcnRzLmdldEZpbGVOYW1lKCkpO1xuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSBnaXZlbiBiaW5kaW5ncyBuYW1lIGVuZHMgd2l0aCAubm9kZVxuICBpZiAocGF0aC5leHRuYW1lKG9wdHMuYmluZGluZ3MpICE9ICcubm9kZScpIHtcbiAgICBvcHRzLmJpbmRpbmdzICs9ICcubm9kZSc7XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay93ZWJwYWNrL2lzc3Vlcy80MTc1I2lzc3VlY29tbWVudC0zNDI5MzEwMzVcbiAgdmFyIHJlcXVpcmVGdW5jID1cbiAgICB0eXBlb2YgX193ZWJwYWNrX3JlcXVpcmVfXyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBfX25vbl93ZWJwYWNrX3JlcXVpcmVfX1xuICAgICAgOiByZXF1aXJlO1xuXG4gIHZhciB0cmllcyA9IFtdLFxuICAgIGkgPSAwLFxuICAgIGwgPSBvcHRzLnRyeS5sZW5ndGgsXG4gICAgbixcbiAgICBiLFxuICAgIGVycjtcblxuICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgIG4gPSBqb2luLmFwcGx5KFxuICAgICAgbnVsbCxcbiAgICAgIG9wdHMudHJ5W2ldLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICAgIHJldHVybiBvcHRzW3BdIHx8IHA7XG4gICAgICB9KVxuICAgICk7XG4gICAgdHJpZXMucHVzaChuKTtcbiAgICB0cnkge1xuICAgICAgYiA9IG9wdHMucGF0aCA/IHJlcXVpcmVGdW5jLnJlc29sdmUobikgOiByZXF1aXJlRnVuYyhuKTtcbiAgICAgIGlmICghb3B0cy5wYXRoKSB7XG4gICAgICAgIGIucGF0aCA9IG47XG4gICAgICB9XG4gICAgICByZXR1cm4gYjtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5jb2RlICE9PSAnTU9EVUxFX05PVF9GT1VORCcgJiZcbiAgICAgICAgICBlLmNvZGUgIT09ICdRVUFMSUZJRURfUEFUSF9SRVNPTFVUSU9OX0ZBSUxFRCcgJiZcbiAgICAgICAgICAhL25vdCBmaW5kL2kudGVzdChlLm1lc3NhZ2UpKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXJyID0gbmV3IEVycm9yKFxuICAgICdDb3VsZCBub3QgbG9jYXRlIHRoZSBiaW5kaW5ncyBmaWxlLiBUcmllZDpcXG4nICtcbiAgICAgIHRyaWVzXG4gICAgICAgIC5tYXAoZnVuY3Rpb24oYSkge1xuICAgICAgICAgIHJldHVybiBvcHRzLmFycm93ICsgYTtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICk7XG4gIGVyci50cmllcyA9IHRyaWVzO1xuICB0aHJvdyBlcnI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBiaW5kaW5ncztcblxuLyoqXG4gKiBHZXRzIHRoZSBmaWxlbmFtZSBvZiB0aGUgSmF2YVNjcmlwdCBmaWxlIHRoYXQgaW52b2tlcyB0aGlzIGZ1bmN0aW9uLlxuICogVXNlZCB0byBoZWxwIGZpbmQgdGhlIHJvb3QgZGlyZWN0b3J5IG9mIGEgbW9kdWxlLlxuICogT3B0aW9uYWxseSBhY2NlcHRzIGFuIGZpbGVuYW1lIGFyZ3VtZW50IHRvIHNraXAgd2hlbiBzZWFyY2hpbmcgZm9yIHRoZSBpbnZva2luZyBmaWxlbmFtZVxuICovXG5cbmV4cG9ydHMuZ2V0RmlsZU5hbWUgPSBmdW5jdGlvbiBnZXRGaWxlTmFtZShjYWxsaW5nX2ZpbGUpIHtcbiAgdmFyIG9yaWdQU1QgPSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSxcbiAgICBvcmlnU1RMID0gRXJyb3Iuc3RhY2tUcmFjZUxpbWl0LFxuICAgIGR1bW15ID0ge30sXG4gICAgZmlsZU5hbWU7XG5cbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gMTA7XG5cbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBmdW5jdGlvbihlLCBzdCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmaWxlTmFtZSA9IHN0W2ldLmdldEZpbGVOYW1lKCk7XG4gICAgICBpZiAoZmlsZU5hbWUgIT09IF9fZmlsZW5hbWUpIHtcbiAgICAgICAgaWYgKGNhbGxpbmdfZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlTmFtZSAhPT0gY2FsbGluZ19maWxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBydW4gdGhlICdwcmVwYXJlU3RhY2tUcmFjZScgZnVuY3Rpb24gYWJvdmVcbiAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoZHVtbXkpO1xuICBkdW1teS5zdGFjaztcblxuICAvLyBjbGVhbnVwXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gb3JpZ1BTVDtcbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gb3JpZ1NUTDtcblxuICAvLyBoYW5kbGUgZmlsZW5hbWUgdGhhdCBzdGFydHMgd2l0aCBcImZpbGU6Ly9cIlxuICB2YXIgZmlsZVNjaGVtYSA9ICdmaWxlOi8vJztcbiAgaWYgKGZpbGVOYW1lLmluZGV4T2YoZmlsZVNjaGVtYSkgPT09IDApIHtcbiAgICBmaWxlTmFtZSA9IGZpbGVVUkxUb1BhdGgoZmlsZU5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVOYW1lO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZSwgZ2l2ZW4gYW4gYXJiaXRyYXJ5IGZpbGVuYW1lXG4gKiBzb21ld2hlcmUgaW4gdGhlIG1vZHVsZSB0cmVlLiBUaGUgXCJyb290IGRpcmVjdG9yeVwiIGlzIHRoZSBkaXJlY3RvcnlcbiAqIGNvbnRhaW5pbmcgdGhlIGBwYWNrYWdlLmpzb25gIGZpbGUuXG4gKlxuICogICBJbjogIC9ob21lL25hdGUvbm9kZS1uYXRpdmUtbW9kdWxlL2xpYi9pbmRleC5qc1xuICogICBPdXQ6IC9ob21lL25hdGUvbm9kZS1uYXRpdmUtbW9kdWxlXG4gKi9cblxuZXhwb3J0cy5nZXRSb290ID0gZnVuY3Rpb24gZ2V0Um9vdChmaWxlKSB7XG4gIHZhciBkaXIgPSBkaXJuYW1lKGZpbGUpLFxuICAgIHByZXY7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKGRpciA9PT0gJy4nKSB7XG4gICAgICAvLyBBdm9pZHMgYW4gaW5maW5pdGUgbG9vcCBpbiByYXJlIGNhc2VzLCBsaWtlIHRoZSBSRVBMXG4gICAgICBkaXIgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBleGlzdHMoam9pbihkaXIsICdwYWNrYWdlLmpzb24nKSkgfHxcbiAgICAgIGV4aXN0cyhqb2luKGRpciwgJ25vZGVfbW9kdWxlcycpKVxuICAgICkge1xuICAgICAgLy8gRm91bmQgdGhlICdwYWNrYWdlLmpzb24nIGZpbGUgb3IgJ25vZGVfbW9kdWxlcycgZGlyOyB3ZSdyZSBkb25lXG4gICAgICByZXR1cm4gZGlyO1xuICAgIH1cbiAgICBpZiAocHJldiA9PT0gZGlyKSB7XG4gICAgICAvLyBHb3QgdG8gdGhlIHRvcFxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgbW9kdWxlIHJvb3QgZ2l2ZW4gZmlsZTogXCInICtcbiAgICAgICAgICBmaWxlICtcbiAgICAgICAgICAnXCIuIERvIHlvdSBoYXZlIGEgYHBhY2thZ2UuanNvbmAgZmlsZT8gJ1xuICAgICAgKTtcbiAgICB9XG4gICAgLy8gVHJ5IHRoZSBwYXJlbnQgZGlyIG5leHRcbiAgICBwcmV2ID0gZGlyO1xuICAgIGRpciA9IGpvaW4oZGlyLCAnLi4nKTtcbiAgfVxufTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBzZXAgPSByZXF1aXJlKCdwYXRoJykuc2VwIHx8ICcvJztcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVVcmlUb1BhdGg7XG5cbi8qKlxuICogRmlsZSBVUkkgdG8gUGF0aCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJpXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHBhdGhcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZmlsZVVyaVRvUGF0aCAodXJpKSB7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdXJpIHx8XG4gICAgICB1cmkubGVuZ3RoIDw9IDcgfHxcbiAgICAgICdmaWxlOi8vJyAhPSB1cmkuc3Vic3RyaW5nKDAsIDcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBwYXNzIGluIGEgZmlsZTovLyBVUkkgdG8gY29udmVydCB0byBhIGZpbGUgcGF0aCcpO1xuICB9XG5cbiAgdmFyIHJlc3QgPSBkZWNvZGVVUkkodXJpLnN1YnN0cmluZyg3KSk7XG4gIHZhciBmaXJzdFNsYXNoID0gcmVzdC5pbmRleE9mKCcvJyk7XG4gIHZhciBob3N0ID0gcmVzdC5zdWJzdHJpbmcoMCwgZmlyc3RTbGFzaCk7XG4gIHZhciBwYXRoID0gcmVzdC5zdWJzdHJpbmcoZmlyc3RTbGFzaCArIDEpO1xuXG4gIC8vIDIuICBTY2hlbWUgRGVmaW5pdGlvblxuICAvLyBBcyBhIHNwZWNpYWwgY2FzZSwgPGhvc3Q+IGNhbiBiZSB0aGUgc3RyaW5nIFwibG9jYWxob3N0XCIgb3IgdGhlIGVtcHR5XG4gIC8vIHN0cmluZzsgdGhpcyBpcyBpbnRlcnByZXRlZCBhcyBcInRoZSBtYWNoaW5lIGZyb20gd2hpY2ggdGhlIFVSTCBpc1xuICAvLyBiZWluZyBpbnRlcnByZXRlZFwiLlxuICBpZiAoJ2xvY2FsaG9zdCcgPT0gaG9zdCkgaG9zdCA9ICcnO1xuXG4gIGlmIChob3N0KSB7XG4gICAgaG9zdCA9IHNlcCArIHNlcCArIGhvc3Q7XG4gIH1cblxuICAvLyAzLjIgIERyaXZlcywgZHJpdmUgbGV0dGVycywgbW91bnQgcG9pbnRzLCBmaWxlIHN5c3RlbSByb290XG4gIC8vIERyaXZlIGxldHRlcnMgYXJlIG1hcHBlZCBpbnRvIHRoZSB0b3Agb2YgYSBmaWxlIFVSSSBpbiB2YXJpb3VzIHdheXMsXG4gIC8vIGRlcGVuZGluZyBvbiB0aGUgaW1wbGVtZW50YXRpb247IHNvbWUgYXBwbGljYXRpb25zIHN1YnN0aXR1dGVcbiAgLy8gdmVydGljYWwgYmFyIChcInxcIikgZm9yIHRoZSBjb2xvbiBhZnRlciB0aGUgZHJpdmUgbGV0dGVyLCB5aWVsZGluZ1xuICAvLyBcImZpbGU6Ly8vY3wvdG1wL3Rlc3QudHh0XCIuICBJbiBzb21lIGNhc2VzLCB0aGUgY29sb24gaXMgbGVmdFxuICAvLyB1bmNoYW5nZWQsIGFzIGluIFwiZmlsZTovLy9jOi90bXAvdGVzdC50eHRcIi4gIEluIG90aGVyIGNhc2VzLCB0aGVcbiAgLy8gY29sb24gaXMgc2ltcGx5IG9taXR0ZWQsIGFzIGluIFwiZmlsZTovLy9jL3RtcC90ZXN0LnR4dFwiLlxuICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eKC4rKVxcfC8sICckMTonKTtcblxuICAvLyBmb3IgV2luZG93cywgd2UgbmVlZCB0byBpbnZlcnQgdGhlIHBhdGggc2VwYXJhdG9ycyBmcm9tIHdoYXQgYSBVUkkgdXNlc1xuICBpZiAoc2VwID09ICdcXFxcJykge1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpO1xuICB9XG5cbiAgaWYgKC9eLitcXDovLnRlc3QocGF0aCkpIHtcbiAgICAvLyBoYXMgV2luZG93cyBkcml2ZSBhdCBiZWdpbm5pbmcgb2YgcGF0aFxuICB9IGVsc2Uge1xuICAgIC8vIHVuaXggcGF0aOKAplxuICAgIHBhdGggPSBzZXAgKyBwYXRoO1xuICB9XG5cbiAgcmV0dXJuIGhvc3QgKyBwYXRoO1xufVxuIiwiLyogRmlsZTogICAgICBTaWRlRWZmZWN0cy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgXCIuLi9NZXNzYWdlTG9vcFwiO1xuaW1wb3J0IFwiLi4vSG9va1wiO1xuaW1wb3J0IFwiLi4vTm9kZUlwY1wiO1xuaW1wb3J0IFwiLi4vS2V5Ym9hcmRcIjtcbmltcG9ydCBcIi4uL01vbml0b3JcIjtcbmltcG9ydCBcIi4uL1RyZWVcIjtcblxuc2V0VGltZW91dCgoKTogdm9pZCA9Plxue1xuICAgIGltcG9ydChcIi4uL01haW5XaW5kb3dcIik7XG4gICAgaW1wb3J0KFwiLi4vUmVuZGVyZXJGdW5jdGlvbnMuR2VuZXJhdGVkXCIpO1xuICAgIGltcG9ydChcIi4vSW5pdGlhbGl6YXRpb25cIik7XG4gICAgaW1wb3J0KFwiLi9UcmF5XCIpO1xufSk7XG5cbiIsIi8qIEZpbGU6ICAgIHV0aWwudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBISGFuZGxlIH0gZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc29sdmVIdG1sUGF0aChIdG1sRmlsZU5hbWU6IHN0cmluZywgQ29tcG9uZW50Pzogc3RyaW5nKVxue1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiKVxuICAgIHtcbiAgICAgICAgY29uc3QgUG9ydDogc3RyaW5nIHwgbnVtYmVyID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAxMjEyO1xuICAgICAgICBjb25zdCBVcmw6IFVSTCA9IG5ldyBVUkwoYGh0dHA6Ly9sb2NhbGhvc3Q6JHsgUG9ydCB9YCk7XG4gICAgICAgIFVybC5wYXRobmFtZSA9IEh0bWxGaWxlTmFtZTtcbiAgICAgICAgcmV0dXJuIFVybC5ocmVmO1xuICAgIH1cbiAgICBjb25zdCBCYXNlUGF0aDogc3RyaW5nID0gYGZpbGU6Ly8ke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vUmVuZGVyZXIvXCIsIEh0bWxGaWxlTmFtZSl9YDtcbiAgICBpZiAoQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBjb25zdCBDb21wb25lbnRBcmd1bWVudDogc3RyaW5nID0gYD9Db21wb25lbnQ9JHsgQ29tcG9uZW50IH1gO1xuICAgICAgICByZXR1cm4gQmFzZVBhdGggKyBDb21wb25lbnRBcmd1bWVudDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IEFyZUhhbmRsZXNFcXVhbCA9IChBOiBISGFuZGxlLCBCOiBISGFuZGxlKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBBLkhhbmRsZSA9PT0gQi5IYW5kbGU7XG59O1xuIiwiLyogRmlsZTogICAgICBEaXNwYXRjaGVyLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGU8VD4gPVxue1xuICAgIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXI7XG4gICAgVW5zdWJzY3JpYmUoSWQ6IG51bWJlcik6IHZvaWQ7XG59O1xuXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXI8VD5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIEdldEhhbmRsZSA9ICgpOiBUU3Vic2NyaXB0aW9uSGFuZGxlPFQ+ID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdWJzY3JpYmUgPSAoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiBJZDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBTdWJzY3JpYmUsXG4gICAgICAgICAgICBVbnN1YnNjcmliZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uICovXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXJfREVQUkVDQVRFRDxUID0gdW5rbm93bj5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXJcbiAgICB7XG4gICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgIHRoaXMuTGlzdGVuZXJzLnNldChJZCwgQ2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gSWQ7XG4gICAgfVxuXG4gICAgcHVibGljIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiaW1wb3J0IHsgSW5pdGlhbGl6ZUhvb2tzIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5Jbml0aWFsaXplSG9va3MoKTtcbiIsIi8qIEZpbGU6ICAgICAgS2V5Ym9hcmQudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgYXMgSXBjU3Vic2NyaWJlIH0gZnJvbSBcIi4vTm9kZUlwY1wiO1xuaW1wb3J0IHsgSXNWaXJ0dWFsS2V5IH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmRcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyX0RFUFJFQ0FURUQgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNsYXNzIEZLZXlib2FyZCBleHRlbmRzIFREaXNwYXRjaGVyX0RFUFJFQ0FURUQ8RktleWJvYXJkRXZlbnQ+XG57XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBJc0tleURvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGBPbktleWAgc2hvdWxkIGNvbnRpbnVlLiAqL1xuICAgIHByaXZhdGUgRGVib3VuY2UgPSAoU3RhdGU6IEZLZXlib2FyZEV2ZW50W1wiU3RhdGVcIl0pOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuSXNLZXlEb3duKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuSXNLZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIE9uS2V5ID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgRXZlbnQ6IEZLZXlib2FyZEV2ZW50ID0gRGF0YVswXSBhcyBGS2V5Ym9hcmRFdmVudDtcbiAgICAgICAgY29uc3QgSXNEZWJvdW5jZWQ6IGJvb2xlYW4gPSB0aGlzLkRlYm91bmNlKEV2ZW50LlN0YXRlKTtcbiAgICAgICAgaWYgKElzRGVib3VuY2VkICYmIElzVmlydHVhbEtleShFdmVudC5Wa0NvZGUpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkRpc3BhdGNoKEV2ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCBLZXlib2FyZDogRktleWJvYXJkID0gbmV3IEZLZXlib2FyZCgpO1xuSXBjU3Vic2NyaWJlKFwiS2V5Ym9hcmRcIiwgS2V5Ym9hcmQuT25LZXkpO1xuIiwiLyogRmlsZTogICAgICBNYWluLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IFwiLi9Db3JlL1NpZGVFZmZlY3RzXCI7XG4iLCIvKiBGaWxlOiAgICAgIE1lc3NhZ2VMb29wLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuLyoqIFRoaXMgZmlsZSBtdXN0IGJlIHNpZGUtZWZmZWN0IGltcG9ydGVkIGJ5IGBNYWluYC4gKi9cblxuaW1wb3J0IHsgSW5pdGlhbGl6ZU1lc3NhZ2VMb29wIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5jb25zdCBSdW5Jbml0aWFsaXplTWVzc2FnZUxvb3AgPSAoKTogdm9pZCA9Plxue1xuICAgIEluaXRpYWxpemVNZXNzYWdlTG9vcCgoKSA9PiB7IH0pO1xufTtcblxuUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wKCk7XG4iLCIvKiBGaWxlOiAgICAgIE1vbml0b3IudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgdHlwZSBGTW9uaXRvckluZm8sIEluaXRpYWxpemVNb25pdG9ycyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyLCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGUgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNvbnN0IE1vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gWyBdO1xuXG5leHBvcnQgY29uc3QgR2V0TW9uaXRvcnMgPSAoKTogQXJyYXk8Rk1vbml0b3JJbmZvPiA9Plxue1xuICAgIHJldHVybiBbIC4uLk1vbml0b3JzIF07XG59O1xuXG5jb25zdCBNb25pdG9yc0Rpc3BhdGNoZXI6IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+ID0gbmV3IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+KCk7XG5leHBvcnQgY29uc3QgTW9uaXRvcnNIYW5kbGU6IFRTdWJzY3JpcHRpb25IYW5kbGU8QXJyYXk8Rk1vbml0b3JJbmZvPj4gPSBNb25pdG9yc0Rpc3BhdGNoZXIuR2V0SGFuZGxlKCk7XG5cbmNvbnN0IE9uTW9uaXRvcnNDaGFuZ2VkID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE5ld01vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gRGF0YVswXSBhcyBBcnJheTxGTW9uaXRvckluZm8+O1xuICAgIE1vbml0b3JzLmxlbmd0aCA9IDA7XG4gICAgTW9uaXRvcnMucHVzaCguLi5OZXdNb25pdG9ycyk7XG4gICAgTW9uaXRvcnNEaXNwYXRjaGVyLkRpc3BhdGNoKE5ld01vbml0b3JzKTtcbn07XG5cbmNvbnN0IEluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcgPSAoKTogdm9pZCA9Plxue1xuICAgIE1vbml0b3JzLnB1c2goLi4uSW5pdGlhbGl6ZU1vbml0b3JzKCkpO1xuICAgIFN1YnNjcmliZShcIk1vbml0b3JzXCIsIE9uTW9uaXRvcnNDaGFuZ2VkKTtcbn07XG5cbkluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcoKTtcbiIsIi8qIEZpbGU6ICAgICAgTm9kZUlwYy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZJcGNDYWxsYmFjaywgRklwY0NhbGxiYWNrU2VyaWFsaXplZCB9IGZyb20gXCIuL05vZGVJcGMuVHlwZXNcIjtcbmltcG9ydCB7IEluaXRpYWxpemVJcGMgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmxldCBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcbmNvbnN0IExpc3RlbmVyczogTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4gPSBuZXcgTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4oKTtcblxuZXhwb3J0IGNvbnN0IFN1YnNjcmliZSA9IChDaGFubmVsOiBzdHJpbmcsIENhbGxiYWNrOiBGSXBjQ2FsbGJhY2spOiBudW1iZXIgPT5cbntcbiAgICBjb25zdCBJZDogbnVtYmVyID0gTmV4dExpc3RlbmVySWQrKztcbiAgICBMaXN0ZW5lcnMuc2V0KElkLCB7IENhbGxiYWNrLCBDaGFubmVsIH0pO1xuICAgIHJldHVybiBJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9Plxue1xuICAgIExpc3RlbmVycy5kZWxldGUoSWQpO1xufTtcblxuZnVuY3Rpb24gT25NZXNzYWdlKENoYW5uZWw6IHN0cmluZywgTWVzc2FnZTogdW5rbm93bilcbntcbiAgICBMaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6IEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ2FsbGJhY2suQ2hhbm5lbCA9PT0gQ2hhbm5lbClcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2suQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuSW5pdGlhbGl6ZUlwYyhPbk1lc3NhZ2UpO1xuIiwiLyogRmlsZTogICAgICBUcmVlLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgICBGQW5ub3RhdGVkUGFuZWwsXG4gICAgRkNlbGwsXG4gICAgRkZvcmVzdCxcbiAgICBGUGFuZWwsXG4gICAgRlBhbmVsQmFzZSxcbiAgICBGUGFuZWxIb3Jpem9udGFsLFxuICAgIEZSb290UGFuZWwsXG4gICAgRlZlcnRleCB9IGZyb20gXCIuL1RyZWUuVHlwZXNcIjtcbmltcG9ydCB7XG4gICAgdHlwZSBGTW9uaXRvckluZm8sXG4gICAgR2V0VGlsZWFibGVXaW5kb3dzLFxuICAgIEdldE1vbml0b3JGcm9tV2luZG93LFxuICAgIHR5cGUgSE1vbml0b3IsXG4gICAgdHlwZSBIV2luZG93LFxuICAgIFNldFdpbmRvd1Bvc2l0aW9uLFxuICAgIEdldFdpbmRvd0J5TmFtZSxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICBHZXRTY3JlZW5zaG90LFxuICAgIHR5cGUgRkJveCxcbiAgICBDYXB0dXJlU2NyZWVuU2VjdGlvblRvVGVtcFBuZ0ZpbGUsXG4gICAgR2V0TW9uaXRvckZyaWVuZGx5TmFtZSxcbiAgICBHZXRBcHBsaWNhdGlvbkZyaWVuZGx5TmFtZX0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHsgQXJlSGFuZGxlc0VxdWFsIH0gZnJvbSBcIi4vQ29yZS9VdGlsaXR5XCI7XG5pbXBvcnQgeyBwcm9taXNlcyBhcyBGcyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgR2V0TW9uaXRvcnMgfSBmcm9tIFwiLi9Nb25pdG9yXCI7XG5pbXBvcnQgeyBMb2cgfSBmcm9tIFwiLi9EZXZlbG9wbWVudFwiO1xuXG5jb25zdCBGb3Jlc3Q6IEZGb3Jlc3QgPSBbIF07XG5cbmV4cG9ydCBjb25zdCBHZXRGb3Jlc3QgPSAoKTogRkZvcmVzdCA9Plxue1xuICAgIHJldHVybiBbIC4uLkZvcmVzdCBdO1xufTtcblxuLyoqIEBUT0RPICovXG5leHBvcnQgY29uc3QgTG9nRm9yZXN0ID0gKCk6IHZvaWQgPT5cbntcbn07XG5cbmNvbnN0IENlbGwgPSAoSGFuZGxlOiBIV2luZG93KTogRkNlbGwgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBIYW5kbGUsXG4gICAgICAgIFNpemU6IHsgSGVpZ2h0OiAwLCBXaWR0aDogMCwgWDogMCwgWTogMCB9LFxuICAgICAgICBaT3JkZXI6IDBcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IFVwZGF0ZUZvcmVzdCA9IChVcGRhdGVGdW5jdGlvbjogKE9sZEZvcmVzdDogRkZvcmVzdCkgPT4gRkZvcmVzdCk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBOZXdGb3Jlc3Q6IEZGb3Jlc3QgPSBVcGRhdGVGdW5jdGlvbihbIC4uLkZvcmVzdCBdKTtcbiAgICBGb3Jlc3QubGVuZ3RoID0gMDtcbiAgICBGb3Jlc3QucHVzaCguLi5OZXdGb3Jlc3QpO1xuXG4gICAgLy8gQFRPRE8gTW92ZSBhbmQgcmVzaXplLCBhbmQgc29ydCBaT3JkZXIgb2YgYWxsIHdpbmRvd3MgYmVpbmcgdGlsZWQgYnkgU29ycmVsbFdtLlxufTtcblxuY29uc3QgSW5pdGlhbGl6ZVRyZWUgPSAoKTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE1vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gR2V0TW9uaXRvcnMoKTtcblxuICAgIGNvbnNvbGUubG9nKE1vbml0b3JzKTtcblxuICAgIEZvcmVzdC5wdXNoKC4uLk1vbml0b3JzLm1hcCgoTW9uaXRvcjogRk1vbml0b3JJbmZvKTogRlBhbmVsSG9yaXpvbnRhbCA9PlxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coYEhlcmUsIE1vbml0b3JIYW5kbGUgaXMgJHsgTW9uaXRvci5IYW5kbGUgfS5gKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIENoaWxkcmVuOiBbIF0sXG4gICAgICAgICAgICBNb25pdG9ySWQ6IE1vbml0b3IuSGFuZGxlLFxuICAgICAgICAgICAgU2l6ZTogTW9uaXRvci5TaXplLFxuICAgICAgICAgICAgVHlwZTogXCJIb3Jpem9udGFsXCIsXG4gICAgICAgICAgICBaT3JkZXI6IDBcbiAgICAgICAgfTtcbiAgICB9KSk7XG5cbiAgICBjb25zb2xlLmxvZyhGb3Jlc3QpO1xuXG4gICAgY29uc3QgVGlsZWFibGVXaW5kb3dzOiBBcnJheTxIV2luZG93PiA9IEdldFRpbGVhYmxlV2luZG93cygpO1xuXG4gICAgY29uc29sZS5sb2coYEZvdW5kICR7IFRpbGVhYmxlV2luZG93cy5sZW5ndGggfSB0aWxlYWJsZSB3aW5kb3dzLmApO1xuXG4gICAgVGlsZWFibGVXaW5kb3dzLmZvckVhY2goKEhhbmRsZTogSFdpbmRvdyk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE1vbml0b3I6IEhNb25pdG9yID0gR2V0TW9uaXRvckZyb21XaW5kb3coSGFuZGxlKTtcbiAgICAgICAgY29uc3QgUm9vdFBhbmVsOiBGUGFuZWxCYXNlIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIEZvcmVzdC5maW5kKChQYW5lbDogRlBhbmVsQmFzZSk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgTW9uaXRvciBpcyAkeyBKU09OLnN0cmluZ2lmeShNb25pdG9yKSB9IGFuZCBQYW5lbC5Nb25pdG9ySWQgaXMgJHsgSlNPTi5zdHJpbmdpZnkoUGFuZWwuTW9uaXRvcklkKSB9LmApO1xuICAgICAgICAgICAgICAgIGNvbnN0IEluZm86IEZNb25pdG9ySW5mbyB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICAgICAgICAgIE1vbml0b3JzLmZpbmQoKEZvbzogRk1vbml0b3JJbmZvKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRm9vLkhhbmRsZS5IYW5kbGUgPT09IFBhbmVsLk1vbml0b3JJZD8uSGFuZGxlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTaXplICR7IEpTT04uc3RyaW5naWZ5KEluZm8/LlNpemUpIH0gV29ya1NpemUgJHsgSlNPTi5zdHJpbmdpZnkoSW5mbz8uV29ya1NpemUpIH0uYCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUGFuZWwuTW9uaXRvcklkPy5IYW5kbGUgPT09IE1vbml0b3IuSGFuZGxlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKFJvb3RQYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBAVE9ET1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLwn5Kh8J+SofCfkqHwn5KhIFJvb3RQYW5lbCB3YXMgdW5kZWZpbmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJvb3RQYW5lbC5DaGlsZHJlbi5wdXNoKENlbGwoSGFuZGxlKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIEZvcmVzdC5mb3JFYWNoKChQYW5lbDogRlBhbmVsKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgTW9uaXRvckluZm86IEZNb25pdG9ySW5mbyB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICBNb25pdG9ycy5maW5kKChJbk1vbml0b3I6IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT4gSW5Nb25pdG9yLkhhbmRsZSA9PT0gUGFuZWwuTW9uaXRvcklkKTtcblxuICAgICAgICBpZiAoTW9uaXRvckluZm8gPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQFRPRE9cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFBhbmVsLkNoaWxkcmVuID0gUGFuZWwuQ2hpbGRyZW4ubWFwKChDaGlsZDogRlZlcnRleCwgSW5kZXg6IG51bWJlcik6IEZWZXJ0ZXggPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBVbmlmb3JtV2lkdGg6IG51bWJlciA9IE1vbml0b3JJbmZvLldvcmtTaXplLldpZHRoIC8gUGFuZWwuQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IE91dENoaWxkOiBGVmVydGV4ID0geyAuLi5DaGlsZCB9O1xuICAgICAgICAgICAgICAgIE91dENoaWxkLlNpemUgPVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uTW9uaXRvckluZm8uV29ya1NpemUsXG4gICAgICAgICAgICAgICAgICAgIFdpZHRoOiBVbmlmb3JtV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIFg6IFVuaWZvcm1XaWR0aCAqIEluZGV4ICsgTW9uaXRvckluZm8uV29ya1NpemUuWFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT3V0Q2hpbGQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgQ2VsbHM6IEFycmF5PEZDZWxsPiA9IEdldEFsbENlbGxzKEZvcmVzdCk7XG5cbiAgICBDZWxscy5mb3JFYWNoKChDZWxsOiBGQ2VsbCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTZXR0aW5nIHBvc2l0aW9uIG9mICR7IEdldFdpbmRvd1RpdGxlKENlbGwuSGFuZGxlKSB9IHRvICR7IEpTT04uc3RyaW5naWZ5KENlbGwuU2l6ZSkgfS5gKTtcbiAgICAgICAgU2V0V2luZG93UG9zaXRpb24oQ2VsbC5IYW5kbGUsIENlbGwuU2l6ZSk7XG4gICAgICAgIC8qIEF0IGxlYXN0IGZvciBub3csIGlnbm9yZSBTb3JyZWxsV20gd2luZG93cy4gKi9cbiAgICAgICAgLy8gaWYgKEdldFdpbmRvd1RpdGxlKENlbGwuSGFuZGxlKSAhPT0gXCJTb3JyZWxsV21cIilcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgU2V0V2luZG93UG9zaXRpb24oQ2VsbC5IYW5kbGUsIENlbGwuU2l6ZSk7XG4gICAgICAgIC8vIH1cbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGBDYWxsZWQgU2V0V2luZG93UG9zaXRpb24gZm9yICR7IENlbGxzLmxlbmd0aCB9IHdpbmRvd3MuYCk7XG59O1xuXG5jb25zdCBJc0NlbGwgPSAoVmVydGV4OiBGVmVydGV4KTogVmVydGV4IGlzIEZDZWxsID0+XG57XG4gICAgcmV0dXJuIFwiSGFuZGxlXCIgaW4gVmVydGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IEZsYXR0ZW4gPSAoKTogQXJyYXk8RlZlcnRleD4gPT5cbntcbiAgICBjb25zdCBPdXRBcnJheTogQXJyYXk8RlZlcnRleD4gPSBbIF07XG5cbiAgICBUcmF2ZXJzZSgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgT3V0QXJyYXkucHVzaChWZXJ0ZXgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIE91dEFycmF5LnB1c2goLi4uRm9yZXN0KTtcblxuICAgIHJldHVybiBPdXRBcnJheTtcbn07XG5cbi8qKlxuICogUnVuIGEgZnVuY3Rpb24gZm9yIGVhY2ggdmVydGV4IHVudGlsIHRoZSBmdW5jdGlvbiByZXR1cm5zIGBmYWxzZWAgZm9yXG4gKiBhbiBpdGVyYXRpb24uXG4gKi9cbmV4cG9ydCBjb25zdCBUcmF2ZXJzZSA9IChJbkZ1bmN0aW9uOiAoVmVydGV4OiBGVmVydGV4KSA9PiBib29sZWFuLCBFbnRyeT86IEZWZXJ0ZXgpOiB2b2lkID0+XG57XG4gICAgbGV0IENvbnRpbnVlczogYm9vbGVhbiA9IHRydWU7XG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ29udGludWVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250aW51ZXMgPSBJbkZ1bmN0aW9uKFZlcnRleCk7XG4gICAgICAgICAgICBpZiAoQ29udGludWVzICYmIFwiQ2hpbGRyZW5cIiBpbiBWZXJ0ZXgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWN1cnJlbmNlKENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKEVudHJ5KVxuICAgIHtcbiAgICAgICAgUmVjdXJyZW5jZShFbnRyeSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgUGFuZWwgb2YgRm9yZXN0KVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFBhbmVsLkNoaWxkcmVuKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlY3VycmVuY2UoQ2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG5jb25zdCBHZXRBbGxDZWxscyA9IChQYW5lbHM6IEFycmF5PEZQYW5lbD4pOiBBcnJheTxGQ2VsbD4gPT5cbntcbiAgICBjb25zdCBSZXN1bHQ6IEFycmF5PEZDZWxsPiA9IFsgXTtcblxuICAgIGZ1bmN0aW9uIFRyYXZlcnNlKFZlcnRleDogRlZlcnRleCk6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmIChcIkhhbmRsZVwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgUmVzdWx0LnB1c2goVmVydGV4IGFzIEZDZWxsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcIkNoaWxkcmVuXCIgaW4gVmVydGV4KVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUcmF2ZXJzZShDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFBhbmVsIG9mIFBhbmVscylcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgQ2hpbGQgb2YgUGFuZWwuQ2hpbGRyZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIFRyYXZlcnNlKENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgRXhpc3RzID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICBsZXQgRG9lc0V4aXN0OiBib29sZWFuID0gZmFsc2U7XG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmICghRG9lc0V4aXN0KVxuICAgICAgICB7XG4gICAgICAgICAgICBEb2VzRXhpc3QgPSBQcmVkaWNhdGUoVmVydGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhRG9lc0V4aXN0O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIERvZXNFeGlzdDtcbn07XG5cbi8qKiBAVE9ETyAqL1xuZXhwb3J0IGNvbnN0IEV4aXN0c0V4YWN0bHlPbmUgPSAoUHJlZGljYXRlOiAoVmVydGV4OiBGVmVydGV4KSA9PiBib29sZWFuKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBGb3JBbGwgPSAoUHJlZGljYXRlOiAoVmVydGV4OiBGVmVydGV4KSA9PiBib29sZWFuKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBJc1dpbmRvd1RpbGVkID0gKEhhbmRsZTogSFdpbmRvdyk6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gRXhpc3RzKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICByZXR1cm4gSXNDZWxsKFZlcnRleCkgJiYgQXJlSGFuZGxlc0VxdWFsKFZlcnRleC5IYW5kbGUsIEhhbmRsZSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgR2V0UGFuZWxzID0gKCk6IEFycmF5PEZQYW5lbD4gPT5cbntcbiAgICBjb25zdCBWZXJ0aWNlczogQXJyYXk8RlZlcnRleD4gPSBGbGF0dGVuKCk7XG4gICAgcmV0dXJuIFZlcnRpY2VzLmZpbHRlcigoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PiAhSXNDZWxsKFZlcnRleCkpIGFzIEFycmF5PEZQYW5lbD47XG59O1xuXG5mdW5jdGlvbiBQYW5lbENvbnRhaW5zVmVydGV4KGN1cnJlbnRWZXJ0ZXg6IEZWZXJ0ZXgsIHRhcmdldFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW5cbntcbiAgICBpZiAoY3VycmVudFZlcnRleCA9PT0gdGFyZ2V0VmVydGV4KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHBhbmVsLCBjaGVjayBpdHMgY2hpbGRyZW4gcmVjdXJzaXZlbHlcbiAgICBpZiAoXCJDaGlsZHJlblwiIGluIGN1cnJlbnRWZXJ0ZXgpXG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGN1cnJlbnRWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChQYW5lbENvbnRhaW5zVmVydGV4KGNoaWxkLCB0YXJnZXRWZXJ0ZXgpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgR2V0Um9vdFBhbmVsID0gKFZlcnRleDogRlZlcnRleCk6IEZQYW5lbCB8IHVuZGVmaW5lZCA9Plxue1xuICAgIGZvciAoY29uc3QgUGFuZWwgb2YgRm9yZXN0KVxuICAgIHtcbiAgICAgICAgaWYgKFBhbmVsQ29udGFpbnNWZXJ0ZXgoUGFuZWwsIFZlcnRleCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBQYW5lbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5jb25zdCBHZXRQYW5lbEFwcGxpY2F0aW9uTmFtZXMgPSAoUGFuZWw6IEZQYW5lbCk6IEFycmF5PHN0cmluZz4gPT5cbntcbiAgICBjb25zdCBSZXN1bHROYW1lczogQXJyYXk8c3RyaW5nPiA9IFsgXTtcblxuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoXCJIYW5kbGVcIiBpbiBWZXJ0ZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEZyaWVuZGx5TmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gR2V0QXBwbGljYXRpb25GcmllbmRseU5hbWUoVmVydGV4LkhhbmRsZSk7XG4gICAgICAgICAgICBpZiAoRnJpZW5kbHlOYW1lICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVzdWx0TmFtZXMucHVzaChGcmllbmRseU5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoUmVzdWx0TmFtZXMubGVuZ3RoID49IDMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSwgUGFuZWwpO1xuXG4gICAgcmV0dXJuIFJlc3VsdE5hbWVzO1xufTtcblxuZXhwb3J0IGNvbnN0IEFubm90YXRlUGFuZWwgPSBhc3luYyAoUGFuZWw6IEZQYW5lbCk6IFByb21pc2U8RkFubm90YXRlZFBhbmVsIHwgdW5kZWZpbmVkPiA9Plxue1xuICAgIGNvbnN0IFNjcmVlbnNob3RCdWZmZXI6IEJ1ZmZlciA9XG4gICAgICAgIGF3YWl0IEZzLnJlYWRGaWxlKENhcHR1cmVTY3JlZW5TZWN0aW9uVG9UZW1wUG5nRmlsZShQYW5lbC5TaXplKSk7XG5cbiAgICBjb25zdCBSb290UGFuZWw6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldFJvb3RQYW5lbChQYW5lbCk7XG4gICAgaWYgKFJvb3RQYW5lbCAhPT0gdW5kZWZpbmVkICYmIFJvb3RQYW5lbC5Nb25pdG9ySWQgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IEFwcGxpY2F0aW9uTmFtZXM6IEFycmF5PHN0cmluZz4gPSBHZXRQYW5lbEFwcGxpY2F0aW9uTmFtZXMoUGFuZWwpO1xuICAgICAgICBjb25zdCBJc1Jvb3Q6IGJvb2xlYW4gPSBSb290UGFuZWwgPT09IFBhbmVsO1xuICAgICAgICBjb25zdCBNb25pdG9yOiBzdHJpbmcgPSBHZXRNb25pdG9yRnJpZW5kbHlOYW1lKFJvb3RQYW5lbC5Nb25pdG9ySWQpIHx8IFwiXCI7XG4gICAgICAgIGNvbnN0IFNjcmVlbnNob3Q6IHN0cmluZyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgU2NyZWVuc2hvdEJ1ZmZlci50b1N0cmluZyhcImJhc2U2NFwiKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uUGFuZWwsXG5cbiAgICAgICAgICAgIEFwcGxpY2F0aW9uTmFtZXMsXG4gICAgICAgICAgICBJc1Jvb3QsXG4gICAgICAgICAgICBNb25pdG9yLFxuICAgICAgICAgICAgU2NyZWVuc2hvdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5Jbml0aWFsaXplVHJlZSgpO1xuIiwiLyogRmlsZTogICAgICBLZXlib2FyZC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZLZXlJZCwgRlZpcnR1YWxLZXkgfSBmcm9tIFwiLi9LZXlib2FyZC5UeXBlc1wiO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBzb3J0LWtleXMgKi9cblxuLyoqIERldmVsb3Blci1mcmllbmRseSBuYW1lcyBvZiBrZXkgY29kZXMuICovXG5jb25zdCBLZXlJZHNCeUlkOiBSZWFkb25seTxSZWNvcmQ8RlZpcnR1YWxLZXksIEZLZXlJZD4+ID1cbntcbiAgICAweDA1OiBcIk1vdXNlWDFcIixcbiAgICAweDA2OiBcIk1vdXNlWDJcIixcbiAgICAweDA4OiBcIkJhY2tzcGFjZVwiLFxuICAgIDB4MDk6IFwiVGFiXCIsXG4gICAgMHgwRDogXCJFbnRlclwiLFxuICAgIDB4MTA6IFwiU2hpZnRcIixcbiAgICAweDExOiBcIkN0cmxcIixcbiAgICAweDEyOiBcIkFsdFwiLFxuICAgIDB4MTM6IFwiUGF1c2VcIixcbiAgICAweDIwOiBcIlNwYWNlXCIsXG4gICAgMHgyMTogXCJQZ1VwXCIsXG4gICAgMHgyMjogXCJQZ0Rvd25cIixcbiAgICAweDIzOiBcIkVuZFwiLFxuICAgIDB4MjQ6IFwiSG9tZVwiLFxuICAgIDB4MjU6IFwiTGVmdEFycm93XCIsXG4gICAgMHgyNjogXCJVcEFycm93XCIsXG4gICAgMHgyNzogXCJSaWdodEFycm93XCIsXG4gICAgMHgyODogXCJEb3duQXJyb3dcIixcbiAgICAweDJEOiBcIkluc1wiLFxuICAgIDB4MkU6IFwiRGVsXCIsXG4gICAgMHgzMDogXCIwXCIsXG4gICAgMHgzMTogXCIxXCIsXG4gICAgMHgzMjogXCIyXCIsXG4gICAgMHgzMzogXCIzXCIsXG4gICAgMHgzNDogXCI0XCIsXG4gICAgMHgzNTogXCI1XCIsXG4gICAgMHgzNjogXCI2XCIsXG4gICAgMHgzNzogXCI3XCIsXG4gICAgMHgzODogXCI4XCIsXG4gICAgMHgzOTogXCI5XCIsXG4gICAgMHg0MTogXCJBXCIsXG4gICAgMHg0MjogXCJCXCIsXG4gICAgMHg0MzogXCJDXCIsXG4gICAgMHg0NDogXCJEXCIsXG4gICAgMHg0NTogXCJFXCIsXG4gICAgMHg0NjogXCJGXCIsXG4gICAgMHg0NzogXCJHXCIsXG4gICAgMHg0ODogXCJIXCIsXG4gICAgMHg0OTogXCJJXCIsXG4gICAgMHg0QTogXCJKXCIsXG4gICAgMHg0QjogXCJLXCIsXG4gICAgMHg0QzogXCJMXCIsXG4gICAgMHg0RDogXCJNXCIsXG4gICAgMHg0RTogXCJOXCIsXG4gICAgMHg0RjogXCJPXCIsXG4gICAgMHg1MDogXCJQXCIsXG4gICAgMHg1MTogXCJRXCIsXG4gICAgMHg1MjogXCJSXCIsXG4gICAgMHg1MzogXCJTXCIsXG4gICAgMHg1NDogXCJUXCIsXG4gICAgMHg1NTogXCJVXCIsXG4gICAgMHg1NjogXCJWXCIsXG4gICAgMHg1NzogXCJXXCIsXG4gICAgMHg1ODogXCJYXCIsXG4gICAgMHg1OTogXCJZXCIsXG4gICAgMHg1QTogXCJaXCIsXG4gICAgMHg1QjogXCJMV2luXCIsXG4gICAgMHg1QzogXCJSV2luXCIsXG4gICAgMHg1RDogXCJBcHBsaWNhdGlvbnNcIixcbiAgICAweDYwOiBcIk51bTBcIixcbiAgICAweDYxOiBcIk51bTFcIixcbiAgICAweDYyOiBcIk51bTJcIixcbiAgICAweDYzOiBcIk51bTNcIixcbiAgICAweDY0OiBcIk51bTRcIixcbiAgICAweDY1OiBcIk51bTVcIixcbiAgICAweDY2OiBcIk51bTZcIixcbiAgICAweDY3OiBcIk51bTdcIixcbiAgICAweDY4OiBcIk51bThcIixcbiAgICAweDY5OiBcIk51bTlcIixcbiAgICAweDZBOiBcIk11bHRpcGx5XCIsXG4gICAgMHg2QjogXCJBZGRcIixcbiAgICAweDZEOiBcIlN1YnRyYWN0XCIsXG4gICAgMHg2RTogXCJOdW1EZWNpbWFsXCIsXG4gICAgMHg2RjogXCJOdW1EaXZpZGVcIixcbiAgICAweDcwOiBcIkYxXCIsXG4gICAgMHg3MTogXCJGMlwiLFxuICAgIDB4NzI6IFwiRjNcIixcbiAgICAweDczOiBcIkY0XCIsXG4gICAgMHg3NDogXCJGNVwiLFxuICAgIDB4NzU6IFwiRjZcIixcbiAgICAweDc2OiBcIkY3XCIsXG4gICAgMHg3NzogXCJGOFwiLFxuICAgIDB4Nzg6IFwiRjlcIixcbiAgICAweDc5OiBcIkYxMFwiLFxuICAgIDB4N0E6IFwiRjExXCIsXG4gICAgMHg3QjogXCJGMTJcIixcbiAgICAweDdDOiBcIkYxM1wiLFxuICAgIDB4N0Q6IFwiRjE0XCIsXG4gICAgMHg3RTogXCJGMTVcIixcbiAgICAweDdGOiBcIkYxNlwiLFxuICAgIDB4ODA6IFwiRjE3XCIsXG4gICAgMHg4MTogXCJGMThcIixcbiAgICAweDgyOiBcIkYxOVwiLFxuICAgIDB4ODM6IFwiRjIwXCIsXG4gICAgMHg4NDogXCJGMjFcIixcbiAgICAweDg1OiBcIkYyMlwiLFxuICAgIDB4ODY6IFwiRjIzXCIsXG4gICAgMHg4NzogXCJGMjRcIixcbiAgICAweEEwOiBcIkxTaGlmdFwiLFxuICAgIDB4QTE6IFwiUlNoaWZ0XCIsXG4gICAgMHhBMjogXCJMQ3RybFwiLFxuICAgIDB4QTM6IFwiUkN0cmxcIixcbiAgICAweEE0OiBcIkxBbHRcIixcbiAgICAweEE1OiBcIlJBbHRcIixcbiAgICAweEE2OiBcIkJyb3dzZXJCYWNrXCIsXG4gICAgMHhBNzogXCJCcm93c2VyRm9yd2FyZFwiLFxuICAgIDB4QTg6IFwiQnJvd3NlclJlZnJlc2hcIixcbiAgICAweEE5OiBcIkJyb3dzZXJTdG9wXCIsXG4gICAgMHhBQTogXCJCcm93c2VyU2VhcmNoXCIsXG4gICAgMHhBQjogXCJCcm93c2VyRmF2b3JpdGVzXCIsXG4gICAgMHhBQzogXCJCcm93c2VyU3RhcnRcIixcbiAgICAweEIwOiBcIk5leHRUcmFja1wiLFxuICAgIDB4QjE6IFwiUHJldmlvdXNUcmFja1wiLFxuICAgIDB4QjI6IFwiU3RvcE1lZGlhXCIsXG4gICAgMHhCMzogXCJQbGF5UGF1c2VNZWRpYVwiLFxuICAgIDB4QjQ6IFwiU3RhcnRNYWlsXCIsXG4gICAgMHhCNTogXCJTZWxlY3RNZWRpYVwiLFxuICAgIDB4QjY6IFwiU3RhcnRBcHBsaWNhdGlvbk9uZVwiLFxuICAgIDB4Qjc6IFwiU3RhcnRBcHBsaWNhdGlvblR3b1wiLFxuICAgIDB4QkE6IFwiO1wiLFxuICAgIDB4QkI6IFwiK1wiLFxuICAgIDB4QkM6IFwiLFwiLFxuICAgIDB4QkQ6IFwiLVwiLFxuICAgIDB4QkU6IFwiLlwiLFxuICAgIDB4QkY6IFwiL1wiLFxuICAgIDB4QzA6IFwiYFwiLFxuICAgIDB4REI6IFwiW1wiLFxuICAgIDB4REM6IFwiXFxcXFwiLFxuICAgIDB4REQ6IFwiXVwiLFxuICAgIDB4REU6IFwiJ1wiXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgR2V0S2V5TmFtZSA9IChWa0NvZGU6IEZWaXJ0dWFsS2V5KTogRktleUlkID0+XG57XG4gICAgcmV0dXJuIEtleUlkc0J5SWRbVmtDb2RlXTtcbn07XG5cbi8qKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgb2Yga2V5IGNvZGVzLiAqL1xuZXhwb3J0IGNvbnN0IFZrOiBSZWFkb25seTxSZWNvcmQ8RktleUlkLCBGVmlydHVhbEtleT4+ID1cbntcbiAgICBNb3VzZVgxOiAweDA1LFxuICAgIE1vdXNlWDI6IDB4MDYsXG4gICAgQmFja3NwYWNlOiAweDA4LFxuICAgIFRhYjogMHgwOSxcbiAgICBFbnRlcjogMHgwRCxcbiAgICBTaGlmdDogMHgxMCxcbiAgICBDdHJsOiAweDExLFxuICAgIEFsdDogMHgxMixcbiAgICBQYXVzZTogMHgxMyxcbiAgICBTcGFjZTogMHgyMCxcbiAgICBQZ1VwOiAweDIxLFxuICAgIFBnRG93bjogMHgyMixcbiAgICBFbmQ6IDB4MjMsXG4gICAgSG9tZTogMHgyNCxcbiAgICBMZWZ0QXJyb3c6IDB4MjUsXG4gICAgVXBBcnJvdzogMHgyNixcbiAgICBSaWdodEFycm93OiAweDI3LFxuICAgIERvd25BcnJvdzogMHgyOCxcbiAgICBJbnM6IDB4MkQsXG4gICAgRGVsOiAweDJFLFxuICAgIDA6IDB4MzAsXG4gICAgMTogMHgzMSxcbiAgICAyOiAweDMyLFxuICAgIDM6IDB4MzMsXG4gICAgNDogMHgzNCxcbiAgICA1OiAweDM1LFxuICAgIDY6IDB4MzYsXG4gICAgNzogMHgzNyxcbiAgICA4OiAweDM4LFxuICAgIDk6IDB4MzksXG4gICAgQTogMHg0MSxcbiAgICBCOiAweDQyLFxuICAgIEM6IDB4NDMsXG4gICAgRDogMHg0NCxcbiAgICBFOiAweDQ1LFxuICAgIEY6IDB4NDYsXG4gICAgRzogMHg0NyxcbiAgICBIOiAweDQ4LFxuICAgIEk6IDB4NDksXG4gICAgSjogMHg0QSxcbiAgICBLOiAweDRCLFxuICAgIEw6IDB4NEMsXG4gICAgTTogMHg0RCxcbiAgICBOOiAweDRFLFxuICAgIE86IDB4NEYsXG4gICAgUDogMHg1MCxcbiAgICBROiAweDUxLFxuICAgIFI6IDB4NTIsXG4gICAgUzogMHg1MyxcbiAgICBUOiAweDU0LFxuICAgIFU6IDB4NTUsXG4gICAgVjogMHg1NixcbiAgICBXOiAweDU3LFxuICAgIFg6IDB4NTgsXG4gICAgWTogMHg1OSxcbiAgICBaOiAweDVBLFxuICAgIExXaW46IDB4NUIsXG4gICAgUldpbjogMHg1QyxcbiAgICBBcHBsaWNhdGlvbnM6IDB4NUQsXG4gICAgTnVtMDogMHg2MCxcbiAgICBOdW0xOiAweDYxLFxuICAgIE51bTI6IDB4NjIsXG4gICAgTnVtMzogMHg2MyxcbiAgICBOdW00OiAweDY0LFxuICAgIE51bTU6IDB4NjUsXG4gICAgTnVtNjogMHg2NixcbiAgICBOdW03OiAweDY3LFxuICAgIE51bTg6IDB4NjgsXG4gICAgTnVtOTogMHg2OSxcbiAgICBNdWx0aXBseTogMHg2QSxcbiAgICBBZGQ6IDB4NkIsXG4gICAgU3VidHJhY3Q6IDB4NkQsXG4gICAgTnVtRGVjaW1hbDogMHg2RSxcbiAgICBOdW1EaXZpZGU6IDB4NkYsXG4gICAgRjE6IDB4NzAsXG4gICAgRjI6IDB4NzEsXG4gICAgRjM6IDB4NzIsXG4gICAgRjQ6IDB4NzMsXG4gICAgRjU6IDB4NzQsXG4gICAgRjY6IDB4NzUsXG4gICAgRjc6IDB4NzYsXG4gICAgRjg6IDB4NzcsXG4gICAgRjk6IDB4NzgsXG4gICAgRjEwOiAweDc5LFxuICAgIEYxMTogMHg3QSxcbiAgICBGMTI6IDB4N0IsXG4gICAgRjEzOiAweDdDLFxuICAgIEYxNDogMHg3RCxcbiAgICBGMTU6IDB4N0UsXG4gICAgRjE2OiAweDdGLFxuICAgIEYxNzogMHg4MCxcbiAgICBGMTg6IDB4ODEsXG4gICAgRjE5OiAweDgyLFxuICAgIEYyMDogMHg4MyxcbiAgICBGMjE6IDB4ODQsXG4gICAgRjIyOiAweDg1LFxuICAgIEYyMzogMHg4NixcbiAgICBGMjQ6IDB4ODcsXG4gICAgTFNoaWZ0OiAweEEwLFxuICAgIFJTaGlmdDogMHhBMSxcbiAgICBMQ3RybDogMHhBMixcbiAgICBSQ3RybDogMHhBMyxcbiAgICBMQWx0OiAweEE0LFxuICAgIFJBbHQ6IDB4QTUsXG4gICAgQnJvd3NlckJhY2s6IDB4QTYsXG4gICAgQnJvd3NlckZvcndhcmQ6IDB4QTcsXG4gICAgQnJvd3NlclJlZnJlc2g6IDB4QTgsXG4gICAgQnJvd3NlclN0b3A6IDB4QTksXG4gICAgQnJvd3NlclNlYXJjaDogMHhBQSxcbiAgICBCcm93c2VyRmF2b3JpdGVzOiAweEFCLFxuICAgIEJyb3dzZXJTdGFydDogMHhBQyxcbiAgICBOZXh0VHJhY2s6IDB4QjAsXG4gICAgUHJldmlvdXNUcmFjazogMHhCMSxcbiAgICBTdG9wTWVkaWE6IDB4QjIsXG4gICAgUGxheVBhdXNlTWVkaWE6IDB4QjMsXG4gICAgU3RhcnRNYWlsOiAweEI0LFxuICAgIFNlbGVjdE1lZGlhOiAweEI1LFxuICAgIFN0YXJ0QXBwbGljYXRpb25PbmU6IDB4QjYsXG4gICAgU3RhcnRBcHBsaWNhdGlvblR3bzogMHhCNyxcbiAgICBcIjtcIjogMHhCQSxcbiAgICBcIitcIjogMHhCQixcbiAgICBcIixcIjogMHhCQyxcbiAgICBcIi1cIjogMHhCRCxcbiAgICBcIi5cIjogMHhCRSxcbiAgICBcIi9cIjogMHhCRixcbiAgICBcImBcIjogMHhDMCxcbiAgICBcIltcIjogMHhEQixcbiAgICBcIlxcXFxcIjogMHhEQyxcbiAgICBcIl1cIjogMHhERCxcbiAgICBcIidcIjogMHhERVxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFZpcnR1YWxLZXlzOiBSZWFkb25seTxBcnJheTxGVmlydHVhbEtleT4+ID1cbltcbiAgICAweDA1LFxuICAgIDB4MDYsXG4gICAgMHgwOCxcbiAgICAweDA5LFxuICAgIDB4MEQsXG4gICAgMHgxMCxcbiAgICAweDExLFxuICAgIDB4MTIsXG4gICAgMHgxMyxcbiAgICAweDIwLFxuICAgIDB4MjEsXG4gICAgMHgyMixcbiAgICAweDIzLFxuICAgIDB4MjQsXG4gICAgMHgyNSxcbiAgICAweDI2LFxuICAgIDB4MjcsXG4gICAgMHgyOCxcbiAgICAweDJELFxuICAgIDB4MkUsXG4gICAgMHgzMCxcbiAgICAweDMxLFxuICAgIDB4MzIsXG4gICAgMHgzMyxcbiAgICAweDM0LFxuICAgIDB4MzUsXG4gICAgMHgzNixcbiAgICAweDM3LFxuICAgIDB4MzgsXG4gICAgMHgzOSxcbiAgICAweDQxLFxuICAgIDB4NDIsXG4gICAgMHg0MyxcbiAgICAweDQ0LFxuICAgIDB4NDUsXG4gICAgMHg0NixcbiAgICAweDQ3LFxuICAgIDB4NDgsXG4gICAgMHg0OSxcbiAgICAweDRBLFxuICAgIDB4NEIsXG4gICAgMHg0QyxcbiAgICAweDRELFxuICAgIDB4NEUsXG4gICAgMHg0RixcbiAgICAweDUwLFxuICAgIDB4NTEsXG4gICAgMHg1MixcbiAgICAweDUzLFxuICAgIDB4NTQsXG4gICAgMHg1NSxcbiAgICAweDU2LFxuICAgIDB4NTcsXG4gICAgMHg1OCxcbiAgICAweDU5LFxuICAgIDB4NUEsXG4gICAgMHg1QixcbiAgICAweDVDLFxuICAgIDB4NUQsXG4gICAgMHg2MCxcbiAgICAweDYxLFxuICAgIDB4NjIsXG4gICAgMHg2MyxcbiAgICAweDY0LFxuICAgIDB4NjUsXG4gICAgMHg2NixcbiAgICAweDY3LFxuICAgIDB4NjgsXG4gICAgMHg2OSxcbiAgICAweDZBLFxuICAgIDB4NkIsXG4gICAgMHg2RCxcbiAgICAweDZFLFxuICAgIDB4NkYsXG4gICAgMHg3MCxcbiAgICAweDcxLFxuICAgIDB4NzIsXG4gICAgMHg3MyxcbiAgICAweDc0LFxuICAgIDB4NzUsXG4gICAgMHg3NixcbiAgICAweDc3LFxuICAgIDB4NzgsXG4gICAgMHg3OSxcbiAgICAweDdBLFxuICAgIDB4N0IsXG4gICAgMHg3QyxcbiAgICAweDdELFxuICAgIDB4N0UsXG4gICAgMHg3RixcbiAgICAweDgwLFxuICAgIDB4ODEsXG4gICAgMHg4MixcbiAgICAweDgzLFxuICAgIDB4ODQsXG4gICAgMHg4NSxcbiAgICAweDg2LFxuICAgIDB4ODcsXG4gICAgMHhBMCxcbiAgICAweEExLFxuICAgIDB4QTIsXG4gICAgMHhBMyxcbiAgICAweEE0LFxuICAgIDB4QTUsXG4gICAgMHhBNixcbiAgICAweEE3LFxuICAgIDB4QTgsXG4gICAgMHhBOSxcbiAgICAweEFBLFxuICAgIDB4QUIsXG4gICAgMHhBQyxcbiAgICAweEIwLFxuICAgIDB4QjEsXG4gICAgMHhCMixcbiAgICAweEIzLFxuICAgIDB4QjQsXG4gICAgMHhCNSxcbiAgICAweEI2LFxuICAgIDB4QjcsXG4gICAgMHhCQSxcbiAgICAweEJCLFxuICAgIDB4QkMsXG4gICAgMHhCRCxcbiAgICAweEJFLFxuICAgIDB4QkYsXG4gICAgMHhDMCxcbiAgICAweERCLFxuICAgIDB4REMsXG4gICAgMHhERCxcbiAgICAweERFXG5dIGFzIGNvbnN0O1xuXG4vKiBlc2xpbnQtZW5hYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogSXMgdGhlIGBLZXlDb2RlYCBhIFZLIENvZGUgKip0aGF0IHRoaXMgYXBwIHVzZXMqKi4gKi9cbmV4cG9ydCBjb25zdCBJc1ZpcnR1YWxLZXkgPSAoS2V5Q29kZTogbnVtYmVyKTogS2V5Q29kZSBpcyBGVmlydHVhbEtleSA9Plxue1xuICAgIHJldHVybiBWaXJ0dWFsS2V5cy5pbmNsdWRlcyhLZXlDb2RlIGFzIEZWaXJ0dWFsS2V5KTtcbn07XG4iLCJ2YXIgbXlNb2R1bGUgPSByZXF1aXJlKFwiYmluZGluZ3NcIikoXCJoZWxsb1wiKTtcbm1vZHVsZS5leHBvcnRzID0gbXlNb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhc3NlcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYnVmZmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29uc3RhbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInF1ZXJ5c3RyaW5nXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJpbmdfZGVjb2RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0dHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiemxpYlwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbl9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuYnVuZGxlLmRldi5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBjaHVua3Ncbi8vIFwiMVwiIG1lYW5zIFwibG9hZGVkXCIsIG90aGVyd2lzZSBub3QgbG9hZGVkIHlldFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDFcbn07XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxudmFyIGluc3RhbGxDaHVuayA9IChjaHVuaykgPT4ge1xuXHR2YXIgbW9yZU1vZHVsZXMgPSBjaHVuay5tb2R1bGVzLCBjaHVua0lkcyA9IGNodW5rLmlkcywgcnVudGltZSA9IGNodW5rLnJ1bnRpbWU7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAxO1xuXG59O1xuXG4vLyByZXF1aXJlKCkgY2h1bmsgbG9hZGluZyBmb3IgamF2YXNjcmlwdFxuX193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmUgPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0Ly8gXCIxXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG5cdGlmKCFpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0aW5zdGFsbENodW5rKHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpKSk7XG5cdFx0fSBlbHNlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDE7XG5cdH1cbn07XG5cbi8vIG5vIGV4dGVybmFsIGluc3RhbGwgY2h1bmtcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdCIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL1NvdXJjZS9NYWluL01haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=